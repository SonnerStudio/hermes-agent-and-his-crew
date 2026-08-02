<p align="center">
  <img src="assets/banner.png" alt="SonnerStudio — Hermes Agent and his Crew" width="100%">
</p>

# Hermes הסוכן וצוותו (עם תת-סוכנים) ☤

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
  <a href="README.il.md"><img src="https://img.shields.io/badge/Lang-Hebrew-0052cc?style=for-the-badge" alt="עברית"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/Lang-English-lightgrey?style=for-the-badge" alt="English"></a>
</p>

> **Fork של SonnerStudio של Hermes Agent מ-Nous Research**

> **שפות:** קובץ README זה זמין ב[דויטש](README.de.md), [פראנסז](README.fr.md), [אספניול](README.es.md), [נדרלנדס](README.nl.md) ו[עברית](README.il.md). אפליקציית שולחן העבודה כוללת בוחר שפות מובנה (🌐) עם שפות אלו ועוד.

**Fork של SonnerStudio של [Hermes Agent](https://hermes-agent.nousresearch.com/) מבית Nous Research** — הסוכן המלאכותי המשתפר-מעצמו, שהורחב בשכבת קול **Hermes מזכירה** ובלוח בקרה ויזואלי **Composer-Control-HUD** לתזמור תת-סוכנים.

Fork זה מוסיף:

- **כפתורי בקרת המלחין (Composer Control Buttons)** — ארבעה כפתורי מצב מתחלף במלחין שולחן העבודה (תזמור תת-סוכנים, תקשורת קולית, מצב תזמור, מצב כפול) עם צבעי מצב חיים (אדום = לא פעיל, צהוב = בהקמה, ירוק = פעיל).
- **לוח הבקרה לתזמור (Orchestration HUD)** — ארבעה לוחות חיים עם מסגרת כחולה מתחת לתיבת הקלט של המלחין: *צוות תת-סוכנים*, *Hermes מזכירה (תקשורת שמע)*, *סוכנים משובטים*, ו*הרמוניה ועומס סוכנים*. הלוחות מופיעים רק כאשר משימה אמיתית רצה — ללא תחנות מצב לדוגמה.
- **Hermes מזכירה** — שכבת קול המאפשרת לך לדבר עם הסוכן. TTS בגרמנית דרך **Kokoro** (`df_eva`, נשי, מהירות קולנועית 0.9), STT דרך Whisper, ומוניטור רמת מיקרופון ללא חלון (ללא חלון טרמינל נראה לעין). הסוכן יכול להאציל תת-סוכנים לביצוע בקשות מדוברות.
- **MLX Runtime Proxy** — פרוקסי מקומי עצלן (`:1240`) המשרת את דגמי Kokoro TTS, Whisper STT ו-MLX chat אחד בכל פעם, כך ש-Mac mini ברמת 16 GB נשאר בגבולות הזיכרון.

> **הערה:** זמן הריצה MLX, Kokoro TTS בגרמנית, וצינור הקול של Hermes מזכירה מכוונים ל-Apple Silicon (macOS). ראה `plugins/hermes-sekretaerin/` להגדרה.

---

## התקנה מהירה

### לינוקס, macOS, WSL2, Termux

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows (מקורי, PowerShell)

> **שים לב:** Windows מקורי מריץ את Hermes ללא WSL — CLI, gateway, TUI וכלים עובדים במקורי. אם אתה מעדיף להשתמש ב-WSL2, הפקודה החד-שורתית של לינוקס/macOS עובדת גם שם. מצאת באג? אנא [דווח על בעיות](https://github.com/NousResearch/hermes-agent/issues).

הרץ זאת ב-PowerShell:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

המתקין מטפל בכל: uv, Python 3.11, Node.js, ripgrep, ffmpeg, **וגם Git Bash נייד** (MinGit, שפורק ל-`%LOCALAPPDATA%\hermes\git` — ללא צורך בהרשאות מנהל, מבודד לחלוטין מהתקנת Git של המערכת). Hermes משתמש ב-Git Bash הכלול הזה להרצת פקודות מעטפת.

אם כבר מותקן לך Git, המתקין מזהה אותו ומשתמש בו. אחרת הורדת MinGit של ~45MB היא כל מה שצריך — הוא לא ייגע או יפריע לשום Git של המערכת.

> **Android / Termux:** מסלול הידני הנבדק מתועד ב[מדריך Termux](https://hermes-agent.nousresearch.com/docs/getting-started/termux). ב-Termux, Hermes מתקין הרחבה נבחרת `.[termux]` מכיוון שהרחבה מלאה `.[all]` מושכת כרגע תלויות קול לא תואמות אנדרואיד.
>
> **Windows:** Windows מקורי נתמך במלואו — הפקודה החד-שורתית של PowerShell מתקינה הכל. אם אתה מעדיף להשתמש ב-WSL2, פקודת לינוקס עובדת גם שם. התקנת Windows מקורי נמצאת תחת `%LOCALAPPDATA%\hermes`; התקנת WSL2 נמצאת תחת `~/.hermes` כמו בלינוקס.

---

## הגדרת Hermes מזכירה (הרחבה של SonnerStudio)

שכבת הקול נמצאת ב-`plugins/hermes-sekretaerin/`:

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

זה מתקין:
- `mlx-proxy.py` כ-daemon מסוג launchd (משרת דגמי TTS/STT/MLX ב-`:1240`)
- `mic-level.py` כ-LaunchAgent ללא חלון (מוניטור רמת מיקרופון, ללא חלון טרמינל)
- `kokoro-tts-server.py` (Kokoro TTS גרמני, `df_eva`)

**בניית Kokoro (חד-פעמית):** ראה `plugins/hermes-sekretaerin/BUILD_kokoro.md`. דורש כותרות `cmake`, `espeak-ng`, ותת-מודולים `ggml`/`highway`.

**הרשאת מיקרופון:** הענק גישת macOS *System Settings → Privacy & Security → Microphone* למסייע פעם אחת.

---

לאחר ההתקנה:

```bash
source ~/.bashrc    # טען מחדש את המעטפת (או: source ~/.zshrc)
hermes              # התחל לצ'וטט!
```

### פתרון בעיות

#### Windows Defender או אנטי-וירוס מסמנים את `uv.exe` כתוכנה זדונית

אם האנטי-וירוס שלך (Bitdefender, Windows Defender וכו') מכניס להסגר את `uv.exe` מתיקיית ה-`bin` של Hermes (`%LOCALAPPDATA%\hermes\bin\uv.exe`), זהו **חיוב שגוי**. הקובץ הוא `uv` של Astral — מנהל חבילות Python ב-Rust ש-Hermes כולל לניהול סביבת Python שלו. מנועי אנטי-וירוס מבוססי-ML מסמנים לעתים קרובות קבצים בינאריים של Rust לא חתומים שהורדים ומתקינים חבילות.

**כדי לוודא שהעותק שלך אותנטי:**

```powershell
# התקן GitHub CLI אם נדרש
winget install --id GitHub.cli

# התחבר ל-GitHub
gh auth login

# הרץ אימות
$uv = "$env:LOCALAPPDATA\hermes\bin\uv.exe"
$ver = (& $uv --version).Split(' ')[1]
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$zip = "$env:TEMP\uv.zip"
Invoke-WebRequest "https://github.com/astral-sh/uv/releases/download/$ver/uv-x86_64-pc-windows-msvc.zip" -OutFile $zip -UseBasicParsing
gh attestation verify $zip --repo astral-sh/uv
Expand-Archive $zip "$env:TEMP\uv_x" -Force
(Get-FileHash "$env:TEMP\uv_x\uv.exe").Hash -eq (Get-FileHash $uv).Hash
```

אם האימות אומר "Verification succeeded" והשורה האחרונה מדפיסה `True`, אתה בסדר.

**כדי להכניס את Hermes לרשימת השמע (whitelist):**
- **Windows Defender:** הרץ PowerShell כמנהל → `Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\hermes\bin"`
- **Bitdefender:** הוסף חריג בקונסולת Bitdefender (Protection > Antivirus > Settings > Manage Exceptions)
- הכנס לרשימת השמע את **התיקייה**, לא את גיבוב הקובץ — Hermes מעדכן את `uv` וגיבוב הקובץ משתנה בכל גרסה

למידע נוסף, ראה דוחות Astral במעלה הזרם: [astral-sh/uv#13553](https://github.com/astral-sh/uv/issues/13553), [astral-sh/uv#15011](https://github.com/astral-sh/uv/issues/15011), [astral-sh/uv#10079](https://github.com/astral-sh/uv/issues/10079).

---

## התחלה מהירה

```bash
hermes              # CLI אינטראקטיבי — התחל שיחה
hermes model        # בחר ספק LLM ודגם
hermes tools        # הגדר אילו כלים מופעלים
hermes config set   # הגדר ערכי תצורה בודדים
hermes config get   # הדפס ערכי תצורה בודדים
hermes gateway      # התחל את שער ההודעות (Telegram, Discord וכו')
hermes setup        # הרץ את אשף ההגדרה המלא (מגדיר הכל בבת אחת)
hermes claw migrate # העבר מ-OpenClaw (אם באת מ-OpenClaw)
hermes update       # עדכן לגרסה האחרונה
hermes doctor       # אבחן בעיות
```

📖 **[תיעוד מלא →](https://hermes-agent.nousresearch.com/docs/)**

---

## דלג על איסוף מפתחות ה-API — Nous Portal

Hermes עובד עם כל ספק שתרצה — זה לא משתנה. אבל אם אתה מעדיף לא לאסוף חמישה מפתחות API נפרדים עבור הדגם, חיפוש ברשת, יצירת תמונות, TTS, ודפדפן ענן, **[Nous Portal](https://portal.nousresearch.com)** מכסה את כולם תחת מנוי אחד:

- **300+ דגמים** — בחר כל אחד מהם עם `/model <name>`
- **שער כלים (Tool Gateway)** — חיפוש ברשת (Firecrawl), יצירת תמונות (FAL), המרת טקסט לדיבור (OpenAI), דפדפן ענן (Browser Use), הכל מופנה דרך המנוי שלך. ללא חשבונות נוספים.

פקודה אחת מהתקנה טרייה:

```bash
hermes setup --portal
```

זה מחבר אותך דרך OAuth, מגדיר את Nous כספק שלך, ומפעיל את שער הכלים. בדוק מה מחובר בכל עת עם `hermes portal info`. פרטים מלאים ב[עמוד התיעוד של שער הכלים](https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway).

אתה עדיין יכול להביא מפתחות משלך לכל כלי מתי שתרצה — השער הוא לפי backend, לא הכל-או-כלום.

---

## התייחסות מהירה: CLI מול הודעות

ל-Hermes שתי נקודות כניסה: התחל את ממשק הטרמינל עם `hermes`, או הרץ את השער ודבר איתו מ-Telegram, Discord, Slack, WhatsApp, Signal, או אימייל. ברגע שאתה בשיחה, הרבה פקודות slash משותפות לשני הממשקים.

| פעולה | CLI | פלטפורמות הודעות |
| ------------------------------ | --------------------------------------------- | -------------------------------------------------------------------------------- |
| התחל לצ'וטט | `hermes` | הרץ `hermes gateway setup` + `hermes gateway start`, ואז שלח הודעה לבוט |
| התחל שיחה חדשה | `/new` או `/reset` | `/new` או `/reset` |
| שנה דגם | `/model [provider:model]` | `/model [provider:model]` |
| הגדר אישיות | `/personality [name]` | `/personality [name]` |
| נסה מחדש או בטל את התור האחרון | `/retry`, `/undo` | `/retry`, `/undo` |
| דחוס הקשר / בדוק שימוש | `/compress`, `/usage`, `/insights [--days N]` | `/compress`, `/usage`, `/insights [days]` |
| עיין בסקילים | `/skills` או `/<skill-name>` | `/<skill-name>` |
| קטע עבודה נוכחית | `Ctrl+C` או שלח הודעה חדשה | `/stop` או שלח הודעה חדשה |
| סטטוס ספציפי לפלטפורמה | `/platforms` | `/status`, `/sethome` |

לרשימות פקודות מלאות, ראה את [מדריך ה-CLI](https://hermes-agent.nousresearch.com/docs/user-guide/cli) ואת [מדריך שער ההודעות](https://hermes-agent.nousresearch.com/docs/user-guide/messaging).

---

## תיעוד

כל התיעוד נמצא ב**[hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs)**:

| סעיף | מה מכוסה |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart) | התקנה → הגדרה → שיחה ראשונה ב-2 דקות |
| [CLI Usage](https://hermes-agent.nousresearch.com/docs/user-guide/cli) | פקודות, קיצורי מקשים, אישיות, סשנים |
| [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration) | קובץ תצורה, ספקים, דגמים, כל האפשרויות |
| [Messaging Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging) | Telegram, Discord, Slack, WhatsApp, Signal, Home Assistant |
| [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security) | אישור פקודות, זיווג DM, בידוד מכולות |
| [Tools & Toolsets](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools) | 40+ כלים, מערכת toolset, backend-ים של טרמינל |
| [Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills) | זיכרון פרוצדורלי, Skills Hub, יצירת סקילים |
| [Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory) | זיכרון מתמיד, פרופילי משתמש, שיטות עבודה מומלצות |
| [MCP Integration](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp) | חבר כל שרת MCP ליכולות מורחבות |
| [Cron Scheduling](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron) | משימות מתוזמנות עם משלוח פלטפורמי |
| [Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files) | הקשר פרויקט שמעצב כל שיחה |
| [Architecture](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture) | מבנה פרויקט, לולאת סוכן, מחלקות מפתח |
| [Contributing](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing) | הגדרת פיתוח, תהליך PR, סגנון קוד |
| [CLI Reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands) | כל הפקודות והדגלים |
| [Environment Variables](https://hermes-agent.nousresearch.com/docs/reference/environment-variables) | הפניה מלאה למשתני סביבה |

---

## מעבר מ-OpenClaw

אם אתה בא מ-OpenClaw, Hermes יכול לייבא אוטומטית את ההגדרות, הזיכרונות, הסקילים, ומפתחות ה-API שלך.

**במהלך ההגדרה הראשונית:** אשף ההגדרה (`hermes setup`) מזהה אוטומטית את `~/.openclaw` ומציע להעביר לפני שהתצורה מתחילה.

**בכל עת לאחר ההתקנה:**

```bash
hermes claw migrate              # העברה אינטראקטיבית (פריסט מלא)
hermes claw migrate --dry-run    # תצוגה מקדימה של מה שיועבר
hermes claw migrate --preset user-data   # העברה ללא סודות
hermes claw migrate --overwrite  # דרוס התנגשויות קיימות
```

מה מיובא:

- **SOUL.md** — קובץ פרסונה
- **זיכרונות (Memories)** — רשומות MEMORY.md ו-USER.md
- **סקילים (Skills)** — סקילים שנוצרו על ידי המשתמש → `~/.hermes/skills/openclaw-imports/`
- **רשימת התרות פקודות (Command allowlist)** — תבניות אישור
- **הגדרות הודעות** — תצורות פלטפורמה, משתמשים מורשים, ספריית עבודה
- **מפתחות API** — סודות ברשימת התרות (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs)
- **נכסי TTS** — קבצי שמע של סביבת העבודה
- **הוראות סביבת עבודה** — AGENTS.md (עם `--workspace-target`)

ראה `hermes claw migrate --help` לכל האפשרויות, או השתמש בסקיל `openclaw-migration` להעברה אינטראקטיבית מודרכת על ידי סוכן עם תצוגות מקדימות dry-run.

---

## תרומה

אנו מקבלים בברכה תרומות! ראה את [מדריך התרומה](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing) להגדרת פיתוח, סגנון קוד, ותהליך PR.

התחלה מהירה לתורמים — השתמש במתקין הסטנדרטי, ואז עבוד מה-checkout המלא של git שהוא יוצר ב-`$HERMES_HOME/hermes-agent` (בדרך כלל `~/.hermes/hermes-agent`). זה תואם את הפריסה שמשמשת את `hermes update`, את ה-venv המנוהל, תלויות עצלות, השער, וכלי התיעוד.

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
cd "${HERMES_HOME:-$HOME/.hermes}/hermes-agent"
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

גיבוי שכפול ידני (עבור שכפולים חד-פעמיים/CI שבהם בכוונה אין לך את פריסת ההתקנה המנוהלת):

צור את ה-venv מחוץ לעץ המקור שהועתק — venv בתוך הספרייה שממנה הסוכן פועל יכול להימחק על ידי פקודת נתיב יחסי שהסוכן מריץ נגד ה-checkout שלו עצמו, משמיד את זמן הריצה הפעיל באמצע הסשן.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv ~/.hermes/venvs/hermes-dev --python 3.11
source ~/.hermes/venvs/hermes-dev/bin/activate
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

---

## קהילה

- 💬 [Discord](https://discord.gg/NousResearch)
- 📚 [Skills Hub](https://agentskills.io)
- 🐛 [Issues](https://github.com/NousResearch/hermes-agent/issues)
- 🔌 [computer-use-linux](https://github.com/avifenesh/computer-use-linux) — שרת MCP לשליטה בשולחן עבודה לינוקס עבור Hermes ומארחי MCP אחרים, עם עצי נגישות AT-SPI, קלט Wayland/X11, צילומי מסך, ויעד חלון compositor.
- 🔌 [HermesClaw](https://github.com/AaronWong1999/hermesclaw) — גשר קהילתי ל-WeChat: הרץ את Hermes Agent ו-OpenClaw באותו חשבון WeChat.

---

## רישיון

MIT — ראה [LICENSE](LICENSE).

נבנה על ידי [Nous Research](https://nousresearch.com).
