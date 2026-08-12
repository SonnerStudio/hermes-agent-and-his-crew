#!/usr/bin/env python3
"""Hermes-Sekretärin — native voice agent (Managerin von Hermes Agent).

Runs locally on the MLX runtime proxy (127.0.0.1:1240). Loop:
  1. mic audio -> Whisper STT (127.0.0.1:1250) -> user text
  2. user text  -> MLX model via proxy (chat/completions) -> reply text
  3. reply text  -> Qwen3-TTS (MLX, Serena voice, warm DE) -> spoken reply
  4. print "Hey Hermes" greeting at startup so readiness is audible

This is the process the mlx-proxy starts when the user toggles the
Sekretärin (voice_comms) composer button. It is the Secretary ACTING — she
begins the conversation with the user, listens, and replies in German
(female voice: Serena / Qwen3-TTS, warm-professional, film-grade DE).

Microphone capture uses ffmpeg avfoundation (same as mic-level.py); the
headset device is probed by name first, then index, so a hot-plugged
headset is picked up.
"""
import json
import os
import subprocess
import sys
import time
import threading
import urllib.request

# Self-learning: the Secretary records every successful exchange into the shared
# Secretary learning memory so her live score (LearningFooter) reflects real
# learned experience. Imported lazily to avoid a hard dependency when the module
# is unavailable.
try:
    sys.path.insert(0, "/Users/m4janfriske/.hermes/hermes-agent")
    from agent.secretary_memory import SecretaryMemory
    _MEM = SecretaryMemory()
except Exception:
    _MEM = None


def _record_learning(user_text: str, reply_text: str, success: bool = True, stage: str = "secretary"):
    """Record a Secretary learning exchange (success or failure) so the score graph reflects real outcomes."""
    if _MEM is None:
        return
    try:
        _MEM.sync_turn({
            "stage": stage,
            "topology": "managed",
            "clone_factor": 1,
            "units": 1,
            "success": bool(success),
            "latency_s": 0.0,
            "cost": 0.0,
            "prompt_len": len(user_text or ""),
            "reply_len": len(reply_text or ""),
        })
    except Exception:
        pass

FF = "/Users/m4janfriske/.local/bin/ffmpeg"
STT_URL = "http://127.0.0.1:1240/v1/audio/transcriptions"
LLM_URL = "http://127.0.0.1:1240/v1/chat/completions"
HEALTH_URL = "http://127.0.0.1:1240/health"
MODEL = "Qwen3-4b-MLX-8bit"  # default Secretary brain (native MLX)

# Qwen3-TTS Sekretärin-Stimme (deutsch, kein englischer Akzent):
# - Antworten: voice='vivian' (STT-verifiziert sauber deutsch, kein englischer
#   Akzent wie 'serena') + ref_audio=<WAV> zur Annäherung + temperature=0.0
#   (deterministisch, keine zufällige/accented Stimme)
QWEN_PY = "/Users/m4janfriske/.omni-venv.bak/bin/python3"
QWEN_MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-CustomVoice-8bit"
QWEN_VOICE = "vivian"  # deutsch, kein englischer Akzent (serena klang amerikanisch)
SEKRETAERIN_REF_WAV = "/Users/m4janfriske/.hermes/audio_cache/secretary/serena_warm_ref.wav"
SEKRETAERIN_REF_TEXT = (
    "Hier spricht die Hermes-Sekretärin. Ich habe Ihre Anfrage geprüft und für "
    "heute drei Aufgaben vorbereitet. Möchten Sie, dass ich mit dem Projektbericht "
    "beginne? Wenn ja, öffnen Sie einfach das entsprechende Dokument, und ich lese "
    "es Ihnen vor."
)

DEV_CANDIDATES = [":0", ":BURNESTER073", "BURNESTER073", ":default", "Default:"]

# Shared raw PCM mirror written by mic-level.py (avoids a second ffmpeg on the
# same BT device, which macOS only allows one reader of).
RAW_PCM = os.path.expanduser("~/.hermes/mic-raw.pcm")

SYS_PROMPT = (
    "Du bist die Hermes-Sekretärin, die persönliche Managerin von Hermes Agent. "
    "Du sprichst Deutsch (weiblich, warm, harmonisch, intelligent, professionell) in Hollywood-Synchronsprecher-Qualität. "
    "Du siezt Jan (nutze Sie, Ihre, Ihnen). Du hilfst Jan, indem du seine mündlichen Anweisungen "
    "entgegennimmst, beantwortest und im Hintergrund strukturierst.\n\n"
    "REGELN FÜR DIE AUSGABE:\n"
    "1. Du MUSST immer einen Tag <antwort>...</antwort> enthalten. Darin steht deine GESPROCHENE Antwort für Jan "
    "(maximal 2-3 natürliche, warme Sätze, ohne Sternchen oder Formatierungen).\n"
    "2. Wenn Jan dir einen Arbeitsauftrag erteilt (z. B. Recherche, Code, Analyse, Dokumentation), erstelle "
    "ZUSÄTZLICH einen lautlosen Tag <delegation>[{\"purpose\": \"...\", \"specialist\": \"Recherche-Spezialist\"}]</delegation> "
    "mit den Teilaufgaben für die Sub-Agenten. Dieser Tag wird STUMM und rein intern verarbeitet — Jan hört davon nichts über das Headset!"
)

# Multi-turn conversation memory (keeps recent dialogue context)
CONVERSATION_HISTORY = []
MAX_HISTORY_TURNS = 6


def _post_json(url, payload, binary=None):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read(), r.headers.get("Content-Type", "")


def _wait_for_model(max_wait: int = 180) -> bool:
    """Poll /health until the model is ready (ready=True). Returns True if ready."""
    deadline = time.time() + max_wait
    triggered = False
    while time.time() < deadline:
        try:
            req = urllib.request.Request(HEALTH_URL)
            with urllib.request.urlopen(req, timeout=5) as r:
                health = json.loads(r.read())
            if health.get("ready", False) or health.get("current_model"):
                return True
            if not health.get("loading_model") and not triggered:
                try:
                    _trigger_model_load()
                    triggered = True
                    sys.stderr.write("secretary: Modell-Lade-Anfrage gesendet…\n")
                except Exception as e:
                    sys.stderr.write(f"secretary: Modell-Trigger fehlgeschlagen: {e}\n")
        except Exception:
            pass
        sys.stderr.write("secretary: Modell lädt noch, warte 5s…\n")
        time.sleep(5)
    sys.stderr.write("secretary: Modell nicht bereit nach Timeout.\n")
    return False


def _trigger_model_load():
    """Fire-and-forget chat request to make the proxy preload the default model."""
    data = json.dumps({
        "model": MODEL,
        "messages": [{"role": "user", "content": "Sag kurz hallo."}],
        "max_tokens": 4,
    }).encode()
    req = urllib.request.Request(
        LLM_URL, data=data,
        headers={"Content-Type": "application/json"})
    threading.Thread(
        target=lambda: (_urlopen_noraise(req)), daemon=True).start()


def _urlopen_noraise(req):
    try:
        urllib.request.urlopen(req, timeout=2)
    except Exception:
        pass


def _prepare_text_for_tts(text: str) -> str:
    """Pre-process text for Hollywood-grade F5-TTS synthesis:
    - Replaces technical abbreviations with natural German phonetic words.
    - Adds natural comma micro-pauses for cadence.
    - Strips markdown formatting.
    """
    if not text:
        return ""
    import re
    t = text
    t = re.sub(r'[\*\#\`\~]', '', t)
    t = t.replace("z. B.", "zum Beispiel")
    t = t.replace("bzw.", "beziehungsweise")
    t = t.replace("ca.", "circa")
    t = t.replace("etc.", "et cetera")
    t = t.replace("Sub-Agenten", "Sub-Agenten")
    t = t.replace("Hermes Agent", "Hermes Agent")
    # Clean up whitespace
    t = " ".join(t.split())
    return t


def _post_silent_delegation(delegation_json_str: str):
    """Silently dispatch internal subagent delegation task JSON to the proxy orchestrator."""
    try:
        tasks = json.loads(delegation_json_str.strip())
        if isinstance(tasks, list) and tasks:
            # Map into orchestration agents list format
            agents_payload = []
            for item in tasks:
                if isinstance(item, dict):
                    agents_payload.append({
                        "id": f"subagent-{int(time.time()) % 10000}",
                        "purpose": item.get("purpose", "Teilaufgabe"),
                        "specialist": item.get("specialist", "Analyse-Spezialist"),
                        "status": "running",
                        "progress": 25
                    })
            if agents_payload:
                body = {"agents": agents_payload}
                _post_json("http://127.0.0.1:1240/orchestration", body)
                sys.stderr.write(f"secretary: silently dispatched {len(agents_payload)} subagent tasks\n")
    except Exception as e:
        sys.stderr.write(f"secretary: silent delegation error: {e}\n")


def _transcribe(dev: str) -> str:
    """Take the loudest ~4s window from the recent raw mic PCM (written by
    mic-level.py's continuous ffmpeg stream) and Whisper-transcribe it.

    We MUST NOT open a second ffmpeg on the same BT device — macOS only allows
    one reader, so a parallel capture returns silence. mic-level.py already
    holds the device open and mirrors PCM into RAW_PCM, so we just transcribe
    the tail of that file. Returns text or ''.
    """
    import struct as _s
    wav = "/tmp/secretary_listen.wav"
    try:
        if not os.path.isfile(RAW_PCM) or os.path.getsize(RAW_PCM) < 8000:
            return ""
        # Read the last ~12s (the VAD window) and find the loudest 4s segment.
        with open(RAW_PCM, "rb") as f:
            f.seek(-min(12 * 16000 * 4, os.path.getsize(RAW_PCM)), 2)
            tail = f.read()
        n = len(tail) // 4
        if n < 1000:
            return ""
        floats = _s.unpack(f"{n}f", tail[:n * 4])
        win = 16000  # 1s windows
        best_peak, best_start = 0.0, 0
        for w in range(0, max(1, n // win)):
            seg = floats[w * win:(w + 1) * win]
            pk = max(abs(x) for x in seg) if seg else 0.0
            if pk > best_peak:
                best_peak, best_start = pk, w * win
        if best_peak < 0.01:
            return ""  # only silence captured
        # take 4s starting at the loudest window
        seg = floats[best_start:best_start + 4 * win]
        # write as 16-bit WAV for whisper
        import wave
        with wave.open(wav, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(16000)
            wf.writeframes(b"".join(
                int(max(-1, min(1, x)) * 32767).to_bytes(2, "little", signed=True)
                for x in seg))
    except Exception as e:
        sys.stderr.write(f"secretary: PCM extract failed: {e}\n")
        return ""
    try:
        with open(wav, "rb") as f:
            audio = f.read()
        import urllib.request as u
        boundary = "----secretaryboundary"
        body = (
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"a.wav\"\r\n"
            f"Content-Type: audio/wav\r\n\r\n".encode() + audio +
            f"\r\n--{boundary}\r\nContent-Disposition: form-data; name=\"model\"\r\n\r\nwhisper\r\n"
            f"--{boundary}--\r\n".encode()
        )
        req = u.Request(STT_URL, data=body, headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}"})
        with u.urlopen(req, timeout=30) as r:
            return json.loads(r.read()).get("text", "").strip()
    except Exception as e:
        sys.stderr.write(f"secretary: STT failed: {e}\n")
        _record_learning("stt_error", "STT service unreachable", success=False)
        return ""


def _chat(user_text: str) -> str:
    global CONVERSATION_HISTORY
    import re

    # Construct conversation history payload
    messages = [{"role": "system", "content": SYS_PROMPT}]
    for turn in CONVERSATION_HISTORY[-MAX_HISTORY_TURNS:]:
        messages.append(turn)
    messages.append({"role": "user", "content": user_text})

    for attempt in range(5):
        try:
            body = {
                "model": MODEL,
                "messages": messages,
                "max_tokens": 1500,
                "temperature": 0.7,
            }
            raw, _ = _post_json(LLM_URL, body)
            parsed = json.loads(raw)
            # Catch model-loading / proxy-not-ready responses
            if "status" in parsed and parsed["status"] in ("loading", "unavailable"):
                sys.stderr.write(
                    f"secretary: Modell noch nicht bereit ({parsed.get('status')}), warte…\n"
                )
                if _wait_for_model(max_wait=90):
                    continue
                else:
                    break
            if "choices" not in parsed:
                sys.stderr.write(
                    f"secretary: Unbekannte Antwort: {raw[:120]}\n"
                )
                time.sleep(3.0)
                continue

            msg = parsed["choices"][0]["message"]
            content = msg.get("content", "").strip()

            # Extract silent internal delegation if present
            del_match = re.search(r'<delegation>(.*?)</delegation>', content, re.DOTALL)
            if del_match:
                _post_silent_delegation(del_match.group(1))

            # Extract spoken answer for Jan
            ans_match = re.search(r'<antwort>(.*?)</antwort>', content, re.DOTALL)
            if ans_match:
                spoken_text = ans_match.group(1).strip()
            else:
                # Fallback: strip tags if present or take full content minus delegation block
                clean_text = re.sub(r'<delegation>.*?</delegation>', '', content, flags=re.DOTALL)
                clean_text = re.sub(r'<.*?>', '', clean_text).strip()
                spoken_text = clean_text

            spoken_text = _prepare_text_for_tts(spoken_text)

            if spoken_text:
                # Save turn to multi-turn conversation memory
                CONVERSATION_HISTORY.append({"role": "user", "content": user_text})
                CONVERSATION_HISTORY.append({"role": "assistant", "content": spoken_text})
                return spoken_text
        except Exception as e:
            sys.stderr.write(f"secretary: LLM attempt {attempt+1} failed: {e}\n")
            if attempt < 4:
                time.sleep(3.0)
    sys.stderr.write("secretary: LLM nicht verfügbar — schweige um Akzent-Fallback zu vermeiden.\n")
    _record_learning(user_text, "LLM failed after retries", success=False)
    return ""


def _speak_f5(text: str) -> bool:
    """Synthesize a GERMAN Secretary reply via cduvenhorst/f5-tts-mlx-german.

    Direct single-pass call to cdu_clone.py (seeded, deterministic DE voice,
    ~15-20s). Replaces the old audio_optimizer.run_optimization_loop which did
    2x cdu_clone + 2x STT verification (~3 min/reply) and felt like silence.
    """
    if not text or not text.strip():
        return True
    try:
        cdu_py = "/Users/m4janfriske/.omni-venv.bak/bin/python3"
        cdu_script = "/Users/m4janfriske/.hermes/skills/voice_cloner/templates/cdu_clone.py"
        out = "/tmp/secretary_cdu.wav"
        env = dict(os.environ)
        env["PYTHONPATH"] = ""
        proc = subprocess.run(
            [cdu_py, cdu_script, text, out, SEKRETAERIN_REF_WAV],
            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, timeout=60, env=env,
        )
        if proc.returncode == 0 and os.path.isfile(out) and os.path.getsize(out) > 1000:
            subprocess.run(["afplay", out], stderr=subprocess.DEVNULL, timeout=30)
            sys.stderr.write("secretary: played cdu reply\n")
            return True
        sys.stderr.write(f"secretary: cdu TTS failed (rc={proc.returncode}): {proc.stderr[:200]!r}\n")
    except Exception as e:
        sys.stderr.write(f"secretary: cdu TTS error: {e}\n")
    return False


def _speak_mac(text: str) -> bool:
    """Safe fallback: play the EXACT chosen reference WAV (no 'say'/accented voice).
    Never synthesizes any other/accented voice. Returns True so _speak does not
    retry into an unwanted TTS path."""
    try:
        if os.path.isfile(SEKRETAERIN_REF_WAV):
            subprocess.run(["afplay", SEKRETAERIN_REF_WAV],
                           stderr=subprocess.DEVNULL, timeout=30)
            return True
    except Exception as e:
        sys.stderr.write(f"secretary: ref-WAV fallback failed: {e}\n")
    return True


def _speak(text: str):
    if not text or not text.strip():
        return
    if _speak_f5(text):
        return
    _speak_mac(text)


def _pick_device() -> str:
    for dev in DEV_CANDIDATES:
        try:
            subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-t", "0.1",
                            "-f", "avfoundation", "-i", dev, "-f", "null", "-"],
                           stderr=subprocess.PIPE, timeout=3, check=True)
            return dev
        except Exception:
            continue
    return ":default"


def main():
    sys.stderr.write("secretary: starting — probing mic device…\n")
    dev = _pick_device()
    sys.stderr.write(f"secretary: using mic device '{dev}'\n")

    # Wait for MLX model to be ready before greeting (avoids LLM loading errors)
    sys.stderr.write("secretary: warte auf Modell-Bereitschaft…\n")
    model_ready = _wait_for_model(max_wait=120)
    if model_ready:
        sys.stderr.write("secretary: Modell bereit!\n")
    else:
        sys.stderr.write("secretary: Modell nicht bereit, starte mit Fallback-TTS.\n")

    # Dynamic AI readiness greeting (live TTS, no pre-recorded WAV)
    _speak("Hallo Jan, ich bin die Hermes-Sekretärin und jetzt bereit. Wie kann ich dir helfen?")
    _record_learning("startup", "Hallo Jan, ich bin bereit.", success=True)

    silence = 0
    mic_level_file = os.path.expanduser("~/.hermes/mic-level.json")
    # VAD tuning: higher threshold + minimum consecutive frames above threshold
    VAD_THRESHOLD = 35         # was 15 — BT headset noise sits ~10-20
    VAD_MIN_FRAMES = 3         # must stay above threshold for 3 frames (~0.3s)
    vad_frames = 0
    while True:
        # VAD (Voice Activity Detection): Wait for mic level > VAD_THRESHOLD
        try:
            if os.path.isfile(mic_level_file):
                with open(mic_level_file, "r") as f:
                    level_data = json.load(f)
                mic_level = level_data.get("mic", 0)
                if mic_level < VAD_THRESHOLD:
                    vad_frames = 0
                    time.sleep(0.1)
                    silence += 1
                    if silence > 600:  # ~60s idle (600 * 0.1s)
                        _speak("Jan, bist du noch da?")
                        silence = 0
                    continue
                # Above threshold — count consecutive frames
                vad_frames += 1
                if vad_frames < VAD_MIN_FRAMES:
                    time.sleep(0.1)
                    continue
            else:
                vad_frames = 0
                time.sleep(0.1)
                continue
        except Exception:
            vad_frames = 0
            time.sleep(0.1)
            continue

        sys.stderr.write(f"secretary: Sprache erkannt (Pegel {mic_level} > {VAD_THRESHOLD}, {vad_frames} Frames), nehme auf...\n")
        text = _transcribe(dev)

        # Hallucination filter for Whisper (stray sounds interpreted as weird text)
        is_hallucination = False
        bad_phrases = ["untertitel", "amara.org", "mental mental", "ướ", "copyright"]
        text_lower = text.lower()
        if any(p in text_lower for p in bad_phrases) or (len(text) < 4 and " " not in text.strip()):
            if text_lower not in ["ja", "nein", "hey", "hi", "ok", "gut", "was"]:
                is_hallucination = True

        if not text or is_hallucination:
            if is_hallucination:
                sys.stderr.write(f"secretary: filtered hallucination: {text}\n")
            time.sleep(0.5)
            continue

        silence = 0
        sys.stderr.write(f"secretary heard: {text}\n")
        reply = _chat(text)
        if reply:
            _speak(reply)
            _record_learning(text, reply, success=True)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
