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
  <a href="README.cz.md"><img src="https://img.shields.io/badge/Lang-%C4%8Ce%C5%A1tina-blue?style=for-the-badge" alt="Čeština"></a>
  <a href="README.de.md"><img src="https://img.shields.io/badge/Lang-Deutsch-red?style=for-the-badge" alt="Deutsch"></a>
  <a href="README.fr.md"><img src="https://img.shields.io/badge/Lang-Fran%C3%A7ais-blue?style=for-the-badge" alt="Français"></a>
  <a href="README.es.md"><img src="https://img.shields.io/badge/Lang-Espa%C3%B1ol-orange?style=for-the-badge" alt="Español"></a>
  <a href="README.nl.md"><img src="https://img.shields.io/badge/Lang-Nederlands-green?style=for-the-badge" alt="Nederlands"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/Lang-English-lightgrey?style=for-the-badge" alt="English"></a>
</p>

> **Jazyky:** Tento README je k dispozici v jazycích [Deutsch](README.de.md), [Français](README.fr.md), [Español](README.es.md), [Nederlands](README.nl.md). Desktopová aplikace má vestavěný výběr jazyka (🌐) s těmito a dalšími jazyky.

**Fork SonnerStudio agenta Hermes Agent od Nous Research** — samovylepšující se AI agent, rozšířený o hlasem ovládanou **Hermes Sekretářku** a vizuální **Composer-Control-HUD** pro orchestraci sub-agentů.

Tento fork přidává:

- **Composer Control Buttons** — čtyři přepínací tlačítka v desktopovém composeru (orchestrace sub-agentů, hlasová komunikace, režim orchestrace, dvojitý režim) s živými barevnými stavy (červená = neaktivní, žlutá = zřizování, zelená = aktivní).
- **Orchestrace HUD** — čtyři modře orámované živé panely pod vstupem composeru: *Tým sub-agentů*, *Hermes Sekretářka (Audio-Kommunikation)*, *Klonovaní agenti (Cloned Agents)* a *Harmonizace a zátěž agentů*. Panely se zobrazí pouze tehdy, když běží skutečný úkol — žádná demo zástupná pole.
- **Hermes Sekretářka** — hlasová vrstva, která vám umožňuje mluvit s agentem. Německé TTS přes **Kokoro** (`df_eva`, ženský hlas, filmová rychlost 0.9), STT přes Whisper a bezokenní monitor hladiny mikrofonu (žádné viditelné vyskakovací okno terminálu). Agent může delegovat sub-agenty k provedení mluvených požadavků.
- **MLX Runtime Proxy** — lokální líný proxy server (`:1240`), který servíruje Kokoro TTS, Whisper STT a MLX chat modely vždy po jednom, aby Mac mini s 16 GB RAM zůstal v mezích paměti.

> **Poznámka:** MLX runtime, Kokoro německé TTS a hlasový pipeline Hermes Sekretářky jsou vyladěny pro Apple Silicon (macOS). Viz `plugins/hermes-sekretaerin/` pro nastavení.

---

## Rychlá instalace

### Linux, macOS, WSL2, Termux

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows (nativní, PowerShell)

> **Pozor:** Nativní Windows spouští Hermese bez WSL — CLI, gateway, TUI a nástroje vše fungují nativně. Pokud dáváte přednost WSL2, výše uvedený jednořádkový příkaz pro Linux/macOS funguje i tam. Našli jste chybu? Prosím, [nahlaste ji](https://github.com/NousResearch/hermes-agent/issues).

Spusťte toto v PowerShellu:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Instalátor zařídí vše: uv, Python 3.11, Node.js, ripgrep, ffmpeg **a přenosný Git Bash** (MinGit, rozbalený do `%LOCALAPPDATA%\hermes\git` — nevyžaduje admin práva, zcela izolovaný od jakékoli systémové instalace Git). Hermes používá tento zabalený Git Bash ke spouštění shell příkazů.

Pokud máte Git již nainstalovaný, instalátor jej detekuje a použije místo toho. Jinak je vše, co potřebujete, stažení MinGitu o velikosti ~45 MB — nezasáhne ani nebude rušit žádný systémový Git.

> **Android / Termux:** Otestovaná manuální cesta je zdokumentována v [průvodci Termux](https://hermes-agent.nousresearch.com/docs/getting-started/termux). Na Termuxu Hermes instaluje pečlivě vybraný extra `.[termux]`, protože plný extra `.[all]` momentálně stahuje pro Android nekompatibilní hlasové závislosti.
>
> **Windows:** Nativní Windows je plně podporován — výše uvedený jednořádkový příkaz PowerShellu nainstaluje vše. Pokud dáváte přednost WSL2, linuxový příkaz tam také funguje. Nativní instalace Windows žije v `%LOCALAPPDATA%\hermes`; WSL2 se instaluje do `~/.hermes` stejně jako na Linuxu.

---

## Nastavení Hermes Sekretářky (rozšíření SonnerStudio)

Hlasová vrstva sídlí v `plugins/hermes-sekretaerin/`:

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

Tím se nainstaluje:
- `mlx-proxy.py` jako launchd démon (servíruje TTS/STT/MLX modely na `:1240`)
- `mic-level.py` jako bezokenní LaunchAgent (monitor hladiny mikrofonu, bez okna terminálu)
- `kokoro-tts-server.py` (Kokoro německé TTS, `df_eva`)

**Sestavení Kokoro (jednorázové):** viz `plugins/hermes-sekretaerin/BUILD_kokoro.md`. Vyžaduje `cmake`, hlavičky `espeak-ng` a submoduly `ggml`/`highway`.

**Oprávnění mikrofonu:** udělte macOS *System Settings → Privacy & Security → Microphone* jednorázový přístup pomocnému procesu.

---

Po instalaci:

```bash
source ~/.bashrc    # znovu načtěte shell (nebo: source ~/.zshrc)
hermes              # začněte chatovat!
```

### Odstraňování problémů

#### Windows Defender nebo antivir označí `uv.exe` jako malware

Pokud váš antivir (Bitdefender, Windows Defender atd.) dá `uv.exe` z Hermes složky `bin` (`%LOCALAPPDATA%\hermes\bin\uv.exe`) do karantény, jde o **falešný poplach**. Soubor je Astralův `uv` — Rustový správce Python balíčků, který Hermes přibaluje ke správě svého Python prostředí. Antivirové enginy založené na ML běžně označují nepodepsané Rust binárky, které stahují a instalují balíčky.

**Jak ověřit, že je vaše kopie autentická:**

```powershell
# Nainstalujte GitHub CLI v případě potřeby
winget install --id GitHub.cli

# Přihlaste se na GitHub
gh auth login

# Spusťte ověření
$uv = "$env:LOCALAPPDATA\hermes\bin\uv.exe"
$ver = (& $uv --version).Split(' ')[1]
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$zip = "$env:TEMP\uv.zip"
Invoke-WebRequest "https://github.com/astral-sh/uv/releases/download/$ver/uv-x86_64-pc-windows-msvc.zip" -OutFile $zip -UseBasicParsing
gh attestation verify $zip --repo astral-sh/uv
Expand-Archive $zip "$env:TEMP\uv_x" -Force
(Get-FileHash "$env:TEMP\uv_x\uv.exe").Hash -eq (Get-FileHash $uv).Hash
```

Pokud atestace vypíše „Verification succeeded“ a poslední řádek vytiskne `True`, jste v pořádku.

**Jak přidat Hermese na seznam výjimek:**
- **Windows Defender:** Spusťte PowerShell jako Admin → `Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\hermes\bin"`
- **Bitdefender:** Přidejte výjimku v konzoli Bitdefender (Protection > Antivirus > Settings > Manage Exceptions)
- Na seznam výjimek přidejte **složku**, nikoli hash souboru — Hermes aktualizuje `uv` a hash se mění s každou verzí

Pro více kontextu viz upstream zprávy Astralu: [astral-sh/uv#13553](https://github.com/astral-sh/uv/issues/13553), [astral-sh/uv#15011](https://github.com/astral-sh/uv/issues/15011), [astral-sh/uv#10079](https://github.com/astral-sh/uv/issues/10079).

---

## Začínáme

```bash
hermes              # Interaktivní CLI — začněte konverzaci
hermes model        # Zvolte poskytovatele LLM a model
hermes tools        # Nakonfigurujte, které nástroje jsou povoleny
hermes config set   # Nastavte jednotlivé hodnoty konfigurace
hermes config get   # Vytiskněte jednotlivé hodnoty konfigurace
hermes gateway      # Spusťte komunikační bránu (Telegram, Discord atd.)
hermes setup        # Spusťte úplného průvodce nastavením (nakonfiguruje vše najednou)
hermes claw migrate # Migrujte z OpenClaw (pokud přicházíte z OpenClaw)
hermes update       # Aktualizujte na nejnovější verzi
hermes doctor       # Diagnostikujte případné problémy
```

📖 **[Úplná dokumentace →](https://hermes-agent.nousresearch.com/docs/)**

---

## Vyhněte se sběru API klíčů — Nous Portal

Hermes funguje s jakýmkoli poskytovatelem, kterého chcete — to se nemění. Pokud však nechcete sbírat pět samostatných API klíčů pro model, vyhledávání na webu, generování obrázků, TTS a cloudový prohlížeč, **[Nous Portal](https://portal.nousresearch.com)** pokrývá všechny pod jedním předplatným:

- **300+ modelů** — vyberte si kterýkoli z nich pomocí `/model <název>`
- **Tool Gateway** — vyhledávání na webu (Firecrawl), generování obrázků (FAL), text-to-speech (OpenAI), cloudový prohlížeč (Browser Use), vše směrované přes vaše předplatné. Žádné další účty.

Jeden příkaz z čerstvé instalace:

```bash
hermes setup --portal
```

To vás přihlásí přes OAuth, nastaví Nous jako vašeho poskytovatele a zapne Tool Gateway. Co je zapojeno, si kdykoli zkontrolujte pomocí `hermes portal info`. Úplné podrobnosti na [stránce dokumentace Tool Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway).

Stále si můžete kdykoli přinést vlastní klíče pro jednotlivé nástroje — brána je nastavena podle backendu, ne jde o všechno-nebo-nic.

---

## Rychlý přehled: CLI vs. zasílání zpráv

Hermes má dva vstupní body: spusťte terminálové UI pomocí `hermes`, nebo spusťte bránu a mluvte s ní z Telegramu, Discordu, Slacku, WhatsAppu, Signalu nebo e-mailu. Jakmile jste v konverzaci, mnoho lomítkových příkazů je sdíleno napříč oběma rozhraními.

| Akce                               | CLI                                           | Platformy zasílání zpráv                                                         |
| ---------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| Začít chatovat                     | `hermes`                                      | Spusťte `hermes gateway setup` + `hermes gateway start`, pak botovi pošlete zprávu |
| Začít novou konverzaci             | `/new` nebo `/reset`                          | `/new` nebo `/reset`                                                             |
| Změnit model                       | `/model [provider:model]`                     | `/model [provider:model]`                                                       |
| Nastavit osobnost                  | `/personality [name]`                         | `/personality [name]`                                                           |
| Opakovat nebo vrátit poslední krok | `/retry`, `/undo`                             | `/retry`, `/undo`                                                               |
| Komprimovat kontext / zkontrolovat využití | `/compress`, `/usage`, `/insights [--days N]` | `/compress`, `/usage`, `/insights [days]`                                       |
| Procházet dovednosti               | `/skills` nebo `/<název-dovednosti>`          | `/<název-dovednosti>`                                                           |
| Přerušit aktuální práci            | `Ctrl+C` nebo odeslat novou zprávu            | `/stop` nebo odeslat novou zprávu                                               |
| Stav specifický pro platformu      | `/platforms`                                  | `/status`, `/sethome`                                                           |

Pro úplné seznamy příkazů viz [průvodce CLI](https://hermes-agent.nousresearch.com/docs/user-guide/cli) a [průvodce Messaging Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging).

---

## Dokumentace

Veškerá dokumentace sídlí na **[hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs)**:

| Sekce                                                                                                | Co je pokryto                                               |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)                 | Instalace → nastavení → první konverzace za 2 minuty       |
| [CLI Usage](https://hermes-agent.nousresearch.com/docs/user-guide/cli)                              | Příkazy, klávesové zkratky, osobnosti, relace              |
| [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)                | Konfigurační soubor, poskytovatelé, modely, všechny volby  |
| [Messaging Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)                | Telegram, Discord, Slack, WhatsApp, Signal, Home Assistant |
| [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)                          | Schválení příkazů, párování DM, izolace kontejneru         |
| [Tools & Toolsets](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools)            | 40+ nástrojů, systém toolsetů, backendy terminálu          |
| [Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)              | Procedurální paměť, Skills Hub, vytváření dovedností       |
| [Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)                     | Trvalá paměť, uživatelské profily, osvědčené postupy       |
| [MCP Integration](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)               | Připojte libovolný MCP server pro rozšířené schopnosti     |
| [Cron Scheduling](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)              | Plánované úlohy s doručením na platformu                   |
| [Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)       | Kontext projektu formující každou konverzaci               |
| [Architecture](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture)             | Struktura projektu, smyčka agenta, klíčové třídy           |
| [Contributing](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing)             | Vývojové nastavení, proces PR, styl kódu                   |
| [CLI Reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)                  | Všechny příkazy a příznaky                                 |
| [Environment Variables](https://hermes-agent.nousresearch.com/docs/reference/environment-variables) | Úplný seznam proměnných prostředí                          |

---

## Migrace z OpenClaw

Pokud přicházíte z OpenClaw, Hermes může automaticky importovat vaše nastavení, paměti, dovednosti a API klíče.

**Během prvního nastavení:** Průvodce nastavením (`hermes setup`) automaticky detekuje `~/.openclaw` a nabídne migraci před zahájením konfigurace.

**Kdykoli po instalaci:**

```bash
hermes claw migrate              # Interaktivní migrace (plná předvolba)
hermes claw migrate --dry-run    # Náhled toho, co by bylo migrováno
hermes claw migrate --preset user-data   # Migrovat bez tajemství
hermes claw migrate --overwrite  # Přepsat existující konflikty
```

Co se importuje:

- **SOUL.md** — soubor osobnosti
- **Paměti** — položky MEMORY.md a USER.md
- **Dovednosti** — uživatelem vytvořené dovednosti → `~/.hermes/skills/openclaw-imports/`
- **Seznam povolených příkazů** — vzory schválení
- **Nastavení zasílání zpráv** — konfigurace platforem, povolení uživatelé, pracovní adresář
- **API klíče** — povolená tajemství (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs)
- **TTS assety** — audio soubory pracovního prostoru
- **Pokyny pracovního prostoru** — AGENTS.md (s `--workspace-target`)

Viz `hermes claw migrate --help` pro všechny volby, nebo použijte dovednost `openclaw-migration` pro interaktivní migraci vedenou agentem s náhledy dry-run.

---

## Přispívání

Vítáme příspěvky! Viz [Průvodce přispíváním](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing) pro vývojové nastavení, styl kódu a proces PR.

Rychlý start pro přispěvatele — použijte standardní instalátor a pak pracujte z
plného git checkoutu, který vytvoří v `$HERMES_HOME/hermes-agent` (obvykle
`~/.hermes/hermes-agent`). To odpovídá rozvržení používanému `hermes update`,
spravovaným venv, líným závislostem, bráně a nástrojům dokumentace.

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
cd "${HERMES_HOME:-$HOME/.hermes}/hermes-agent"
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

Záložní manuální klon (pro jednorázové klony/CI, kde záměrně nechcete
spravované rozvržení instalace):

Vytvořte venv mimo strom klonovaného zdroje — venv uvnitř adresáře,
ze kterého agent operuje, může být smazán relativní cestou příkazu, který
agent spustí proti vlastnímu checkoutu, čímž zničí běžící runtime uprostřed relace.

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
- 🔌 [computer-use-linux](https://github.com/avifenesh/computer-use-linux) — Linux MCP server pro ovládání desktopu pro Hermese a další MCP hostitele, s AT-SPI stromy přístupnosti, vstupem Wayland/X11, snímky obrazovky a cílením oken compositoru.
- 🔌 [HermesClaw](https://github.com/AaronWong1999/hermesclaw) — komunitní most WeChat: Spusťte Hermes Agent a OpenClaw na stejném účtu WeChat.

---

## Licence

MIT — viz [LICENSE](LICENSE).

Vytvořeno společností [Nous Research](https://nousresearch.com).
