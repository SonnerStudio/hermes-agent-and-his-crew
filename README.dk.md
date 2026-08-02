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
  <a href="README.dk.md"><img src="https://img.shields.io/badge/Lang-Dansk-red?style=for-the-badge" alt="Dansk"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/Lang-English-lightgrey?style=for-the-badge" alt="English"></a>
</p>

> **Sprog:** Denne README er tilgængelig på [Deutsch](README.de.md), [Français](README.fr.md), [Español](README.es.md), [Nederlands](README.nl.md) og [Dansk](README.dk.md). Skrivebordsappen har en indbygget sprogvælger (🌐) med disse og flere.

**Et SonnerStudio-fork af [Hermes Agent](https://hermes-agent.nousresearch.com/) af Nous Research** — den selvforbedrende AI-agent, udvidet med et stemmestyret **Hermes Sekretær** og et visuelt **Composer-Control-HUD** til orkestrering af under-agenter.

Dette fork tilføjer:

- **Composer Control-knapper** — fire til/fra-knapper i skrivebords-composeren (under-agent-orkestrering, stemmekommunikation, orkestreringstilstand, dobbelttilstand) med live tilstandsfarver (rød = inaktiv, gul = klargøring, grøn = aktiv).
- **Orchestration HUD** — fire blå-omrammede live-paneler under composer-inputtet: *Underagenthold*, *Hermes Sekretær*, *Klonede agenter* og *Harmonisering og agentbelastning*. Paneler vises kun, når en reel opgave kører — ingen demo-pladsholdere.
- **Hermes Sekretær** — et stemmelag, der lader dig tale med agenten. Tysk TTS via **Kokoro** (`df_eva`, kvindelig, filmreif hastighed 0.9), STT via Whisper og en hovedløs mikrofonniveau-overvågning (ingen synlig terminal-popup). Agenten kan delegere under-agenter til at udføre talte anmodninger.
- **MLX Runtime Proxy** — en lokal doven proxy (`:1240`), der serverer Kokoro TTS, Whisper STT og MLX chat-modellerne én ad gangen, så 16 GB Mac mini'en forbliver inden for RAM-grænserne.

> **Bemærk:** MLX-runtimen, Kokoro tysk TTS og Hermes Sekretær-stemmepipelinen er tunerede til Apple Silicon (macOS). Se `plugins/hermes-sekretaerin/` for opsætning.

---

## Hurtig Installation

### Linux, macOS, WSL2, Termux

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows (native, PowerShell)

> **Hovsa:** Native Windows kører Hermes uden WSL — CLI, gateway, TUI og værktøjer virker alle nativt. Hvis du hellere vil bruge WSL2, virker Linux/macOS-en-linje-kommandoen ovenfor også der. Fandt du en fejl? Venligst [opret en sag](https://github.com/NousResearch/hermes-agent/issues).

Kør dette i PowerShell:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Installationsprogrammet håndterer alt: uv, Python 3.11, Node.js, ripgrep, ffmpeg, **og en portabel Git Bash** (MinGit, pakket ud til `%LOCALAPPDATA%\hermes\git` — ingen administratorrettigheder påkrævet, fuldstændig isoleret fra enhver system-Git-installation). Hermes bruger denne indpakkede Git Bash til at køre shell-kommandoer.

Hvis du allerede har Git installeret, opdager installationsprogrammet det og bruger det i stedet. Ellers er et ~45MB MinGit-download alt, hvad du behøver — det rører ikke ved eller forstyrrer nogen system-Git.

> **Android / Termux:** Den testede manuelle vej er dokumenteret i [Termux-guiden](https://hermes-agent.nousresearch.com/docs/getting-started/termux). På Termux installerer Hermes et kurateret `.[termux]`-ekstra, fordi det fulde `.[all]`-ekstra i øjeblikket henter Android-inkompatible stemme-afhængigheder.
>
> **Windows:** Native Windows er fuldt understøttet — PowerShell-en-linje-kommandoen ovenfor installerer alt. Hvis du hellere vil bruge WSL2, virker Linux-kommandoen også der. Native Windows-installationen ligger under `%LOCALAPPDATA%\hermes`; WSL2 installerer under `~/.hermes` som på Linux.

---

## Hermes Sekretær Opsætning (SonnerStudio-udvidelse)

Stemmelaget ligger i `plugins/hermes-sekretaerin/`:

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

Dette installerer:
- `mlx-proxy.py` som en launchd-dæmon (serverer TTS/STT/MLX-modeller på `:1240`)
- `mic-level.py` som en hovedløs LaunchAgent (mikrofonniveau-overvågning, intet terminalvindue)
- `kokoro-tts-server.py` (Kokoro tysk TTS, `df_eva`)

**Byg Kokoro (engangskørsel):** se `plugins/hermes-sekretaerin/BUILD_kokoro.md`. Kræver `cmake`, `espeak-ng`-headere og `ggml`/`highway`-undermodulerne.

**Mikrofontilladelse:** giv macOS *Systemindstillinger → Privatliv & Sikkerhed → Mikrofon* adgang til hjælperen én gang.

---

Efter installationen:

```bash
source ~/.bashrc    # genindlæs shell (eller: source ~/.zshrc)
hermes              # start samtalen!
```

### Fejlfinding

#### Windows Defender eller antivirus markerer `uv.exe` som malware

Hvis din antivirus (Bitdefender, Windows Defender osv.) sætter `uv.exe` fra Hermes' `bin`-mappe (`%LOCALAPPDATA%\hermes\bin\uv.exe`) i karantæne, er dette et **falsk positiv**. Filen er Astral's `uv` — den Rust-baserede Python-pakkehåndtering, som Hermes pakker sammen for at håndtere sit Python-miljø. ML-baserede antivirus-motorer markerer almindeligvis usignerede Rust-binære, der downloader og installerer pakker.

**For at bekræfte, at din kopi er ægte:**

```powershell
# Installer GitHub CLI hvis nødvendigt
winget install --id GitHub.cli

# Log ind på GitHub
gh auth login

# Kør verifikation
$uv = "$env:LOCALAPPDATA\hermes\bin\uv.exe"
$ver = (& $uv --version).Split(' ')[1]
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$zip = "$env:TEMP\uv.zip"
Invoke-WebRequest "https://github.com/astral-sh/uv/releases/download/$ver/uv-x86_64-pc-windows-msvc.zip" -OutFile $zip -UseBasicParsing
gh attestation verify $zip --repo astral-sh/uv
Expand-Archive $zip "$env:TEMP\uv_x" -Force
(Get-FileHash "$env:TEMP\uv_x\uv.exe").Hash -eq (Get-FileHash $uv).Hash
```

Hvis attestationen siger "Verification succeeded" og den sidste linje udskriver `True`, er du klar.

**For at hvidliste Hermes:**
- **Windows Defender:** Kør PowerShell som Admin → `Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\hermes\bin"`
- **Bitdefender:** Tilføj en undtagelse i Bitdefender-konsollen (Protection > Antivirus > Settings > Manage Exceptions)
- Hvidlist **mappen**, ikke fil-hash'en — Hermes opdaterer `uv`, og hash'en ændres ved hver version

For mere baggrund, se de opstrøms Astral-rapporter: [astral-sh/uv#13553](https://github.com/astral-sh/uv/issues/13553), [astral-sh/uv#15011](https://github.com/astral-sh/uv/issues/15011), [astral-sh/uv#10079](https://github.com/astral-sh/uv/issues/10079).

---

## Kom godt i gang

```bash
hermes              # Interaktiv CLI — start en samtale
hermes model        # Vælg din LLM-udbyder og model
hermes tools        # Konfigurer hvilke værktøjer der er aktiveret
hermes config set   # Sæt individuelle konfigurationsværdier
hermes config get   # Udskriv individuelle konfigurationsværdier
hermes gateway      # Start besked-gatewayen (Telegram, Discord osv.)
hermes setup        # Kør den fulde opsætningsguide (konfigurerer alt på én gang)
hermes claw migrate # Migrer fra OpenClaw (hvis du kommer fra OpenClaw)
hermes update       # Opdater til den nyeste version
hermes doctor       # Diagnostiser eventuelle problemer
```

📖 **[Fuld dokumentation →](https://hermes-agent.nousresearch.com/docs/)**

---

## Spring API-nøgle-samlingen over — Nous Portal

Hermes virker med enhver udbyder, du ønsker — det ændrer sig ikke. Men hvis du hellere vil undgå at samle fem separate API-nøgler til modellen, websøgning, billedgenerering, TTS og en cloud-browser, dækker **[Nous Portal](https://portal.nousresearch.com)** dem alle under ét abonnement:

- **300+ modeller** — vælg en hvilken som helst med `/model <navn>`
- **Tool Gateway** — websøgning (Firecrawl), billedgenerering (FAL), tekst-til-tale (OpenAI), cloud-browser (Browser Use), alt routeret gennem dit abonnement. Ingen ekstra konti.

Én kommando fra en frisk installation:

```bash
hermes setup --portal
```

Det logger dig ind via OAuth, sætter Nous som din udbyder og tænder for Tool Gateway. Tjek hvad der er forbundet når som helst med `hermes portal info`. Fulde detaljer på [Tool Gateway-dokumentationssiden](https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway).

Du kan stadig medbringe dine egne nøgler per-værktøj, når du vil — gatewayen er per-backend, ikke alt-eller-intet.

---

## CLI kontra Beskeder — Hurtigreference

Hermes har to indgangspunkter: start terminal-UI'et med `hermes`, eller kør gatewayen og tal med den fra Telegram, Discord, Slack, WhatsApp, Signal eller E-mail. Når du først er i en samtale, deles mange skråstregskommandoer på tværs af begge interfaces.

| Handling                         | CLI                                           | Besked-platforme                                                              |
| ------------------------------ | --------------------------------------------- | -------------------------------------------------------------------------------- |
| Start samtale                 | `hermes`                                      | Kør `hermes gateway setup` + `hermes gateway start`, og send derefter botten en besked |
| Start ny samtale       | `/new` eller `/reset`                            | `/new` eller `/reset`                                                               |
| Skift model                   | `/model [provider:model]`                     | `/model [provider:model]`                                                        |
| Sæt en personlighed                              | `/personality [name]`                         | `/personality [name]`                                                            |
| Gentag eller fortryd sidste tur    | `/retry`, `/undo`                             | `/retry`, `/undo`                                                                |
| Komprimer kontekst / tjek forbrug | `/compress`, `/usage`, `/insights [--days N]` | `/compress`, `/usage`, `/insights [days]`                                        |
| Gennemse skills                  | `/skills` eller `/<skill-name>`                  | `/<skill-name>`                                                                  |
| Afbryd nuværende arbejde         | `Ctrl+C` eller send en ny besked                | `/stop` eller send en ny besked                                                    |
| Platform-specifik status       | `/platforms`                                  | `/status`, `/sethome`                                                            |

For de fulde kommandolister, se [CLI-guiden](https://hermes-agent.nousresearch.com/docs/user-guide/cli) og [Besked-gateway-guiden](https://hermes-agent.nousresearch.com/docs/user-guide/messaging).

---

## Dokumentation

Al dokumentation ligger på **[hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs)**:

| Sektion                                                                                             | Hvad dækkes                                             |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [Hurtigstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)                 | Installér → opsæt → første samtale på 2 minutter          |
| [CLI-brug](https://hermes-agent.nousresearch.com/docs/user-guide/cli)                              | Kommandoer, tastebindinger, personligheder, sessioner             |
| [Konfiguration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)                | Konfigurationsfil, udbydere, modeller, alle indstillinger                |
| [Besked-gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)                | Telegram, Discord, Slack, WhatsApp, Signal, Home Assistant |
| [Sikkerhed](https://hermes-agent.nousresearch.com/docs/user-guide/security)                          | Kommandogodkendelse, DM-parring, container-isolation          |
| [Værktøjer & Værktøjssæt](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools)            | 40+ værktøjer, værktøjssæt-system, terminal-backends               |
| [Skills-system](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)              | Procedurel hukommelse, Skills Hub, oprettelse af skills             |
| [Hukommelse](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)                     | Vedvarende hukommelse, brugerprofiler, bedste praksis           |
| [MCP-integration](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)               | Forbind enhver MCP-server for udvidede muligheder           |
| [Cron-planlægning](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)              | Planlagte opgaver med platform-levering                     |
| [Kontekstfiler](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)       | Projektkontekst, der former hver samtale             |
| [Arkitektur](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture)             | Projektstruktur, agent-løkke, nøgleklasser                 |
| [Bidrag](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing)                  | Udviklingsopsætning, PR-proces, kodestil                  |
| [CLI-reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)                  | Alle kommandoer og flag                                     |
| [Miljøvariabler](https://hermes-agent.nousresearch.com/docs/reference/environment-variables) | Komplet miljøvariabel-reference                                 |

---

## Migration fra OpenClaw

Hvis du kommer fra OpenClaw, kan Hermes automatisk importere dine indstillinger, hukommelse, skills og API-nøgler.

**Under førstegangs-opsætningen:** Opsætningsguiden (`hermes setup`) opdager automatisk `~/.openclaw` og tilbyder at migrere, før konfigurationen begynder.

**Når som helst efter installationen:**

```bash
hermes claw migrate              # Interaktiv migration (fuld forudindstilling)
hermes claw migrate --dry-run    # Forhåndsvisning af hvad der ville blive migreret
hermes claw migrate --preset user-data   # Migrer uden hemmeligheder
hermes claw migrate --overwrite  # Overskriv eksisterende konflikter
```

Hvad importeres:

- **SOUL.md** — personafil
- **Hukommelse** — MEMORY.md og USER.md-indgange
- **Skills** — brugeroprettede skills → `~/.hermes/skills/openclaw-imports/`
- **Kommandotilladelsesliste** — godkendelsesmønstre
- **Besked-indstillinger** — platform-konfigurationer, tilladte brugere, arbejdsmappe
- **API-nøgler** — hvidlistede hemmeligheder (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs)
- **TTS-aktiver** — arbejdsområde-lydfiler
- **Arbejdsområde-instruktioner** — AGENTS.md (med `--workspace-target`)

Se `hermes claw migrate --help` for alle muligheder, eller brug `openclaw-migration`-skillen til en interaktiv agent-vejledt migration med dry-run-forhåndsvisninger.

---

## Bidrag

Vi byder bidrag velkommen! Se [Bidrags-guiden](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing) for udviklingsopsætning, kodestil og PR-proces.

Hurtig start for bidragsydere — brug det standard installprogram, og arbejd derefter fra
den fulde git-checkout, det opretter ved `$HERMES_HOME/hermes-agent` (normalt
`~/.hermes/hermes-agent`). Dette matcher det layout, der bruges af `hermes update`, det
managede venv, doven afhængigheder, gateway og dokumentationsværktøjer.

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
cd "${HERMES_HOME:-$HOME/.hermes}/hermes-agent"
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

Manuelt klon-fallback (til engangs-kloner/CI, hvor du bevidst ikke
vil have det managede installationslayout):

Opret venv'et uden for det klonede kildetræ — et venv inde i den mappe,
agenten arbejder fra, kan blive slettet af en relativ-sti-kommando, agenten kører
mod sit eget checkout, hvilket ødelægger den kørende runtime midt i sessionen.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv ~/.hermes/venvs/hermes-dev --python 3.11
source ~/.hermes/venvs/hermes-dev/bin/activate
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

---

## Fællesskab

- 💬 [Discord](https://discord.gg/NousResearch)
- 📚 [Skills Hub](https://agentskills.io)
- 🐛 [Issues](https://github.com/NousResearch/hermes-agent/issues)
- 🔌 [computer-use-linux](https://github.com/avifenesh/computer-use-linux) — Linux desktop-kontrol MCP-server til Hermes og andre MCP-værter, med AT-SPI tilgængelighedstræer, Wayland/X11-input, skærmbilleder og compositor-vindues Targeting.
- 🔌 [HermesClaw](https://github.com/AaronWong1999/hermesclaw) — Community WeChat-bro: Kør Hermes Agent og OpenClaw på den samme WeChat-konto.

---

## Licens

MIT — se [LICENSE](LICENSE).

Bygget af [Nous Research](https://nousresearch.com).
