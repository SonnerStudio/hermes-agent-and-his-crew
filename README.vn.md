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
  <a href="README.vn.md"><img src="https://img.shields.io/badge/Lang-Ti%E1%BA%BFng%20Vi%E1%BB%87t-blueviolet?style=for-the-badge" alt="Tiếng Việt"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/Lang-English-lightgrey?style=for-the-badge" alt="English"></a>
</p>

> **Ngôn ngữ:** Bản README này có sẵn bằng [Deutsch](README.de.md), [Français](README.fr.md), [Español](README.es.md), [Nederlands](README.nl.md), và [Tiếng Việt](README.vn.md). Ứng dụng desktop có trình chọn ngôn ngữ tích hợp sẵn (🌐) với các ngôn ngữ này và nhiều hơn nữa.

**Bản fork SonnerStudio của Hermes Agent từ Nous Research** — agent AI tự cải thiện (self-improving), được mở rộng với một **Hermes Thư Ký** điều khiển bằng giọng nói và một **Composer-Control-HUD** trực quan để điều phối các tiểu-agent (sub-agent).

Bản fork này bổ sung:

- **Nút điều khiển Composer (Composer Control Buttons)** — bốn nút chuyển đổi (toggle) trong composer của desktop (điều phối tiểu-agent, giao tiếp giọng nói, chế độ điều phối, chế độ kép) với màu trạng thái trực tiếp (đỏ = không hoạt động, vàng = đang cung cấp/dựng, xanh lá = đang hoạt động).
- **Orchestration HUD** — bốn bảng trực tiếp có viền màu xanh dương bên dưới ô nhập composer: *Đội ngũ tiểu-agent (Sub-Agent Team)*, *Hermes Thư Ký (Giao tiếp âm thanh)*, *Các agent nhân bản (Cloned Agents)*, và *Sự hài hòa và tải agent (Harmonisierung & Agentenauslastung)*. Các bảng chỉ xuất hiện khi một tác vụ thực sự đang chạy — không có trình giữ chỗ (placeholder) giả lập.
- **Hermes Thư Ký (Hermes Secretary)** — một lớp giọng nói cho phép bạn nói chuyện với agent. TTS tiếng Đức qua **Kokoro** (`df_eva`, nữ, tốc độ filmreif 0.9), STT qua Whisper, và một trình giám sát mức micrô không giao diện (headless, không có cửa sổ terminal hiện lên). Agent có thể ủy quyền cho các tiểu-agent thực hiện các yêu cầu bằng lời nói.
- **MLX Runtime Proxy** — một proxy lazy cục bộ (`:1240`) phục vụ lần lượt các mô hình Kokoro TTS, Whisper STT, và MLX chat, để Mac mini 16 GB luôn nằm trong giới hạn RAM.

> **Lưu ý:** Runtime MLX, Kokoro TTS tiếng Đức và đường ống giọng nói (voice pipeline) của Hermes Thư Ký được tinh chỉnh cho Apple Silicon (macOS). Xem `plugins/hermes-sekretaerin/` để biết cách thiết lập.

---

## Cài Đặt Nhanh

### Linux, macOS, WSL2, Termux

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows (nguyên bản, PowerShell)

> **Lưu ý:** Windows nguyên bản chạy Hermes mà không cần WSL — CLI, gateway, TUI, và các công cụ đều hoạt động nguyên bản. Nếu bạn muốn dùng WSL2, lệnh một dòng cho Linux/macOS ở trên cũng hoạt động ở đó. Tìm thấy lỗi? Hãy [báo lỗi](https://github.com/NousResearch/hermes-agent/issues).

Chạy lệnh này trong PowerShell:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Trình cài đặt xử lý mọi thứ: uv, Python 3.11, Node.js, ripgrep, ffmpeg, **và một Git Bash di động** (MinGit, được giải nén vào `%LOCALAPPDATA%\hermes\git` — không cần quyền admin, hoàn toàn tách biệt khỏi mọi bản cài đặt Git hệ thống). Hermes sử dụng Git Bash đi kèm này để chạy các lệnh shell.

Nếu bạn đã cài đặt Git, trình cài đặt sẽ phát hiện và sử dụng nó thay thế. Nếu không, bạn chỉ cần tải về MinGit ~45MB — nó sẽ không động chạm hay can thiệp vào bất kỳ Git hệ thống nào.

> **Android / Termux:** Đường dẫn thủ công đã được kiểm thử được ghi chép trong [hướng dẫn Termux](https://hermes-agent.nousresearch.com/docs/getting-started/termux). Trên Termux, Hermes cài đặt một extra `.[termux]` được tuyển chọn vì extra `.[all]` đầy đủ hiện kéo theo các phần phụ thuộc giọng nói không tương thích với Android.
>
> **Windows:** Windows nguyên bản được hỗ trợ đầy đủ — lệnh một dòng PowerShell ở trên cài đặt mọi thứ. Nếu bạn muốn dùng WSL2, lệnh Linux cũng hoạt động ở đó. Cài đặt Windows nguyên bản nằm dưới `%LOCALAPPDATA%\hermes`; WSL2 cài đặt dưới `~/.hermes` như trên Linux.

---

## Thiết Lập Hermes Thư Ký (Phần mở rộng SonnerStudio)

Lớp giọng nói nằm trong `plugins/hermes-sekretaerin/`:

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

Lệnh này cài đặt:
- `mlx-proxy.py` dưới dạng daemon launchd (phục vụ các mô hình TTS/STT/MLX trên `:1240`)
- `mic-level.py` dưới dạng LaunchAgent không giao diện (trình giám sát mức micrô, không có cửa sổ terminal)
- `kokoro-tts-server.py` (Kokoro TTS tiếng Đức, `df_eva`)

**Build Kokoro (một lần):** xem `plugins/hermes-sekretaerin/BUILD_kokoro.md`. Yêu cầu `cmake`, headers `espeak-ng`, và các submodule `ggml`/`highway`.

**Quyền micrô:** cấp quyền truy cập macOS *System Settings → Privacy & Security → Microphone* cho helper một lần.

---

Sau khi cài đặt:

```bash
source ~/.bashrc    # tải lại shell (hoặc: source ~/.zshrc)
hermes              # bắt đầu trò chuyện!
```

### Xử Lý Sự Cố

#### Windows Defender hoặc phần mềm diệt virus gắn cờ `uv.exe` là mã độc

Nếu phần mềm diệt virus (Bitdefender, Windows Defender, v.v.) cách ly `uv.exe` từ thư mục `bin` của Hermes (`%LOCALAPPDATA%\hermes\bin\uv.exe`), đây là một **báo động giả (false positive)**. Tệp này là `uv` của Astral — trình quản lý gói Python viết bằng Rust mà Hermes đóng gói để quản lý môi trường Python của nó. Các công cụ diệt virus dựa trên ML thường gắn cờ các tệp nhị phân Rust chưa ký mà tải xuống và cài đặt các gói.

**Để xác minh bản sao của bạn là xác thực:**

```powershell
# Cài đặt GitHub CLI nếu cần
winget install --id GitHub.cli

# Đăng nhập GitHub
gh auth login

# Chạy xác minh
$uv = "$env:LOCALAPPDATA\hermes\bin\uv.exe"
$ver = (& $uv --version).Split(' ')[1]
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$zip = "$env:TEMP\uv.zip"
Invoke-WebRequest "https://github.com/astral-sh/uv/releases/download/$ver/uv-x86_64-pc-windows-msvc.zip" -OutFile $zip -UseBasicParsing
gh attestation verify $zip --repo astral-sh/uv
Expand-Archive $zip "$env:TEMP\uv_x" -Force
(Get-FileHash "$env:TEMP\uv_x\uv.exe").Hash -eq (Get-FileHash $uv).Hash
```

Nếu xác thực hiện thị "Verification succeeded" và dòng cuối in ra `True`, bạn đã ổn.

**Để đưa Hermes vào danh sách cho phép (whitelist):**

- **Windows Defender:** Chạy PowerShell với quyền Admin → `Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\hermes\bin"`
- **Bitdefender:** Thêm một ngoại lệ trong bảng điều khiển Bitdefender (Protection > Antivirus > Settings > Manage Exceptions)
- Đưa **thư mục** vào danh sách cho phép, không phải giá trị băm tệp — Hermes cập nhật `uv` và giá trị băm thay đổi mỗi phiên bản

Để biết thêm ngữ cảnh, xem các báo cáo upstream của Astral: [astral-sh/uv#13553](https://github.com/astral-sh/uv/issues/13553), [astral-sh/uv#15011](https://github.com/astral-sh/uv/issues/15011), [astral-sh/uv#10079](https://github.com/astral-sh/uv/issues/10079).

---

## Bắt Đầu

```bash
hermes              # CLI tương tác — bắt đầu một cuộc trò chuyện
hermes model        # Chọn nhà cung cấp LLM và mô hình của bạn
hermes tools        # Cấu hình các công cụ được bật
hermes config set   # Đặt các giá trị cấu hình riêng lẻ
hermes config get   # In ra các giá trị cấu hình riêng lẻ
hermes gateway      # Khởi động messaging gateway (Telegram, Discord, v.v.)
hermes setup        # Chạy trình hướng dẫn thiết lập đầy đủ (cấu hình mọi thứ cùng lúc)
hermes claw migrate # Di chuyển từ OpenClaw (nếu đến từ OpenClaw)
hermes update       # Cập nhật lên phiên bản mới nhất
hermes doctor       # Chẩn đoán bất kỳ sự cố nào
```

📖 **[Tài liệu đầy đủ →](https://hermes-agent.nousresearch.com/docs/)**

---

## Bỏ Qua Việc Thu Thập API Key — Nous Portal

Hermes hoạt động với bất kỳ nhà cung cấp nào bạn muốn — điều đó không thay đổi. Nhưng nếu bạn không muốn thu thập năm khóa API riêng biệt cho mô hình, tìm kiếm web, tạo hình ảnh, TTS, và một trình duyệt đám mây, thì **[Nous Portal](https://portal.nousresearch.com)** bao phủ tất cả chúng trong một gói đăng ký:

- **300+ mô hình** — chọn bất kỳ mô hình nào với `/model <name>`
- **Tool Gateway** — tìm kiếm web (Firecrawl), tạo hình ảnh (FAL), văn bản-thành-giọng-nói (OpenAI), trình duyệt đám mây (Browser Use), tất cả được định tuyến qua gói đăng ký của bạn. Không cần thêm tài khoản nào.

Một lệnh từ cài đặt mới:

```bash
hermes setup --portal
```

Lệnh này đăng nhập bạn qua OAuth, đặt Nous làm nhà cung cấp của bạn, và bật Tool Gateway. Kiểm tra những gì được kết nối bất cứ lúc nào với `hermes portal info`. Chi tiết đầy đủ trên [trang tài liệu Tool Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway).

Bạn vẫn có thể mang khóa riêng của mình cho từng công cụ bất cứ khi nào bạn muốn — gateway là theo từng backend, không phải tất-cả-hoặc-không-gì.

---

## Tham Chiếu Nhanh CLI so với Tin Nhắn

Hermes có hai điểm vào: bắt đầu giao diện terminal với `hermes`, hoặc chạy gateway và nói chuyện với nó từ Telegram, Discord, Slack, WhatsApp, Signal, hoặc Email. Khi bạn đã vào một cuộc trò chuyện, nhiều lệnh slash được chia sẻ trên cả hai giao diện.

| Hành động                              | CLI                                           | Các nền tảng tin nhắn                                                              |
| -------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------- |
| Bắt đầu trò chuyện                    | `hermes`                                      | Chạy `hermes gateway setup` + `hermes gateway start`, sau đó gửi tin nhắn cho bot |
| Bắt đầu cuộc trò chuyện mới           | `/new` hoặc `/reset`                          | `/new` hoặc `/reset`                                                              |
| Đổi mô hình                           | `/model [provider:model]`                     | `/model [provider:model]`                                                         |
| Đặt một tính cách                     | `/personality [name]`                         | `/personality [name]`                                                             |
| Thử lại hoặc hoàn tác lượt cuối       | `/retry`, `/undo`                             | `/retry`, `/undo`                                                                 |
| Nén ngữ cảnh / kiểm tra sử dụng       | `/compress`, `/usage`, `/insights [--days N]` | `/compress`, `/usage`, `/insights [days]`                                         |
| Duyệt kỹ năng                         | `/skills` hoặc `/<skill-name>`                | `/<skill-name>`                                                                   |
| Ngắt công việc hiện tại               | `Ctrl+C` hoặc gửi một tin nhắn mới            | `/stop` hoặc gửi một tin nhắn mới                                                 |
| Trạng thái đặc thù nền tảng           | `/platforms`                                  | `/status`, `/sethome`                                                             |

Để biết danh sách lệnh đầy đủ, xem [hướng dẫn CLI](https://hermes-agent.nousresearch.com/docs/user-guide/cli) và [hướng dẫn Messaging Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging).

---

## Tài Liệu

Tất cả tài liệu đều nằm tại **[hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs)**:

| Phần                                                                                                | Nội dung được bao phủ                                       |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)                 | Cài đặt → thiết lập → cuộc trò chuyện đầu tiên trong 2 phút |
| [CLI Usage](https://hermes-agent.nousresearch.com/docs/user-guide/cli)                              | Lệnh, phím tắt, tính cách, phiên                            |
| [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)                | Tệp cấu hình, nhà cung cấp, mô hình, mọi tùy chọn           |
| [Messaging Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)                | Telegram, Discord, Slack, WhatsApp, Signal, Home Assistant  |
| [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)                          | Phê duyệt lệnh, ghép đôi DM, cách ly container              |
| [Tools & Toolsets](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools)            | 40+ công cụ, hệ thống toolset, backend terminal             |
| [Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)              | Bộ nhớ thủ tục, Skills Hub, tạo kỹ năng                     |
| [Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)                     | Bộ nhớ liên tục, hồ sơ người dùng, phương pháp hay nhất    |
| [MCP Integration](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)               | Kết nối bất kỳ MCP server nào để mở rộng khả năng           |
| [Cron Scheduling](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)              | Tác vụ được lập lịch với giao hàng nền tảng                |
| [Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)       | Bối cảnh dự án định hình mọi cuộc trò chuyện                |
| [Architecture](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture)             | Cấu trúc dự án, vòng lặp agent, các lớp chính               |
| [Contributing](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing)             | Thiết lập phát triển, quy trình PR, phong cách mã           |
| [CLI Reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)                  | Tất cả lệnh và cờ                                           |
| [Environment Variables](https://hermes-agent.nousresearch.com/docs/reference/environment-variables) | Tham chiếu biến môi trường đầy đủ                           |

---

## Di Chuyển Từ OpenClaw

Nếu bạn đến từ OpenClaw, Hermes có thể tự động nhập cài đặt, bộ nhớ, kỹ năng, và khóa API của bạn.

**Trong quá trình thiết lập lần đầu:** Trình hướng dẫn thiết lập (`hermes setup`) tự động phát hiện `~/.openclaw` và đề xuất di chuyển trước khi cấu hình bắt đầu.

**Bất cứ lúc nào sau khi cài đặt:**

```bash
hermes claw migrate              # Di chuyển tương tác (preset đầy đủ)
hermes claw migrate --dry-run    # Xem trước những gì sẽ được di chuyển
hermes claw migrate --preset user-data   # Di chuyển không có bí mật
hermes claw migrate --overwrite  # Ghi đè các xung đột hiện có
```

Những gì được nhập:

- **SOUL.md** — tệp persona
- **Memories** — các mục nhập MEMORY.md và USER.md
- **Skills** — kỹ năng do người dùng tạo → `~/.hermes/skills/openclaw-imports/`
- **Command allowlist** — các mẫu phê duyệt
- **Messaging settings** — cấu hình nền tảng, người dùng được phép, thư mục làm việc
- **API keys** — các bí mật trong danh sách cho phép (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs)
- **TTS assets** — tệp âm thanh workspace
- **Workspace instructions** — AGENTS.md (với `--workspace-target`)

Xem `hermes claw migrate --help` để biết tất cả các tùy chọn, hoặc sử dụng kỹ năng `openclaw-migration` để có một di chuyển có hướng dẫn agent tương tác với xem trước dry-run.

---

## Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! Xem [Hướng Dẫn Đóng Góp](https://hermes-agent.nousresearch.com/docs/developer-guide/contributing) để biết thiết lập phát triển, phong cách mã, và quy trình PR.

Bắt đầu nhanh cho người đóng góp — sử dụng trình cài đặt tiêu chuẩn, sau đó làm việc từ
bản checkout git đầy đủ mà nó tạo ra tại `$HERMES_HOME/hermes-agent` (thường là
`~/.hermes/hermes-agent`). Điều này khớp với bố cục được sử dụng bởi `hermes update`,
venv được quản lý, các phần phụ thuộc lazy, gateway, và công cụ tài liệu.

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
cd "${HERMES_HOME:-$HOME/.hermes}/hermes-agent"
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

Dự phòng clone thủ công (cho các clone dùng một lần/CI nơi bạn cố ý không
muốn bố cục cài đặt được quản lý):

Tạo venv bên ngoài cây mã nguồn đã clone — một venv bên trong thư mục
mà agent hoạt động có thể bị xóa bởi một lệnh đường dẫn tương đối mà agent chạy
chống lại chính bản checkout của nó, phá hủy runtime đang chạy giữa phiên.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv ~/.hermes/venvs/hermes-dev --python 3.11
source ~/.hermes/venvs/hermes-dev/bin/activate
uv pip install -e ".[all,dev]"
scripts/run_tests.sh
```

---

## Cộng Đồng

- 💬 [Discord](https://discord.gg/NousResearch)
- 📚 [Skills Hub](https://agentskills.io)
- 🐛 [Issues](https://github.com/NousResearch/hermes-agent/issues)
- 🔌 [computer-use-linux](https://github.com/avifenesh/computer-use-linux) — Linux desktop-control MCP server cho Hermes và các MCP host khác, với các cây truy cập AT-SPI, đầu vào Wayland/X11, ảnh chụp màn hình, và nhắm mục tiêu cửa sổ compositor.
- 🔌 [HermesClaw](https://github.com/AaronWong1999/hermesclaw) — Cầu nối WeChat cộng đồng: Chạy Hermes Agent và OpenClaw trên cùng một tài khoản WeChat.

---

## Giấy Phép

MIT — xem [LICENSE](LICENSE).

Được xây dựng bởi [Nous Research](https://nousresearch.com).
