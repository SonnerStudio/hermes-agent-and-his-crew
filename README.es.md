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

**Un fork de SonnerStudio de [Hermes Agent](https://hermes-agent.nousresearch.com/) por Nous Research** — el agente de IA automejorable, ampliado con una **Hermes Secretaria** por voz y un **HUD de control del compositor** para orquestar sub-agentes.

Este fork añade:

- **Botones de control del compositor** — cuatro botones de alternancia en el compositor de escritorio (orquestación de sub-agentes, comunicación por voz, orquestación, modo doble) con colores de estado en vivo (rojo = inactivo, amarillo = aprovisionamiento, verde = activo).
- **HUD de orquestación** — cuatro paneles en vivo con borde azul debajo del campo de entrada: *Equipo de sub-agentes*, *Hermes Secretaria (Comunicación de audio)*, *Agentes clonados*, y *Armonización y carga de agentes*. Los paneles solo aparecen con una tarea real (sin demo).
- **Hermes Secretaria** — una capa de voz para hablar con el agente. TTS alemán vía **Kokoro** (`df_eva`, femenino, velocidad cinematográfica 0.9), STT vía Whisper, y un monitor de nivel de micro invisible (sin ventana de terminal). El agente puede delegar sub-agentes para ejecutar solicitudes habladas.
- **Proxy MLX Runtime** — un proxy local (`:1240`) que sirve el TTS Kokoro, STT Whisper y modelos MLX uno tras otro, para mantenerse dentro de los límites de RAM del Mac mini de 16 GB.

> **Nota:** La MLX Runtime, el TTS alemán Kokoro y la pipeline de voz Hermes Secretaria están optimizados para Apple Silicon (macOS). Ver `plugins/hermes-sekretaerin/`.

---

## Instalación rápida

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

---

## Configuración de Hermes Secretaria (extensión SonnerStudio)

La capa de voz está en `plugins/hermes-sekretaerin/`:

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

Esto instala:
- `mlx-proxy.py` como daemon launchd (TTS/STT/modelos MLX en `:1240`)
- `mic-level.py` como LaunchAgent invisible (monitor de nivel de micro, sin ventana de terminal)
- `kokoro-tts-server.py` (TTS alemán Kokoro, `df_eva`)

**Construir Kokoro (una vez):** ver `plugins/hermes-sekretaerin/BUILD_kokoro.md`. Requiere `cmake`, cabeceras `espeak-ng` y los submódulos `ggml`/`highway`.

**Permiso de micrófono:** conceder una vez en macOS *Ajustes del sistema → Privacidad y Seguridad → Micrófono* para el asistente.

---

## Selección de idioma

La aplicación de escritorio tiene un selector de idioma integrado (🌐) con alemán, inglés, francés, español, neerlandés y más idiomas de SonnerStudio.
