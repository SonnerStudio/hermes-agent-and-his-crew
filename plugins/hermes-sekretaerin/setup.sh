#!/usr/bin/env bash
# Hermes-Sekretärin — Installations-Skript
#
# Richtet die sprachgesteuerte Audio-Kommunikation mit dem Hermes-Agenten ein:
#   - MLX-Runtime-Proxy (TTS/STT/Modell auf :1240)
#   - Mikrofon-Pegel-Helfer (headless LaunchAgent, keine Terminal-Popups)
#   - Kokoro TTS (deutsche Stimme df_eva) — sofern kokoro-cli gebaut ist
#
# Aufruf:  bash plugins/hermes-sekretaerin/setup.sh
set -euo pipefail

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOME_DIR="${HOME:-/Users/m4janfriske}"
LAUNCH_DIR="$HOME_DIR/Library/LaunchAgents"

echo "==> Hermes-Sekretärin Setup"
echo "    Plugin: $PLUGIN_DIR"

# 1) mlx-proxy als LaunchAgent (läuft als Daemon, startet MLX-Modelle lazy)
cat > "$LAUNCH_DIR/com.jan.mlx-proxy.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.jan.mlx-proxy</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/m4janfriske/.hermes/hermes-agent/venv/bin/python3</string>
        <string>$PLUGIN_DIR/mlx-proxy.py</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>WorkingDirectory</key>
    <string>$HOME_DIR</string>
    <key>StandardOutPath</key>
    <string>$HOME_DIR/.hermes/logs/mlx-proxy.out.log</string>
    <key>StandardErrorPath</key>
    <string>$HOME_DIR/.hermes/logs/mlx-proxy.err.log</string>
</dict>
</plist>
PLIST
echo "    [ok] com.jan.mlx-proxy.plist"

# 2) Mic-Helfer LaunchAgent (headless, im User-Kontext -> TCC-Mikrofonfreigabe)
cp "$PLUGIN_DIR/mic-level.launchagent.plist" "$LAUNCH_DIR/com.jan.mic-level.plist"
echo "    [ok] com.jan.mic-level.plist"

# 3) kokoro-cli prüfen — falls nicht gebaut, Hinweis geben
KOKORO_CLI="/tmp/kokoro.cpp/build/kokoro-cli"
if [ -x "$KOKORO_CLI" ]; then
    echo "    [ok] kokoro-cli gefunden ($KOKORO_CLI)"
else
    echo "    [warn] kokoro-cli nicht gebaut — deutsche TTS funktioniert erst nach Build."
    echo "           Build: siehe plugins/hermes-sekretaerin/BUILD_kokoro.md"
fi

# 4) LaunchAgents laden
launchctl load -w "$LAUNCH_DIR/com.jan.mlx-proxy.plist" 2>/dev/null || true
echo "==> Fertig. Proxy startet via launchd (KeepAlive)."
echo "    Hermes-Sekretärin-Button (Mic) in der Composer-Leiste aktiviert die Funktion."
