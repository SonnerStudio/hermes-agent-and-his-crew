<p align="center">
  <img src="assets/banner.png" alt="SonnerStudio — Hermes Agent and his Crew" width="100%">
</p>

# Hermes Agent and his Crew (with Sub-Agents) ☤

<p align="center">
  <a href="https://www.sonnerstudio.net">SonnerStudio</a> | <a href="https://hermes-agent.nousresearch.com/">Hermes Agent (Upstream)</a>
</p>
<p align="center">
  <a href="https://github.com/SonnerStudio/hermes-agent-and-his-crew/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License: MIT"></a>
  <a href="https://github.com/NousResearch/hermes-agent"><img src="https://img.shields.io/badge/Upstream-NousResearch/hermes--agent-blueviolet?style=for-the-badge" alt="Upstream"></a>
  <a href="https://www.sonnerstudio.net"><img src="https://img.shields.io/badge/Built%20by-SonnerStudio-orange?style=for-the-badge" alt="Built by SonnerStudio"></a>
</p>

<p align="center">
  <a href="README.de.md"><img src="https://img.shields.io/badge/Lang-Deutsch-red?style=for-the-badge" alt="Deutsch"></a>
  <a href="README.fr.md"><img src="https://img.shields.io/badge/Lang-Fran%C3%A7ais-blue?style=for-the-badge" alt="Français"></a>
  <a href="README.es.md"><img src="https://img.shields.io/badge/Lang-Espa%C3%B1ol-orange?style=for-the-badge" alt="Español"></a>
  <a href="README.nl.md"><img src="https://img.shields.io/badge/Lang-Nederlands-green?style=for-the-badge" alt="Nederlands"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/Lang-English-lightgrey?style=for-the-badge" alt="English"></a>
</p>

> **Languages:** This README is available in [Deutsch](README.de.md), [Français](README.fr.md), [Español](README.es.md), [Nederlands](README.nl.md). The desktop app has a built-in language picker (🌐) with these and more.

**A SonnerStudio fork of [Hermes Agent](https://hermes-agent.nousresearch.com/) by Nous Research** — the self-improving AI agent, extended with a voice-driven **Hermes Secretary** and a visual **Composer-Control-HUD** for orchestrating sub-agents.

This fork adds:

- **Composer Control Buttons** — four toggle buttons in the desktop composer (sub-agent orchestration, voice communication, orchestration mode, double mode) with live state colors (red = inactive, yellow = provisioning, green = active).
- **Orchestration HUD** — four blue-bordered live panels under the composer input: *Sub-Agent Team* (shows only running agents), *Hermes Secretary Load* (speaker/mic levels instead of sub-agent load), *Cloned Agents* (double-mode clone counts), and *Harmonization & Agent Load* (mean progress of running agents only). Panels only appear when a real task is running — no demo placeholders.
- **Hermes Secretary** — a voice layer that lets you talk to the agent. German TTS via **cduvenhorst F5-TTS** (Serena voice, `q3_serena_warm_000.wav`, warm female German voice, no accent drift), STT via Whisper-small-MLX (German), and a headless microphone-level monitor (RAW PCM sharing, no visible terminal popup). The agent can delegate sub-agents to carry out spoken requests.
- **MLX Runtime Proxy** — a local lazy proxy (`:1240`) that serves the F5-TTS, Whisper STT, and MLX chat models one at a time, so the 16 GB Mac mini stays within RAM limits.
- **Learning Crew** — live learning scores for Hermes Agent, Secretary, and 8 sub-agent specialists (Recherche, Code, Bild, Audio, Analyse, Planung, Technik, Strukturierung) shown as compact progress bars with real scores from delegation outcomes.
- **Last Learning Success Panel** — shows the most recent learning win: which agent (Hermes Agent, Hermes Secretary, or one of 8 sub-agents), what was achieved (topology, clone factor, units, latency), and success marker.

> **Note:** The MLX runtime, cduvenhorst F5-TTS German, and the Hermes Secretary voice pipeline are tuned for Apple Silicon (macOS). See `plugins/hermes-sekretaerin/` for setup.

---

## Quick Install

### Linux, macOS, WSL2, Termux

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows (native, PowerShell)

> **Heads up:** Native Windows runs Hermes without WSL — CLI, gateway, TUI, and tools all work natively. If you'd rather use WSL2, the Linux/macOS one-liner above works there too. Found a bug? Please [file issues](https://github.com/NousResearch/hermes-agent/issues).

Run this in PowerShell:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

The installer handles everything: uv, Python 3.11, Node.js, ripgrep, ffmpeg, **and a portable Git Bash** (MinGit, unpacked to `%LOCALAPPDATA%\hermes\git` — no admin required, completely isolated from any system Git install). Hermes uses this bundled Git Bash to run shell commands.

If you already have Git installed, the installer detects it and uses that instead. Otherwise a ~45MB MinGit download is all you need — it won't touch or interfere with any system Git.

> **Android / Termux:** The tested manual path is documented in the [Termux guide](https://hermes-agent.nousresearch.com/docs/getting-started/termux). On Termux, Hermes installs a curated `.[termux]` extra because the full `.[all]` extra currently pulls Android-incompatible voice dependencies.
>
> **Windows:** Native Windows is fully supported — the PowerShell one-liner above installs everything. If you'd rather use WSL2, the Linux command works there too. Native Windows install lives under `%LOCALAPPDATA%\hermes`; WSL2 installs under `~/.hermes` as on Linux.

---

## Hermes Secretary Setup (SonnerStudio extension)

The voice layer lives in `plugins/hermes-sekretaerin/`:

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

This installs:
- `mlx-proxy.py` as a launchd daemon (serves TTS/STT/MLX models on `:1240`)
- `mic-level.py` as a headless LaunchAgent (microphone level monitor, no terminal window)
- `f5-tts-server.py` (cduvenhorst F5-TTS German, Serena voice)

**Build F5-TTS (one-time):** see `plugins/hermes-sekretaerin/BUILD_f5.md`. Requires `cmake`, `espeak-ng` headers, and the `ggml`/`highway` submodules.

**Microphone permission:** grant macOS *System Settings → Privacy & Security → Microphone* access to the helper once.

---

## Language Selection

The desktop app has a built-in language picker (🌐) with German, English, French, Spanish, Dutch and more SonnerStudio languages.

---

## Current Development Status (August 2026)

### Completed This Session

1. **Secretary Voice Pipeline Restored**
   - Fixed `voice_comms.py` indentation corruption (aborted edit)
   - VAD threshold 15 → 35 + 3-frame minimum (suppresses BT headset noise hallucinations)
   - RAW PCM sharing via `mic-level.py` → `~/.hermes/mic-raw.pcm` (solves BT HFP silence)
   - Device `:0` prioritized in `DEV_CANDIDATES` (real audio input)
   - `_trigger_model_load()` auto-triggers model load after proxy restart

2. **Proxy Stability**
   - `/health` HTTP 500 → 200 (psutil try/except + sysctl fallback)
   - Single LaunchAgent (`com.jan.mlx-proxy`) — removed duplicate/conflicting agents
   - Boot autostart: when `voice_comms.toggle.active=true` → starts mic-level + voice_comms
   - Direct subprocess spawning (no launchctl race conditions)

3. **Orchestration HUD Redesign**
   - 4 cards: Sub-Agent Team, Hermes Secretary Load, Cloned Agents, Harmonization
   - Sub-Agent Team shows ONLY running agents (no static "ready" placeholder)
   - Audio panel → "Hermes Secretary Load" (speaker/mic, not sub-agent load)
   - Cards share full width equally (`flex-1 min-w-0`, no wrap)

4. **Learning Crew & Last Learning Panel**
   - 8 sub-agent specialists registered: Recherche, Code, Bild, Audio, Analyse, Planung, Technik, Strukturierung
   - Duplicate "Planungs-Spezialist" removed; Strukturierungs-Experte added
   - `secretary_memory.py`: `last_learning_event()` returns latest successful outcome
   - Proxy endpoint `/secretary-learning` emits `last_learning`
   - Frontend: Field 1 = "Letzter Lernerfolg" (agent label + topology/clone/units/latency + success marker)
   - Removed "Routing-Präferenzen" and "Lernende Crew" fields

5. **Full Width Composer**
   - `--composer-width: 100%` (was `62rem`) — composer + thread span full width between side menus

6. **All Lint/Type Gates Pass**
   - `eslint` exit 0 on all changed files
   - `tsc -p . --noEmit` exit 0
   - Python `py_compile` OK on `secretary_memory.py`, `mlx-proxy.py`

### Running Services (Verified)

- mlx-proxy: PID 54356 (launchd managed)
- voice_comms.py: PID 36659 (cduvenhorst F5-TTS, Serena voice)
- mic-level.py: PID 43150 (RAW PCM + level JSON)
- whisper-stt: PID ~1250 (German, small MLX)
- Hermes Desktop: PID 54655 (app.asar repacked with all changes)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Hermes Desktop (Electron + React)                              │
│  ├── Composer (4 buttons, live HUD)                             │
│  ├── OrchestrationStatus (4 cards, real data)                   │
│  ├── LearningFooter (Learning Crew, 2-row grid)                 │
│  └── SecretaryLearning (Last Learning + Skills + Graph)         │
└──────────────────────────┬──────────────────────────────────────┘
                           │ WebSocket / REST
┌──────────────────────────▼──────────────────────────────────────┐
│  mlx-proxy.py (:1240) — LaunchAgent managed                     │
│  ├── /health → buttons state (voice_comms, orchestration, ...)  │
│  ├── /orchestration → live agent map                            │
│  ├── /secretary-learning → scores + last_learning + graph       │
│  ├── voice_comms.py subprocess (F5-TTS Serena)                  │
│  ├── mic-level.py subprocess (RAW PCM + level JSON)             │
│  └── whisper-stt subprocess (German, port 1250)                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Contributing

See [AGENTS.md](AGENTS.md) for the development guide and [DESIGN.md](apps/desktop/DESIGN.md) for the visual contract.

---

## License

MIT — see [LICENSE](LICENSE).