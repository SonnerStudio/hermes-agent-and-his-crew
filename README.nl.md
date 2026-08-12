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

**Een SonnerStudio-fork van [Hermes Agent](https://hermes-agent.nousresearch.com/) door Nous Research** — de zelfverbeterende AI-agent, uitgebreid met een gespreksgestuurde **Hermes-Secretaresse** en een visueel **Composer-bestuurs-HUD** voor het orkestreren van sub-agenten.

Dit fork voegt toe:

- **Composer-bestuursknoppen** — vier schakelknoppen in de Composer van het desktop (sub-agent orkestratie, spraakcommunicatie, orkestratiemodus, dubbelmodus) met live statuskleuren (rood = inactief, geel = provisioning, groen = actief).
- **Orkestratie-HUD** — vier live paneeltjes met blauwe rand onder de invoer van de Composer: *Sub-Agenten Team* (toont alleen actieve agenten), *Hermes-Secretaresse Belasting* (luidspreker/microfoon in plaats van sub-agenten-belasting), *Kopieerde Agenten* (clone-tellingen dubbelmodus), en *Harmoniseren en Agentenbelasting* (gemiddelde voortgang alleen actieve agenten). Paneeltjes verschijnen alleen bij echte taak — geen demo-placeholders.
- **Hermes-Secretaresse** — een spraaklaag om met de agent te praten. Duitse TTS via **cduvenhorst F5-TTS** (Stimme Serena, `q3_serena_warm_000.wav`, warme vrouwelijke Duitse stem, geen accentdrift), STT via Whisper-small-MLX (Duits), en een headless microfoonniveau monitor (RAW PCM-delging, geen zichtbaar terminalpop-up). De agent kan sub-agenten deployen voor gesproken verzoeken.
- **MLX Runtime Proxy** — een lokaal lazy proxy (`:1240`) dat F5-TTS, Whisper STT en MLX-chatmodellen één voor één dient, zodat de 16 GB Mac mini binnen de RAM-grenzen blijft.
- **Lerende Crew** — live leerscores voor Hermes Agent, Secretaresse, en 8 sub-agent specialisten (Onderzoek, Code, Beeld, Audio, Analyse, Planning, Technisch, Structurering) als compacte voortgangsbalken met echte scores uit delegatieresultaten.
- **Panel Laatste Leer Succes** — toont de laatste leersucces: welke agent (Hermes Agent, Hermes-Secretaresse, of één van 8 sub-agenten), wat bereikt werd (topologie, clone-factor, eenheden, latency), en succesmarker.

> **Opmerking:** De MLX-runtime, cduvenhorst F5-TTS Duits, en de Hermes-Secretaresse spraakpipeline zijn afgestemd op Apple Silicon (macOS). Zie `plugins/hermes-sekretaerin/` voor setup.

---

## Snel Installeren

### Linux, macOS, WSL2, Termux

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows (native, PowerShell)

> **Opgepast:** Native Windows draait Hermes zonder WSL — CLI, gateway, TUI en tools werken al native. Als je WSL2 liever wilt, werkt de Linux/macOS een-lijner hierboven ook daar.

Dit in PowerShell uitvoeren:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

De installer regelt alles: uv, Python 3.11, Node.js, ripgrep, ffmpeg, **en een portabele Git Bash** (MinGit, uitgepakt naar `%LOCALAPPDATA%\hermes\git` — geen admin vereist, volledig geïsoleerd van elke systeem-Git-installatie). Hermes gebruikt deze gebundelde Git Bash voor shell-commando's.

Als Git al geïnstalleerd is, detecteert de installer dat en gebruikt die in plaats daarvan. Anders is een ~45MB MinGit-download alles wat je nodig hebt — het raakt geen systeem-Git-installatie.

> **Android / Termux:** De geteste handmatige route is gedocumenteerd in de [Termux-gids](https://hermes-agent.nousresearch.com/docs/getting-started/termux). Op Termux installeert Hermes een gecureerde `.[termux]` extra omdat de volledige `.[all]` extra momenteel Android-ongeschikte spraakafhankelijkheden trekt.
>
> **Windows:** Native Windows is volledig ondersteund — de PowerShell een-lijner hierboven installeert alles. Als je WSL2 liever wilt, werkt de Linux-opdracht ook daar. Native Windows-installatie staat onder `%LOCALAPPDATA%\hermes`; WSL2 onder `~/.hermes` zoals op Linux.

---

## Hermes-Secretaresse Setup (SonnerStudio-extensie)

De spraaklaag staat in `plugins/hermes-sekretaerin/` :

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

Dit installeert:
- `mlx-proxy.py` als launchd-daemon (dient TTS/STT/MLX-modellen op `:1240`)
- `mic-level.py` als headless LaunchAgent (microfoonniveau monitor, geen terminalvenster)
- `f5-tts-server.py` (cduvenhorst F5-TTS Duits, Serena-stimme)

**F5-TTS bouwen (eenmalig):** zie `plugins/hermes-sekretaerin/BUILD_f5.md`. Vereist `cmake`, `espeak-ng`-headers, en de `ggml`/`highway`-submodules.

**Microfoon-machtiging:** eenmalig macOS *Systeeminstellingen → Privacy & Beveiliging → Microfoon* voor de helper vrijgeven.

---

## Taalkeuze

De desktop-app heeft een ingebouwde taalkeuze (🌐) met Duits, Engels, Frans, Spaans, Nederlands en meer SonnerStudio-talen.

---

## Huidig Ontwikkelingsstand (Augustus 2026)

### Deze Sessie Compleet

1. **Secretaresse Spraakpipeline Hersteld**
   - `voice_comms.py` indentatiecorruptie hersteld (afgebroken bewerking)
   - VAD drempel 15 → 35 + 3-frame minimum (onderdrukt BT-headset ruis hallucinaties)
   - RAW PCM-delging via `mic-level.py` → `~/.hermes/mic-raw.pcm` (lost BT-HFP stilte op)
   - Apparaat `:0` geprioriteerd in `DEV_CANDIDATES` (echte audio-invoer)
   - `_trigger_model_load()` activeert modelbelasting na proxy-restart automatisch

2. **Proxy-Stabiliteit**
   - `/health` HTTP 500 → 200 (psutil try/except + sysctl fallback)
   - Enkele LaunchAgent (`com.jan.mlx-proxy`) — redundante/conflictende agents verwijderd
   - Boot-autostart: wanneer `voice_comms.toggle.active=true` → start mic-level + voice_comms
   - Directe subprocess-instantiatie (geen launchctl-races)

3. **Orkestratie-HUD Opnieuw Geconstrueerd**
   - 4 kaarten: Sub-Agenten Team, Hermes-Secretaresse Belasting, Kopieerde Agenten, Harmoniseren
   - Sub-Agenten Team toont ALLEEN actieve agenten (geen statische "gereed" placeholder)
   - Audiopaneel → "Hermes-Secretaresse Belasting" (luidspreker/microfoon, niet sub-agentenbelading)
   - Kaarten delen volledige breedte gelijkmatig (`flex-1 min-w-0`, geen wrap)

4. **Lerende Crew & Laatste Leer Succes Panel**
   - 8 sub-agent specialisten geregistreerd: Onderzoek, Code, Beeld, Audio, Analyse, Planning, Technisch, Structurering
   - Duplicaat "Planning Specialist" verwijderd; StructureringsExpert toegevoegd
   - `secretary_memory.py`: `last_learning_event()` geeft laatste succesvolle resultaat
   - Proxy endpoint `/secretary-learning` geeft `last_learning` uit
   - Frontend: Kaart 1 = "Laatste Leer Succes" (agent label + topologie/clone/eenheden/latency + succesmarker)
   - "Routingvoorkeuren" en "Lerende Crew" velden verwijderd

5. **Volledige Breedte Composer**
   - `--composer-width: 100%` (was `62rem`) — composer + thread gebruiken volledige breedte tussen zijmenus

6. **Alle Lint/Type-Deuren Geslaagd**
   - `eslint` exit 0 op alle gewijzigde bestanden
   - `tsc -p . --noEmit` exit 0
   - Python `py_compile` OK op `secretary_memory.py`, `mlx-proxy.py`

### Lopende Diensten (Geverifieerd)

- mlx-proxy: PID 54356 (door launchd beheerd)
- voice_comms.py: PID 36659 (cduvenhorst F5-TTS, Serena-stimme)
- mic-level.py: PID 43150 (RAW PCM + level JSON)
- whisper-stt: PID ~1250 (Duits, small MLX)
- Hermes Desktop: PID 54655 (app.asar hergepakt met alle veranderingen)

---

## Architectuur-overzicht

```
┌─────────────────────────────────────────────────────────────────┐
│  Hermes Desktop (Electron + React)                              │
│  ├── Composer (4 knoppen, live HUD)                             │
│  ├── OrchestrationStatus (4 kaarten, echte gegevens)            │
│  ├── LearningFooter (Lerende Crew, 2-rijen rooster)             │
│  └── SecretaryLearning (Laatste Leer + Skills + Grafiek)        │
└──────────────────────────┬──────────────────────────────────────┘
                           │ WebSocket / REST
┌──────────────────────────▼──────────────────────────────────────┐
│  mlx-proxy.py (:1240) — LaunchAgent beheerd                     │
│  ├── /health → knoppenstatus (voice_comms, orkestratie, ...)    │
│  ├── /orchestration → live agentenkaart                         │
│  ├── /secretary-learning → scores + last_learning + grafiek     │
│  ├── voice_comms.py subprocess (F5-TTS Serena)                  │
│  ├── mic-level.py subprocess (RAW PCM + level JSON)             │
│  └── whisper-stt subprocess (Duits, poort 1250)                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Bijdragen

Zie [AGENTS.md](AGENTS.md) voor de ontwikkelingsgids en [DESIGN.md](apps/desktop/DESIGN.md) voor het visuele contract.

---

## Licentie

MIT — zie [LICENSE](LICENSE).