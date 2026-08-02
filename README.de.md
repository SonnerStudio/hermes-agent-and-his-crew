<p align="center">
  <img src="assets/banner.png" alt="SonnerStudio — Hermes Agent and his Crew" width="100%">
</p>

# Hermes Agent und sein Team (mit Sub-Agenten) ☤

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

> **Sprachen:** Diese README ist verfügbar auf [Deutsch](README.de.md), [Français](README.fr.md), [Español](README.es.md), [Nederlands](README.nl.md). Die Desktop-App hat einen integrierten Sprachumschalter (🌐) mit diesen und weiteren Sprachen.

**Ein SonnerStudio-Fork von [Hermes Agent](https://hermes-agent.nousresearch.com/) von Nous Research** — der selbstlernende KI-Agent, erweitert um eine sprachgesteuerte **Hermes-Sekretärin** und ein visuelles **Composer-Control-HUD** zur Orchestrierung von Sub-Agenten.

Dieser Fork fügt hinzu:

- **Composer Control Buttons** — vier Umschalt-Buttons im Desktop-Composer (Sub-Agent-Orchestrierung, Sprachkommunikation, Orchestrierungsmodus, Double-Mode) mit Live-Statusfarben (rot = inaktiv, gelb = Bereitstellung, grün = aktiv).
- **Orchestration HUD** — vier blau umrandete Live-Felder unter dem Composer-Eingabefeld: *Sub-Agenten-Team*, *Hermes-Sekretärin (Audio-Kommunikation)*, *Kopierte Agenten (Cloned Agents)* und *Harmonisierung & Agentenauslastung*. Felder erscheinen nur, wenn eine echte Aufgabe läuft — keine Demo-Platzhalter.
- **Hermes-Sekretärin** — eine Sprachebene, mit der du mit dem Agenten sprechen kannst. Deutsche TTS über **Kokoro** (`df_eva`, weiblich, filmreif speed 0.9), STT über Whisper und ein headless Mikrofon-Pegel-Monitor (kein sichtbares Terminal-Fenster). Der Agent kann Sub-Agenten delegieren, um gesprochene Anfragen auszuführen.
- **MLX Runtime Proxy** — ein lokaler Lazy-Proxy (`:1240`), der Kokoro TTS, Whisper STT und MLX-Chat-Modelle nacheinander bereitstellt, damit der 16-GB-Mac-mini innerhalb der RAM-Grenzen bleibt.

> **Hinweis:** Die MLX-Laufzeit, Kokoro Deutsche TTS und die Hermes-Sekretärin-Sprachpipeline sind auf Apple Silicon (macOS) abgestimmt. Siehe `plugins/hermes-sekretaerin/` für die Einrichtung.

---

## Schnellinstallation

### Linux, macOS, WSL2, Termux

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows (nativ, PowerShell)

> **Achtung:** Nativ unter Windows läuft Hermes ohne WSL — CLI, Gateway, TUI und Tools funktionieren alle nativ. Wenn du lieber WSL2 nutzen möchtest, funktioniert der Linux/macOS-Einzeiler oben dort ebenfalls. Einen Bug gefunden? Bitte [Issues melden](https://github.com/NousResearch/hermes-agent/issues).

Führe dies in PowerShell aus:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Der Installer erledigt alles: uv, Python 3.11, Node.js, ripgrep, ffmpeg, **sowie eine portable Git Bash** (MinGit, entpackt nach `%LOCALAPPDATA%\hermes\git` — keine Admin-Rechte nötig, vollständig isoliert von jeder System-Git-Installation). Hermes nutzt diese gebündelte Git Bash, um Shell-Befehle auszuführen.

Falls Git bereits installiert ist, erkennt der Installer dies und verwendet es stattdessen. Andernfalls ist ein ~45 MB großer MinGit-Download alles, was du brauchst — er verändert oder stört kein System-Git.

> **Android / Termux:** Der getestete manuelle Weg ist im [Termux-Leitfaden](https://hermes-agent.nousresearch.com/docs/getting-started/termux) dokumentiert. Auf Termux installiert Hermes ein kuratiertes `.[termux]`-Extra, da das vollständige `.[all]`-Extra derzeit Android-inkompatible Sprachabhängigkeiten mitzieht.
>
> **Windows:** Nativ unter Windows wird vollständig unterstützt — der PowerShell-Einzeiler oben installiert alles. Wenn du lieber WSL2 nutzen möchtest, funktioniert der Linux-Befehl dort ebenfalls. Die native Windows-Installation liegt unter `%LOCALAPPDATA%\hermes`; WSL2 installiert wie unter Linux unter `~/.hermes`.

---

## Hermes-Sekretärin-Einrichtung (SonnerStudio-Erweiterung)

Die Sprachebene liegt in `plugins/hermes-sekretaerin/`:

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

Dies installiert:
- `mlx-proxy.py` als launchd-Daemon (stellt TTS/STT/MLX-Modelle auf `:1240` bereit)
- `mic-level.py` als headless LaunchAgent (Mikrofon-Pegel-Monitor, kein Terminalfenster)
- `kokoro-tts-server.py` (Kokoro Deutsche TTS, `df_eva`)

**Kokoro bauen (einmalig):** siehe `plugins/hermes-sekretaerin/BUILD_kokoro.md`. Benötigt `cmake`, `espeak-ng`-Header und die `ggml`/`highway`-Submodule.

**Mikrofon-Berechtigung:** gewähre dem Helper einmalig macOS-*Systemeinstellungen → Datenschutz & Sicherheit → Mikrofon*-Zugriff.

---

Nach der Installation:

```bash
source ~/.bashrc    # Shell neu laden (oder: source ~/.zshrc)
hermes              # Los chatten!
```

### Fehlerbehebung

#### Windows Defender oder Antivirensoftware markiert `uv.exe` als Malware

Falls deine Antivirensoftware (Bitdefender, Windows Defender usw.) `uv.exe` aus dem Hermes-`bin`-Ordner (`%LOCALAPPDATA%\hermes\bin\uv.exe`) in Quarantäne verschiebt, ist dies ein **Fehlalarm**. Die Datei ist Astrals `uv` — der Rust-Python-Paketmanager, den Hermes zur Verwaltung seiner Python-Umgebung bündelt. ML-basierte Antiviren-Engines markieren häufig unsignierte Rust-Binärdateien, die Pakete herunterladen und installieren.

**So verifizierst du, dass deine Kopie authentisch ist:**

```powershell
# Install GitHub CLI if needed
winget install --id GitHub.cli

# Login to GitHub
gh auth login

# Run verification
$uv = "$env:LOCALAPPDATA\hermes\bin\uv.exe"
$ver = (& $uv --version).Split(' ')[1]
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$zip = "$env:TEMP\uv.zip"
Invoke-WebRequest "https://github.com/astral-sh/uv/releases/download/$ver/uv-x86_64-pc-windows-msvc.zip" -OutFile $zip -UseBasicParsing
gh attestation verify $zip --repo astral-sh/uv
Expand-Archive $zip "$env:TEMP\uv_x" -Force
(Get-FileHash "$env:TEMP\uv_x\uv.exe").Hash -eq (Get-FileHash $uv).Hash
```

Wenn die Attestierung "Verification succeeded" ausgibt und die letzte Zeile `True` ausgibt, ist alles in Ordnung.

**So setzt du Hermes auf die Whitelist:**
- **Windows Defender:** Führe PowerShell als Admin aus → `Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\hermes\bin"`
- **Bitdefender:** Füge eine Ausnahme in der Bitdefender-Konsole hinzu (Protection > Antivirus > Settings > Manage Exceptions)
- Setze den **Ordner** auf die Whitelist, nicht den Datei-Hash — Hermes aktualisiert `uv`, und der Hash ändert sich mit jeder Version.

Für mehr Kontext siehe die Upstream-Astral-Berichte: [astral-sh/uv#13553](https://github.com/astral-sh/uv/issues/13553), [astral-sh/uv#15011](https://github.com/astral-sh/uv/issues/15011), [astral-sh/uv#10079](https://github.com/astral-sh/uv/issues/10079).

---

## Erste Schritte

```bash
hermes              # Interaktive CLI — ein Gespräch starten
hermes model        # Wähle deinen LLM-Anbieter und dein Modell
hermes tools        # Konfiguriere, welche Tools aktiviert sind
hermes config set   # Einzelne Konfigurationswerte setzen
hermes config get   # Einzelne Konfigurationswerte ausgeben
hermes gateway      # Das Messaging-Gateway starten (Telegram, Discord usw.)
hermes setup        # Den vollständigen Setup-Assistenten ausführen (konfiguriert alles auf einmal)
hermes claw migrate # Von OpenClaw migrieren (falls du von OpenClaw kommst)
hermes update       # Auf die neueste Version aktualisieren
hermes doctor       # Probleme diagnostizieren
```

📖 **[Vollständige Dokumentation →](https://hermes-agent.nousresearch.com/docs/)**

---

## API-Schlüssel-Sammlung überspringen — Nous Portal

Hermes arbeitet mit jedem Anbieter, den du möchtest — das ändert sich nicht. Wenn du aber nicht fünf separate API-Schlüssel für Modell, Websuche, Bildgenerierung, TTS und einen Cloud-Browser sammeln möchtest, deckt **[Nous Portal](https://portal.nousresearch.com)** sie alle unter einem Abo ab:

- **300+ Modelle** — wähle eines davon mit `/model <name>`
- **Tool Gateway** — Websuche (Firecrawl), Bildgenerierung (FAL), Text-zu-Sprache (OpenAI), Cloud-Browser (Browser Use), alle über dein Abo geroutet. Keine zusätzlichen Konten.

Ein Befehl ab einer frischen Installation:

```bash
hermes setup --portal
```

Das meldet dich via OAuth an, setzt Nous als Anbieter und aktiviert das Tool Gateway. Prüfe jederzeit mit `hermes portal info`, was verbunden ist. Volle Details auf der [Tool-Gateway-Dokumentationsseite](https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway).

Du kannst jederzeit deine eigenen Schlüssel pro Tool mitbringen — das Gateway ist pro-Backend, nicht alles-oder-nichts.

---

## CLI vs. Messaging — Kurzreferenz

Hermes hat zwei Einstiegspunkte: starte die Terminal-UI mit `hermes`, oder betreibe das Gateway und kommuniziere darüber von Telegram, Discord, Slack, WhatsApp, Signal oder E-Mail. Sobald du in einem Gespräch bist, werden viele Slash-Befehle über beide Schnittstellen geteilt.

| Aktion                                     | CLI                                           | Messaging-Plattformen                                                          |
| ------------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------ |
| Chat starten                               | `hermes`                                      | Führe `hermes gateway setup` + `hermes gateway start` aus und sende dem Bot dann eine Nachricht |
| Neues Gespräch starten                     | `/new` oder `/reset`                          | `/new` oder `/reset`                                                           |
| Modell wechseln                            | `/model [provider:model]`                     | `/model [provider:model]`                                                      |
| Persönlichkeit festlegen                   | `/personality [name]`                         | `/personality [name]`                                                          |
| Letzten Schritt wiederholen oder rückgängig machen | `/retry`, `/undo`                      | `/retry`, `/undo`                                                              |
| Kontext komprimieren / Nutzung prüfen      | `/compress`, `/usage`, `/insights [--days N]` | `/compress`, `/usage`, `/insights [days]`                                      |
| Skills durchsuchen                         | `/skills` oder `/<skill-name>`                | `/<skill-name>`                                                                |
| Aktuelle Arbeit unterbrechen               | `Ctrl+C` oder neue Nachricht senden           | `/stop` oder neue Nachricht senden                                             |
| Plattformspezifischer Status               | `/platforms`                                  | `/status`, `/sethome`                                                          |

Für die vollständigen Befehlslisten siehe den [CLI-Leitfaden](https://hermes-agent.nousresearch.com/docs/user-guide/cli) und den [Messaging-Gateway-Leitfaden](https://hermes-agent.nousresearch.com/docs/user-guide/messaging).

---

## Dokumentation

Die gesamte Dokumentation findet sich unter **[hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs)**:

| Bereich                                                                                              | Inhalt                                                     |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [Schnellstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)                | Installation → Einrichtung → erstes Gespräch in 2 Minuten  |
| [CLI-Nutzung](https://hermes-agent.nousresearch.com/docs/user-guide/cli)                             | Befehle, Tastenkürzel, Persönlichkeiten, Sitzungen         |
| [Konfiguration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)                 | Konfigurationsdatei, Anbieter, Modelle, alle Optionen      |
| [Messaging-Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)                 | Telegram, Discord, Slack, WhatsApp, Signal, Home Assistant |
| [Sicherheit](https://hermes-agent.nousresearch.com/docs/user-guide/security)                         | Befehlsfreigabe, DM-Pairing, Container-Isolation           |
| [Tools & Toolsets](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools)             | 40+ Tools, Toolset-System, Terminal-Backends               |
| [Skills-System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)               | Prozeduraler Speicher, Skills Hub, Skills erstellen        |
| [Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)                      | Persistenter Speicher, Benutzerprofile, Best Practices     |
| [MCP-Integration](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)                | Verbinde einen beliebigen MCP-Server für erweiterte Fähigkeiten |
| [Cron-Zeitplanung](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)              | Geplante Aufgaben mit Plattform-Zustellung                 |
| [Kontextdateien](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)       | Projektkontext, der jedes Gespräch prägt                   |
| [Architektur](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture)               | Projektstruktur, Agenten-Schleife, Schlüsselklassen        |
| [Mitwirken](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing)                 | Entwicklungs-Setup, PR-Prozess, Code-Stil                  |
| [CLI-Referenz](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)                    | Alle Befehle und Flags                                     |
| [Umgebungsvariablen](https://hermes-agent.nousresearch.com/docs/reference/environment-variables)     | Vollständige Referenz der Umgebungsvariablen               |

---

## Migration von OpenClaw

Wenn du von OpenClaw kommst, kann Hermes deine Einstellungen, Erinnerungen, Skills und API-Schlüssel automatisch importieren.

**Bei der Erst-Einrichtung:** Der Setup-Assistent (`hermes setup`) erkennt `~/.openclaw` automatisch und bietet eine Migration an, bevor die Konfiguration beginnt.

**Jederzeit nach der Installation:**

```bash
hermes claw migrate              # Interaktive Migration (volles Preset)
hermes claw migrate --dry-run    # Vorschau, was migriert würde
hermes claw migrate --preset user-data   # Ohne Geheimnisse migrieren
hermes claw migrate --overwrite  # Vorhandene Konflikte überschreiben
```

Was importiert wird:

- **SOUL.md** — Persona-Datei
- **Erinnerungen** — MEMORY.md- und USER.md-Einträge
- **Skills** — vom Benutzer erstellte Skills → `~/.hermes/skills/openclaw-imports/`
- **Befehls-Allowlist** — Freigabe-Muster
- **Messaging-Einstellungen** — Plattform-Konfigurationen, erlaubte Benutzer, Arbeitsverzeichnis
- **API-Schlüssel** — freigegebene Secrets (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs)
- **TTS-Assets** — Arbeitsbereich-Audiodateien
- **Workspace-Anweisungen** — AGENTS.md (mit `--workspace-target`)

Siehe `hermes claw migrate --help` für alle Optionen, oder nutze den `openclaw-migration`-Skill für eine interaktive, agentengeführte Migration mit Dry-Run-Vorschauen.

---

## Mitwirken

Wir freuen uns über Beiträge! Siehe den [Mitwirk-Leitfaden](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing) für Entwicklungs-Setup, Code-Stil und PR-Prozess.

Schnellstart für Mitwirkende — nutze den Standard-Installer und arbeite dann aus dem vollständigen Git-Checkout, den er unter `$HERMES_HOME/hermes-agent` (meist `~/.hermes/hermes-agent`) erstellt. Dies entspricht dem Layout, das von `hermes update`, dem verwalteten venv, faulen Abhängigkeiten, Gateway und Dokumentations-Tooling genutzt wird.

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
cd "${HERMES_HOME:-$HOME/.hermes}/hermes-agent"
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

Manueller Clone-Fallback (für Wegwerf-Clones/CI, wo du bewusst das verwaltete Installations-Layout nicht möchtest):

Erstelle das venv außerhalb des geklonten Quellbaums — ein venv innerhalb des Verzeichnisses, von dem aus der Agent operiert, kann durch einen Relativpfad-Befehl, den der Agent gegen seinen eigenen Checkout ausführt, gelöscht werden und so die laufende Runtime mitten in der Sitzung zerstören.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv ~/.hermes/venvs/hermes-dev --python 3.11
source ~/.hermes/venvs/hermes-dev/bin/activate
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

---

## Community

- 💬 [Discord](https://discord.gg/NousResearch)
- 📚 [Skills Hub](https://agentskills.io)
- 🐛 [Issues](https://github.com/NousResearch/hermes-agent/issues)
- 🔌 [computer-use-linux](https://github.com/avifenesh/computer-use-linux) — Linux Desktop-Control-MCP-Server für Hermes und andere MCP-Hosts, mit AT-SPI-Zugänglichkeitsbäumen, Wayland/X11-Eingabe, Screenshots und Compositor-Fenster-Zielsteuerung.
- 🔌 [HermesClaw](https://github.com/AaronWong1999/hermesclaw) — Community-WeChat-Brücke: Betreibe Hermes Agent und OpenClaw auf demselben WeChat-Konto.

---

## Lizenz

MIT — siehe [LICENSE](LICENSE).

Erstellt von [Nous Research](https://nousresearch.com).
