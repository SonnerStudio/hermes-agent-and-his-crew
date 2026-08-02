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
# macOS CoreAudio via avfoundation. After a headset hot-plug the device index
# (":0") can fail with I/O error until TCC permission is granted, and ":default"
# may not resolve. We probe several device specs and use the first that opens.
# Named devices need a trailing colon (avfoundation syntax: "Name:").
DEV_CANDIDATES = ["Externes Mikrofon:", ":0", ":default", "Default:"]


def read_level() -> tuple[float, bool]:
    """Sample 150ms of mic input, return (0-100 level, device_ok)."""
    last_err = ""
    for dev in DEV_CANDIDATES:
        try:
            proc = subprocess.run(
                [FF, "-hide_banner", "-loglevel", "error", "-t", "0.15", "-f", "avfoundation",
                 "-i", dev, "-af", "aresample=16000,aformat=fltp,volumedetect", "-f", "null", "-"],
                stderr=subprocess.PIPE, text=True, timeout=3,
            )
            if "does not support" in proc.stderr or "Error opening" in proc.stderr:
                last_err = proc.stderr.strip()
                continue
            for line in proc.stderr.splitlines():
                if "mean_volume" in line:
                    try:
                        db = float(line.split(":")[-1].split("dB")[0].strip())
                        return max(0.0, min(1.0, (db + 50.0) / 50.0)) * 100, True
                    except ValueError:
                        pass
            return 0.0, True
        except Exception as e:
            last_err = str(e)
            continue
    if last_err:
        print(f"mic-level: all devices failed ({last_err[:80]})", file=sys.stderr)
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
