# Changelog — SonnerStudio Fork of Hermes Agent

This file documents all changes in the **SonnerStudio fork** of
[Hermes Agent](https://github.com/NousResearch/hermes-agent) by Nous Research,
relative to the upstream project. It is updated whenever the fork diverges
from upstream.

- **Fork base:** NousResearch/hermes-agent (`sonnerstudio` branch)
- **License:** MIT (see `LICENSE` + `NOTICE`)
- **Maintainer:** SonnerStudio — https://www.sonnerstudio.net

---

## [Unreleased] — SonnerStudio additions

### Desktop UI
- **Composer Control Buttons** — four toggle buttons in the desktop composer:
  Sub-Agent Orchestration, Voice Communication, Orchestration Mode, Double Mode.
  Live state colors: red = inactive, yellow = provisioning, green = active.
  Focus ring uses `ring-current` (status color), never the theme accent.
- **Orchestration HUD** — four blue-bordered live panels under the composer:
  *Sub-Agent Team*, *Hermes-Sekretärin Auslastung* (Hermes Secretary load), *Kopierte Agenten
  (Cloned Agents)*, *Harmonisierung & Agentenauslastung*. Panels only appear
  when a real task is running — no demo placeholders.
- **Last learning success** — a compact line under the composer shows the
  Secretary's most recent successful learning outcome plus a live MLX badge
  (model served on `:1240`, polled from `/secretary-learning`).
- **System RAM status** — a live strip (polls `/health` on `:1240`) showing
  total / free RAM and usage percent.
- **Full-width composer** — composer input spans the full window width
  (`--composer-width: 100%`).
- **Language Picker (🌐)** — built-in language switcher in the left sidebar
  (top) and under the composer. Mirrors sonnerstudio.net: 32 languages with
  national-flag emojis. Selection persisted in `localStorage`
  (`sonnerstudio.lang`) and broadcast via the `sonnerstudio:lang` event.
- **README internationalization** — the README is translated into 32 languages
  (full scope, 10 sections each), adapted to the SonnerStudio project.

### Hermes Secretary (voice layer)
- **Kokoro TTS** — German female voice `df_eva`, filmreif speed 0.9
  (no Asian accent). Whisper STT for speech input.
- **Headless microphone monitor** — `mic-level.py` probes multiple device
  specs (`Externes Mikrofon:`, `:0`, `:default`, `Default:`) and parses the
  `mean_volume` line with a regex (fixed: the old `split(':')[-1]` crashed on
  the real ffmpeg prefix, so the mic always read 0).
- **MLX Runtime Proxy** — `mlx-proxy.py` lazy proxy on `:1240` serving Kokoro
  TTS, Whisper STT, and MLX chat models one at a time, so a 16 GB Mac mini
  stays within RAM limits.

### Plugin
- **`plugins/hermes-sekretaerin/`** — self-contained extension:
  `mlx-proxy.py`, `mic-level.py`, `kokoro-tts-server.py`, `setup.sh`,
  `BUILD_kokoro.md`, `plugin.yaml`. Bundles a persistent `kokoro-cli` build.

### Branding
- **SonnerStudio banner** with ZetaTron hornet in `assets/banner.png`.
- Fork notice on every README: *"A SonnerStudio fork of Hermes Agent by
  Nous Research"*.

---

## Upstream sync

This fork tracks upstream NousResearch/hermes-agent. When upstream changes are
merged, add an entry under a dated heading here, e.g.:

```
## 2026-MM-DD — synced upstream <commit>
- <what changed>
```
