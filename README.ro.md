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
  <a href="README.ro.md"><img src="https://img.shields.io/badge/Lang-Rom%C3%A2n%C4%83-blue?style=for-the-badge" alt="Română"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/Lang-English-lightgrey?style=for-the-badge" alt="English"></a>
</p>

> **Limbi:** Acest README este disponibil în [Deutsch](README.de.md), [Français](README.fr.md), [Español](README.es.md), [Nederlands](README.nl.md) și [Română](README.ro.md). Aplicația desktop are un selector de limbă încorporat (🌐) cu acestea și altele.

**Un fork SonnerStudio al agentului [Hermes Agent](https://hermes-agent.nousresearch.com/) de la Nous Research** — agentul AI care se auto-îmbunătățește, extins cu o **Hermes Secretară** bazată pe voce și un **Composer-Control-HUD** vizual pentru orchestrarea sub-ageneților.

Acest fork adaugă:

- **Butoane de control ale compozitorului (Composer Control Buttons)** — patru butoane comutabile în compozitorul desktop (orchestrarea sub-ageneților, comunicarea vocală, modul de orchestrare, modul dublu) cu culori de stare live (roșu = inactiv, galben = în provizionare, verde = activ).
- **Orchestration HUD** — patru panouri live cu margine albastră sub câmpul de intrare al compozitorului: *Echipa de sub-ageneți*, *Hermes Secretară (Comunicare audio)*, *Agenți clonați* și *Armonizare și încărcarea agenților*. Panourile apar doar când o sarcină reală rulează — fără placeholdere demo.
- **Hermes Secretară** — un strat vocal care îți permite să vorbești cu agentul. TTS german prin **Kokoro** (`df_eva`, feminin, viteză filmreif 0.9), STT prin Whisper și un monitor de nivel microfon fără interfață (fără fereastră de terminal vizibilă). Agentul poate delega sub-ageneți pentru a executa cererile vorbite.
- **MLX Runtime Proxy** — un proxy local leneș (`:1240`) care servește modelele Kokoro TTS, Whisper STT și MLX chat pe rând, astfel încât Mac mini de 16 GB să rămână în limitele RAM-ului.

> **Notă:** Runtime-ul MLX, Kokoro TTS german și pipeline-ul vocal Hermes Secretară sunt optimizate pentru Apple Silicon (macOS). Vezi `plugins/hermes-sekretaerin/` pentru configurare.

---

## Instalare rapidă

### Linux, macOS, WSL2, Termux

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows (nativ, PowerShell)

> **Atenție:** Windows nativ rulează Hermes fără WSL — CLI, gateway, TUI și uneltele funcționează toate nativ. Dacă preferi să folosești WSL2, comanda de o singură linie pentru Linux/macOS de mai sus funcționează și acolo. Ai găsit un bug? Te rugăm să [raportezi probleme](https://github.com/NousResearch/hermes-agent/issues).

Rulează acest lucru în PowerShell:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Installerul gestionează totul: uv, Python 3.11, Node.js, ripgrep, ffmpeg, **și un Git Bash portabil** (MinGit, dezarhivat în `%LOCALAPPDATA%\hermes\git` — nu este necesar administratorul, complet izolat de orice instalare Git de sistem). Hermes folosește acest Git Bash inclus pentru a rula comenzi shell.

Dacă ai deja Git instalat, installerul îl detectează și îl folosește în schimb. Altfel, este suficientă o descărcare MinGit de ~45MB — nu va atinge sau interfera cu niciun Git de sistem.

> **Android / Termux:** Calea manuală testată este documentată în [ghidul Termux](https://hermes-agent.nousresearch.com/docs/getting-started/termux). Pe Termux, Hermes instalează un extra `.[termux]` selectat deoarece extra-ul complet `.[all]` trage în prezent dependențe vocale incompatibile cu Android.
>
> **Windows:** Windows nativ este complet suportat — comanda de o singură linie PowerShell de mai sus instalează totul. Dacă preferi să folosești WSL2, comanda Linux funcționează și acolo. Instalarea Windows nativ se află sub `%LOCALAPPDATA%\hermes`; WSL2 se instalează sub `~/.hermes` ca pe Linux.

---

## Configurarea Hermes Secretară (extensie SonnerStudio)

Stratul vocal se află în `plugins/hermes-sekretaerin/`:

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

Acesta instalează:
- `mlx-proxy.py` ca daemon launchd (servește modelele TTS/STT/MLX pe `:1240`)
- `mic-level.py` ca LaunchAgent fără interfață (monitor de nivel microfon, fără fereastră de terminal)
- `kokoro-tts-server.py` (Kokoro TTS german, `df_eva`)

**Construiește Kokoro (o singură dată):** vezi `plugins/hermes-sekretaerin/BUILD_kokoro.md`. Necesită `cmake`, headere `espeak-ng` și sub-modulele `ggml`/`highway`.

**Permisiune microfon:** acordă acces macOS *System Settings → Privacy & Security → Microphone* pentru helper o singură dată.

---

După instalare:

```bash
source ~/.bashrc    # reîncarcă shell-ul (sau: source ~/.zshrc)
hermes              # începe să vorbești!
```

### Depanare

#### Windows Defender sau antivirusul marchează `uv.exe` ca malware

Dacă antivirusul tău (Bitdefender, Windows Defender etc.) pune în carantină `uv.exe` din folderul Hermes `bin` (`%LOCALAPPDATA%\hermes\bin\uv.exe`), acesta este un **fals pozitiv**. Fișierul este `uv` de la Astral — managerul de pachete Python Rust pe care Hermes îl include pentru a-și gestiona mediul Python. Antivirusurile bazate pe ML marchează frecvent binare Rust nesemnate care descarcă și instalează pachete.

**Pentru a verifica că copia ta este autentică:**

```powershell
# Instalează GitHub CLI dacă este necesar
winget install --id GitHub.cli

# Conectează-te la GitHub
gh auth login

# Rulează verificarea
$uv = "$env:LOCALAPPDATA\hermes\bin\uv.exe"
$ver = (& $uv --version).Split(' ')[1]
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$zip = "$env:TEMP\uv.zip"
Invoke-WebRequest "https://github.com/astral-sh/uv/releases/download/$ver/uv-x86_64-pc-windows-msvc.zip" -OutFile $zip -UseBasicParsing
gh attestation verify $zip --repo astral-sh/uv
Expand-Archive $zip "$env:TEMP\uv_x" -Force
(Get-FileHash "$env:TEMP\uv_x\uv.exe").Hash -eq (Get-FileHash $uv).Hash
```

Dacă atestarea spune „Verification succeeded” și ultima linie afișează `True`, ești OK.

**Pentru a adăuga Hermes la lista albă:**
- **Windows Defender:** Rulează PowerShell ca Admin → `Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\hermes\bin"`
- **Bitdefender:** Adaugă o excepție în consola Bitdefender (Protection > Antivirus > Settings > Manage Exceptions)
- Adaugă la lista albă **folderul**, nu hash-ul fișierului — Hermes actualizează `uv` și hash-ul se schimbă la fiecare versiune

Pentru mai mult context, vezi rapoartele Astral din amonte: [astral-sh/uv#13553](https://github.com/astral-sh/uv/issues/13553), [astral-sh/uv#15011](https://github.com/astral-sh/uv/issues/15011), [astral-sh/uv#10079](https://github.com/astral-sh/uv/issues/10079).

---

## Primii pași

```bash
hermes              # CLI interactiv — începe o conversație
hermes model        # Alege furnizorul și modelul tău LLM
hermes tools        # Configurează ce unelte sunt activate
hermes config set   # Setează valori individuale de configurare
hermes config get   # Afișează valori individuale de configurare
hermes gateway      # Pornește gateway-ul de mesagerie (Telegram, Discord etc.)
hermes setup        # Rulează expertul complet de configurare (configurează totul o dată)
hermes claw migrate # Migrează din OpenClaw (dacă vii din OpenClaw)
hermes update       # Actualizează la cea mai recentă versiune
hermes doctor       # Diagnostichează orice probleme
```

📖 **[Documentație completă →](https://hermes-agent.nousresearch.com/docs/)**

---

## Fără colectarea cheilor API — Nous Portal

Hermes funcționează cu orice furnizor dorești — acest lucru nu se schimbă. Dar dacă nu vrei să colectezi cinci chei API separate pentru model, căutare web, generare de imagini, TTS și un browser în cloud, **[Nous Portal](https://portal.nousresearch.com)** acoperă toate sub un singur abonament:

- **300+ modele** — alege oricare cu `/model <nume>`
- **Tool Gateway** — căutare web (Firecrawl), generare de imagini (FAL), text-to-speech (OpenAI), browser în cloud (Browser Use), toate rutate prin abonamentul tău. Fără conturi suplimentare.

O singură comandă de la o instalare nouă:

```bash
hermes setup --portal
```

Aceasta te conectează prin OAuth, setează Nous ca furnizor și activează Tool Gateway. Verifică ce este conectat oricând cu `hermes portal info`. Detalii complete pe [pagina de documentație Tool Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway).

Poți totuși să aduci propriile chei per-uneltă oricând dorești — gateway-ul este per-backend, nu totul-sau-nimic.

---

## Referință rapidă CLI vs Mesagerie

Hermes are două puncte de intrare: pornește interfața terminal cu `hermes`, sau rulează gateway-ul și vorbește cu el din Telegram, Discord, Slack, WhatsApp, Signal sau Email. Odată ce ești într-o conversație, multe comenzi slash sunt comune ambelor interfețe.

| Acțiune                                | CLI                                           | Platforme de mesagerie                                                              |
| -------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Începe să vorbești                     | `hermes`                                      | Rulează `hermes gateway setup` + `hermes gateway start`, apoi trimite botului un mesaj |
| Începe o conversație nouă              | `/new` sau `/reset`                           | `/new` sau `/reset`                                                               |
| Schimbă modelul                        | `/model [provider:model]`                     | `/model [provider:model]`                                                         |
| Setează o personalitate               | `/personality [name]`                         | `/personality [name]`                                                             |
| Retrimite sau anulează ultimul tur     | `/retry`, `/undo`                             | `/retry`, `/undo`                                                                 |
| Comprimă contextul / verifică utilizarea | `/compress`, `/usage`, `/insights [--days N]` | `/compress`, `/usage`, `/insights [days]`                                        |
| Răsfoiește skillurile                 | `/skills` sau `/<skill-name>`                | `/<skill-name>`                                                                   |
| Întrerupe munca curentă               | `Ctrl+C` sau trimite un mesaj nou             | `/stop` sau trimite un mesaj nou                                                  |
| Stare specifică platformei             | `/platforms`                                 | `/status`, `/sethome`                                                             |

Pentru listele complete de comenzi, vezi [ghidul CLI](https://hermes-agent.nousresearch.com/docs/user-guide/cli) și [ghidul Messaging Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging).

---

## Documentație

Toată documentația se află la **[hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs)**:

| Secțiune                                                                                            | Ce este acoperit                                            |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)                 | Instalare → configurare → prima conversație în 2 minute    |
| [CLI Usage](https://hermes-agent.nousresearch.com/docs/user-guide/cli)                              | Comenzi, taste, personalități, sesiuni                     |
| [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)                | Fișier de configurare, furnizori, modele, toate opțiunile  |
| [Messaging Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)                | Telegram, Discord, Slack, WhatsApp, Signal, Home Assistant |
| [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)                          | Aprobarea comenzilor, asocierea DM, izolarea containerului  |
| [Tools & Toolsets](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools)            | 40+ unelte, sistem de toolset, backend-uri terminal        |
| [Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)              | Memorie procedurală, Skills Hub, crearea skillurilor       |
| [Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)                     | Memorie persistentă, profile utilizator, bune practici     |
| [MCP Integration](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)               | Conectează orice server MCP pentru capabilități extinse   |
| [Cron Scheduling](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)              | Sarcini programate cu livrare pe platformă                |
| [Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)       | Context de proiect care formează fiecare conversație       |
| [Architecture](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture)             | Structura proiectului, bucla agentului, clase cheie        |
| [Contributing](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing)             | Configurare dezvoltare, proces PR, stil de cod             |
| [CLI Reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)                  | Toate comenzile și flag-urile                              |
| [Environment Variables](https://hermes-agent.nousresearch.com/docs/reference/environment-variables) | Referință completă variabile de mediu                      |

---

## Migrarea din OpenClaw

Dacă vii din OpenClaw, Hermes poate importa automat setările, memoriile, skillurile și cheile API.

**În timpul configurării pentru prima dată:** Expertul de configurare (`hermes setup`) detectează automat `~/.openclaw` și oferă migrarea înainte de a începe configurarea.

**Oricând după instalare:**

```bash
hermes claw migrate              # Migrare interactivă (preset complet)
hermes claw migrate --dry-run    # Previzionează ce ar fi migrat
hermes claw migrate --preset user-data   # Migrează fără secrete
hermes claw migrate --overwrite  # Suprascrie conflictele existente
```

Ce este importat:

- **SOUL.md** — fișier persona
- **Memorii** — intrările MEMORY.md și USER.md
- **Skilluri** — skilluri create de utilizator → `~/.hermes/skills/openclaw-imports/`
- **Allowlist comenzi** — modele de aprobare
- **Setări de mesagerie** — configurări platformă, utilizatori permiși, director de lucru
- **Chei API** — secrete permise (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs)
- **Asset-uri TTS** — fișiere audio ale spațiului de lucru
- **Instrucțiuni spațiu de lucru** — AGENTS.md (cu `--workspace-target`)

Vezi `hermes claw migrate --help` pentru toate opțiunile, sau folosește skillul `openclaw-migration` pentru o migrare interactivă ghidată de agent cu previzualizări dry-run.

---

## Contribuții

Binevine contribuțiile! Vezi [Ghidul de contribuție](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing) pentru configurarea dezvoltării, stilul de cod și procesul PR.

Pornire rapidă pentru contribuitori — folosește installerul standard, apoi lucrează din
checkout-ul git complet pe care îl creează la `$HERMES_HOME/hermes-agent` (de obicei
`~/.hermes/hermes-agent`). Aceasta corespunde cu structura folosită de `hermes update`,
venv-ul gestionat, dependențele leneșe, gateway-ul și tooling-ul de documentație.

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
cd "${HERMES_HOME:-$HOME/.hermes}/hermes-agent"
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

Rezervă de siguranță clone manuale (pentru clone de unică folosință/CI unde intenționat nu
vrei structura de instalare gestionată):

Creează venv-ul în afara arborelui sursă clonat — un venv în interiorul directorului
din care operează agentul poate fi șters de o comandă cu cale relativă pe care agentul o
rulează împotriva propriului checkout, distrugând runtime-ul în execuție la mijlocul sesiunii.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv ~/.hermes/venvs/hermes-dev --python 3.11
source ~/.hermes/venvs/hermes-dev/bin/activate
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

---

## Comunitate

- 💬 [Discord](https://discord.gg/NousResearch)
- 📚 [Skills Hub](https://agentskills.io)
- 🐛 [Issues](https://github.com/NousResearch/hermes-agent/issues)
- 🔌 [computer-use-linux](https://github.com/avifenesh/computer-use-linux) — server MCP de control desktop Linux pentru Hermes și alți gazde MCP, cu arbori de accesibilitate AT-SPI, intrare Wayland/X11, capturi de ecran și direcționare ferestre compozitor.
- 🔌 [HermesClaw](https://github.com/AaronWong1999/hermesclaw) — Punte comunitară WeChat: Rulează Hermes Agent și OpenClaw pe același cont WeChat.

---

## Licență

MIT — vezi [LICENSE](LICENSE).

Creat de [Nous Research](https://nousresearch.com).
