<p align="center">
  <img src="assets/banner.png" alt="SonnerStudio — Hermes Agent and his Crew" width="100%">
</p>

# Hermes Agent와 그 크루 (서브 에이전트 포함) ☤

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
  <a href="README.ko.md"><img src="https://img.shields.io/badge/Lang-%ED%95%9C%EA%B5%AD%EC%96%B4-purple?style=for-the-badge" alt="한국어"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/Lang-English-lightgrey?style=for-the-badge" alt="English"></a>
</p>

> **언어:** 이 README는 [Deutsch](README.de.md), [Français](README.fr.md), [Español](README.es.md), [Nederlands](README.nl.md), [한국어](README.ko.md)로 제공됩니다. 데스크톱 앱에는 이들 및 추가 언어를 갖춘 내장 언어 선택기(🌐)가 있습니다.

**Nous Research의 Hermes Agent의 SonnerStudio 포크** — 스스로 학습하는 AI 에이전트로, 음성 기반 **Hermes 비서**와 서브 에이전트를 조율하기 위한 시각적 **Composer-Control-HUD**가 확장되었습니다.

이 포크에서 추가된 기능:

- **Composer 컨트롤 버튼** — 데스크톱 컴포저 내 4개의 토글 버튼(서브 에이전트 오케스트레이션, 음성 통신, 오케스트레이션 모드, 더블 모드)으로, 실시간 상태 색상 표시(빨강 = 비활성, 노랑 = 프로비저닝, 초록 = 활성).
- **Orchestration HUD** — 컴포저 입력창 아래 4개의 파란색 테두리 실시간 패널: *하위 에이전트 팀*, *Hermes 비서(오디오 통신)*, *복제된 에이전트*, *조화 및 에이전트 부하*. 패널은 실제 작업이 실행될 때만 표시되며 데모 자리표시자는 없습니다.
- **Hermes 비서** — 에이전트와 대화할 수 있는 음성 레이어. Kokoro를 통한 독일어 TTS(`df_eva`, 여성, 영화 같은 speed 0.9), Whisper를 통한 STT, 그리고 헤드리스 마이크 레벨 모니터(보이는 터미널 팝업 없음). 에이전트는 말로 요청한 작업을 수행하기 위해 서브 에이전트를 위임할 수 있습니다.
- **MLX Runtime Proxy** — Kokoro TTS, Whisper STT, MLX 채팅 모델을 한 번에 하나씩 제공하는 로컬 지연 프록시(`:1240`)로, 16GB Mac mini가 RAM 한도 내에 머물도록 합니다.

> **참고:** MLX 런타임, Kokoro 독일어 TTS, Hermes 비서 음성 파이프라인은 Apple Silicon(macOS)에 맞춰 조정되었습니다. 설정은 `plugins/hermes-sekretaerin/`을 참조하세요.

---

## 빠른 설치

### Linux, macOS, WSL2, Termux

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows(네이티브, PowerShell)

> **알림:** 네이티브 Windows에서 Hermes는 WSL 없이 실행됩니다 — CLI, 게이트웨이, TUI, 도구가 모두 네이티브로 동작합니다. WSL2를 선호한다면 위의 Linux/macOS 한 줄 명령도那里에서 동작합니다. 버그를 발견하셨나요? [이슈를 등록](https://github.com/NousResearch/hermes-agent/issues)해 주세요.

PowerShell에서 다음을 실행하세요:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

설치 프로그램이 모든 것을 처리합니다: uv, Python 3.11, Node.js, ripgrep, ffmpeg, **그리고 휴대용 Git Bash**(MinGit, `%LOCALAPPDATA%\hermes\git`에 압축 해제 — 관리자 권한 불필요, 시스템 Git 설치로부터 완전히 격리됨). Hermes는 이 번들된 Git Bash를 사용하여 셸 명령을 실행합니다.

Git이 이미 설치되어 있다면 설치 프로그램이 이를 감지하여 대신 사용합니다. 그렇지 않으면 약 45MB의 MinGit 다운로드만 있으면 됩니다 — 시스템 Git을 건드리거나 간섭하지 않습니다.

> **Android / Termux:** 검증된 수동 경로는 [Termux 가이드](https://hermes-agent.nousresearch.com/docs/getting-started/termux)에 문서화되어 있습니다. Termux에서 Hermes는 큐레이션된 `.[termux]` extra를 설치하는데, 전체 `.[all]` extra가 현재 Android와 호환되지 않는 음성 종속성을 가져오기 때문입니다.
>
> **Windows:** 네이티브 Windows가 완전히 지원됩니다 — 위의 PowerShell 한 줄 명령이 모든 것을 설치합니다. WSL2를 선호한다면 Linux 명령도那里에서 동작합니다. 네이티브 Windows 설치는 `%LOCALAPPDATA%\hermes` 아래에, WSL2는 Linux와 마찬가지로 `~/.hermes` 아래에 설치됩니다.

---

## Hermes 비서 설정 (SonnerStudio 확장)

음성 레이어는 `plugins/hermes-sekretaerin/`에 있습니다:

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

다음을 설치합니다:
- `mlx-proxy.py`를 launchd 데몬으로(`:1240`에서 TTS/STT/MLX 모델 제공)
- `mic-level.py`를 헤드리스 LaunchAgent로(마이크 레벨 모니터, 터미널 창 없음)
- `kokoro-tts-server.py`(Kokoro 독일어 TTS, `df_eva`)

**Kokoro 빌드(일회성):** `plugins/hermes-sekretaerin/BUILD_kokoro.md`를 참조하세요. `cmake`, `espeak-ng` 헤더, 그리고 `ggml`/`highway` 서브모듈이 필요합니다.

**마이크 권한:** macOS *시스템 설정 → 개인정보 보호 및 보안 → 마이크*에서 헬퍼에 한 번 접근 권한을 부여하세요.

---

설치 후:

```bash
source ~/.bashrc    # 셸 다시 로드(또는: source ~/.zshrc)
hermes              # 채팅을 시작하세요!
```

### 문제 해결

#### Windows Defender 또는 바이러스 백신이 uv.exe를 악성코드로 표시함

바이러스 백신(Bitdefender, Windows Defender 등)이 Hermes의 `bin` 폴더(`%LOCALAPPDATA%\hermes\bin\uv.exe`)에서 `uv.exe`를 격리한다면, 이는 **오탐**입니다. 해당 파일은 Astral의 `uv` — Hermes가 Python 환경을 관리하기 위해 번들한 Rust Python 패키지 관리자입니다. ML 기반 바이러스 백신 엔진은 패키지를 다운로드하고 설치하는 서명되지 않은 Rust 바이너리를 흔히 오탐합니다.

**복사본이 진짜인지 확인하려면:**

```powershell
# 필요시 GitHub CLI 설치
winget install --id GitHub.cli

# GitHub에 로그인
gh auth login

# 검증 실행
$uv = "$env:LOCALAPPDATA\hermes\bin\uv.exe"
$ver = (& $uv --version).Split(' ')[1]
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$zip = "$env:TEMP\uv.zip"
Invoke-WebRequest "https://github.com/astral-sh/uv/releases/download/$ver/uv-x86_64-pc-windows-msvc.zip" -OutFile $zip -UseBasicParsing
gh attestation verify $zip --repo astral-sh/uv
Expand-Archive $zip "$env:TEMP\uv_x" -Force
(Get-FileHash "$env:TEMP\uv_x\uv.exe").Hash -eq (Get-FileHash $uv).Hash
```

검증에서 "Verification succeeded"라고 표시되고 마지막 줄이 `True`를 출력하면 정상입니다.

**Hermes를 허용 목록에 추가하려면:**
- **Windows Defender:** PowerShell을 관리자로 실행 → `Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\hermes\bin"`
- **Bitdefender:** Bitdefender 콘솔에서 예외 추가(Protection > Antivirus > Settings > Manage Exceptions)
- 파일 해시가 아닌 **폴더**를 허용 목록에 추가하세요 — Hermes는 `uv`를 업데이트하며 해시는 버전마다 바뀝니다

자세한 내용은 업스트림 Astral 보고서를 참조하세요: [astral-sh/uv#13553](https://github.com/astral-sh/uv/issues/13553), [astral-sh/uv#15011](https://github.com/astral-sh/uv/issues/15011), [astral-sh/uv#10079](https://github.com/astral-sh/uv/issues/10079).

---

## 시작하기

```bash
hermes              # 대화형 CLI — 대화 시작
hermes model        # LLM 제공업체 및 모델 선택
hermes tools        # 활성화할 도구 구성
hermes config set   # 개별 구성 값 설정
hermes config get   # 개별 구성 값 출력
hermes gateway      # 메시징 게이트웨이 시작(Telegram, Discord 등)
hermes setup        # 전체 설정 마법사 실행(한 번에 모든 것 구성)
hermes claw migrate # OpenClaw에서 마이그레이션(OpenClaw에서 오는 경우)
hermes update       # 최신 버전으로 업데이트
hermes doctor       # 문제 진단
```

📖 **[전체 문서 →](https://hermes-agent.nousresearch.com/docs/)**

---

## API 키 수집 건너뛰기 — Nous Portal

Hermes는 원하는 제공업체와 함께 동작합니다 — 이는 변하지 않습니다. 하지만 모델, 웹 검색, 이미지 생성, TTS, 클라우드 브라우저를 위해 별도의 API 키 5개를 수집하고 싶지 않다면, **[Nous Portal](https://portal.nousresearch.com)**이 하나의 구독으로 모두를 포괄합니다:

- **300개 이상의 모델** — `/model <name>`으로 그 중 하나 선택
- **Tool Gateway** — 웹 검색(Firecrawl), 이미지 생성(FAL), 텍스트 음성 변환(OpenAI), 클라우드 브라우저(Browser Use)가 모두 구독을 통해 라우팅됩니다. 추가 계정 불필요.

새 설치에서 단 한 줄의 명령:

```bash
hermes setup --portal
```

이것은 OAuth를 통해 로그인하고, Nous를 제공업체로 설정하며, Tool Gateway를 켭니다. 연결된 항목은 언제든 `hermes portal info`로 확인하세요. 자세한 내용은 [Tool Gateway 문서 페이지](https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway)를 참조하세요.

원할 때마다 도구별로 직접 키를 가져올 수도 있습니다 — 게이트웨이는 백엔드별이며 전부 아니면 전무가 아닙니다.

---

## CLI vs 메시징 빠른 참조

Hermes에는 두 가지 진입점이 있습니다: `hermes`로 터미널 UI를 시작하거나, 게이트웨이를 실행하고 Telegram, Discord, Slack, WhatsApp, Signal, Email에서 대화할 수 있습니다. 한 번 대화에 들어가면 많은 슬래시 명령이 두 인터페이스에서 공유됩니다.

| 작업 | CLI | 메시징 플랫폼 |
| ------------------------------ | --------------------------------------------- | -------------------------------------------------------------------------------- |
| 채팅 시작 | `hermes` | `hermes gateway setup` + `hermes gateway start` 실행 후 봇에 메시지 전송 |
| 새 대화 시작 | `/new` 또는 `/reset` | `/new` 또는 `/reset` |
| 모델 변경 | `/model [provider:model]` | `/model [provider:model]` |
| 페르소나 설정 | `/personality [name]` | `/personality [name]` |
| 마지막 턴 재시도 또는 취소 | `/retry`, `/undo` | `/retry`, `/undo` |
| 컨텍스트 압축 / 사용량 확인 | `/compress`, `/usage`, `/insights [--days N]` | `/compress`, `/usage`, `/insights [days]` |
| 스킬 탐색 | `/skills` 또는 `/<skill-name>` | `/<skill-name>` |
| 현재 작업 중단 | `Ctrl+C` 또는 새 메시지 전송 | `/stop` 또는 새 메시지 전송 |
| 플랫폼별 상태 | `/platforms` | `/status`, `/sethome` |

전체 명령 목록은 [CLI 가이드](https://hermes-agent.nousresearch.com/docs/user-guide/cli)와 [메시징 게이트웨이 가이드](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)를 참조하세요.

---

## 문서

모든 문서는 **[hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs)**에 있습니다:

| 섹션 | 다루는 내용 |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [빠른 시작](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart) | 설치 → 설정 → 2분 안에 첫 대화 |
| [CLI 사용법](https://hermes-agent.nousresearch.com/docs/user-guide/cli) | 명령, 키 바인딩, 페르소나, 세션 |
| [구성](https://hermes-agent.nousresearch.com/docs/user-guide/configuration) | 구성 파일, 제공업체, 모델, 모든 옵션 |
| [메시징 게이트웨이](https://hermes-agent.nousresearch.com/docs/user-guide/messaging) | Telegram, Discord, Slack, WhatsApp, Signal, Home Assistant |
| [보안](https://hermes-agent.nousresearch.com/docs/user-guide/security) | 명령 승인, DM 페어링, 컨테이너 격리 |
| [도구 및 툴셋](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools) | 40개 이상의 도구, 툴셋 시스템, 터미널 백엔드 |
| [스킬 시스템](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills) | 절차적 메모리, Skills Hub, 스킬 생성 |
| [메모리](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory) | 영속 메모리, 사용자 프로필, 모범 사례 |
| [MCP 통합](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp) | 확장 기능을 위해 모든 MCP 서버 연결 |
| [Cron 스케줄링](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron) | 플랫폼 배송이 포함된 예약 작업 |
| [컨텍스트 파일](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files) | 모든 대화를 형성하는 프로젝트 컨텍스트 |
| [아키텍처](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture) | 프로젝트 구조, 에이전트 루프, 주요 클래스 |
| [기여](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing) | 개발 설정, PR 프로세스, 코드 스타일 |
| [CLI 참조](https://hermes-agent.nousresearch.com/docs/reference/cli-commands) | 모든 명령 및 플래그 |
| [환경 변수](https://hermes-agent.nousresearch.com/docs/reference/environment-variables) | 전체 환경 변수 참조 |

---

## OpenClaw에서 마이그레이션

OpenClaw에서 오신 경우, Hermes는 설정, 메모리, 스킬, API 키를 자동으로 가져올 수 있습니다.

**최초 설정 중:** 설정 마법사(`hermes setup`)는 `~/.openclaw`를 자동으로 감지하고 구성 시작 전에 마이그레이션을 제안합니다.

**설치 후 언제든:**

```bash
hermes claw migrate              # 대화형 마이그레이션(전체 프리셋)
hermes claw migrate --dry-run    # 마이그레이션될 항목 미리보기
hermes claw migrate --preset user-data   # 비밀 없이 마이그레이션
hermes claw migrate --overwrite  # 기존 충돌 덮어쓰기
```

가져오는 항목:

- **SOUL.md** — 페르소나 파일
- **메모리** — MEMORY.md 및 USER.md 항목
- **스킬** — 사용자가 만든 스킬 → `~/.hermes/skills/openclaw-imports/`
- **명령 허용 목록** — 승인 패턴
- **메시징 설정** — 플랫폼 구성, 허용된 사용자, 작업 디렉토리
- **API 키** — 허용 목록에 등록된 비밀(Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs)
- **TTS 자산** — 워크스페이스 오디오 파일
- **워크스페이스 지침** — AGENTS.md(`--workspace-target` 포함)

모든 옵션은 `hermes claw migrate --help`를 참조하거나, dry-run 미리보기가 포함된 대화형 에이전트 안내 마이그레이션을 위해 `openclaw-migration` 스킬을 사용하세요.

---

## 기여

기여를 환영합니다! 개발 설정, 코드 스타일, PR 프로세스는 [기여 가이드](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing)를 참조하세요.

기여자를 위한 빠른 시작 — 표준 설치 프로그램을 사용한 다음, 생성된 전체 git 체크아웃 `$HERMES_HOME/hermes-agent`(보통 `~/.hermes/hermes-agent`)에서 작업하세요. 이는 `hermes update`, 관리형 venv, 지연 종속성, 게이트웨이, 문서 도구에서 사용하는 레이아웃과 일치합니다.

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
cd "${HERMES_HOME:-$HOME/.hermes}/hermes-agent"
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

수동 클론 폴백(관리형 설치 레이아웃을 의도적으로 원하지 않는 일회용 클론/CI용):

클론한 소스 트리 외부에 venv를 만드세요 — 에이전트가 작동하는 디렉토리 내부의 venv는 에이전트가 자신의 체크아웃에 대해 실행하는 상대 경로 명령에 의해 삭제되어 세션 중에 실행 중인 런타임을 파괴할 수 있습니다.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv ~/.hermes/venvs/hermes-dev --python 3.11
source ~/.hermes/venvs/hermes-dev/bin/activate
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

---

## 커뮤니티

- 💬 [Discord](https://discord.gg/NousResearch)
- 📚 [Skills Hub](https://agentskills.io)
- 🐛 [Issues](https://github.com/NousResearch/hermes-agent/issues)
- 🔌 [computer-use-linux](https://github.com/avifenesh/computer-use-linux) — AT-SPI 접근성 트리, Wayland/X11 입력, 스크린샷, 컴포지터 창 타겟팅을 갖춘 Hermes 및 기타 MCP 호스트용 Linux 데스크톱 제어 MCP 서버.
- 🔌 [HermesClaw](https://github.com/AaronWong1999/hermesclaw) — 커뮤니티 WeChat 브리지: 동일한 WeChat 계정에서 Hermes Agent와 OpenClaw를 실행.

---

## 라이선스

MIT — [LICENSE](LICENSE)를 참조하세요.

[Nous Research](https://nousresearch.com)가 제작했습니다.
