#!/usr/bin/env python3
"""Batch 1: Insert/replace the 4-button description section in FR/ES/IT/NL READMEs.

Each entry is the FULL 4-button block (names + descriptions) translated into
the target language. DE stays as-is (already correct). EN (README.md) is
handled separately (it has buttons 2+4 but not 1+3).

Option A (user requirement): button NAMES are translated into the target
language, NOT left in German.
"""
import re, io, os, sys

D = "/Volumes/Datenplatte/HermesAgentProjekt/repo-mirror/hermes-agent-and-his-crew"

BLOCKS = {
    "fr": """- **Composer Control Buttons** — quatre boutons bascule dans le composeur de bureau avec couleurs d'état en direct (rouge = inactif, jaune = provisioning, vert = actif) :
  1. **Activer les sous-agents** — active les sous-agents IA spécialisés qui prennent autonomement des sous-tâches, chacun avec ses propres compétences spécialisées, et apprennent continuellement des tâches et avec le temps.
  2. **Secrétaire** — la gestionnaire des agents : planifie et attribue les tâches, et en tant que communicatrice fournit un mode vocal (entrée/sortie vocale) avec un audio de qualité cinématographique (Kokoro `df_eva`, vitesse 0.9).
  3. **Clonage temporaire** — permet aux agents de se multiplier temporairement pour la durée d'une tâche afin de traiter des tâches similaires simultanément.
  4. **Harmonisation & orchestration** — harmonise/synchronise soit les agents au sein des tâches (sans la Secrétaire), soit, lorsque la Secrétaire est active, les agents sont pilotés par elle et harmonisés/synchronisés ensemble avec elle.""",
    "es": """- **Composer Control Buttons** — cuatro botones de conmutación en el compositor de escritorio con colores de estado en vivo (rojo = inactivo, amarillo = aprovisionamiento, verde = activo) :
  1. **Activar los sub-agentes** — activa los sub-agentes de IA especializados que asumen sub-tareas de forma autónoma, cada uno con sus propias capacidades especializadas, y aprenden continuamente de las tareas y con el tiempo.
  2. **Secretaria** — la gestora de los agentes: planifica y asigna tareas, y como comunicadora proporciona un modo de voz (entrada/salida de voz) con audio de calidad cinematográfica (Kokoro `df_eva`, velocidad 0.9).
  3. **Clonación temporal** — permite a los agentes multiplicarse temporalmente durante la duración de una tarea para procesar tareas similares simultáneamente.
  4. **Armonización y orquestación** — armoniza/sincroniza ya sea los agentes dentro de las tareas (sin la Secretaria), o, cuando la Secretaria está activa, los agentes son dirigidos por ella y armonizados/sincronizados juntos con ella.""",
    "it": """- **Composer Control Buttons** — quattro pulsanti interruttori nel composer desktop con colori di stato in tempo reale (rosso = inattivo, giallo = provisioning, verde = attivo) :
  1. **Attiva i sub-agenti** — attiva i sub-agenti IA specializzati che assumono autonomamente sotto-compiti, ciascuno con le proprie capacità specializzate, e imparano continuamente dai compiti e nel tempo.
  2. **Segretaria** — la gestora degli agenti: pianifica e assegna compiti, e come comunicatrice fornisce una modalità vocale (input/output vocale) con audio di qualità cinematografica (Kokoro `df_eva`, velocità 0.9).
  3. **Clonazione temporanea** — permette agli agenti di moltiplicarsi temporaneamente per la durata di un compito per elaborare compiti simili simultaneamente.
  4. **Armonizzazione e orchestrazione** — armonizza/sincronizza sia gli agenti all'interno dei compiti (senza la Segretaria), sia, quando la Segretaria è attiva, gli agenti sono guidati da lei e armonizzati/sincronizzati insieme con lei.""",
    "nl": """- **Composer Control Buttons** — vier wisselknoppen in de desktop-composer met live statuskleuren (rood = inactief, geel = provisioning, groen = actief) :
  1. **Sub-agenten activeren** — activeert de gespecialiseerde AI-sub-agenten die autonoom deelopdrachten oppakken, elk met hun eigen gespecialiseerde vaardigheden, en continu leren van opdrachten en in de loop van de tijd.
  2. **Secretaresse** — de beheerder van de agenten: plant en wijst taken toe, en als communicator biedt een spraakmodus (spraakinvoer/-uitvoer) met filmische audiokwaliteit (Kokoro `df_eva`, snelheid 0.9).
  3. **Tijdelijk klonen** — laat agenten zich tijdelijk vermenigvuldigen voor de duur van een taak om soortgelijke taken tegelijkertijd te verwerken.
  4. **Harmonisatie & orkestratie** — harmoniseert/synchroniseert ofwel de agenten binnen de taken (zonder de Secretaresse), of, wanneer de Secretaresse aan staat, worden de agenten door haar aangestuurd en samen met haar geharmoniseerd/gesynchroniseerd.""",
}

def replace_section(path, new_block, lang):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    # Localized "Composer Control Buttons" heading variants
    headings = {
        "fr": r"- \*\*Composer Control Buttons\*\*",
        "es": r"- \*\*Botones de Control del Composer\*\*",
        "it": r"- \*\*Pulsanti di Controllo Composer\*\*",
        "nl": r"- \*\*Composer Control-knoppen\*\*",
    }
    h = headings.get(lang, r"- \*\*Composer Control Buttons\*\*")
    # Match from the localized heading up to (not including) the next
    # "- **Orchestration HUD**" or "- **Hermes Sec..." bullet.
    pattern = re.compile(
        h + r".*?(?=\n- \*\*Orchestration HUD\*\*|\n- \*\*Hermes Sec)",
        re.DOTALL,
    )
    if pattern.search(text):
        text = pattern.sub(new_block, text, count=1)
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
        return "replaced"
    else:
        m = re.search(r"\n(## Installation|\n## )", text)
        if m:
            text = text[:m.start()] + "\n" + new_block + "\n" + text[m.start():]
            with open(path, "w", encoding="utf-8") as f:
                f.write(text)
            return "inserted"
        return "NO_ANCHOR"

for lang, block in BLOCKS.items():
    p = os.path.join(D, f"README.{lang}.md")
    if not os.path.exists(p):
        print(f"{lang}: FILE MISSING")
        continue
    res = replace_section(p, block, lang)
    print(f"{lang}: {res}")
