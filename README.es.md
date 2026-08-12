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
  <a href="README.md"><img src="https://img.shields.io/badge/Lang-English-lightgrey?style=for-the-badge" alt="English"></a>
</p>

**Un fork de SonnerStudio de [Hermes Agent](https://hermes-agent.nousresearch.com/) por Nous Research** — el agente de IA automejorable, extendido con una **Secretaria Hermes** pilotada por voz y un **HUD de control Composer** visual para orquestar subagentes.

Este fork añade:

- **Botones de control Composer** — cuatro botones de alternancia en el Composer de escritorio (orquestación de subagentes, comunicación de voz, modo de orquestación, modo doble) con colores de estado en vivo (rojo = inactivo, amarillo = aprovisionamiento, verde = activo).
- **HUD de orquestación** — cuatro paneles en vivo con borde azul bajo la entrada del Composer: *Equipo de Subagentes* (muestra solo agentes en ejecución), *Carga de la Secretaria Hermes* (niveles de altavoz/micro en lugar de carga de subagentes), *Agentes Clonados* (cuentas de clones modo doble), y *Harmonización y Carga de Agentes* (promedio de progreso solo agentes en ejecución). Los paneles aparecen solo con tarea real — sin placeholders demo.
- **Secretaria Hermes** — una capa de voz para hablar con el agente. TTS alemán mediante **cduvenhorst F5-TTS** (voz Serena, `q3_serena_warm_000.wav`, voz femenina alemana cálida, sin deriva de acento), STT mediante Whisper-small-MLX (alemán), y monitor de nivel de micrófono sin interfaz (compartición RAW PCM, sin popup de terminal visible). El agente puede delegar subagentes para ejecutar solicitudes habladas.
- **Proxy Runtime MLX** — un proxy local perezoso (`:1240`) que sirve F5-TTS, Whisper STT y modelos de chat MLX uno a la vez, para que el Mac mini de 16 GB se mantenga dentro de los límites de RAM.
- **Equipo Aprendizaje** — puntuaciones de aprendizaje en vivo para el Agente Hermes, la Secretaria y 8 especialistas subagentes (Búsqueda, Código, Imagen, Audio, Análisis, Planificación, Técnico, Estructuración) como barras de progreso compactas con puntuaciones reales provenientes de resultados de delegación.
- **Panel Último Éxito de Aprendizaje** — muestra el último logro de aprendizaje: qué agente (Agente Hermes, Secretaria Hermes, o uno de 8 subagentes), lo que se logró (topología, factor de clonación, unidades, latencia), y marcador de éxito.

> **Nota:** El runtime MLX, cduvenhorst F5-TTS alemán y el pipeline de voz de la Secretaria Hermes están ajustados para Apple Silicon (macOS). Ver `plugins/hermes-sekretaerin/` para configuración.

---

## Instalación Rápida

### Linux, macOS, WSL2, Termux

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows (nativo, PowerShell)

> **Advertencia:** Windows nativo ejecuta Hermes sin WSL — CLI, gateway, TUI y herramientas funcionan nativamente. Si prefieres WSL2, el comando Linux/macOS de arriba también funciona allí.

Ejecutar en PowerShell:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

El instalador maneja todo: uv, Python 3.11, Node.js, ripgrep, ffmpeg, **y un Git Bash portátil** (MinGit, descomprimido en `%LOCALAPPDATA%\hermes\git` — sin administrador requerido, completamente aislado de cualquier instalación Git del sistema). Hermes usa este Git Bash agrupado para comandos de shell.

Si ya tienes Git instalado, el instalador lo detecta y usa ese en su lugar. Si no, una descarga de ~45MB de MinGit es todo lo que necesitas — no toca ni interfiere con ninguna instalación Git del sistema.

> **Android / Termux:** El método manual probado está documentado en la [guía Termux](https://hermes-agent.nousresearch.com/docs/getting-started/termux). En Termux, Hermes instala un extra `.[termux]` curado porque el extra completo `.[all]` actualmente tira dependencias de voz incompatibles con Android.
>
> **Windows:** Windows nativo está completamente soportado — el one-liner de PowerShell arriba instala todo. Si prefieres WSL2, el comando Linux también funciona allí. La instalación nativa de Windows vive bajo `%LOCALAPPDATA%\hermes`; WSL2 bajo `~/.hermes` como en Linux.

---

## Configuración de la Secretaria Hermes (extensión SonnerStudio)

La capa de voz vive en `plugins/hermes-sekretaerin/` :

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

Esto instala:
- `mlx-proxy.py` como daemon launchd (sirve modelos TTS/STT/MLX en `:1240`)
- `mic-level.py` como LaunchAgent headless (monitor de nivel de micrófono, sin ventana de terminal)
- `f5-tts-server.py` (cduvenhorst F5-TTS alemán, voz Serena)

**Compilar F5-TTS (una vez):** ver `plugins/hermes-sekretaerin/BUILD_f5.md`. Requiere `cmake`, headers de `espeak-ng`, y los submódulos `ggml`/`highway`.

**Permiso de micrófono:** conceder una vez macOS *Ajustes del Sistema → Privacidad y Seguridad → Micrófono* para el helper.

---

## Selección de Idioma

La app de escritorio tiene un selector de idioma integrado (🌐) con alemán, inglés, francés, español, neerlandés y más idiomas de SonnerStudio.

---

## Estado Actual de Desarrollo (Agosto 2026)

### Completado Esta Sesión

1. **Pipeline de Voz Secretaria Restaurado**
   - Corregido `voice_comms.py` corrupción de indentación (edit interrumpido)
   - Umbral VAD 15 → 35 + mínimo 3 frames (suprime alucinaciones de ruido de casque BT)
   - Compartición RAW PCM mediante `mic-level.py` → `~/.hermes/mic-raw.pcm` (resuelve silencio BT HFP)
   - Dispositivo `:0` priorizado en `DEV_CANDIDATES` (entrada de audio real)
   - `_trigger_model_load()` dispara carga del modelo tras reinicio del proxy

2. **Estabilidad del Proxy**
   - `/health` HTTP 500 → 200 (psutil try/except + fallback sysctl)
   - Único LaunchAgent (`com.jan.mlx-proxy`) — agents duplicados/conflictivos eliminados
   - Autoinicio de arranque: cuando `voice_comms.toggle.active=true` → inicia mic-level + voice_comms
   - Incubación de subprocess directa (sin condiciones de carrera de launchctl)

3. **Rediseño HUD de Orquestación**
   - 4 tarjetas: Equipo de Subagentes, Carga de la Secretaria Hermes, Agentes Clonados, Harmonización
   - Equipo de Subagentes muestra SOLO agentes en ejecución (sin placeholder "listo" estático)
   - Panel de audio → "Carga de la Secretaria Hermes" (altavoz/micro, no carga de subagentes)
   - Las tarjetas comparten el ancho completo uniformemente (`flex-1 min-w-0`, sin wrap)

4. **Equipo Aprendizaje y Panel de Último Aprendizaje**
   - 8 especialistas de subagentes registrados: Búsqueda, Código, Imagen, Audio, Análisis, Planificación, Técnico, Estructuración
   - Duplicado "Especialista de Planificación" eliminado; Experto de Estructuración añadido
   - `secretary_memory.py`: `last_learning_event()` retorna el último outcome exitoso
   - Endpoint del proxy `/secretary-learning` emite `last_learning`
   - Frontend: Campo 1 = "Último Éxito de Aprendizaje" (etiqueta de agente + topología/clon/unidades/latencia + marcador de éxito)
   - Campos "Preferencias de Enrutamiento" y "Equipo Aprendizaje" eliminados

5. **Composer de Ancho Completo**
   - `--composer-width: 100%` (era `62rem`) — el Composer y el hilo usan el ancho completo entre menús laterales

6. **Todas las Puertas Lint/Type Pasaron**
   - `eslint` exit 0 en todos los archivos modificados
   - `tsc -p . --noEmit` exit 0
   - Python `py_compile` OK en `secretary_memory.py`, `mlx-proxy.py`

### Servicios en Ejecución (Verificados)

- mlx-proxy: PID 54356 (gestionado por launchd)
- voice_comms.py: PID 36659 (cduvenhorst F5-TTS, voz Serena)
- mic-level.py: PID 43150 (RAW PCM + JSON de nivel)
- whisper-stt: PID ~1250 (alemán, small MLX)
- Hermes Desktop: PID 54655 (app.asar repacked con todos los cambios)

---

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│  Hermes Desktop (Electron + React)                              │
│  ├── Composer (4 botones, HUD en vivo)                          │
│  ├── OrchestrationStatus (4 tarjetas, datos reales)             │
│  ├── LearningFooter (Equipo Aprendizaje, cuadrícula 2 filas)   │
│  └── SecretaryLearning (Último Aprendizaje + Skills + Graph)    │
└──────────────────────────┬──────────────────────────────────────┘
                           │ WebSocket / REST
┌──────────────────────────▼──────────────────────────────────────┐
│  mlx-proxy.py (:1240) — LaunchAgent gestionado                 │
│  ├── /health → estado de botones (voice_comms, orchestración,…) │
│  ├── /orchestration → mapa de agentes en vivo                  │
│  ├── /secretary-learning → puntuaciones + last_learning + graph │
│  ├── subprocess voice_comms.py (F5-TTS Serena)                 │
│  ├── subprocess mic-level.py (RAW PCM + JSON de nivel)          │
│  └── subprocess whisper-stt (alemán, puerto 1250)              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Contribuir

Ver [AGENTS.md](AGENTS.md) para la guía de desarrollo y [DESIGN.md](apps/desktop/DESIGN.md) para el contrato visual.

---

## Licencia

MIT — ver [LICENSE](LICENSE).