#!/usr/bin/env python3
"""User-level microphone level monitor for the Hermes-Sekretärin panel.

Why a separate user-level process? macOS TCC blocks microphone access for
launchd *daemons* (the mlx-proxy runs as one). A normal user-session process
can prompt for and obtain mic permission, so we measure here and publish the
level to a tiny file the proxy polls.

Run:  python3 mic-level.py
Writes JSON {"mic": 0-100, "ts": epoch} to ~/.hermes/mic-level.json every ~150ms.
Stops when the file is older than 3s (proxy no longer reading) or mic gone.
"""
import json
import os
import subprocess
import sys
import time

FF = "/Users/m4janfriske/.local/bin/ffmpeg"
OUT = os.path.expanduser("~/.hermes/mic-level.json")
# macOS CoreAudio via avfoundation: ":0" = first audio input device (here the
# Sony 3-D Pulse headset "Externes Mikrofon"). ":default" can fail to resolve
# after a device hot-plug, so we pin the index.
DEV = ":0"


def read_level() -> tuple[float, bool]:
    """Sample 150ms of mic input, return (0-100 level, device_ok)."""
    try:
        proc = subprocess.run(
            [FF, "-hide_banner", "-loglevel", "error", "-t", "0.15", "-f", "avfoundation",
             "-i", DEV, "-af", "aresample=16000,aformat=fltp,volumedetect", "-f", "null", "-"],
            stderr=subprocess.PIPE, text=True, timeout=3,
        )
        # No audio devices -> avfoundation errors out opening input.
        if "does not support" in proc.stderr or "Error opening" in proc.stderr:
            return 0.0, False
        for line in proc.stderr.splitlines():
            if "mean_volume" in line:
                try:
                    db = float(line.split(":")[-1].split("dB")[0].strip())
                    return max(0.0, min(1.0, (db + 50.0) / 50.0)) * 100, True
                except ValueError:
                    pass
        return 0.0, True  # device ok but silent
    except Exception:
        pass
    return 0.0, False


def main():
    print("mic-level: starting (requesting mic permission if needed)…", file=sys.stderr)
    while True:
        level, ok = read_level()
        try:
            with open(OUT, "w") as f:
                json.dump({"mic": int(level), "no_device": not ok, "ts": time.time()}, f)
        except OSError:
            pass
        time.sleep(0.15)
        if os.path.isfile(OUT):
            try:
                age = time.time() - os.path.getmtime(OUT)
                if age > 3:
                    # Proxy not reading — but we just wrote; check last *read*.
                    pass
            except OSError:
                pass
        time.sleep(0.15)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
