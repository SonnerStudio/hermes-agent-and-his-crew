<p align="center">
  <img src="assets/banner.png" alt="SonnerStudio — Hermes Agent and his Crew" width="100%">
</p>

# Hermes Agent og hans Crew (med Sub-Agenter) ☤

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
  <a href="README.no.md"><img src="https://img.shields.io/badge/Lang-Norsk-blue?style=for-the-badge" alt="Norsk"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/Lang-English-lightgrey?style=for-the-badge" alt="English"></a>
</p>

> **Språk:** Denne README er tilgjengelig på [Deutsch](README.de.md), [Français](README.fr.md), [Español](README.es.md), [Nederlands](README.nl.md), [Norsk](README.no.md). Skrivebordsappen har en innebygd språkvelger (🌐) med disse og flere.

**En SonnerStudio-fork av [Hermes Agent](https://hermes-agent.nousresearch.com/) fra Nous Research** — den selvlærende KI-agenten, utvidet med et talebasert **Hermes Sekretær** og et visuelt **Composer-Control-HUD** for å orkestrere underagenter.

Denne forken legger til:

- **Composer Control Buttons** — fire veksleknapper i skrivebords-composeren (underagent-orkestrering, taletilkobling, orkestreringsmodus, dobbeltmodus) med live statusfarger (rød = inaktiv, gul = klargjøring, grønn = aktiv).
- **Orchestration HUD** — fire blåkantede live-paneler under composer-inndatafeltet: *Underagentteam*, *Hermes Sekretær (lyd-kommunikasjon)*, *Klonede agenter*, og *Harmonisering og agentbelastning*. Panelene vises bare når en ekte oppgave kjører — ingen demo-plassholdere.
- **Hermes Sekretær** — et tale-lag som lar deg snakke med agenten. Tysk TTS via **Kokoro** (`df_eva`, kvinnelig, filmreif hastighet 0.9), STT via Whisper, og en headless mikrofonnivå-overvåker (intet synlig terminalvindu). Agenten kan delegere underagenter for å utføre talte forespørsler.
- **MLX Runtime Proxy** — en lokal lazy-proxy (`:1240`) som betjener Kokoro TTS, Whisper STT og MLX chat-modeller én om gangen, slik at Mac mini med 16 GB holder seg innenfor RAM-grensene.

> **Merk:** MLX-kjøretiden, Kokoro tysk TTS og Hermes Sekretær tale-pipeline er tilpasset Apple Silicon (macOS). Se `plugins/hermes-sekretaerin/` for oppsett.

---

## Hurtiginstallasjon

### Linux, macOS, WSL2, Termux

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows (nativ, PowerShell)

> **Merk:** Nativ Windows kjører Hermes uten WSL — CLI, gateway, TUI og verktøy fungerer alle nativt. Hvis du heller vil bruke WSL2, fungerer Linux/macOS-enlinjeren ovenfor også der. Fant du en feil? Vennligst [rapporter issues](https://github.com/NousResearch/hermes-agent/issues).

Kjør dette i PowerShell:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Installasjonsprogrammet håndterer alt: uv, Python 3.11, Node.js, ripgrep, ffmpeg, **og en portabel Git Bash** (MinGit, pakket ut til `%LOCALAPPDATA%\hermes\git` — ingen administratorrettigheter nødvendig, fullstendig isolert fra enhver system-Git-installasjon). Hermes bruker denne innebygde Git Bash til å kjøre shell-kommandoer.

Hvis du allerede har Git installert, oppdager installasjonsprogrammet det og bruker det i stedet. Ellers er en ~45 MB MinGit-nedlasting alt du trenger — den vil ikke røre eller forstyrre noe system-Git.

> **Android / Termux:** Den testede manuelle fremgangsmåten er dokumentert i [Termux-veiledningen](https://hermes-agent.nousresearch.com/docs/getting-started/termux). På Termux installerer Hermes et kurert `.[termux]`-tilleggspakke fordi hele `.[all]`-tilleggspakken for tiden trekker med seg Android-inkompatible taleavhengigheter.
>
> **Windows:** Nativ Windows støttes fullt ut — PowerShell-enlinjeren ovenfor installerer alt. Hvis du heller vil bruke WSL2, fungerer Linux-kommandoen også der. Den native Windows-installasjonen ligger under `%LOCALAPPDATA%\hermes`; WSL2 installeres under `~/.hermes` som på Linux.

---

## Hermes Sekretær-oppsett (SonnerStudio-utvidelse)

Tale-laget ligger i `plugins/hermes-sekretaerin/`:

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

Dette installerer:
- `mlx-proxy.py` som en launchd-daemon (betjener TTS/STT/MLX-modeller på `:1240`)
- `mic-level.py` som en headless LaunchAgent (mikrofonnivå-overvåker, intet terminalvindu)
- `kokoro-tts-server.py` (Kokoro tysk TTS, `df_eva`)

**Bygg Kokoro (én gang):** se `plugins/hermes-sekretaerin/BUILD_kokoro.md`. Krever `cmake`, `espeak-ng`-headerfiler og `ggml`/`highway`-undermodulene.

**Mikrofontillatelse:** gi macOS-*Systeminnstillinger → Personvern og sikkerhet → Mikrofon*-tilgang til hjelperen én gang.

---

Etter installasjon:

```bash
source ~/.bashrc    # last inn shell på nytt (eller: source ~/.zshrc)
hermes              # start å chatte!
```

### Feilsøking

#### Windows Defender eller antivirus flagger `uv.exe` som skadelig programvare

Hvis antivirusprogrammet ditt (Bitdefender, Windows Defender osv.) setter `uv.exe` fra Hermes sin `bin`-mappe (`%LOCALAPPDATA%\hermes\bin\uv.exe`) i karantene, er dette et **falskt positiv**. Filen er Astrals `uv` — Rust Python-pakkebehandleren som Hermes pakker inn for å håndtere sitt Python-miljø. ML-baserte antivirusmotorer flagger ofte usignerte Rust-binærfiler som laster ned og installerer pakker.

**Slik bekrefter du at kopien din er ekte:**

```powershell
# Installer GitHub CLI hvis nødvendig
winget install --id GitHub.cli

# Logg inn på GitHub
gh auth login

# Kjør verifisering
$uv = "$env:LOCALAPPDATA\hermes\bin\uv.exe"
$ver = (& $uv --version).Split(' ')[1]
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$zip = "$env:TEMP\uv.zip"
Invoke-WebRequest "https://github.com/astral-sh/uv/releases/download/$ver/uv-x86_64-pc-windows-msvc.zip" -OutFile $zip -UseBasicParsing
gh attestation verify $zip --repo astral-sh/uv
Expand-Archive $zip "$env:TEMP\uv_x" -Force
(Get-FileHash "$env:TEMP\uv_x\uv.exe").Hash -eq (Get-FileHash $uv).Hash
```

Hvis attestasjonen sier «Verification succeeded» og siste linje skriver ut `True`, er du klar.

**Slik hvitlister du Hermes:**
- **Windows Defender:** Kjør PowerShell som administrator → `Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\hermes\bin"`
- **Bitdefender:** Legg til et unntak i Bitdefender-konsollen (Protection > Antivirus > Settings > Manage Exceptions)
- Hvitlist mappen, ikke fil-hashen — Hermes oppdaterer `uv` og hashen endres for hver versjon

For mer kontekst, se de oppstrøms Astral-rapportene: [astral-sh/uv#13553](https://github.com/astral-sh/uv/issues/13553), [astral-sh/uv#15011](https://github.com/astral-sh/uv/issues/15011), [astral-sh/uv#10079](https://github.com/astral-sh/uv/issues/10079).

---

## Kom i gang

```bash
hermes              # Interaktiv CLI — start en samtale
hermes model        # Velg LLM-leverandør og modell
hermes tools        # Konfigurer hvilke verktøy som er aktivert
hermes config set   # Sett enkeltstående konfigurasjonsverdier
hermes config get   # Skriv ut enkeltstående konfigurasjonsverdier
hermes gateway      # Start meldings-gatewayen (Telegram, Discord osv.)
hermes setup        # Kjør hele oppsettveilederen (konfigurerer alt på én gang)
hermes claw migrate # Migrer fra OpenClaw (hvis du kommer fra OpenClaw)
hermes update       # Oppdater til nyeste versjon
hermes doctor       # Diagnostiser eventuelle problemer
```

📖 **[Full dokumentasjon →](https://hermes-agent.nousresearch.com/docs/)**

---

## Unngå API-nøkkel-samlingen — Nous Portal

Hermes fungerer med hvilken som helst leverandør du vil — det endres ikke. Men hvis du heller ikke vil samle inn fem separate API-nøkler for modellen, nettsøk, bildegenerering, TTS og en skyleser, dekker **[Nous Portal](https://portal.nousresearch.com)** alle under ett abonnement:

- **300+ modeller** — velg hvilken som helst med `/model <navn>`
- **Verktøy-gateway** — nettsøk (Firecrawl), bildegenerering (FAL), tekst-til-tale (OpenAI), skyleser (Browser Use), alt ruteg via abonnementet ditt. Ingen ekstra kontoer.

Én kommando fra en fersk installasjon:

```bash
hermes setup --portal
```

Dette logger deg inn via OAuth, setter Nous som leverandør, og slår på Verktøy-gatewayen. Sjekk hva som er koblet opp når som helst med `hermes portal info`. Fullstendige detaljer på [dokumentasjonssiden for Verktøy-gateway](https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway).

Du kan fremdeles ta med dine egne nøkler per verktøy når du vil — gatewayen er per-backend, ikke alt-eller-ingenting.

---

## CLI vs Meldings-plattformer — hurtigreferanse

Hermes har to inngangspunkter: start terminalgrensesnittet med `hermes`, eller kjør gatewayen og snakk med den fra Telegram, Discord, Slack, WhatsApp, Signal eller E-post. Når du først er i en samtale, deles mange skråstrek-kommandoer på tvers av begge grensesnittene.

| Handling                         | CLI                                           | Meldingsplattformer                                                              |
| -------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| Start å chatte                   | `hermes`                                      | Kjør `hermes gateway setup` + `hermes gateway start`, send deretter boten en melding |
| Start ny samtale                 | `/new` eller `/reset`                         | `/new` eller `/reset`                                                            |
| Bytt modell                      | `/model [leverandør:modell]`                  | `/model [leverandør:modell]`                                                     |
| Angi en personlighet             | `/personality [navn]`                         | `/personality [navn]`                                                            |
| Prøv på nytt eller angre forrige tur | `/retry`, `/undo`                         | `/retry`, `/undo`                                                                |
| Komprimer kontekst / sjekk bruk  | `/compress`, `/usage`, `/insights [--days N]` | `/compress`, `/usage`, `/insights [dager]`                                       |
| Bla gjennom ferdigheter          | `/skills` eller `/<ferdighetsnavn>`           | `/<ferdighetsnavn>`                                                              |
| Avbryt pågående arbeid           | `Ctrl+C` eller send en ny melding             | `/stop` eller send en ny melding                                                 |
| Plattformspesifikk status        | `/platforms`                                  | `/status`, `/sethome`                                                            |

For fullstendige kommandolister, se [CLI-veiledningen](https://hermes-agent.nousresearch.com/docs/user-guide/cli) og [Meldings-gateway-veiledningen](https://hermes-agent.nousresearch.com/docs/user-guide/messaging).

---

## Dokumentasjon

All dokumentasjon ligger på **[hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs)**:

| Seksjon                                                                                              | Hva som dekkes                                              |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [Hurtigstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)                 | Installer → oppsett → første samtale på 2 minutter          |
| [CLI-bruk](https://hermes-agent.nousresearch.com/docs/user-guide/cli)                                | Kommandoer, tastaturbindinger, personligheter, økter        |
| [Konfigurasjon](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)                 | Konfigurasjonsfil, leverandører, modeller, alle alternativer |
| [Meldings-gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)                  | Telegram, Discord, Slack, WhatsApp, Signal, Home Assistant  |
| [Sikkerhet](https://hermes-agent.nousresearch.com/docs/user-guide/security)                          | Kommandogodkjenning, DM-paring, container-isolering         |
| [Verktøy & verktøysett](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools)        | 40+ verktøy, verktøysett-system, terminal-backends          |
| [Ferdighetssystem](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)            | Prosedyreminne, Skills Hub, opprette ferdigheter            |
| [Minne](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)                       | Vedvarende minne, brukerprofiler, beste praksis             |
| [MCP-integrasjon](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)                | Koble til en hvilken som helst MCP-server for utvidede muligheter |
| [Cron-planlegging](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)              | Planlagte oppgaver med plattform-levering                   |
| [Kontekstfiler](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)        | Prosjektkontekst som former hver samtale                    |
| [Arkitektur](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture)                | Prosjektstruktur, agentløkke, nøkkelklasser                 |
| [Bidrag](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing)                    | Utvikleroppsett, PR-prosess, kodestil                       |
| [CLI-referanse](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)                   | Alle kommandoer og flagg                                     |
| [Miljøvariabler](https://hermes-agent.nousresearch.com/docs/reference/environment-variables)         | Komplett referanse for miljøvariabler                       |

---

## Migrering fra OpenClaw

Hvis du kommer fra OpenClaw, kan Hermes automatisk importere innstillingene, minnene, ferdighetene og API-nøklene dine.

**Under førstegangs-oppsett:** Oppsettveilederen (`hermes setup`) oppdager automatisk `~/.openclaw` og tilbyr å migrere før konfigurasjonen begynner.

**Når som helst etter installasjon:**

```bash
hermes claw migrate              # Interaktiv migrering (fullt forhåndsvalg)
hermes claw migrate --dry-run    # Forhåndsvisning av hva som ville blitt migrert
hermes claw migrate --preset user-data   # Migrer uten hemmeligheter
hermes claw migrate --overwrite  # Overskriv eksisterende konflikter
```

Hva som importeres:

- **SOUL.md** — persona-fil
- **Minner** — MEMORY.md- og USER.md-oppføringer
- **Ferdigheter** — brukeropprettede ferdigheter → `~/.hermes/skills/openclaw-imports/`
- **Kommandohvitelist** — godkjenningsmønstre
- **Meldingsinnstillinger** — plattformkonfigurasjoner, tillatte brukere, arbeidsmappe
- **API-nøkler** — hvitelistede hemmeligheter (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs)
- **TTS-ressurser** — workspace-lydfiler
- **Workspace-instrukser** — AGENTS.md (med `--workspace-target`)

Se `hermes claw migrate --help` for alle alternativer, eller bruk `openclaw-migration`-ferdigheten for en interaktiv agent-veiledet migrering med forhåndsvisning av tørrkjøring.

---

## Bidrag

Vi ønsker bidrag velkommen! Se [Bidragsguide](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing) for utvikleroppsett, kodestil og PR-prosess.

Hurtigstart for bidragsytere — bruk standard installasjonsprogram, og arbeid deretter fra
den fulle git-utpakningen den oppretter på `$HERMES_HOME/hermes-agent` (vanligvis
`~/.hermes/hermes-agent`). Dette stemmer med oppsettet som brukes av `hermes update`, det
managede venv-et, late avhengigheter, gateway og dokumentasjonsverktøy.

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
cd "${HERMES_HOME:-$HOME/.hermes}/hermes-agent"
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

Manuell klon-reserve (for engangskloner/CI der du bevisst ikke
vil ha det managede installasjonsoppsettet):

Opprett venv-et utenfor den klonede kildetreet — et venv inne i mappen
agenten opererer fra kan bli slettet av en relative-path-kommando agenten kjører
mot sitt eget uttrekk, og ødelegger den kjørende kjøretiden midt i økten.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv ~/.hermes/venvs/hermes-dev --python 3.11
source ~/.hermes/venvs/hermes-dev/bin/activate
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

---

## Fellesskap

- 💬 [Discord](https://discord.gg/NousResearch)
- 📚 [Skills Hub](https://agentskills.io)
- 🐛 [Issues](https://github.com/NousResearch/hermes-agent/issues)
- 🔌 [computer-use-linux](https://github.com/avifenesh/computer-use-linux) — Linux skrivebordskontroll-MCP-server for Hermes og andre MCP-verter, med AT-SPI tilgjengelighetstreet, Wayland/X11-inndata, skjermbilder og compositor-vindusmålretting.
- 🔌 [HermesClaw](https://github.com/AaronWong1999/hermesclaw) — Fellesskapets WeChat-bro: Kjør Hermes Agent og OpenClaw på samme WeChat-konto.

---

## Lisens

MIT — se [LICENSE](LICENSE).

Laget av [Nous Research](https://nousresearch.com).
