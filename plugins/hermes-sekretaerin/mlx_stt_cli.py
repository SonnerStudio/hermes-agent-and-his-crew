#!/usr/bin/env python3
"""mlx_stt_cli.py — local MLX-Whisper STT bridge for the Hermes STT pipeline.

Called by ``tools.transcription_tools`` as a ``stt.providers.<name>: type: command``
provider. Receives the audio file path and an output path via the placeholder
grammar (``{input_path}`` / ``{output_path}``) and:

  1. POSTs the audio to the local MLX-Runtime proxy's OpenAI-compatible
     transcription endpoint (``http://127.0.0.1:1240/v1/audio/transcriptions``),
  2. writes the returned transcript text to ``{output_path}`` (plain ``txt``).

This keeps the Hermes core untouched — the MLX model runs in the user's local
proxy (``whisper-stt-server.py``, port 1250), never in the cloud. The Secretary
pre-loads the model via ``POST /secretary/activate {active:true}`` so it is warm
before the first utterance.

Usage (as wired in config.yaml):
    python3 mlx_stt_cli.py <input_audio_path> <output_text_path> [language]
"""
import sys
import json
import urllib.request
import urllib.error

STT_ENDPOINT = "http://127.0.0.1:1240/v1/audio/transcriptions"


def _transcribe(audio_path: str, language: str = "") -> str:
    with open(audio_path, "rb") as fh:
        audio_data = fh.read()

    # OpenAI-compatible multipart form: file=audio, model=whisper-1 (ignored by
    # the proxy, which uses its configured STT_MODEL), optional language.
    boundary = "----hermesmlxboundary"
    parts = [
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="audio"\r\n'
        f"Content-Type: application/octet-stream\r\n\r\n"
    ]
    body = b""
    body += ("--%s\r\n" % boundary).encode()
    body += b'Content-Disposition: form-data; name="file"; filename="audio"\r\n'
    body += b"Content-Type: application/octet-stream\r\n\r\n"
    body += audio_data
    body += b"\r\n"
    body += ("--%s\r\n" % boundary).encode()
    body += b'Content-Disposition: form-data; name="model"\r\n\r\n'
    body += b"whisper-1\r\n"
    if language:
        body += ("--%s\r\n" % boundary).encode()
        body += b'Content-Disposition: form-data; name="language"\r\n\r\n'
        body += language.encode() + b"\r\n"
    body += ("--%s--\r\n" % boundary).encode()

    req = urllib.request.Request(
        STT_ENDPOINT,
        data=body,
        headers={
            "Content-Type": "multipart/form-data; boundary=%s" % boundary,
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        payload = json.loads(resp.read().decode("utf-8"))

    return payload.get("text", "")


def main() -> int:
    if len(sys.argv) < 3:
        sys.stderr.write("usage: mlx_stt_cli.py <input> <output> [language]\n")
        return 2
    audio_path = sys.argv[1]
    output_path = sys.argv[2]
    language = sys.argv[3] if len(sys.argv) > 3 else ""

    try:
        transcript = _transcribe(audio_path, language)
    except urllib.error.HTTPError as exc:
        sys.stderr.write("MLX STT HTTP error %s: %s\n" % (exc.code, exc.read().decode("utf-8", "replace")[:500]))
        return 1
    except Exception as exc:  # noqa: BLE001 — surface any failure to the caller
        sys.stderr.write("MLX STT failed: %s\n" % exc)
        return 1

    with open(output_path, "w", encoding="utf-8") as out:
        out.write(transcript)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
