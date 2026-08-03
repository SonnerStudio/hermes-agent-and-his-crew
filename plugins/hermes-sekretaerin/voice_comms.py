#!/usr/bin/env python3
"""Hermes-Sekretärin — native voice agent (Managerin von Hermes Agent).

Runs locally on the MLX runtime proxy (127.0.0.1:1240). Loop:
  1. mic audio -> Whisper STT (127.0.0.1:1250) -> user text
  2. user text  -> MLX model via proxy (chat/completions) -> reply text
  3. reply text  -> Kokoro TTS (127.0.0.1:1255, df_eva) -> spoken reply
  4. print "Hey Hermes" greeting at startup so readiness is audible

This is the process the mlx-proxy starts when the user toggles the
Sekretärin (voice_comms) composer button. It is the Secretary ACTING — she
begins the conversation with the user, listens, and replies in German
(female voice per user requirement: df_eva, speed 0.9 = "filmreif").

Microphone capture uses ffmpeg avfoundation (same as mic-level.py); the
headset device is probed by name first, then index, so a hot-plugged
headset is picked up.
"""
import json
import os
import subprocess
import sys
import time
import urllib.request

FF = "/Users/m4janfriske/.local/bin/ffmpeg"
STT_URL = "http://127.0.0.1:1240/v1/audio/transcriptions"
LLM_URL = "http://127.0.0.1:1240/v1/chat/completions"
TTS_URL = "http://127.0.0.1:1240/v1/audio/speech"
MODEL = "Qwen3.5-9B-MLX-4bit"  # default Secretary brain (native MLX)
VOICE = "df_eva"
SPEED = 0.9  # "filmreif" per user requirement

# Probe headset by name (BURNESTER073 seen on this machine) then index.
# avfoundation -i syntax is "video:audio"; for an AUDIO-ONLY device the NAME
# must follow the colon (":BURNESTER073"), NOT precede it ("BURNESTER073:" which
# avfoundation parses as a VIDEO device => "Video device not found").
DEV_CANDIDATES = [":BURNESTER073", "BURNESTER073", ":0", ":default", "Default:"]

SYS_PROMPT = (
    "Du bist die Hermes-Sekretärin, die persönliche Managerin von Hermes Agent. "
    "Du sprichst Deutsch (weiblich, freundlich, professionell). Du hilfst Jan, "
    "indem du Aufgaben entgegennimmst, ordnest und Hermes Agent steuerst. "
    "Antworte kurz und klar, max. 3 Sätze, damit die Sprachausgabe flüssig bleibt."
)


def _post_json(url, payload, binary=None):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read(), r.headers.get("Content-Type", "")


def _transcribe(dev: str) -> str:
    """Capture ~3s of mic audio and Whisper-transcribe it. Returns text or ''."""
    wav = "/tmp/secretary_listen.wav"
    try:
        subprocess.run(
            [FF, "-hide_banner", "-loglevel", "error", "-t", "3", "-f", "avfoundation",
             "-i", dev, "-ar", "16000", "-ac", "1", wav],
            stderr=subprocess.DEVNULL, timeout=6,
        )
    except Exception:
        return ""
    if not os.path.isfile(wav) or os.path.getsize(wav) < 1000:
        return ""
    try:
        with open(wav, "rb") as f:
            audio = f.read()
        import urllib.request as u
        import urllib.parse as up
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
        return ""


def _chat(user_text: str) -> str:
    try:
        body = {
            "model": MODEL,
            "messages": [
                {"role": "system", "content": SYS_PROMPT},
                {"role": "user", "content": user_text},
            ],
            "max_tokens": 200,
            "temperature": 0.7,
        }
        raw, _ = _post_json(LLM_URL, body)
        return json.loads(raw)["choices"][0]["message"]["content"].strip()
    except Exception as e:
        sys.stderr.write(f"secretary: LLM failed: {e}\n")
        return "Entschuldigung, ich konnte gerade nicht antworten."


def _speak(text: str):
    try:
        body = {"model": "kokoro", "input": text, "voice": VOICE, "speed": SPEED,
                "response_format": "wav"}
        raw, ctype = _post_json(TTS_URL, body)
        if raw:
            with open("/tmp/secretary_reply.wav", "wb") as f:
                f.write(raw)
            subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-i",
                            "/tmp/secretary_reply.wav", "-f", "avfoundation", "default"],
                           stderr=subprocess.DEVNULL, timeout=30)
    except Exception as e:
        sys.stderr.write(f"secretary: TTS failed: {e}\n")


def _pick_device() -> str:
    for dev in DEV_CANDIDATES:
        try:
            subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-t", "0.1",
                            "-f", "avfoundation", "-i", dev, "-f", "null", "-"],
                           stderr=subprocess.PIPE, timeout=3)
            return dev
        except Exception:
            continue
    return ":default"


def main():
    sys.stderr.write("secretary: starting — probing mic device…\n")
    dev = _pick_device()
    sys.stderr.write(f"secretary: using mic device '{dev}'\n")

    # Audible readiness: the Secretary begins the conversation.
    _speak("Hallo Jan, hier ist die Hermes-Sekretärin. Ich höre zu, wie kann ich helfen?")

    silence = 0
    while True:
        text = _transcribe(dev)
        if not text:
            silence += 1
            if silence > 20:  # ~60s idle: re-prompt gently
                _speak("Jan, bist du noch da?")
                silence = 0
            time.sleep(0.5)
            continue
        silence = 0
        sys.stderr.write(f"secretary heard: {text}\n")
        reply = _chat(text)
        _speak(reply)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
