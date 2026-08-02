#!/usr/bin/env python3
"""Update the 4-button description in every translated README.

Replaces the OLD single-line "Composer Control Buttons" bullet with the NEW
4-point list describing each button's function (per user spec):
  1. Sub-Agenten aktivieren   (activate specialized learning sub-agents)
  2. Secretary / Sekretärin    (manager + voice I/O, film-quality TTS)
  3. Temporäres Klonen         (temporary multiplication for parallel tasks)
  4. Harmonisierung & Orchestr. (harmonize/sync, with or without Secretary)

Languages with a dedicated translation table get a translated list; all others
fall back to the English button names (most READMEs use English tech terms).
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))

# English reference list (used as fallback for non-mapped languages).
EN_LIST = """- **Composer Control Buttons** — four toggle buttons in the desktop composer with live state colors (red = inactive, yellow = provisioning, green = active):
  1. **Sub-Agenten aktivieren** — activates the specialized AI sub-agents that autonomously take on sub-tasks, each with its own specialist skills, and learn continuously from tasks and over time.
  2. **Secretary / Sekretärin** — the manager of the agents: plans and assigns tasks, and as communicator provides a speech mode (voice in / voice out) with film-quality audio (Kokoro `df_eva`, speed 0.9).
  3. **Temporäres Klonen** — lets agents temporarily multiply for the duration of a task to process similar tasks simultaneously.
  4. **Harmonisierung & Orchestrierung** — either harmonizes/synchronizes the agents within the tasks (without the Secretary), or, when the Secretary is on, the agents are steered by the Secretary and harmonized/synchronized together with her.
"""

# Per-language 4-point lists (translated button descriptions).
TRANSLATIONS = {
    "de": """- **Composer Control Buttons** — vier Umschalt-Buttons im Desktop-Composer mit Live-Statusfarben (rot = inaktiv, gelb = Bereitstellung, grün = aktiv):
  1. **Sub-Agenten aktivieren** — aktiviert die spezialisierten KI-Sub-Agenten, die sich eigenständig Teilaufgaben vornehmen, jeweils mit eigenen Spezialfähigkeiten, und kontinuierlich aus Aufgaben und über die Zeit lernen.
  2. **Secretary / Sekretärin** — die Managerin der Agenten: plant und teilt Aufgaben zu und stellt als Kommunikatorin einen Sprachmodus (Spracheingabe/-ausgabe) mit Audio in Filmqualität bereit (Kokoro `df_eva`, speed 0.9).
  3. **Temporäres Klonen** — lässt Agenten sich für die Dauer einer Aufgabe temporär vervielfältigen, um gleichartige Aufgaben gleichzeitig zu bearbeiten.
  4. **Harmonisierung & Orchestrierung** — harmonisiert/synchronisiert entweder die Agenten innerhalb der Aufgaben (ohne Sekretärin), oder, wenn die Sekretärin an ist, werden die Agenten von ihr gesteuert und mit ihr gemeinsam harmonisiert/synchronisiert.""",
    "fr": """- **Composer Control Buttons** — quatre boutons bascule dans le composeur de bureau avec couleurs d'état en direct (rouge = inactif, jaune = provisioning, vert = actif):
  1. **Sub-Agenten aktivieren** — active les sous-agents IA spécialisés qui prennent autonomement des sous-tâches, chacun avec ses propres compétences spécialisées, et apprennent continuellement des tâches et avec le temps.
  2. **Secretary / Sekretärin** — la gestionnaire des agents : planifie et attribue les tâches, et en tant que communicatrice fournit un mode vocal (entrée/sortie vocale) avec un audio de qualité cinématographique (Kokoro `df_eva`, vitesse 0.9).
  3. **Temporäres Klonen** — permet aux agents de se multiplier temporairement pour la durée d'une tâche afin de traiter des tâches similaires simultanément.
  4. **Harmonisierung & Orchestrierung** — harmonise/synchronise soit les agents au sein des tâches (sans la Secretary), soit, lorsque la Secretary est active, les agents sont pilotés par elle et harmonisés/synchronisés ensemble avec elle.""",
    "es": """- **Composer Control Buttons** — cuatro botones de conmutación en el compositor de escritorio con colores de estado en vivo (rojo = inactivo, amarillo = provisioning, verde = activo):
  1. **Sub-Agenten aktivieren** — activa los sub-agentes IA especializados que asumen sub-tareas de forma autónoma, cada uno con sus propias habilidades especializadas, y aprenden continuamente de las tareas y con el tiempo.
  2. **Secretary / Sekretärin** — la gerente de los agentes: planifica y asigna tareas, y como comunicadora proporciona un modo de voz (entrada/salida de voz) con audio de calidad cinematográfica (Kokoro `df_eva`, velocidad 0.9).
  3. **Temporäres Klonen** — permite a los agentes multiplicarse temporalmente durante la duración de una tarea para procesar tareas similares simultáneamente.
  4. **Harmonisierung & Orchestrierung** — ya sea armoniza/sincroniza los agentes dentro de las tareas (sin la Secretary), o, cuando la Secretary está activa, los agentes son dirigidos por ella y armonizados/sincronizados junto con ella.""",
}

# Regex: match the OLD single-line "Composer Control Buttons" bullet.
OLD_RE = re.compile(
    r"^- \*\*Composer Control Buttons\*\*.*$",
    re.MULTILINE,
)

LANG_FROM_FILENAME = re.compile(r"README\.([a-z]{2}(?:-[A-Z]{2})?)\.md$")


def main():
    count = 0
    for fn in sorted(os.listdir(ROOT)):
        m = LANG_FROM_FILENAME.match(fn)
        if not m or fn == "README.md":
            continue
        code = m.group(1)
        path = os.path.join(ROOT, fn)
        with open(path, encoding="utf-8") as f:
            text = f.read()
        if not OLD_RE.search(text):
            continue
        new_list = TRANSLATIONS.get(code, EN_LIST)
        text = OLD_RE.sub(lambda _: new_list, text, count=1)
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
        count += 1
        print(f"updated {fn} ({code})")
    print(f"\nTotal updated: {count}")


if __name__ == "__main__":
    main()
