#!/usr/bin/env python3
"""Generic batch inserter for the Composer 4-button section.

Strategy:
- For each language, the FULL 4-button block (translated names + descriptions)
  is provided in BUTTONS[lang].
- The script finds the existing button section by scanning for a line that
  contains "Composer" (any heading variant) and replaces everything up to the
  next "- **Orchestration HUD**" / "- **Hermes Sec" bullet.
- If no such line exists, it inserts the block before the first "## " heading
  after the intro (fallback: before "## Installation").

Option A: button NAMES are translated into the target language (never German).
"""
import re, os, sys

D = "/Volumes/Datenplatte/HermesAgentProjekt/repo-mirror/hermes-agent-and-his-crew"

INTRO = "- **Composer Control Buttons** — four toggle buttons in the desktop composer with live state colors (red = inactive, yellow = provisioning, green = active) :"

BUTTONS = {
    # ---- Batch 1 (already applied, kept for idempotency) ----
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
    # ---- Batch 2 ----
    "pt": """- **Botões de Controlo do Composer** — quatro botões de alternância no compositor de ambiente de trabalho com cores de estado em tempo real (vermelho = inativo, amarelo = provisionamento, verde = ativo) :
  1. **Ativar os sub-agentes** — ativa os sub-agentes de IA especializados que assumem sub-tarefas autonomamente, cada um com suas próprias capacidades especializadas, e aprendem continuamente com as tarefas e ao longo do tempo.
  2. **Secretária** — a gestora dos agentes: planeia e atribui tarefas, e como comunicadora fornece um modo de voz (entrada/saída de voz) com áudio de qualidade cinematográfica (Kokoro `df_eva`, velocidade 0.9).
  3. **Clonagem temporária** — permite que os agentes se multipliquem temporariamente pela duração de uma tarefa para processar tarefas semelhantes simultaneamente.
  4. **Harmonização & orquestração** — harmoniza/sincroniza ou os agentes dentro das tarefas (sem a Secretária), ou, quando a Secretária está ativa, os agentes são dirigidos por ela e harmonizados/sincronizados juntos com ela.""",
    "pl": """- **Composer Control Buttons** — cztery przyciski przełączające w kompozytorze pulpitu z kolorami stanu na żywo (czerwony = nieaktywny, żółty = provisioning, zielony = aktywny) :
  1. **Aktywuj sub-agentów** — aktywuje wyspecjalizowanych sub-agentów AI, którzy autonomicznie przejmują pod-zadania, każdy ze swoimi specjalistycznymi umiejętnościami, i stale uczą się z zadań i z czasem.
  2. **Sekretarka** — menedżerka agentów: planuje i przydziela zadania, a jako komunikatorka zapewnia tryb głosowy (wejście/wyjście głosowe) z dźwiękiem w jakości filmowej (Kokoro `df_eva`, prędkość 0.9).
  3. **Tymczasowe klonowanie** — pozwala agentom tymczasowo się powielać na czas trwania zadania, aby przetwarzać podobne zadania jednocześnie.
  4. **Harmonizacja & orkiestracja** — harmonizuje/synchronizuje albo agentów wewnątrz zadań (bez Sekretarki), albo, gdy Sekretarka jest aktywna, agenci są nią kierowani i harmonizowani/synchronizowani razem z nią.""",
    "ru": """- **Composer Control Buttons** — четыре переключающиеся кнопки в настольном композиторе с цветами состояния в реальном времени (красный = неактивно, жёлтый = подготовка, зелёный = активно) :
  1. **Активировать суб-агентов** — активирует специализированных суб-агентов ИИ, которые самостоятельно берут подзадачи, каждый со своими специальными навыками, и постоянно учатся на задачах и с течением времени.
  2. **Секретарь** — менеджер агентов: планирует и распределяет задачи, а как коммуникатор предоставляет голосовой режим (голосовой ввод/вывод) с аудио кинематографического качества (Kokoro `df_eva`, скорость 0.9).
  3. **Временное клонирование** — позволяет агентам временно размножаться на время выполнения задачи, чтобы обрабатывать похожие задачи одновременно.
  4. **Гармонизация и оркестрация** — гармонизирует/синхронизирует либо агентов внутри задач (без Секретаря), либо, когда Секретарь активен, агенты управляются ею и гармонизируются/синхронизируются вместе с ней.""",
    "cs": """- **Composer Control Buttons** — čtyři přepínací tlačítka v desktopovém kompozitoru s barvami stavu v reálném čase (červená = neaktivní, žlutá = provisioning, zelená = aktivní) :
  1. **Aktivovat sub-agenty** — aktivuje specializované sub-agenty AI, kteří samostatně přebírají dílčí úkoly, každý se svými specializovanými schopnostmi, a neustále se učí z úkolů a v průběhu času.
  2. **Sekretářka** — manažerka agentů: plánuje a přiděluje úkoly a jako komunikátorka poskytuje hlasový režim (hlasový vstup/výstup) s audio kvality filmu (Kokoro `df_eva`, rychlost 0.9).
  3. **Dočasné klonování** — umožňuje agentům dočasně se rozmnožit na dobu trvání úkolu, aby zpracovávali podobné úkoly současně.
  4. **Harmonizace & orchestrace** — harmonizuje/synchronizuje buď agenty uvnitř úkolů (bez Sekretářky), nebo, když je Sekretářka aktivní, agenti jsou jí řízeni a harmonizováni/synchronizováni spolu s ní.""",
    "sv": """- **Composer Control Buttons** — fyra växelknappar i desktop-kompositören med live-statusfärger (röd = inaktiv, gul = provisioning, grön = aktiv) :
  1. **Aktivera sub-agenter** — aktiverar specialiserade AI-sub-agenter som självständigt tar deluppgifter, var och en med sina egna specialiserade färdigheter, och lär sig kontinuerligt av uppgifter och över tid.
  2. **Sekreterare** — agenternas chef: planerar och fördelar uppgifter, och som kommunikatör tillhandahåller ett röstläge (röstinmatning/utmatning) med ljud i filmkvalitet (Kokoro `df_eva`, hastighet 0.9).
  3. **Tillfällig kloning** — låter agenter tillfälligt föröka sig under en uppgifts gång för att bearbeta liknande uppgifter samtidigt.
  4. **Harmonisering & orkestrering** — harmoniserar/synkroniserar antingen agenterna inom uppgifterna (utan Sekreteraren), eller, när Sekreteraren är på, styrs agenterna av henne och harmoniseras/synkroniseras tillsammans med henne.""",
    # ---- Batch 3 ----
    "dk": """- **Composer Control Buttons** — fire vekselknapper i desktop-kompositøren med live-statusfarver (rød = inaktiv, gul = provisioning, grøn = aktiv) :
  1. **Aktivér sub-agenter** — aktiverer de specialiserede AI-sub-agenter, der selvstændigt tager delopgaver, hver med sine egne specialiserede færdigheder, og løbende lærer af opgaver og over tid.
  2. **Sekretær** — agenternes leder: planlægger og tildeler opgaver, og som kommunikator leverer en stemmetilstand (stemmeindtastning/udtastning) med lyd i filmkvalitet (Kokoro `df_eva`, hastighed 0.9).
  3. **Midlertidig kloning** — lader agenter midlertidigt formere sig i varigheden af en opgave for at behandle lignende opgaver samtidigt.
  4. **Harmonisering & orkestrering** — harmoniserer/synkroniserer enten agenterne inden for opgaverne (uden Sekretæren), eller, når Sekretæren er til, styres agenterne af hende og harmoniseres/synkroniseres sammen med hende.""",
    "no": """- **Composer Control Buttons** — fire vekselknapper i desktop-kompositøren med live-statusfarger (rød = inaktiv, gul = provisioning, grønn = aktiv) :
  1. **Aktiver sub-agenter** — aktiverer de spesialiserte AI-sub-agentene som selvstendig tar deloppgaver, hver med sine egne spesialiserte ferdigheter, og løpende lærer av oppgaver og over tid.
  2. **Sekretær** — agentenes leder: planlegger og tildeler oppgaver, og som kommunikator leverer en taletilstand (taleinntasting/uttasting) med lyd i filmkvalitet (Kokoro `df_eva`, hastighet 0.9).
  3. **Midlertidig kloning** — lar agenter midlertidig forme seg i varigheten av en oppgave for å behandle lignende oppgaver samtidig.
  4. **Harmonisering & orkestrering** — harmoniserer/synkroniserer enten agentene innenfor oppgavene (uten Sekretæren), eller, når Sekretæren er på, styres agentene av henne og harmoniseres/synkroniseres sammen med henne.""",
    "se": """- **Composer Control Buttons** — fyra växelknappar i desktop-kompositören med live-statusfärger (röd = inaktiv, gul = provisioning, grön = aktiv) :
  1. **Aktivera sub-agenter** — aktiverar specialiserade AI-sub-agenter som självständigt tar deluppgifter, var och en med sina egna specialiserade färdigheter, och lär sig kontinuerligt av uppgifter och över tid.
  2. **Sekreterare** — agenternas chef: planerar och fördelar uppgifter, och som kommunikatör tillhandahåller ett röstläge (röstinmatning/utmatning) med ljud i filmkvalitet (Kokoro `df_eva`, hastighet 0.9).
  3. **Tillfällig kloning** — låter agenter tillfälligt föröka sig under en uppgifts gång för att bearbeta liknande uppgifter samtidigt.
  4. **Harmonisering & orkestrering** — harmoniserar/synkroniserar antingen agenterna inom uppgifterna (utan Sekreteraren), eller, när Sekreteraren är på, styrs agenterna av henne och harmoniseras/synkroniseras tillsammans med henne.""",
    "fi": """- **Composer Control Buttons** — neljä vaihtokytkintä työpöytäkompositionissa reaaliaikaisilla tilaväreillä (punainen = inaktiivinen, keltainen = provisioning, vihreä = aktiivinen) :
  1. **Aktivoi sub-agentit** — aktivoi erikoistuneet AI-sub-agentit, jotka ottavat alitehtäviä itsenäisesti, kukin omilla erikoistaitoillaan, ja oppivat jatkuvasti tehtävistä ja ajan myötä.
  2. **Sihteeri** — agenttien esimies: suunnittelee ja jakaa tehtäviä, ja viestijänä tarjoaa puhetilan (puheen syöttö/tuotto) elokuvalaatuisella äänellä (Kokoro `df_eva`, nopeus 0.9).
  3. **Väliaikainen kloonaus** — antaa agenttien lisääntyä väliaikaisesti tehtävän keston ajaksi käsitelläkseen samankaltaisia tehtäviä samanaikaisesti.
  4. **Harmonisointi & orkestraatio** — harmonisoi/synkronoi joko agentit tehtävien sisällä (ilman Sihteeriä), tai, kun Sihteeri on päällä, agentteja ohjaa hän ja ne harmonisoidaan/synkronoidaan yhdessä hänen kanssaan.""",
    "sk": """- **Composer Control Buttons** — štyri prepínacie tlačidlá v desktopovom kompozítoru s farbami stavu v reálnom čase (červená = neaktívna, žltá = provisioning, zelená = aktívna) :
  1. **Aktivovať sub-agentov** — aktivuje špecializovaných AI-sub-agentov, ktorí samostatne preberajú čiastkové úlohy, každý so svojimi špecializovanými schopnosťami, a neustále sa učia z úloh a v priebehu času.
  2. **Sekretárka** — manažérka agentov: plánuje a prideľuje úlohy a ako komunikátorka poskytuje hlasový režim (hlasový vstup/výstup) s audiom vo filmovej kvalite (Kokoro `df_eva`, rýchlosť 0.9).
  3. **Dočasné klonovanie** — umožňuje agentom dočasne sa rozmnožiť na dobu trvania úlohy, aby spracovávali podobné úlohy súčasne.
  4. **Harmonizácia & orchesterácia** — harmonizuje/synchronizuje buď agentov vnútri úloh (bez Sekretárky), alebo, keď je Sekretárka aktívna, agenti sú riadení ňou a harmonizovaní/synchronizovaní spolu s ňou.""",
}

LANGS = sys.argv[1:] or list(BUTTONS.keys())

def process(path, lang):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    block = BUTTONS[lang]
    # Find a line containing "Composer" (any heading variant)
    m = re.search(r"^- \*\*[^*]*Composer[^*]*\*\*.+$", text, re.MULTILINE)
    if m:
        start = m.start()
        # Cut at next "- **Orchestration HUD**" or "- **Hermes Sec"
        tail = re.search(r"\n- \*\*Orchestration HUD\*\*|\n- \*\*Hermes Sec", text[start:])
        if tail:
            end = start + tail.start()
            text = text[:start] + block + text[end:]
        else:
            # No tail anchor: replace from start to end of that line + following numbered list
            nxt = re.search(r"\n(## |\n- \*\*)", text[start+len(m.group()):])
            if nxt:
                end = start + len(m.group()) + nxt.start()
                text = text[:start] + block + text[end:]
            else:
                text = text[:start] + block + "\n" + text[start+len(m.group()):]
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
        return "replaced"
    else:
        # No existing section: insert before first "## " after intro
        ins = re.search(r"\n(## )", text)
        if ins:
            text = text[:ins.start()] + "\n" + block + "\n" + text[ins.start():]
            with open(path, "w", encoding="utf-8") as f:
                f.write(text)
            return "inserted"
        return "NO_ANCHOR"

for lang in LANGS:
    if lang not in BUTTONS:
        print(f"{lang}: NOT IN DICT")
        continue
    p = os.path.join(D, f"README.{lang}.md")
    if not os.path.exists(p):
        print(f"{lang}: FILE MISSING")
        continue
    print(f"{lang}: {process(p, lang)}")
