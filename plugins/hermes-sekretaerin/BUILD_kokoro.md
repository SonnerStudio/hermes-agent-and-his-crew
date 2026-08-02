# Build kokoro.cpp (deutsche TTS — df_eva)

kokoro.cpp ist die C++/Metal-Inferenz für das deutsche Kokoro-Modell
(`cstr/kokoro-de-hui-base-GGUF`). Es braucht die Submodule `ggml` und
`highway` sowie `cmake` + die `espeak-ng`-Header/Lib.

## Voraussetzungen
- `cmake` (im omni-venv vorhanden: `~/.omni-venv/bin/cmake`, v4.4.0)
- `espeak-ng` (PyPI `espeakng`, Lib + Header im omni-venv)
- Xcode Command Line Tools (`clang`, `make`)

## Build
```bash
# Submodule nachladen (oder Tarballs von github.com/ggml-org/ggml + google/highway)
git clone --recurse-submodules https://github.com/simonfxr/kokoro.cpp /tmp/kokoro.cpp
cd /tmp/kokoro.cpp

ESPEAK_LIB=~/.omni-venv/lib/python3.11/site-packages/espeakng_loader/libespeak-ng.dylib
ESPEAK_INC=~/.omni-venv/lib/python3.11/site-packages/espeakng_loader/include

mkdir build && cd build
cmake -DGGML_METAL=ON \
      -DESPEAK_NG_LIB="$ESPEAK_LIB" \
      -DESPEAK_NG_INCLUDEDIR="$ESPEAK_INC" ..
make -j$(sysctl -n hw.ncpu)

# Binary landet in build/kokoro-cli
ls -la kokoro-cli
```

## Wichtig — Metal-Backend-Bug
kokoro.cpp's Metal-Backend schreibt **Stille** (peak=0). Der
`kokoro-tts-server.py` erzwingt daher `--backend cpu` — funktioniert
einwandfrei auf Apple Silicon (CPU ist bei 24 kHz/8 kHz TTS schnell genug).

## Modelle (HF-Cache)
- `cstr/kokoro-de-hui-base-GGUF` — deutsches Kokoro-Modell
- `cstr/kokoro-voices-GGUF` — deutsche Stimmen: `df_eva` (weiblich, Default),
  `df_victoria`, `dm_bernd`, `dm_martin`, `ef_dora`, `ff_siwis`

Der `kokoro-tts-server.py` lädt diese automatisch bei Bedarf.
