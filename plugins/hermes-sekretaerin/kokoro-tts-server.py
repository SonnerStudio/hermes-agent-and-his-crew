#!/usr/bin/env python3
"""Kokoro TTS server — OpenAI-compatible /v1/audio/speech.

Wraps the kokoro.cpp CLI (C++ GGUF inference) which supports German
multilingual models. Runs as a side-channel TTS backend for the MLX-Runtime
proxy, independent of the chat model.

QUALITY PIPELINE (fixes choppy/garbled German output):
  1. Text -> IPA via epitran (deu-Latn). This bypasses kokoro.cpp's built-in
     espeak-ng integration, which mis-phonemizes German and sounds garbled.
  2. IPA is fed to kokoro-cli with --phonemes (skip espeak entirely).
  3. Long text is split into short phrases (~10 words) so kokoro.cpp's
     internal hard-cut chunking never triggers mid-phrase.
  4. Phrases are concatenated with short silence pads between sentences.

German text -> German Kokoro model + German voice pack (df_eva / dm_bernd).
English text -> falls back to Kokoro EN voice (af_sky) if requested.

Usage:
    kokoro-tts-server.py --host 127.0.0.1 --port 1255 \
        --model /path/kokoro-de-hui-base-q8_0.gguf \
        --voice /path/kokoro-voice-df_eva.gguf \
        --cli /path/kokoro-cli
"""
import argparse
import json
import os
import re
import subprocess
import tempfile
import wave
import io
from aiohttp import web

import numpy as np

KOKORO_CLI = ""
MODEL = ""
VOICE = ""
ESPEAK_DATA = ""
DEFAULT_VOICE = "df_victoria"   # German female (kikiri-tts, recommended hochdeutsch)
EN_VOICE = "af_heart"      # English (if EN fallback needed)
VOICE_DIR = ""
SR = 24000
PAD_S = 0.15  # silence between phrases/sentences (optimized: 0.15s)
MAX_WORDS = 6  # keep phrases short to avoid kokoro.cpp internal hard cuts
USE_IPA = True  # epitran IPA (deu-Latn) — bypasses kokoro.cpp's broken espeak


def _load_custom_dict():
    dict_path = os.path.expanduser("~/.hermes/tts_dictionary.json")
    try:
        if os.path.exists(dict_path):
            with open(dict_path, "r") as f:
                return json.load(f)
    except Exception as e:
        print(f"[kokoro-tts] Error loading custom dict: {e}", flush=True)
    return {}


def _to_ipa(text, lang):
    """German/English text -> IPA. Returns None if epitran unavailable."""
    try:
        from epitran import Epitran
        if lang.startswith("de"):
            ep = Epitran("deu-Latn")
        else:
            ep = Epitran("eng-Latn")
            
        custom_dict = _load_custom_dict()
        
        # Apply custom phonetic replacements (case-insensitive word boundaries)
        for bad_word, replacement in custom_dict.items():
            pattern = r'(?i)\b' + re.escape(bad_word) + r'\b'
            text = re.sub(pattern, replacement, text)

        # word-by-word keeps punctuation/spaces intact
        return " ".join(ep.transliterate(w) for w in text.split(" "))
    except Exception as e:
        print(f"[kokoro-tts] epitran failed: {e}", flush=True)
        return None


def _split_phrases(text):
    """Split into short phrases (~MAX_WORDS) on sentence + word boundaries.
    Keeps the sentence delimiter attached."""
    # first split sentences
    raw = re.split(r'([.!?]+)', text)
    sents = []
    buf = ""
    for i, p in enumerate(raw):
        buf += p
        if i % 2 == 1:
            s = buf.strip()
            if s:
                sents.append(s)
            buf = ""
    if buf.strip():
        sents.append(buf.strip())
    # then chunk each sentence into ~MAX_WORDS phrases
    out = []
    for s in sents:
        words = s.split()
        for j in range(0, len(words), MAX_WORDS):
            out.append(" ".join(words[j:j + MAX_WORDS]))
    return out


def _resolve_voice(voice, lang):
    if voice.endswith(".gguf") and os.path.exists(voice):
        return voice
    de_voices = {
        "df_eva": "kokoro-voice-df_eva.gguf",
        "df_victoria": "kokoro-voice-df_victoria.gguf",
        "dm_bernd": "kokoro-voice-dm_bernd.gguf",
        "dm_martin": "kokoro-voice-dm_martin.gguf",
        "ef_dora": "kokoro-voice-ef_dora.gguf",
        "ff_siwis": "kokoro-voice-ff_siwis.gguf",
    }
    en_voices = {
        "af_heart": "kokoro-voice-af_heart.gguf",
        "af_sky": "kokoro-voice-af_heart.gguf",
    }
    if lang.startswith("de") or voice in de_voices:
        fname = de_voices.get(voice, de_voices[DEFAULT_VOICE])
        lang = "de"
    else:
        fname = en_voices.get(voice, en_voices[EN_VOICE])
        lang = "en"
    cand = os.path.join(VOICE_DIR, fname)
    if os.path.exists(cand):
        return cand, lang
    for root, _, files in os.walk(os.path.expanduser("~/.cache/huggingface")):
        if fname in files:
            return os.path.join(root, fname), lang
    raise FileNotFoundError(f"voice pack {fname} not found")


async def handle_speech(request):
    body = await request.json()
    text = body.get("input", "")
    voice = body.get("voice", DEFAULT_VOICE)
    lang = body.get("lang_code", "de")
    try:
        vpath, lang = _resolve_voice(voice, lang)
    except FileNotFoundError as e:
        return web.json_response({"error": {"message": str(e)}}, status=500)

    phrases = _split_phrases(text)
    if not phrases:
        phrases = [text]
    env = dict(os.environ)
    if ESPEAK_DATA:
        env["ESPEAK_DATA_PATH"] = ESPEAK_DATA

    chunks = []
    try:
        for ph in phrases:
            ipa = _to_ipa(ph, lang) if USE_IPA else None
            inp = ipa if ipa else ph
            out = tempfile.mktemp(suffix=".wav")
            cmd = [KOKORO_CLI, "-m", MODEL, "-v", vpath, "-l", lang,
                   "--backend", "cpu", "-s", "0.9", "-o", out]
            if ipa:
                cmd.append("--phonemes")  # skip espeak, use our IPA
            cmd.append(inp)
            subprocess.run(cmd, env=env, check=True,
                           capture_output=True, timeout=180)
            with wave.open(out, "rb") as w:
                d = np.frombuffer(w.readframes(w.getnframes()),
                                   dtype=np.int16)
            chunks.append(d)
            try:
                os.unlink(out)
            except OSError:
                pass
        pad = np.zeros(int(PAD_S * SR), dtype=np.int16)
        parts = []
        for i, c in enumerate(chunks):
            parts.append(c)
            if i < len(chunks) - 1:
                parts.append(pad)
        combined = np.concatenate(parts) if parts else np.array([], dtype=np.int16)
        out_io = io.BytesIO()
        with wave.open(out_io, "w") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes(combined.tobytes())
        return web.Response(body=out_io.getvalue(), content_type="audio/wav")
    except Exception as e:
        return web.json_response(
            {"error": {"message": f"kokoro TTS failed: {e}", "type": "server_error"}},
            status=500,
        )


async def handle_health(request):
    return web.json_response({"status": "ok", "model": os.path.basename(MODEL)})


def main():
    global KOKORO_CLI, MODEL, VOICE, ESPEAK_DATA, VOICE_DIR
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=1255)
    ap.add_argument("--cli", required=True, help="path to kokoro-cli binary")
    ap.add_argument("--model", required=True, help="kokoro GGUF model")
    ap.add_argument("--voice", required=True, help="kokoro GGUF voice pack")
    ap.add_argument("--voice-dir", default="", help="dir with voice packs")
    ap.add_argument("--espeak-data", default="", help="ESPEAK_DATA_PATH")
    args = ap.parse_args()
    KOKORO_CLI = args.cli
    MODEL = args.model
    VOICE = args.voice
    VOICE_DIR = args.voice_dir
    ESPEAK_DATA = args.espeak_data

    app = web.Application()
    app.router.add_post("/v1/audio/speech", handle_speech)
    app.router.add_get("/health", handle_health)
    web.run_app(app, host=args.host, port=args.port)


if __name__ == "__main__":
    main()
