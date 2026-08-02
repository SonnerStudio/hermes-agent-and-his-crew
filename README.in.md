<p align="center">
  <img src="assets/banner.png" alt="SonnerStudio — Hermes Agent and his Crew" width="100%">
</p>

# Hermes Agent और उनकी टीम (उप-एजेंटों के साथ) ☤

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
  <a href="README.in.md"><img src="https://img.shields.io/badge/Lang-Hindi-orange?style=for-the-badge" alt="हिंदी"></a>
</p>

> **भाषाएँ (Languages):** यह README [Deutsch](README.de.md), [Français](README.fr.md), [Español](README.es.md), [Nederlands](README.nl.md) में उपलब्ध है। डेस्कटॉप ऐप में इन और अन्य के लिए एक अंतर्निहित भाषा चयनकर्ता (🌐) है।

**Nous Research के Hermes Agent का SonnerStudio फोर्क** — स्व-सुधार करने वाला AI एजेंट, जिसमें आवाज़-संचालित **Hermes सचिव** और उप-एजेंटों को व्यवस्थित करने के लिए एक दृश्य **Composer-Control-HUD** जोड़ा गया है।

इस फोर्क में जोड़ा गया:

- **Composer Control Buttons** — डेस्कटॉप कंपोज़र में चार टॉगल बटन (उप-एजेंट ऑर्केस्ट्रेशन, आवाज़ संचार, ऑर्केस्ट्रेशन मोड, डबल मोड) जिनके सजीव स्थिति रंग हैं (लाल = निष्क्रिय, पीला = प्रावधान निर्माण, हरा = सक्रिय)।
- **Orchestration HUD** — कंपोज़र इनपुट के नीचे चार नीले-किनारे वाले सजीव पैनल: *उप-एजेंट टीम*, *Hermes सचिव (ऑडियो-संचार)*, *क्लोन किए गए एजेंट*, और *सामंजस्य और एजेंट लोड*। पैनल केवल तभी दिखते हैं जब कोई वास्तविक कार्य चल रहा हो — कोई डेमो प्लेसहोल्डर नहीं।
- **Hermes सचिव** — एक आवाज़ परत जो आपको एजेंट से बात करने देती है। **Kokoro** के माध्यम से जर्मन TTS (`df_eva`, महिला, फिल्मी गति 0.9), Whisper के माध्यम से STT, और एक हेडलेस माइक्रोफोन-स्तर मॉनिटर (कोई दृश्य टर्मिनल पॉपअप नहीं)। एजेंट बोले गए अनुरोधों को पूरा करने के लिए उप-एजेंटों को प्रतिनियुक्त कर सकता है।
- **MLX Runtime Proxy** — एक स्थानीय आलसी प्रॉक्सी (`:1240`) जो Kokoro TTS, Whisper STT, और MLX चैट मॉडल को एक समय में एक सेवा देता है, ताकि 16 GB Mac mini RAM सीमा के भीतर रहे।

> **नोट:** MLX रनटाइम, Kokoro जर्मन TTS, और Hermes सचिव आवाज़ पाइपलाइन Apple Silicon (macOS) के लिए ट्यून की गई हैं। सेटअप के लिए `plugins/hermes-sekretaerin/` देखें।

---

## त्वरित इंस्टॉल (Quick Install)

### Linux, macOS, WSL2, Termux

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows (native, PowerShell)

> **ध्यान दें (Heads up):** नेटिव Windows बिना WSL के Hermes चलाता है — CLI, गेटवे, TUI, और टूल सभी स्वाभाविक रूप से काम करते हैं। यदि आप WSL2 का उपयोग करना चाहते हैं, तो ऊपर दिया गया Linux/macOS वन-लाइनर वहाँ भी काम करता है। कोई बग मिला? कृपया [इश्यू दर्ज करें](https://github.com/NousResearch/hermes-agent/issues)।

PowerShell में यह चलाएँ:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

इंस्टॉलर हर चीज़ को संभाल लेता है: uv, Python 3.11, Node.js, ripgrep, ffmpeg, **और एक पोर्टेबल Git Bash** (MinGit, `%LOCALAPPDATA%\hermes\git` पर निकाला गया — कोई एडमिन आवश्यक नहीं, किसी भी सिस्टम Git इंस्टॉल से पूरी तरह अलग)। Hermes शेल कमांड चलाने के लिए इसी बंडल की गई Git Bash का उपयोग करता है।

यदि आपके पास पहले से Git इंस्टॉल है, तो इंस्टॉलर उसका पता लगा लेता है और उसी का उपयोग करता है। अन्यथा केवल ~45MB MinGit डाउनलोड की आवश्यकता है — यह किसी भी सिस्टम Git को छूेगा या बाधित नहीं करेगा।

> **Android / Termux:** परीक्षित मैन्युअल पथ [Termux गाइड](https://hermes-agent.nousresearch.com/docs/getting-started/termux) में दस्तावेज़ित है। Termux पर, Hermes एक क्यूरेटेड `.[termux]` एक्सट्रा इंस्टॉल करता है क्योंकि पूर्ण `.[all]` एक्सट्रा वर्तमान में Android-असंगत आवाज़ निर्भरताएँ खींचता है।
>
> **Windows:** नेटिव Windows पूरी तरह समर्थित है — ऊपर दिया गया PowerShell वन-लाइनर सब कुछ इंस्टॉल कर देता है। यदि आप WSL2 का उपयोग करना चाहते हैं, तो Linux कमांड वहाँ भी काम करता है। नेटिव Windows इंस्टॉल `%LOCALAPPDATA%\hermes` के अंतर्गत रहता है; WSL2 Linux की तरह `~/.hermes` के अंतर्गत इंस्टॉल होता है।

---

## Hermes सचिव सेटअप (SonnerStudio एक्सटेंशन)

आवाज़ परत `plugins/hermes-sekretaerin/` में स्थित है:

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

यह इंस्टॉल करता है:
- `mlx-proxy.py` को एक launchd डेमन के रूप में (`:1240` पर TTS/STT/MLX मॉडल सेवा देता है)
- `mic-level.py` को एक हेडलेस LaunchAgent के रूप में (माइक्रोफोन स्तर मॉनिटर, कोई टर्मिनल विंडो नहीं)
- `kokoro-tts-server.py` (Kokoro जर्मन TTS, `df_eva`)

**Kokoro बनाएँ (एक बार):** `plugins/hermes-sekretaerin/BUILD_kokoro.md` देखें। इसके लिए `cmake`, `espeak-ng` हेडर, और `ggml`/`highway` सबमॉड्यूल आवश्यक हैं।

**माइक्रोफोन अनुमति:** macOS *System Settings → Privacy & Security → Microphone* पहुँच को सहायक को एक बार दें।

---

इंस्टॉलेशन के बाद:

```bash
source ~/.bashrc    # शेल रीलोड करें (या: source ~/.zshrc)
hermes              # बातचीत शुरू करें!
```

### समस्या निवारण (Troubleshooting)

#### Windows Defender या एंटीवायरस `uv.exe` को मालवेयर के रूप में फ्लैग करता है

यदि आपका एंटीवायरस (Bitdefender, Windows Defender, आदि) Hermes `bin` फ़ोल्डर (`%LOCALAPPDATA%\hermes\bin\uv.exe`) से `uv.exe` को संगरोध (quarantine) कर देता है, तो यह एक **गलत सकारात्मक (false positive)** है। फ़ाइल Astral का `uv` है — Rust Python पैकेज मैनेजर जिसे Hermes अपने Python परिवेश को प्रबंधित करने के लिए बंडल करता है। ML-आधारित एंटीवायरस इंजन अक्सर अहस्ताक्षरित Rust बाइनरीज़ को फ्लैग करते हैं जो पैकेज डाउनलोड और इंस्टॉल करते हैं।

**अपनी प्रति के प्रामाणिक होने की पुष्टि करने के लिए:**

```powershell
# GitHub CLI इंस्टॉल करें यदि आवश्यक हो
winget install --id GitHub.cli

# GitHub में लॉगिन करें
gh auth login

# सत्यापन चलाएँ
$uv = "$env:LOCALAPPDATA\hermes\bin\uv.exe"
$ver = (& $uv --version).Split(' ')[1]
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$zip = "$env:TEMP\uv.zip"
Invoke-WebRequest "https://github.com/astral-sh/uv/releases/download/$ver/uv-x86_64-pc-windows-msvc.zip" -OutFile $zip -UseBasicParsing
gh attestation verify $zip --repo astral-sh/uv
Expand-Archive $zip "$env:TEMP\uv_x" -Force
(Get-FileHash "$env:TEMP\uv_x\uv.exe").Hash -eq (Get-FileHash $uv).Hash
```

यदि सत्यापन "Verification succeeded" कहता है और अंतिम पंक्ति `True` प्रिंट करती है, तो आप ठीक हैं।

**Hermes को व्हाइटलिस्ट करने के लिए:**
- **Windows Defender:** PowerShell को Admin के रूप में चलाएँ → `Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\hermes\bin"`
- **Bitdefender:** Bitdefender कंसोल में एक अपवाद जोड़ें (Protection > Antivirus > Settings > Manage Exceptions)
- फ़ाइल हैश के बजाय **फ़ोल्डर** को व्हाइटलिस्ट करें — Hermes `uv` को अपडेट करता है और हैश हर संस्करण में बदलता है

अधिक संदर्भ के लिए, अपस्ट्रीम Astral रिपोर्ट देखें: [astral-sh/uv#13553](https://github.com/astral-sh/uv/issues/13553), [astral-sh/uv#15011](https://github.com/astral-sh/uv/issues/15011), [astral-sh/uv#10079](https://github.com/astral-sh/uv/issues/10079)।

---

## आरंभ करें (Getting Started)

```bash
hermes              # इंटरैक्टिव CLI — एक बातचीत शुरू करें
hermes model        # अपना LLM प्रदाता और मॉडल चुनें
hermes tools        # कॉन्फ़िगर करें कि कौन से टूल सक्षम हैं
hermes config set   # व्यक्तिगत कॉन्फ़िग मान सेट करें
hermes config get   # व्यक्तिगत कॉन्फ़िग मान प्रिंट करें
hermes gateway      # मैसेजिंग गेटवे शुरू करें (Telegram, Discord, आदि)
hermes setup        # पूर्ण सेटअप विज़ार्ड चलाएँ (सब कुछ एक साथ कॉन्फ़िगर करता है)
hermes claw migrate # OpenClaw से माइग्रेट करें (यदि OpenClaw से आ रहे हैं)
hermes update       # नवीनतम संस्करण में अपडेट करें
hermes doctor       # किसी भी समस्या का निदान करें
```

📖 **[पूर्ण दस्तावेज़ →](https://hermes-agent.nousresearch.com/docs/)**

---

## एपीआई-कुंजी संग्रह छोड़ें — Nous Portal

Hermes जिस भी प्रदाता को आप चाहें उसके साथ काम करता है — यह नहीं बदल रहा। लेकिन यदि आप मॉडल, वेब सर्च, छवि जनरेशन, TTS, और एक क्लाउड ब्राउज़र के लिए पाँच अलग-अलग API कुंजियाँ एकत्र नहीं करना चाहते, तो **[Nous Portal](https://portal.nousresearch.com)** एक ही सदस्यता के तहत इन सभी को कवर करता है:

- **300+ मॉडल** — उनमें से किसी को भी `/model <name>` के साथ चुनें
- **Tool Gateway** — वेब सर्च (Firecrawl), छवि जनरेशन (FAL), टेक्स्ट-टू-स्पीच (OpenAI), क्लाउड ब्राउज़र (Browser Use), सभी आपकी सदस्यता के माध्यम से रूट किए गए। कोई अतिरिक्त खाते नहीं।

नए इंस्टॉल से एक कमांड:

```bash
hermes setup --portal
```

यह आपको OAuth के माध्यम से लॉग इन कराता है, Nous को अपना प्रदाता सेट करता है, और Tool Gateway चालू करता है। किसी भी समय `hermes portal info` के साथ जाँचें कि क्या वायर्ड अप है। पूर्ण विवरण [Tool Gateway दस्तावेज़ पृष्ठ](https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway) पर हैं।

आप अभी भी अपनी स्वयं की कुंजियाँ प्रति-टूल कभी भी ला सकते हैं — गेटवे प्रति-बैकएंड है, सब-या-कुछ-नहीं नहीं।

---

## CLI बनाम मैसेजिंग त्वरित संदर्भ

Hermes के दो प्रवेश बिंदु हैं: `hermes` के साथ टर्मिनल UI शुरू करें, या गेटवे चलाएँ और Telegram, Discord, Slack, WhatsApp, Signal, या Email से उससे बात करें। एक बार जब आप बातचीत में आ जाते हैं, तो कई स्लैश कमांड दोनों इंटरफेस में साझा होते हैं।

| क्रिया (Action)                            | CLI                                           | मैसेजिंग प्लेटफ़ॉर्म                                                              |
| ------------------------------------------ | --------------------------------------------- | -------------------------------------------------------------------------------- |
| बातचीत शुरू करें                           | `hermes`                                      | `hermes gateway setup` + `hermes gateway start` चलाएँ, फिर बॉट को संदेश भेजें   |
| नई बातचीत शुरू करें                        | `/new` या `/reset`                            | `/new` या `/reset`                                                               |
| मॉडल बदलें                                 | `/model [provider:model]`                     | `/model [provider:model]`                                                        |
| व्यक्तित्व सेट करें                        | `/personality [name]`                         | `/personality [name]`                                                            |
| अंतिम टर्न को पुनः प्रयास या पूर्ववत करें | `/retry`, `/undo`                             | `/retry`, `/undo`                                                                |
| संदर्भ संपीड़ित करें / उपयोग जाँचें        | `/compress`, `/usage`, `/insights [--days N]` | `/compress`, `/usage`, `/insights [days]`                                        |
| स्किल्स ब्राउज़ करें                        | `/skills` या `/<skill-name>`                  | `/<skill-name>`                                                                  |
| वर्तमान कार्य रोकें                         | `Ctrl+C` या एक नया संदेश भेजें                | `/stop` या एक नया संदेश भेजें                                                    |
| प्लेटफ़ॉर्म-विशिष्ट स्थिति                 | `/platforms`                                  | `/status`, `/sethome`                                                            |

पूर्ण कमांड सूचियों के लिए, [CLI गाइड](https://hermes-agent.nousresearch.com/docs/user-guide/cli) और [Messaging Gateway गाइड](https://hermes-agent.nousresearch.com/docs/user-guide/messaging) देखें।

---

## दस्तावेज़ (Documentation)

सभी दस्तावेज़ **[hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs)** पर स्थित हैं:

| अनुभाग (Section)                                                                                   | कवर किया गया (What's Covered)                                 |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)                 | इंस्टॉल → सेटअप → 2 मिनट में पहली बातचीत                     |
| [CLI Usage](https://hermes-agent.nousresearch.com/docs/user-guide/cli)                              | कमांड, कीबाइंडिंग, व्यक्तित्व, सत्र                          |
| [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)                | कॉन्फ़िग फ़ाइल, प्रदाता, मॉडल, सभी विकल्प                    |
| [Messaging Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)                | Telegram, Discord, Slack, WhatsApp, Signal, Home Assistant    |
| [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)                          | कमांड अनुमोदन, DM पेयरिंग, कंटेनर अलगाव                     |
| [Tools & Toolsets](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools)            | 40+ टूल, टूलसेट सिस्टम, टर्मिनल बैकएंड                      |
| [Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)              | प्रक्रियात्मक मेमोरी, Skills Hub, स्किल्स बनाना              |
| [Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)                     | स्थायी मेमोरी, उपयोगकर्ता प्रोफ़ाइल, सर्वोत्तम प्रथाएँ     |
| [MCP Integration](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)               | विस्तारित क्षमताओं के लिए किसी भी MCP सर्वर से कनेक्ट करें  |
| [Cron Scheduling](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)              | प्लेटफ़ॉर्म डिलीवरी के साथ अनुसूचित कार्य                   |
| [Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)       | परियोजना संदर्भ जो हर बातचीत को आकार देता है                |
| [Architecture](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture)             | परियोजना संरचना, एजेंट लूप, प्रमुख कक्षाएँ                  |
| [Contributing](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing)             | विकास सेटअप, PR प्रक्रिया, कोड शैली                        |
| [CLI Reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)                  | सभी कमांड और फ़्लैग                                         |
| [Environment Variables](https://hermes-agent.nousresearch.com/docs/reference/environment-variables) | पूर्ण env var संदर्भ                                         |

---

## OpenClaw से माइग्रेट करना

यदि आप OpenClaw से आ रहे हैं, तो Hermes स्वचालित रूप से आपकी सेटिंग्स, मेमोरी, स्किल्स, और API कुंजियाँ आयात कर सकता है।

**पहली बार सेटअप के दौरान:** सेटअप विज़ार्ड (`hermes setup`) स्वचालित रूप से `~/.openclaw` का पता लगाता है और कॉन्फ़िगरेशन शुरू होने से पहले माइग्रेट करने का विकल्प देता है।

**इंस्टॉल के बाद कभी भी:**

```bash
hermes claw migrate              # इंटरैक्टिव माइग्रेशन (पूर्ण प्रीसेट)
hermes claw migrate --dry-run    # पूर्वावलोकन कि क्या माइग्रेट किया जाएगा
hermes claw migrate --preset user-data   # रहस्यों के बिना माइग्रेट करें
hermes claw migrate --overwrite  # मौजूदा संघर्षों को अधिलेखित करें
```

क्या आयात किया जाता है:

- **SOUL.md** — व्यक्तित्व फ़ाइल
- **Memories** — MEMORY.md और USER.md प्रविष्टियाँ
- **Skills** — उपयोगकर्ता-निर्मित स्किल्स → `~/.hermes/skills/openclaw-imports/`
- **Command allowlist** — अनुमोदन पैटर्न
- **Messaging settings** — प्लेटफ़ॉर्म कॉन्फ़िग, अनुमत उपयोगकर्ता, कार्य निर्देशिका
- **API keys** — allowlisted रहस्य (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs)
- **TTS assets** — वर्कस्पेस ऑडियो फ़ाइलें
- **Workspace instructions** — AGENTS.md ( `--workspace-target` के साथ)

सभी विकल्पों के लिए `hermes claw migrate --help` देखें, या dry-run पूर्वावलोकन के साथ एक इंटरैक्टिव एजेंट-निर्देशित माइग्रेशन के लिए `openclaw-migration` स्किल का उपयोग करें।

---

## योगदान (Contributing)

हम योगदान का स्वागत करते हैं! विकास सेटअप, कोड शैली, और PR प्रक्रिया के लिए [Contributing Guide](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing) देखें।

योगदानकर्ताओं के लिए त्वरित आरंभ — मानक इंस्टॉलर का उपयोग करें, फिर इसके द्वारा बनाए गए पूर्ण git चेकआउट से काम करें `$HERMES_HOME/hermes-agent` (आमतौर पर `~/.hermes/hermes-agent`)। यह लेआउट `hermes update`, मैनेज्ड venv, lazy निर्भरताओं, गेटवे, और docs टूलिंग द्वारा उपयोग किए गए से मेल खाता है।

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
cd "${HERMES_HOME:-$HOME/.hermes}/hermes-agent"
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

मैन्युअल क्लोन फ़ॉलबैक (थ्रोअवे क्लोन/CI के लिए जहाँ आप जानबूझकर मैनेज्ड इंस्टॉल लेआउट नहीं चाहते):

क्लोन किए गए स्रोत ट्री के बाहर venv बनाएँ — एजेंट जिस निर्देशिका से संचालित होता है उसके भीतर venv को एक सापेक्ष-पथ कमांड द्वारा मिटाया जा सकता है जो एजेंट अपनी ही चेकआउट के विरुद्ध चलाता है, जिससे सत्र के बीच में चलने वाला रनटाइम नष्ट हो जाता है।

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv ~/.hermes/venvs/hermes-dev --python 3.11
source ~/.hermes/venvs/hermes-dev/bin/activate
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

---

## समुदाय (Community)

- 💬 [Discord](https://discord.gg/NousResearch)
- 📚 [Skills Hub](https://agentskills.io)
- 🐛 [Issues](https://github.com/NousResearch/hermes-agent/issues)
- 🔌 [computer-use-linux](https://github.com/avifenesh/computer-use-linux) — Hermes और अन्य MCP होस्ट के लिए Linux डेस्कटॉप-नियंत्रण MCP सर्वर, AT-SPI एक्सेसिबिलिटी ट्रीज़, Wayland/X11 इनपुट, स्क्रीनशॉट, और कंपोज़िटर विंडो टार्गेटिंग के साथ।
- 🔌 [HermesClaw](https://github.com/AaronWong1999/hermesclaw) — सामुदायिक WeChat ब्रिज: एक ही WeChat खाते पर Hermes Agent और OpenClaw चलाएँ।

---

## लाइसेंस (License)

MIT — देखें [LICENSE](LICENSE)।

निर्मित [Nous Research](https://nousresearch.com) द्वारा।
