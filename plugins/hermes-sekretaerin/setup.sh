#!/usr/bin/env bash
# Hermes-Sekretärin + SonnerStudio Addon — Einrichtungsroutine
#
# Richtet die Modell-Architektur ein:
#   1. MLX-Runtime Proxy (TTS/STT/MLX-Modelle auf :1240) — automatisch
#   2. MLX-Modell auto-setup (passend zum System, nach Genehmigung)
#   3. OpenRouter-Anmeldung — interaktiv (vom Anwender selbst)
#   4. Nous-Portal-Anmeldung — interaktiv (vom Anwender selbst)
#   5. Google AI Studio (Gemini) — interaktiv (vom Anwender selbst)
#
# Aufruf:  bash plugins/hermes-sekretaerin/setup.sh
set -euo pipefail

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOME_DIR="${HOME:-/Users/$(whoami)}"
LAUNCH_DIR="$HOME_DIR/Library/LaunchAgents"
HERMES_ENV="$HOME_DIR/.hermes/.env"
HERMES_DIR="$HOME_DIR/.hermes"

echo "==> SonnerStudio Addon Einrichtung"
echo "    Plugin: $PLUGIN_DIR"
echo ""

# ── 0) Verzeichnisse ───────────────────────────────────────────────
mkdir -p "$LAUNCH_DIR" "$HERMES_DIR/logs"

# ── 1) MLX-Runtime Proxy als LaunchAgent (automatisch) ──────────────
echo "==> [1/4] MLX-Runtime Proxy (TTS/STT/Modelle)"
cat > "$LAUNCH_DIR/com.jan.mlx-proxy.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.jan.mlx-proxy</string>
    <key>ProgramArguments</key>
    <array>
        <string>$HOME_DIR/.omni-venv/bin/python3</string>
        <string>$PLUGIN_DIR/mlx-proxy.py</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>WorkingDirectory</key>
    <string>$HOME_DIR</string>
    <key>StandardOutPath</key>
    <string>$HERMES_DIR/logs/mlx-proxy.out.log</string>
    <key>StandardErrorPath</key>
    <string>$HERMES_DIR/logs/mlx-proxy.err.log</string>
</dict>
</plist>
PLIST
echo "    [ok] com.jan.mlx-proxy.plist"

# Mic-Helfer LaunchAgent (headless, TCC-Mikrofonfreigabe im User-Kontext)
cp "$PLUGIN_DIR/mic-level.launchagent.plist" "$LAUNCH_DIR/com.jan.mic-level.plist"
echo "    [ok] com.jan.mic-level.plist"

# ── 2) MLX-Modell auto-setup (nach Genehmigung) ─────────────────────
echo ""
echo "==> [2/4] MLX-Modell einrichten"
echo "    Ein passendes MLX-Modell wird lokal installiert (ca. 4-7 GB)."
echo "    Das Modell läuft NUR lokal auf deinem Mac — keine Cloud-Kosten."
read -r -p "    MLX-Modell jetzt einrichten? [J/n] " _mlx_confirm
if [[ "${_mlx_confirm:-J}" =~ ^[JjJ]$ ]]; then
    echo "    Lade Qwen3-4b-MLX-8bit (optimal für 16 GB RAM, mit Speculative Decoding)…"
    # Modell via Hermes MLX-Native-Katalog discover/download
    if command -v hermes >/dev/null 2>&1; then
        hermes model pull "Qwen3-4b-MLX-8bit" 2>/dev/null || \
        echo "    [warn] Automatischer Download fehlgeschlagen — Modell manuell via Hermes-Modellauswahl laden."
    else
        echo "    [warn] 'hermes' nicht im PATH — Modell manuell in der Modellauswahl wählen."
    fi
    echo "    [ok] MLX-Modell-Setup veranlasst (lazy-load beim ersten Start)."
else
    echo "    [skip] MLX-Modell manuell in der Modellauswahl verfügbar."
fi

# ── 3) OpenRouter-Anmeldung (interaktiv) ─────────────────────────────
echo ""
echo "==> [3/5] OpenRouter-Anmeldung (vom Anwender selbst)"
echo "    Hole dir einen kostenlosen Key: https://openrouter.ai/keys"
read -r -p "    OpenRouter API-Key eingeben (oder Enter zum Überspringen): " _or_key
if [[ -n "$_or_key" ]]; then
    touch "$HERMES_ENV"
    # Key in .env schreiben (oder ersetzen)
    if grep -q "^OPENROUTER_API_KEY=" "$HERMES_ENV" 2>/dev/null; then
        sed -i '' "s|^OPENROUTER_API_KEY=.*|OPENROUTER_API_KEY=$_or_key|" "$HERMES_ENV"
    else
        printf '\nOPENROUTER_API_KEY=%s\n' "$_or_key" >> "$HERMES_ENV"
    fi
    echo "    [ok] OPENROUTER_API_KEY in ~/.hermes/.env gespeichert."
else
    echo "    [skip] OpenRouter später via 'hermes auth add openrouter' einrichten."
fi

# ── 4) Nous-Portal-Anmeldung (interaktiv) ────────────────────────────
echo ""
echo "==> [4/5] Nous-Portal-Anmeldung (vom Anwender selbst)"
echo "    Nous Research Portal: https://nousresearch.com (device_code OAuth)"
read -r -p "    Nous API-Key eingeben (oder Enter zum Überspringen): " _nous_key
if [[ -n "$_nous_key" ]]; then
    touch "$HERMES_ENV"
    if grep -q "^NOUS_API_KEY=" "$HERMES_ENV" 2>/dev/null; then
        sed -i '' "s|^NOUS_API_KEY=.*|NOUS_API_KEY=$_nous_key|" "$HERMES_ENV"
    else
        printf '\nNOUS_API_KEY=%s\n' "$_nous_key" >> "$HERMES_ENV"
    fi
    echo "    [ok] NOUS_API_KEY in ~/.hermes/.env gespeichert."
else
    echo "    [skip] Nous später via 'hermes auth add nous' einrichten."
fi

# ── 5) Google AI Studio (Gemini) ─────────────────────────────────────
echo ""
echo "==> [5/5] Google AI Studio (Gemini) — vom Anwender selbst"
echo "    API-Key: https://aistudio.google.com/apikey"
read -r -p "    Gemini API-Key eingeben (oder Enter zum Überspringen): " _gem_key
if [[ -n "$_gem_key" ]]; then
    touch "$HERMES_ENV"
    if grep -q "^GEMINI_API_KEY=" "$HERMES_ENV" 2>/dev/null; then
        sed -i '' "s|^GEMINI_API_KEY=.*|GEMINI_API_KEY=$_gem_key|" "$HERMES_ENV"
    else
        printf '\nGEMINI_API_KEY=%s\n' "$_gem_key" >> "$HERMES_ENV"
    fi
    echo "    [ok] GEMINI_API_KEY in ~/.hermes/.env gespeichert."
else
    echo "    [skip] Google AI Studio später via 'hermes auth add google' einrichten."
fi

# ── LaunchAgents laden ──────────────────────────────────────────────
echo ""
launchctl load -w "$LAUNCH_DIR/com.jan.mlx-proxy.plist" 2>/dev/null || true
launchctl load -w "$LAUNCH_DIR/com.jan.mic-level.plist" 2>/dev/null || true

echo "==> Fertig. Der Proxy startet via launchd (KeepAlive)."
echo "    Modellauswahl: Nous + OpenRouter + MLX-Runtime nativ (Dropdown)."
echo "    3 Modelle parallel nutzbar: OpenRouter (Haupt), Nous (Sekretärin), MLX (Sub-Agenten)."
echo "    Hermes-Sekretärin-Button (Mic) aktiviert die Sprachsteuerung."
