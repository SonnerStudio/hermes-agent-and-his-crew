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

**Un fork SonnerStudio de [Hermes Agent](https://hermes-agent.nousresearch.com/) par Nous Research** — l'agent IA auto-apprenant, étendu avec une **Secrétaire Hermes** pilotée par la voix et un **HUD de contrôle Composer** visuel pour l'orchestration des sous-agents.

Ce fork ajoute :

- **Boutons de contrôle Composer** — quatre boutons bascule dans le Composer de bureau (orchestration sous-agents, communication vocale, mode orchestration, mode double) avec couleurs d'état en direct (rouge = inactif, jaune = provisionnement, vert = actif).
- **HUD d'orchestration** — quatre panneaux en direct à bordure bleue sous la saisie Composer : *Équipe Sous-Agents* (affiche seulement agents en cours), *Charge Secrétaire Hermes* (niveaux haut-parleur/micro au lieu de charge sous-agents), *Agents Clonés* (comptes clones mode double), et *Harmonisation & Charge Agents* (progrès moyen agents en cours seulement). Panneaux apparaissent seulement lors de vraie tâche — pas de placeholders demo.
- **Secrétaire Hermes** — une couche vocale pour parler à l'agent. TTS allemand via **cduvenhorst F5-TTS** (voix Serena, `q3_serena_warm_000.wav`, voix féminine allemande chaude, pas de dérive d'accent), STT via Whisper-small-MLX (allemand), et moniteur niveau microphone headless (partage RAW PCM, pas de popup terminal visible). L'agent peut déléguer sous-agents pour exécuter requêtes vocales.
- **Proxy Runtime MLX** — un proxy local paresseux (`:1240`) qui sert F5-TTS, Whisper STT et modèles chat MLX un à la fois, pour que le Mac mini 16 Go reste dans limites RAM.
- **Équipe Apprenante** — scores d'apprentissage en direct pour Agent Hermes, Secrétaire, et 8 spécialistes sous-agents (Recherche, Code, Image, Audio, Analyse, Planification, Technique, Structuration) comme barres de progression compactes avec scores réels issus résultats délégation.
- **Panneau Dernier Succès Apprentissage** — affiche dernier gain apprentissage : quel agent (Agent Hermes, Secrétaire Hermes, ou un des 8 sous-agents), ce qui a été atteint (topologie, facteur clone, unités, latence), et marqueur succès.

> **Note :** Le runtime MLX, cduvenhorst F5-TTS allemand, et le pipeline vocal Secrétaire Hermes sont optimisés pour Apple Silicon (macOS). Voir `plugins/hermes-sekretaerin/` pour la configuration.

---

## Installation Rapide

### Linux, macOS, WSL2, Termux

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Windows (natif, PowerShell)

> **Info :** Windows natif exécute Hermes sans WSL — CLI, gateway, TUI et outils fonctionnent nativement. Si WSL2 préféré, la commande Linux/macOS ci-dessus fonctionne aussi.

Exécuter dans PowerShell :

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

L'installateur gère tout : uv, Python 3.11, Node.js, ripgrep, ffmpeg, **et un Git Bash portable** (MinGit, décompressé vers `%LOCALAPPDATA%\hermes\git` — pas d'admin requis, complètement isolé de toute installation Git système). Hermes utilise ce Git Bash groupé pour commandes shell.

Si Git déjà installé, l'installateur le détecte et l'utilise. Sinon téléchargement ~45MB MinGit suffit — ne touche pas installation Git système.

> **Android / Termux :** Le chemin manuel testé est documenté dans le [guide Termux](https://hermes-agent.nousresearch.com/docs/getting-started/termux). Sur Termux, Hermes installe un extra `.[termux]` curaté car le `.[all]` complet tire actuellement des dépendances voice incompatibles Android.
>
> **Windows :** Windows natif entièrement supporté — la one-liner PowerShell ci-dessus installe tout. Si WSL2 préféré, la commande Linux fonctionne aussi. Installation Windows native sous `%LOCALAPPDATA%\hermes`; WSL2 sous `~/.hermes` comme sur Linux.

---

## Configuration Secrétaire Hermes (extension SonnerStudio)

La couche vocale se trouve dans `plugins/hermes-sekretaerin/` :

```bash
bash plugins/hermes-sekretaerin/setup.sh
```

Ceci installe :
- `mlx-proxy.py` comme daemon launchd (sert TTS/STT/MLX modèles sur `:1240`)
- `mic-level.py` comme LaunchAgent headless (moniteur niveau microphone, pas fenêtre terminal)
- `f5-tts-server.py` (cduvenhorst F5-TTS allemand, voix Serena)

**Compiler F5-TTS (une fois) :** voir `plugins/hermes-sekretaerin/BUILD_f5.md`. Nécessite `cmake`, headers `espeak-ng`, et sous-modules `ggml`/`highway`.

**Permission microphone :** accorder macOS *Réglages Système → Confidentialité et Sécurité → Microphone* au helper une fois.

---

## Sélection Langue

L'app Desktop a un sélecteur de langue intégré (🌐) avec allemand, anglais, français, espagnol, néerlandais et plus langues SonnerStudio.

---

## Statut Développement Actuel (Août 2026)

### Terminé Cette Session

1. **Pipeline Vocal Secrétaire Restauré**
   - Corrigé `voice_comms.py` indentation corrompue (edit interrompu)
   - Seuil VAD 15 → 35 + 3 frames minimum (supprime hallucinations bruit casque BT)
   - Partage RAW PCM via `mic-level.py` → `~/.hermes/mic-raw.pcm` (résout silence BT HFP)
   - Périphérique `:0` priorisé dans `DEV_CANDIDATES` (entrée audio réelle)
   - `_trigger_model_load()` déclenche chargement modèle après redémarrage proxy

2. **Stabilité Proxy**
   - `/health` HTTP 500 → 200 (psutil try/except + fallback sysctl)
   - Unique LaunchAgent (`com.jan.mlx-proxy`) — agents doublons/conflits supprimés
   - Autostart boot : quand `voice_comms.toggle.active=true` → démarre mic-level + voice_comms
   - Spawn subprocess direct (pas conditions course launchctl)

3. **Redesign HUD Orchestration**
   - 4 cartes : Équipe Sous-Agents, Charge Secrétaire Hermes, Agents Clonés, Harmonisation
   - Équipe Sous-Agents montre SEULEMENT agents en cours (pas placeholder "prêt" statique)
   - Panneau audio → "Charge Secrétaire Hermes" (haut-parleur/micro, pas charge sous-agents)
   - Cartes partagent largeur complète équitablement (`flex-1 min-w-0`, pas wrap)

4. **Équipe Apprenante & Panneau Dernier Apprentissage**
   - 8 spécialistes sous-agents enregistrés : Recherche, Code, Image, Audio, Analyse, Planification, Technique, Structuration
   - Doublon "Spécialiste Planification" supprimé ; Expert Structuration ajouté
   - `secretary_memory.py` : `last_learning_event()` retourne dernier outcome réussi
   - Endpoint proxy `/secretary-learning` émet `last_learning`
   - Frontend : Champ 1 = "Dernier Succès Apprentissage" (label agent + topologie/clone/unités/latence + marqueur succès)
   - Champs "Préférences Routage" et "Équipe Apprenante" supprimés

5. **Composer Pleine Largeur**
   - `--composer-width: 100%` (était `62rem`) — composer + thread utilisent largeur complète entre menus latéraux

6. **Tous Gates Lint/Type Passent**
   - `eslint` exit 0 sur tous fichiers modifiés
   - `tsc -p . --noEmit` exit 0
   - Python `py_compile` OK sur `secretary_memory.py`, `mlx-proxy.py`

### Services En Cours (Vérifiés)

- mlx-proxy: PID 54356 (géré launchd)
- voice_comms.py: PID 36659 (cduvenhorst F5-TTS, voix Serena)
- mic-level.py: PID 43150 (RAW PCM + level JSON)
- whisper-stt: PID ~1250 (allemand, small MLX)
- Hermes Desktop: PID 54655 (app.asar repacké avec tous changements)

---

## Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│  Hermes Desktop (Electron + React)                              │
│  ├── Composer (4 boutons, HUD live)                             │
│  ├── OrchestrationStatus (4 cartes, données réelles)            │
│  ├── LearningFooter (Équipe Apprenante, grille 2 lignes)        │
│  └── SecretaryLearning (Dernier Apprentissage + Skills + Graph) │
└──────────────────────────┬──────────────────────────────────────┘
                           │ WebSocket / REST
┌──────────────────────────▼──────────────────────────────────────┐
│  mlx-proxy.py (:1240) — LaunchAgent géré                        │
│  ├── /health → état boutons (voice_comms, orchestration, ...)   │
│  ├── /orchestration → map agents live                           │
│  ├── /secretary-learning → scores + last_learning + graph       │
│  ├── voice_comms.py subprocess (F5-TTS Serena)                  │
│  ├── mic-level.py subprocess (RAW PCM + level JSON)             │
│  └── whisper-stt subprocess (allemand, port 1250)               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Contribution

Voir [AGENTS.md](AGENTS.md) pour guide développement et [DESIGN.md](apps/desktop/DESIGN.md) pour contrat visuel.

---

## Licence

MIT — voir [LICENSE](LICENSE).