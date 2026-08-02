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
  <a href="README.sk.md"><img src="https://img.shields.io/badge/Lang-Sloven%C4%8Dina-lightblue?style=for-the-badge" alt="Slovenčina"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/Lang-English-lightgrey?style=for-the-badge" alt="English"></a>
</p>

> **Jazyky:** Tento README je k dispozícii v jazykoch [Deutsch](README.de.md), [Français](README.fr.md), [Español](README.es.md), [Nederlands](README.nl.md) a [Slovenčina](README.sk.md). Desktopová aplikácia má vstavaný prepínač jazykov (🌐) s týmito a ďalšími jazykmi.

**Fork SonnerStudio agenta Hermes Agent od Nous Research** — samovzdelávajúci sa AI agent, rozšírený o hlasom ovládanú **Hermes Sekretárku** a vizuálny **Composer-Control-HUD** na orchestráciu sub-agentov.

Tento fork pridáva:

- **Composer Control Buttons** — štyri prepínacie tlačidlá v desktopovom composere (orchestrácia sub-agentov, hlasová komunikácia, režim orchestrácie, dvojitý režim) so živými stavovými farbami (červená = neaktívne, žltá = zriaďovanie, zelená = aktívne).
- **Orchestration HUD** — štyri modro orámované živé panely pod vstupom composere: *Tím sub-agentov*, *Hermes Sekretárka (audiokomunikácia)*, *Klonovaní agenti* a *Harmonizácia a záťaž agentov*. Panely sa zobrazia len vtedy, keď beží skutočná úloha — žiadne demoverstné placeholdery.
- **Hermes Sekretárka** — hlasová vrstva, ktorá vám umožňuje rozprávať sa s agentom. Nemecké TTS cez **Kokoro** (`df_eva`, ženský hlas, filmová rýchlosť 0.9), STT cez Whisper a bezokienkový monitor hladiny mikrofónu (bez viditeľného vyskakovacieho okna terminálu). Agent môže delegovať sub-agentov na vykonanie hlasom zadaných požiadaviek.
- **MLX Runtime Proxy** — lokálny lenivý proxy server (`:1240`), ktorý poskytuje Kokoro TTS, Whisper STT a MLX chat modely vždy len jeden naraz, aby Mac mini s 16 GB RAM zostal v rámci limitov pamäte.

> **Poznámka:** MLX runtime, nemecké Kokoro TTS a hlasový pipeline Hermes Sekretárky sú optimalizované pre Apple Silicon (macOS). Pozrite si `plugins/hermes-sekretaerin/` pre nastavenie.

---

## Rýchla inštalácia

### Linux, macOS, WSL2, Termux

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows (natívne, PowerShell)

> **Upozornenie:** Natívne Windows spúšťa Hermesa bez WSL — CLI, gateway, TUI a nástroje fungujú všetky natívne. Ak uprednostňujete WSL2, vyššie uvedený jednoriadkový príkaz pre Linux/macOS funguje aj tam. Našli ste chybu? Prosím, [nahláste issue](https://github.com/NousResearch/hermes-agent/issues).

Spustite toto v PowerShelli:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Inštalátor vybaví všetko: uv, Python 3.11, Node.js, ripgrep, ffmpeg, **a prenosný Git Bash** (MinGit, rozbalený do `%LOCALAPPDATA%\hermes\git` — nevyžaduje sa administrátor, je úplne izolovaný od akýchkoľvek systémových inštalácií Git). Hermes používa tento zabalený Git Bash na spúšťanie shell príkazov.

Ak už máte nainštalovaný Git, inštalátor ho zistí a namiesto toho ho použije. V opačnom prípade stačí stiahnuť približne 45 MB MinGit — nezasiahne ani nebude interfereovať s žiadnym systémovým Gitom.

> **Android / Termux:** Otestovaná manuálna cesta je zdokumentovaná v [Termux príručke](https://hermes-agent.nousresearch.com/docs/getting-started/termux). Na Termuxe Hermes inštaluje kurátorský extra `.[termux]`, pretože plný extra `.[all]` momentálne sťahuje hlasové závislosti nekompatibilné s Androidom.
>
> **Windows:** Natívne Windows je plne podporované — vyššie uvedený PowerShell jednoriadkový príkaz nainštaluje všetko. Ak uprednostňujete WSL2, funguje tam aj Linux príkaz. Natívna inštalácia Windows žije pod `%LOCALAPPDATA%\hermes`; WSL2 sa inštaluje pod `~/.hermes` rovnako ako na Linuxe.

---

## Nastavenie Hermes Sekretárky (rozšírenie SonnerStudio)

Hlasová vrstva sa nachádza v `plugins/hermes-sekretaerin/`:

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

Toto nainštaluje:
- `mlx-proxy.py` ako launchd démona (poskytuje TTS/STT/MLX modely na `:1240`)
- `mic-level.py` ako bezokienkový LaunchAgent (monitor hladiny mikrofónu, bez okna terminálu)
- `kokoro-tts-server.py` (nemecké Kokoro TTS, `df_eva`)

**Zostavenie Kokoro (jednorazovo):** pozrite si `plugins/hermes-sekretaerin/BUILD_kokoro.md`. Vyžaduje `cmake`, hlavičky `espeak-ng` a submoduly `ggml`/`highway`.

**Povolenie mikrofónu:** udelte macOS *System Settings → Privacy & Security → Microphone* prístup pomocnému procesu raz.

---

Po inštalácii:

```bash
source ~/.bashrc    # znova načítajte shell (alebo: source ~/.zshrc)
hermes              # začnite si povrávať!
```

### Riešenie problémov

#### Windows Defender alebo antivír označí `uv.exe` ako malware

Ak váš antivír (Bitdefender, Windows Defender atď.) dá `uv.exe` z priečinka `bin` Hermesa (`%LOCALAPPDATA%\hermes\bin\uv.exe`) do karantény, ide o **falošný poplach**. Súbor je Astralov `uv` — Rustový správca Python balíkov, ktorý Hermes zabalil na správu svojho Python prostredia. Antivírové enginy založené na ML bežne označujú nepodpísané Rust binárky, ktoré sťahujú a inštalujú balíky.

**Ako overiť, že vaša kópia je autentická:**

```powershell
# Nainštalujte GitHub CLI, ak je potrebné
winget install --id GitHub.cli

# Prihláste sa do GitHubu
gh auth login

# Spustite overenie
$uv = "$env:LOCALAPPDATA\hermes\bin\uv.exe"
$ver = (& $uv --version).Split(' ')[1]
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$zip = "$env:TEMP\uv.zip"
Invoke-WebRequest "https://github.com/astral-sh/uv/releases/download/$ver/uv-x86_64-pc-windows-msvc.zip" -OutFile $zip -UseBasicParsing
gh attestation verify $zip --repo astral-sh/uv
Expand-Archive $zip "$env:TEMP\uv_x" -Force
(Get-FileHash "$env:TEMP\uv_x\uv.exe").Hash -eq (Get-FileHash $uv).Hash
```

Ak atestácia hlási „Verification succeeded“ a posledný riadok vypíše `True`, ste v poriadku.

**Ako pridať Hermesa na zoznam výnimiek:**
- **Windows Defender:** Spustite PowerShell ako Admin → `Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\hermes\bin"`
- **Bitdefender:** Pridajte výnimku v konzole Bitdefender (Protection > Antivirus > Settings > Manage Exceptions)
- Pridajte na zoznam výnimiek **priečinok**, nie hash súboru — Hermes aktualizuje `uv` a hash sa mení pri každej verzii

Pre viac kontextu si pozrite upstream Astral reporty: [astral-sh/uv#13553](https://github.com/astral-sh/uv/issues/13553), [astral-sh/uv#15011](https://github.com/astral-sh/uv/issues/15011), [astral-sh/uv#10079](https://github.com/astral-sh/uv/issues/10079).

---

## Začíname

```bash
hermes              # Interaktívne CLI — začnite konverzáciu
hermes model        # Vyberte svojho poskytovateľa LLM a model
hermes tools        # Nakonfigurujte, ktoré nástroje sú povolené
hermes config set   # Nastavte jednotlivé konfiguračné hodnoty
hermes config get   # Vytlačte jednotlivé konfiguračné hodnoty
hermes gateway      # Spustite messaging gateway (Telegram, Discord atď.)
hermes setup        # Spustite kompletné nastavovacie sprievodcu (nakonfiguruje všetko naraz)
hermes claw migrate # Migrujte z OpenClaw (ak prechádzate z OpenClaw)
hermes update       # Aktualizujte na najnovšiu verziu
hermes doctor       # Diagnostikujte akékoľvek problémy
```

📖 **[Kompletná dokumentácia →](https://hermes-agent.nousresearch.com/docs/)**

---

## Bez zhromažďovania API kľúčov — Nous Portal

Hermes funguje s akýmkoľvek poskytovateľom, ktorého chcete — to sa nemení. Ale ak nechcete zbierať päť oddelených API kľúčov pre model, webové vyhľadávanie, generovanie obrázkov, TTS a cloudový prehliadač, **[Nous Portal](https://portal.nousresearch.com)** pokrýva všetky pod jedným predplatným:

- **300+ modelov** — vyberte si ktorýkoľvek z nich pomocou `/model <názov>`
- **Tool Gateway** — webové vyhľadávanie (Firecrawl), generovanie obrázkov (FAL), text-to-speech (OpenAI), cloudový prehliadač (Browser Use), všetko smerované cez vaše predplatné. Žiadne ďalšie účty.

Jeden príkaz z čerstvej inštalácie:

```bash
hermes setup --portal
```

To vás prihlási cez OAuth, nastaví Nous ako vášho poskytovateľa a zapne Tool Gateway. Kedykoľvek skontrolujte, čo je pripojené, pomocou `hermes portal info`. Úplné podrobnosti na [stránke dokumentácie Tool Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway).

Stále si môžete kedykoľvek priniesť vlastné kľúče pre jednotlivé nástroje — gateway je nastavený podľa backendu, nie all-or-nothing.

---

## Rýchly prehľad: CLI vs správy

Hermes má dva vstupné body: spustite terminálové UI pomocou `hermes`, alebo spustite gateway a rozprávajte sa s ním z Telegramu, Discordu, Slacku, WhatsAppu, Signalu alebo e-mailu. Keď ste v konverzácii, veľa lomítkových príkazov je zdieľaných medzi oboma rozhraniami.

| Akcia                               | CLI                                           | Messaging platformy                                                              |
| ----------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| Začať si povrávať                    | `hermes`                                      | Spustite `hermes gateway setup` + `hermes gateway start`, potom pošlite botovi správu |
| Začať novú konverzáciu              | `/new` alebo `/reset`                         | `/new` alebo `/reset`                                                            |
| Zmeniť model                        | `/model [provider:model]`                     | `/model [provider:model]`                                                        |
| Nastaviť osobnosť                   | `/personality [name]`                         | `/personality [name]`                                                            |
| Opakovať alebo vrátiť posledný ťah  | `/retry`, `/undo`                             | `/retry`, `/undo`                                                                |
| Komprimovať kontext / skontrolovať využitie | `/compress`, `/usage`, `/insights [--days N]` | `/compress`, `/usage`, `/insights [days]`                                        |
| Prehliadať skilly                   | `/skills` alebo `/<názov-skilly>`             | `/<názov-skilly>`                                                               |
| Prerušiť aktuálnu prácu             | `Ctrl+C` alebo poslanie novej správy          | `/stop` alebo poslanie novej správy                                              |
| Stav špecifický pre platformu       | `/platforms`                                  | `/status`, `/sethome`                                                            |

Pre kompletné zoznamy príkazov si pozrite [CLI príručku](https://hermes-agent.nousresearch.com/docs/user-guide/cli) a [príručku Messaging Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging).

---

## Dokumentácia

Celá dokumentácia sa nachádza na **[hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs)**:

| Sekcia                                                                                              | Čo je pokryté                                              |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)                 | Inštalácia → nastavenie → prvá konverzácia za 2 minúty     |
| [CLI Usage](https://hermes-agent.nousresearch.com/docs/user-guide/cli)                              | Príkazy, klávesové skratky, osobnosti, relácie             |
| [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)                | Konfiguračný súbor, poskytovatelia, modely, všetky možnosti |
| [Messaging Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)                | Telegram, Discord, Slack, WhatsApp, Signal, Home Assistant |
| [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)                          | Schválenie príkazov, párovanie DM, izolácia kontajnerov    |
| [Tools & Toolsets](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools)            | 40+ nástrojov, systém nástrojových sád, backendy terminálu |
| [Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)              | Procedurálna pamäť, Skills Hub, tvorba skrillov            |
| [Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)                     | Trvalá pamäť, používateľské profily, osvedčené postupy     |
| [MCP Integration](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)               | Pripojte ľubovoľný MCP server pre rozšírené schopnosti     |
| [Cron Scheduling](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)              | Naplánované úlohy s doručením na platformu                 |
| [Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)       | Kontext projektu, ktorý formuje každú konverzáciu          |
| [Architecture](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture)             | Štruktúra projektu, slučka agenta, kľúčové triedy          |
| [Contributing](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing)             | Nastavenie vývoja, proces PR, štýl kódu                    |
| [CLI Reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)                  | Všetky príkazy a zástavy                                    |
| [Environment Variables](https://hermes-agent.nousresearch.com/docs/reference/environment-variables) | Kompletná referencia env premenných                        |

---

## Migrácia z OpenClaw

Ak prechádzate z OpenClaw, Hermes môže automaticky importovať vaše nastavenia, pamäte, skilly a API kľúče.

**Počas prvého nastavenia:** Sprievodca nastavením (`hermes setup`) automaticky zistí `~/.openclaw` a ponúkne migráciu ešte pred začatím konfigurácie.

**Kedykoľvek po inštalácii:**

```bash
hermes claw migrate              # Interaktívna migrácia (plný preset)
hermes claw migrate --dry-run    # Náhľad toho, čo by sa migrovalo
hermes claw migrate --preset user-data   # Migrovať bez tajomstiev
hermes claw migrate --overwrite  # Prepísať existujúce konflikty
```

Čo sa importuje:

- **SOUL.md** — súbor persony
- **Pamäte** — položky MEMORY.md a USER.md
- **Skilly** — používateľom vytvorené skilly → `~/.hermes/skills/openclaw-imports/`
- **Zoznam povolených príkazov** — vzory schválenia
- **Nastavenia správ** — konfigurácie platforiem, povolení používatelia, pracovný priečinok
- **API kľúče** — povolené tajomstvá (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs)
- **TTS assety** — audio súbory pracovného priestoru
- **Inštrukcie pracovného priestoru** — AGENTS.md (s `--workspace-target`)

Pozrite si `hermes claw migrate --help` pre všetky možnosti, alebo použite skill `openclaw-migration` pre interaktívnu migráciu vedenú agentom s náhľadmi dry-run.

---

## Prispievanie

Vitajú sa príspevky! Pozrite si [Príručku pre prispievateľov](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing) pre nastavenie vývoja, štýl kódu a proces PR.

Rýchly štart pre prispievateľov — použite štandardný inštalátor, potom pracujte z
kompletného git checkoutu, ktorý vytvorí v `$HERMES_HOME/hermes-agent` (zvyčajne
`~/.hermes/hermes-agent`). To zodpovedá rozloženiu používanému `hermes update`,
spravovaným venv, lenivým závislostiam, gateway a docs toolingu.

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
cd "${HERMES_HOME:-$HOME/.hermes}/hermes-agent"
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

Manuálna záloha klonovania (pre jednorazové klony/CI, kde zámerne
nechcete spravované rozloženie inštalácie):

Vytvorte venv mimo stromu klonovaného zdroja — venv vo vnútri priečinka,
z ktorého agent operuje, môže byť vymazaný relatívnou cestou príkazu, ktorý agent
spustí proti vlastnému checkoutu, čím sa zničí bežiaci runtime uprostred relácie.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv ~/.hermes/venvs/hermes-dev --python 3.11
source ~/.hermes/venvs/hermes-dev/bin/activate
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

---

## Komunita

- 💬 [Discord](https://discord.gg/NousResearch)
- 📚 [Skills Hub](https://agentskills.io)
- 🐛 [Issues](https://github.com/NousResearch/hermes-agent/issues)
- 🔌 [computer-use-linux](https://github.com/avifenesh/computer-use-linux) — Linuxový MCP server na ovládanie desktopu pre Hermesa a ďalších MCP hostiteľov, s AT-SPI stromami prístupnosti, Wayland/X11 vstupom, snímkami obrazovky a cielením okien kompozitora.
- 🔌 [HermesClaw](https://github.com/AaronWong1999/hermesclaw) — Komunitný most WeChat: Spustite Hermes Agent a OpenClaw na tom istom účte WeChat.

---

## Licencia

MIT — pozrite si [LICENSE](LICENSE).

Vytvorili [Nous Research](https://nousresearch.com).
