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

**Un fork SonnerStudio de [Hermes Agent](https://hermes-agent.nousresearch.com/) par Nous Research** — l'agent IA auto-améliorant, étendu avec une **Hermes Secrétaire** vocale et un **HUD de contrôle du composeur** pour orchestrer les sous-agents.

Ce fork ajoute :

- **Boutons de contrôle du composeur** — quatre boutons bascule dans le composeur de bureau (orchestration de sous-agents, communication vocale, orchestration, mode double) avec couleurs d'état en direct (rouge = inactif, jaune = provisionnement, vert = actif).
- **HUD d'orchestration** — quatre panneaux live bordés de bleu sous le champ de saisie : *Équipe de sous-agents*, *Hermes Secrétaire (Communication audio)*, *Agents clonés*, et *Harmonisation & charge des agents*. Les panneaux n'apparaissent qu'en cas de tâche réelle (pas de démo).
- **Hermes Secrétaire** — une couche vocale pour parler à l'agent. TTS allemand via **Kokoro** (`df_eva`, féminin, vitesse cinématographique 0.9), STT via Whisper, et un moniteur de niveau de micro invisible (pas de fenêtre de terminal). L'agent peut déléguer des sous-agents pour exécuter les demandes vocales.
- **Proxy MLX Runtime** — un proxy local (`:1240`) qui sert le TTS Kokoro, le STT Whisper et les modèles MLX l'un après l'autre, pour rester dans les limites de RAM du Mac mini 16 Go.

> **Note :** La MLX Runtime, le TTS allemand Kokoro et la pipeline vocale Hermes Secrétaire sont optimisés pour Apple Silicon (macOS). Voir `plugins/hermes-sekretaerin/`.

---

## Installation rapide

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

---

## Configuration de Hermes Secrétaire (extension SonnerStudio)

La couche vocale se trouve dans `plugins/hermes-sekretaerin/` :

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

Cela installe :
- `mlx-proxy.py` comme daemon launchd (TTS/STT/modèles MLX sur `:1240`)
- `mic-level.py` comme LaunchAgent invisible (moniteur de niveau micro, pas de fenêtre de terminal)
- `kokoro-tts-server.py` (TTS allemand Kokoro, `df_eva`)

**Construction de Kokoro (une fois) :** voir `plugins/hermes-sekretaerin/BUILD_kokoro.md`. Nécessite `cmake`, en-têtes `espeak-ng` et les sous-modules `ggml`/`highway`.

**Autorisation microphone :** accorder une fois macOS *Réglages système → Confidentialité & Sécurité → Microphone* pour l'assistant.

---

## Sélection de langue

L'application de bureau dispose d'un sélecteur de langue intégré (🌐) avec allemand, anglais, français, espagnol, néerlandais et d'autres langues SonnerStudio.
