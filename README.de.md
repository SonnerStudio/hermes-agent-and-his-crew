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

**Ein SonnerStudio-Fork von [Hermes Agent](https://hermes-agent.nousresearch.com/) von Nous Research** — der selbstlernende KI-Agent, erweitert um eine sprachgesteuerte **Hermes-Sekretärin** und ein visuelles **Composer-Steuerungs-HUD** zur Orchestrierung von Sub-Agenten.

Dieser Fork fügt hinzu:

- **Composer-Steuerungsbuttons** — vier Umschaltbuttons im Desktop-Composer (Sub-Agent-Orchestrierung, Sprachkommunikation, Orchestrierung, Doppel-Modus) mit live Zustandsfarben (rot = inaktiv, gelb = Bereitstellung, grün = aktiv).
- **Orchestration-HUD** — vier blau umrandete Live-Felder unter dem Composer-Eingabefeld: *Sub-Agenten-Team*, *Hermes-Sekretärin (Audio-Kommunikation)*, *Kopierte Agenten*, und *Harmonisierung & Agentenauslastung*. Felder erscheinen nur bei echter Aufgabe (keine Demo).
- **Hermes-Sekretärin** — eine Sprachebene, mit der du mit dem Agenten sprichst. Deutsche TTS über **Kokoro** (`df_eva`, weiblich, filmreif Speed 0.9), STT über Whisper, und ein headless Mikrofon-Pegel-Monitor (kein sichtbares Terminal-Fenster). Der Agent kann Sub-Agenten zur Umsetzung gesprochener Anfragen einteilen.
- **MLX-Runtime-Proxy** — ein lokaler Lazy-Proxy (`:1240`), der Kokoro-TTS, Whisper-STT und MLX-Chat-Modelle nacheinander bereitstellt, damit der 16-GB-Mac-mini innerhalb der RAM-Grenzen bleibt.

> **Hinweis:** Die MLX-Runtime, Kokoro deutsche TTS und die Hermes-Sekretärin-Sprachpipeline sind auf Apple Silicon (macOS) abgestimmt. Siehe `plugins/hermes-sekretaerin/`.

---

## Schnellinstallation

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

---

## Hermes-Sekretärin-Setup (SonnerStudio-Erweiterung)

Die Sprachebene liegt in `plugins/hermes-sekretaerin/`:

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

Das installiert:
- `mlx-proxy.py` als launchd-Daemon (TTS/STT/MLX-Modelle auf `:1240`)
- `mic-level.py` als headless LaunchAgent (Mikrofon-Pegel-Monitor, kein Terminal-Fenster)
- `kokoro-tts-server.py` (Kokoro deutsche TTS, `df_eva`)

**Kokoro bauen (einmalig):** siehe `plugins/hermes-sekretaerin/BUILD_kokoro.md`. Benötigt `cmake`, `espeak-ng`-Header und die `ggml`/`highway`-Submodule.

**Mikrofon-Berechtigung:** einmalig macOS *Systemeinstellungen → Datenschutz & Sicherheit → Mikrofon* für den Helfer freigeben.

---

## Sprachauswahl

Die Desktop-App hat eine eingebaute Sprachauswahl (🌐) mit Deutsch, Englisch, Französisch, Spanisch, Niederländisch und weiteren SonnerStudio-Sprachen.
