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
- **Orchestration-HUD** — vier blau umrandete Live-Felder unter dem Composer-Eingabefeld: *Sub-Agenten-Team* (nur laufende Agenten), *Hermes-Sekretärin Auslastung* (Sprecher/Mikrofon statt Sub-Agenten-Last), *Kopierte Agenten*, und *Harmonisierung & Agentenauslastung*. Felder erscheinen nur bei echter Aufgabe (keine Demo).
- **Hermes-Sekretärin** — eine Sprachebene, mit der du mit dem Agenten sprichst. Deutsche TTS über **cduvenhorst F5-TTS** (Serena-Stimme, `q3_serena_warm_000.wav`, warme weibliche deutsche Stimme, kein Akzent-Drift), STT über Whisper-small-MLX (Deutsch), und ein headless Mikrofon-Pegel-Monitor (RAW PCM Sharing, kein sichtbares Terminal-Fenster). Der Agent kann Sub-Agenten zur Umsetzung gesprochener Anfragen einteilen.
- **MLX-Runtime-Proxy** — ein lokaler Lazy-Proxy (`:1240`), der F5-TTS, Whisper-STT und MLX-Chat-Modelle nacheinander bereitstellt, damit der 16-GB-Mac-mini innerhalb der RAM-Grenzen bleibt.
- **Lernende Crew** — live Lern-Scores für Hermes Agent, Sekretärin und 8 Sub-Agenten-Spezialisten (Recherche, Code, Bild, Audio, Analyse, Planung, Technik, Strukturierung) als kompakte Fortschrittsbalken mit echten Scores aus Delegationsergebnissen.
- **Letzter Lernerfolg Panel** — zeigt den letzten Lern-Erfolg: welcher Agent (Hermes Agent, Hermes-Sekretärin oder einer der 8 Sub-Agenten), was erreicht wurde (Topologie, Klon-Faktor, Einheiten, Latenz), und Erfolg-Marker.

> **Hinweis:** Die MLX-Runtime, cduvenhorst F5-TTS Deutsch und die Hermes-Sekretärin-Sprachpipeline sind auf Apple Silicon (macOS) abgestimmt. Siehe `plugins/hermes-sekretaerin/`.

---

## Schnellinstallation

### Linux, macOS, WSL2, Termux

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows (nativ, PowerShell)

> **Hinweis:** Natives Windows führt Hermes ohne WSL aus — CLI, Gateway, TUI und Tools funktionieren nativ. Falls WSL2 bevorzugt wird, funktioniert der Linux/macOS Einzeiler dort ebenfalls.

In PowerShell ausführen:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Der Installer erledigt alles: uv, Python 3.11, Node.js, ripgrep, ffmpeg, **und ein portables Git Bash** (MinGit, entpackt nach `%LOCALAPPDATA%\hermes\git` — kein Admin erforderlich, komplett isoliert von jeder System-Git-Installation). Hermes nutzt dieses gebündelte Git Bash für Shell-Kommandos.

Falls Git bereits installiert ist, erkennt der Installer es und verwendet das stattdessen. Andernfalls wird nur ~45MB MinGit heruntergeladen — es berührt keine System-Git-Installation.

> **Android / Termux:** Der getestete manuelle Pfad ist im [Termux-Guide](https://hermes-agent.nousresearch.com/docs/getting-started/termux) dokumentiert. Auf Termux installiert Hermes ein kuratiertes `.[termux]` Extra, weil das volle `.[all]` Extra aktuell Android-inkompatible Voice-Abhängigkeiten zieht.
>
> **Windows:** Natives Windows wird vollständig unterstützt — der PowerShell-Einzeiler oben installiert alles. Falls WSL2 bevorzugt wird, funktioniert der Linux-Befehl dort auch. Native Windows-Installation unter `%LOCALAPPDATA%\hermes`; WSL2 unter `~/.hermes` wie auf Linux.

---

## Hermes-Sekretärin-Setup (SonnerStudio-Erweiterung)

Die Sprachebene liegt in `plugins/hermes-sekretaerin/`:

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

Das installiert:
- `mlx-proxy.py` als launchd-Daemon (TTS/STT/MLX-Modelle auf `:1240`)
- `mic-level.py` als headless LaunchAgent (Mikrofon-Pegel-Monitor, kein Terminal-Fenster)
- `f5-tts-server.py` (cduvenhorst F5-TTS Deutsch, Serena-Stimme)

**F5-TTS bauen (einmalig):** siehe `plugins/hermes-sekretaerin/BUILD_f5.md`. Benötigt `cmake`, `espeak-ng`-Header und die `ggml`/`highway`-Submodule.

**Mikrofon-Berechtigung:** einmalig macOS *Systemeinstellungen → Datenschutz & Sicherheit → Mikrofon* für den Helfer freigeben.

---

## Sprachauswahl

Die Desktop-App hat eine eingebaute Sprachauswahl (🌐) mit Deutsch, Englisch, Französisch, Spanisch, Niederländisch und weiteren SonnerStudio-Sprachen.

---

## Aktueller Entwicklungsstand (August 2026)

### In dieser Session abgeschlossen

1. **Sekretärin-Sprachpipeline wiederhergestellt**
   - `voice_comms.py` Indentation-Korruption behoben (abgebrochener Edit)
   - VAD-Schwellenwert 15 → 35 + 3-Frames-Minimum (unterdrückt BT-Headset-Rauschen-Halluzinationen)
   - RAW PCM Sharing via `mic-level.py` → `~/.hermes/mic-raw.pcm` (löst BT-HFP-Stille)
   - Gerät `:0` priorisiert in `DEV_CANDIDATES` (echter Audio-Eingang)
   - `_trigger_model_load()` triggert Modell-Load nach Proxy-Restart automatisch

2. **Proxy-Stabilität**
   - `/health` HTTP 500 → 200 (psutil try/except + sysctl Fallback)
   - Einziger LaunchAgent (`com.jan.mlx-proxy`) — redundante/konfliktäre Agents entfernt
   - Boot-Autostart: wenn `voice_comms.toggle.active=true` → startet mic-level + voice_comms
   - Direkter Subprocess-Spawn (keine launchctl-Race-Conditions)

3. **Orchestration HUD neu gestaltet**
   - 4 Karten: Sub-Agenten-Team, Hermes-Sekretärin Auslastung, Kopierte Agenten, Harmonisierung
   - Sub-Agenten-Team zeigt NUR laufende Agenten (kein statischer "Bereit"-Platzhalter)
   - Audio-Panel → "Hermes-Sekretärin Auslastung" (Sprecher/Mikrofon, nicht Sub-Agenten-Last)
   - Karten teilen volle Breite gleichmäßig (`flex-1 min-w-0`, kein wrap)

4. **Lernende Crew & Letzter Lernerfolg Panel**
   - 8 Sub-Agenten-Spezialisten registriert: Recherche, Code, Bild, Audio, Analyse, Planung, Technik, Strukturierung
   - Dopplter "Planungs-Spezialist" entfernt; Strukturierungs-Experte hinzugefügt
   - `secretary_memory.py`: `last_learning_event()` liefert letzten erfolgreichen Outcome
   - Proxy-Endpoint `/secretary-learning` gibt `last_learning` aus
   - Frontend: Feld 1 = "Letzter Lernerfolg" (Agenten-Label + Topologie/Klon/Einheiten/Latenz + Erfolg-Marker)
   - "Routing-Präferenzen" und "Lernende Crew" Felder entfernt

5. **Vollbreite Composer**
   - `--composer-width: 100%` (war `62rem`) — Composer + Thread nutzen volle Breite zwischen Seitenmenüs

6. **Alle Lint/Type Gates grün**
   - `eslint` exit 0 auf allen geänderten Dateien
   - `tsc -p . --noEmit` exit 0
   - Python `py_compile` OK auf `secretary_memory.py`, `mlx-proxy.py`

### Laufende Dienste (Verifiziert)

- mlx-proxy: PID 54356 (launchd verwaltet)
- voice_comms.py: PID 36659 (cduvenhorst F5-TTS, Serena-Stimme)
- mic-level.py: PID 43150 (RAW PCM + Level JSON)
- whisper-stt: PID ~1250 (Deutsch, small MLX)
- Hermes Desktop: PID 54655 (app.asar repacked mit allen Änderungen)

---

## Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────────┐
│  Hermes Desktop (Electron + React)                              │
│  ├── Composer (4 Buttons, live HUD)                             │
│  ├── OrchestrationStatus (4 Karten, echte Daten)                │
│  ├── LearningFooter (Lernende Crew, 2-Zeilen Grid)              │
│  └── SecretaryLearning (Letzter Lernerfolg + Skills + Graph)    │
└──────────────────────────┬──────────────────────────────────────┘
                           │ WebSocket / REST
┌──────────────────────────▼──────────────────────────────────────┐
│  mlx-proxy.py (:1240) — LaunchAgent verwaltet                   │
│  ├── /health → Buttons-Status (voice_comms, orchestration, ...) │
│  ├── /orchestration → live Agent-Map                            │
│  ├── /secretary-learning → Scores + last_learning + Graph       │
│  ├── voice_comms.py Subprocess (F5-TTS Serena)                  │
│  ├── mic-level.py Subprocess (RAW PCM + Level JSON)             │
│  └── whisper-stt Subprocess (Deutsch, Port 1250)                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Mitwirken

Siehe [AGENTS.md](AGENTS.md) für den Entwicklungsleitfaden und [DESIGN.md](apps/desktop/DESIGN.md) für den visuellen Vertrag.

---

## Lizenz

MIT — siehe [LICENSE](LICENSE).