# Implementationsplan: 4 Composer-Buttons (Sub-Agenten-Funktionen)

**Stand:** 2026-08-02 · **Autor:** Hermes-Sekretärin (Jan Friske / SonnerStudio)
**Grundlage:** Tests `test_composer_rpc.py` (12 passed, 1 xfailed) + Code-Analyse `mlx-proxy.py` / `composer-actions.tsx`

---

## 0. Aktueller Ist-Stand (aus Tests + Code)

| Button | Methode | Aktuelles Verhalten | Lücke |
|--------|---------|---------------------|-------|
| 1 | `subagent_orchestration.toggle` | Setzt nur State-Flag (`_button_state`), kein Script | **Keine Sub-Agenten werden gestartet** (xfail-Test belegt es) |
| 2 | `voice_comms.toggle` | Startet `voice_comms.py` (Mic-Monitor + TTS) | Funktioniert, aber: keine "Managerin"-Rolle verdrahtet |
| 3 | `orchestration.toggle` | Nur State-Flag | **Kein Klonen/Verteilen implementiert** |
| 4 | `double_mode.toggle` | Nur State-Flag | **Keine Harmonisierung/Synchronisierung** |

**Getestete Fehlerquellen (müssen im Plan behoben werden):**
- `bool("false")` → `True` (String-"false" ist truthy!). Renderer darf **nur echte Booleans** senden; Proxy sollte `active` strikt als `bool` casten (`isinstance` + explizite Behandlung).
- `bool(0)` → `False`, `bool("true")` → `True` — inkonsistent bei Typ-Mix.
- Buttons 1/3/4 haben `script: None` → **nur Flag, keine Aktion**.

---

## 1. Button 1 — „Sub-Agenten aktivieren" (Sub-Agent-Engine)

**Ziel (aus Beschreibung):** Aktiviert die spezialisierten KI-Sub-Agenten, die
sich eigenständig Teilaufgaben vornehmen, über Spezialfähigkeiten verfügen,
selbsttätig lernen (mit Aufgaben + Zeit), wie Hermes Agent insgesamt.

**Umsetzung:**
1. Proxy `handle_rpc` erhält bei `subagent_orchestration.toggle` mit `active=True`
   einen echten Hook `_spawn_subagent_engine()` (ersetzt den xfail-Test).
2. Die Engine lädt die vorhandenen Sub-Agent-Skills
   (`web-search`, `planner`, `image-generator`, `audio-generator`, `coder`) und
   registriert sie als verfügbare Spezialisten im `delegate_task`-Pool.
3. **Lernen:** Jeder Sub-Agent schreibt nach getaner Arbeit ein kurzes
   Erfahrungs-Log nach `~/.hermes/subagents/<name>/learnings.json`
   (was klappte, was nicht) — persistenter Gedächtnis-Fortschritt.
4. **Orchestrierung:** Aktive Sub-Agenten werden dem `delegate_task`-Broker
   gemeldet (Topologie-Publishing an `/orchestration`), damit Button 4 sie
   harmonisieren kann.

**Tests (neu/erweitert):**
- `test_button1_spawns_subagent` → **xfail wird zu passed** (Hook existiert).
- `test_button1_registers_specialists` → Engine meldet N Spezialisten.
- `test_button1_learning_log_written` → `learnings.json` wird nach Task erzeugt.

---

## 2. Button 2 — „Secretary / Sekretärin" (Managerin + Sprach-I/O)

**Ziel:** Die Managerin der Agenten. Plant + teilt Aufgaben für die Agenten ein.
Als Kommunikatorin: Sprachmodus zur Programmierung per Spracheingabe/-ausgabe,
Audioausgabe in Filmqualität (Kokoro `df_eva`, speed 0.9).

**Umsetzung:**
1. `voice_comms.py` (bereits startbar) wird zur **Managerin** erweitert:
   - Empfängt delegierte Aufgaben von Button 1.
   - Plant sie (nutzt `planner`-Skill) und teilt sie den Sub-Agenten zu.
   - Steuert Button 4 (Harmonisierung) mit, wenn sie aktiv ist.
2. **Sprach-I/O bleibt:** Whisper-STT (Eingabe) + Kokoro-TTS `df_eva` speed 0.9
   (Ausgabe, „filmreif") — unverändert, aber als **Kommunikationskanal der
   Managerin** gekleidet (sie spricht Aufgabenstatus an).
3. **Mehrsprachigkeit:** Label „Secretary" (EN) / „Sekretärin" (DE) aus `i18n.ts`
   — bereits vorhanden, nur Bestätigung.

**Tests (neu):**
- `test_secretary_plans_and_assigns` → bei aktivem Button 2 + Button 1 wird ein
  Plan erzeugt und Sub-Agenten zugewiesen.
- `test_secretary_tts_quality_flag` → TTS-Server wird mit `df_eva` + speed 0.9
  aufgerufen (Mock des TTS-Calls, prüfe Parameter).

---

## 3. Button 3 — „Temporäres Klonen" (Vervielfältigung gleichartiger Aufgaben)

**Ziel:** Agenten können sich für die Dauer einer Aufgabe temporär vervielfältigen,
um gleichartige Aufgaben gleichzeitig zu bearbeiten.

**Umsetzung:**
1. Proxy `handle_rpc` bei `orchestration.toggle` (Button 3) mit `active=True`
   aktiviert den **Clone-Modus** im `delegate_task`-Broker:
   - Gleichartige Tasks (selbe `goal`-Signatur) werden automatisch N-fach
     parallel gestartet ( analog `double_mode`, aber allgemein).
2. **Tempoäres Leben:** Klone existieren nur für die Task-Dauer; danach werden
   ihre `learnings.json` in den Eltern-Agenten gemergt und die Klone beendet.
3. **Limit:** `max_concurrent_children` aus `config.yaml` wird respektiert.

**Tests (neu):**
- `test_clone_mode_spawns_parallel` → bei gleicher goal-Signatur werden 2+ Tasks
  parallel gestartet (Mock-Broker zählt Spawns).
- `test_clone_learnings_merge_back` → nach Task-Ende wird Eltern-`learnings.json`
  um Klon-Erfahrung erweitert.
- `test_clone_respects_max_children` → mehr gleichartige Tasks als Limit → nur
  Limit viele parallel.

---

## 4. Button 4 — „Harmonisierung & Orchestrierung" (mit/ohne Sekretärin)

**Ziel:** Entweder harmonisiert/synchronisiert die Agenten nur innerhalb der
Aufgaben (ohne Sekretärin), ODER die Agenten werden von der Sekretärin gesteuert
und mit ihr gemeinsam harmonisiert/synchronisiert/orkestriert (wenn Sekretärin an).

**Umsetzung:**
1. Proxy `handle_rpc` bei `double_mode.toggle` (Button 4) mit `active=True`:
   - Prüft `voice_comms`-Flag (Button 2).
   - **Button 2 AUS:** Agenten harmonisieren sich untereinander (peer-to-peer
     Sync über `/orchestration` Topology; jeder Agent meldet Fortschritt,
     Konflikte werden per Majority-Vote gelöst).
   - **Button 2 AN:** Sekretärin übernimmt die Steuerung — sie orchestriert die
     Harmonisierung (zieht Agenten zusammen, synchronisiert über ihren Plan).
2. **Harmonisierungsgrad:** Ø `progress` der laufenden Agenten (aus `/orchestration`)
   → HUD zeigt % (bereits im Frontend vorhanden, siehe `orchestration-harmony`).
3. **Synchronisation:** Bei Task-Übergabe wird Shared-State (learnings, Zwischen-
   ergebnisse) zwischen Agenten repliziert.

**Tests (neu):**
- `test_harmonize_without_secretary` → Button 4 + Button 1, Button 2 AUS →
  Peer-Sync läuft (Mock: Topology zeigt 2 Agenten mit gleichem progress).
- `test_harmonize_with_secretary` → Button 4 + Button 2 AN → Sekretärin ist in
  Topology als Steuer-Agent verankert (`status: "orchestrator"`).
- `test_harmony_percentage` → Ø progress wird korrekt aus Agentenliste berechnet.

---

## 5. Gemeinsame Korrekturen (aus Test-Ergebnissen)

1. **Strikter `active`-Cast in `handle_rpc`:**
   ```python
   raw = params.get("active")
   if isinstance(raw, str):
       active = raw.strip().lower() in ("1", "true", "yes", "on")
   elif isinstance(raw, int):
       active = raw != 0
   else:
       active = bool(raw)
   ```
   → behebt `bool("false")`=True und `bool(0)`=False-Inkonsistenz.
2. **Renderer-Check:** `composer-actions.tsx` sendet nur echte Booleans
   (`params: {active: bool}`), nie Strings.
3. **Button-Label Button 1** → bereits auf „Sub-Agenten aktivieren" gepatcht ✓.

---

## 6. Build + asar repacken (Abschluss)

Nach allen Code-Änderungen (Proxy + Frontend + i18n + Tests):

1. **Desktop App bauen:**
   ```bash
   cd /Users/m4janfriske/.hermes/hermes-agent/apps/desktop
   source /Users/m4janfriske/.hermes/node/bin/activate   # falls nötig
   npm run build        # tsc + hermes-ink bundle
   npm run check        # typecheck + eslint (lint-Stage MUSS grün sein)
   ```
2. **asar repacken (manuell, da launchd KeepAlive den Proxy sonst killt):**
   ```bash
   # launchd auto-restart temporär deaktivieren
   launchctl unload ~/Library/LaunchAgents/com.jan.mlx-proxy.plist 2>/dev/null
   # app.asar extract → dist ersetzen → pack
   npx @electron/asar extract app.asar /tmp/asar_edit
   cp -r dist/* /tmp/asar_edit/dist/
   npx @electron/asar pack /tmp/asar_edit app.asar
   # launchd wieder aktivieren
   launchctl load ~/Library/LaunchAgents/com.jan.mlx-proxy.plist
   ```
3. **Proxy neu starten** (damit neue RPC-Handler aktiv sind):
   ```bash
   launchctl kickstart -k gui/$(id -u)/com.jan.mlx-proxy
   ```
4. **Smoke-Test:** Desktop öffnen → 4 Buttons sichtbar, Farben
   (rot/gelb/grün), Sprachwahl (🌐) zeigt RUN + alle 35 Sprachen.

---

## 7. Test-Checkliste (vor Push)

- [ ] `test_composer_rpc.py` → 12 passed, **xfail aufgelöst** (Button 1 spawn)
- [ ] Neue Tests für Button 2/3/4 grün
- [ ] `npm run check` (lint-Stage) grün
- [ ] `npx vitest run` (i18n + composer) grün
- [ ] Manuelle Sichtprüfung im laufenden Desktop

---

## 8. Commit + Push (Datenplatte-Clone)

Alle Änderungen landen im Datenplatte-Clone
(`/Volumes/Datenplatte/HermesAgentProjekt/repo-mirror/hermes-agent-and-his-crew`),
werden committet und via frischem Token gepusht. **Kein** Commit im lokalen
`~/.hermes/hermes-agent`-Clone (Bucket-Versehen vom 2026-08-02 behoben).
