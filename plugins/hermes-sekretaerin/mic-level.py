#!/usr/bin/env python3
"""User-level microphone level monitor for the Hermes-Sekretärin panel.

Why a separate user-level process? macOS TCC blocks microphone access for
launchd *daemons* (the mlx-proxy runs as one). A normal user-session process
can prompt for and obtain mic permission, so we measure here and publish the
level to a tiny file the proxy polls.

Design notes (fixes the "orange mic icon fl/flicker" + always-0% bug):
- We open ONE ffmpeg instance that reads the mic CONTINUOUSLY.
- We request raw f32le PCM audio to compute instant RMS in Python. This
  provides a highly dynamic 20fps feedback loop that mirrors macOS internal
  peak meters, completely avoiding the sluggishness of ebur128's 400ms window.
- avfoundation -i syntax is "video:audio". For an AUDIO-ONLY device the NAME
  must come AFTER the colon (":BURNESTER073").

Run:  python3 mic-level.py
Writes JSON {"mic": 0-100, "no_device": bool, "ts": epoch} to
~/.hermes/mic-level.json at ~20 FPS.
"""

import json
import os
import subprocess
import sys
import time
import math
import struct
import select

FF = "/Users/m4janfriske/.local/bin/ffmpeg"
OUT = os.path.expanduser("~/.hermes/mic-level.json")
DEV_CANDIDATES = [":BURNESTER073", "BURNESTER073", ":0", ":default", "Default:"]

# 16000 Hz sample rate. We process in chunks of 800 samples = 50ms = 20 fps.
SAMPLE_RATE = 16000
CHUNK_SAMPLES = 800
CHUNK_BYTES = CHUNK_SAMPLES * 4  # 4 bytes per 32-bit float


def compute_rms_level(raw_bytes: bytes) -> float:
    """Computes RMS of raw f32le bytes and maps it to a 0-100 UI scale."""
    if not raw_bytes or len(raw_bytes) < 4:
        return 0.0
    
    # We might read fewer bytes than CHUNK_BYTES if ffmpeg flushes early.
    num_samples = len(raw_bytes) // 4
    floats = struct.unpack(f"{num_samples}f", raw_bytes[:num_samples * 4])
    
    sum_squares = sum(f * f for f in floats)
    rms = math.sqrt(sum_squares / num_samples) if num_samples > 0 else 0.0
    
    # Convert to dB (Full scale is 1.0)
    # Typical voice ranges from -50 dB to -10 dB.
    db = 20 * math.log10(max(rms, 1e-6))
    
    # Map roughly -50 dB to 0% and -10 dB to 100%
    clamped = max(-50.0, min(-10.0, db))
    return (clamped + 50.0) / 40.0 * 100.0


def _open_stream(dev: str):
    """Open a continuous ffmpeg read of `dev` returning raw f32le PCM."""
    try:
        proc = subprocess.Popen(
            [FF, "-hide_banner", "-loglevel", "quiet", "-f", "avfoundation",
             "-i", dev, "-ac", "1", "-ar", str(SAMPLE_RATE), "-f", "f32le", "-"],
            stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
            bufsize=CHUNK_BYTES * 2,
        )
    except Exception as e:
        print(f"mic-level: open {dev} failed: {e}", file=sys.stderr)
        return None
        
    # Give it a tiny bit of time to start up and check if it died immediately.
    time.sleep(0.5)
    if proc.poll() is not None:
        return None
        
    return proc


def main():
    import signal
    
    print("mic-level: starting (requesting mic permission if needed)…", file=sys.stderr)
    proc = None
    last_err = ""
    
    def cleanup(signum, frame):
        if proc and proc.poll() is None:
            proc.terminate()
        sys.exit(0)
        
    signal.signal(signal.SIGTERM, cleanup)
    signal.signal(signal.SIGINT, cleanup)

    level = 0.0
    silence_count = 0
    
    while True:
        # (Re)acquire a device if needed.
        if proc is None or proc.poll() is not None:
            if proc is not None:
                proc.terminate()
            proc = None
            for dev in DEV_CANDIDATES:
                p = _open_stream(dev)
                if p is not None:
                    proc = p
                    break
            if proc is None:
                if last_err:
                    print(f"mic-level: all devices failed ({last_err[:80]})", file=sys.stderr)
                last_err = "no usable device"
                try:
                    with open(OUT, "w") as f:
                        json.dump({"mic": 0, "no_device": True, "ts": time.time()}, f)
                except OSError:
                    pass
                time.sleep(1.0)
                continue

        device_ok = True
        
        # Read EXACTLY one chunk (50ms of audio). 
        # This acts as our perfectly paced 20fps clock, because ffmpeg 
        # produces data at exactly 1x real-time speed.
        raw_bytes = proc.stdout.read(CHUNK_BYTES)
        
        if not raw_bytes or len(raw_bytes) < CHUNK_BYTES:
            silence_count += 1
            level = max(0.0, level - 20.0)  # Decay rapidly
            if silence_count > 10:
                # If stream broke, kill and restart
                proc.terminate()
                proc = None
                silence_count = 0
                continue
        else:
            silence_count = 0
            lvl = compute_rms_level(raw_bytes)
            
            # Very light smoothing for visual appeal, but highly snappy
            level = (level * 0.2) + (lvl * 0.8)
                
        try:
            with open(OUT, "w") as f:
                json.dump({"mic": int(level), "no_device": not device_ok, "ts": time.time()}, f)
        except OSError:
            pass


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
    except Exception as e:
        import traceback
        print(f"mic-level FATAL ERROR: {e}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
