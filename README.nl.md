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

**Een SonnerStudio-fork van [Hermes Agent](https://hermes-agent.nousresearch.com/) door Nous Research** — de zelfverbeterende AI-agent, uitgebreid met een stemgestuurde **Hermes Secretaresse** en een visuele **Composer-besturing-HUD** voor het orkestreren van sub-agenten.

Deze fork voegt toe:

- **Composer-besturingsknoppen** — vier wisselknoppen in de desktop-composer (sub-agent-orchestratie, spraakcommunicatie, orchestratie, dubbele modus) met live statuskleuren (rood = inactief, geel = provisioning, groen = actief).
- **Orchestratie-HUD** — vier blauw omrande live-panelen onder het invoerveld: *Sub-agententeam*, *Hermes Secretaresse (Audiocommunicatie)*, *Gekloonde agenten*, en *Harmonisatie & agentbelasting*. Panelen verschijnen alleen bij een echte taak (geen demo).
- **Hermes Secretaresse** — een spraaklaag om met de agent te praten. Duitse TTS via **Kokoro** (`df_eva`, vrouwelijk, filmische snelheid 0.9), STT via Whisper, en een onzichtbare microfoon-niveaumonitor (geen terminalvenster). De agent kan sub-agenten delegeren om gesproken verzoeken uit te voeren.
- **MLX-Runtime-Proxy** — een lokale lazy-proxy (`:1240`) die Kokoro-TTS, Whisper-STT en MLX-modellen één voor één serveert, om binnen de RAM-limieten van de 16 GB Mac mini te blijven.

> **Opmerking:** De MLX-runtime, Kokoro Duitse TTS en de Hermes Secretaresse-spraakpipeline zijn afgestemd op Apple Silicon (macOS). Zie `plugins/hermes-sekretaerin/`.

---

## Snelle installatie

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

---

## Hermes Secretaresse-setup (SonnerStudio-extensie)

De spraaklaag staat in `plugins/hermes-sekretaerin/`:

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

Dit installeert:
- `mlx-proxy.py` als launchd-daemon (TTS/STT/MLX-modellen op `:1240`)
- `mic-level.py` als onzichtbare LaunchAgent (microfoon-niveaumonitor, geen terminalvenster)
- `kokoro-tts-server.py` (Kokoro Duitse TTS, `df_eva`)

**Kokoro bouwen (eenmalig):** zie `plugins/hermes-sekretaerin/BUILD_kokoro.md`. Vereist `cmake`, `espeak-ng`-headers en de `ggml`/`highway`-submodules.

**Microfoonmachtiging:** eenmalig verlenen in macOS *Systeeminstellingen → Privacy & Beveiliging → Microfoon* voor de helper.

---

## Taalselectie

De desktop-app heeft een ingebouwde taalkiezer (🌐) met Duits, Engels, Frans, Spaans, Nederlands en meer SonnerStudio-talen.
