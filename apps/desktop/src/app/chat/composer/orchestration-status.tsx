import { useEffect, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

import { getLang, type Lang, localizeSpecialist, t } from './i18n'

// Live task HUD rendered BELOW the composer text field (underside strip).
// One bordered box per active composer button, each showing that button's real
// function state. All boxes share a thin blue border (border-sky-500/40) to
// match the text input field. Hidden entirely when nothing is active.
//
// Values are REAL, never demo:
//  - Sub-Agenten-Team:    the running subagents + their progress (from /orchestration)
//  - Audio-Kommunikation: voice_comms connection state (from /health buttons)
//  - Kopierte Agenten:    double_mode clone counts (from /orchestration clones)
//  - Harmonisierung:      mean progress of RUNNING agents only (0% when idle)
//  - Agenten-Auslastung:  running / MAX_AGENTS
//
// Renderer never touches Node/Electron: plain fetches to the local proxy.
const ORCH_URL = 'http://127.0.0.1:1240/orchestration'
const HEALTH_URL = 'http://127.0.0.1:1240/health'

// Max parallel subagents the agent may spawn (matches delegate_tasks cap).
const MAX_AGENTS = 3

interface AgentNode {
  id: string
  purpose: string
  /** Specialisation label (Recherche-, Code-, Analyse-Spezialist, …). Shown as
   *  the bar's name so the team reads as roles, not as free-form task text. */
  specialist?: string
  status: 'running' | 'done' | 'blocked' | 'reassigned' | string
  progress?: number // 0-100, set manually by the agent per task
}

/** Derive a specialisation label from the agent's purpose when the backend
 *  did not send an explicit one (older payloads / manual posts). */
export function specialistOf(a: AgentNode): string {
  if (a.specialist) {
    return a.specialist
  }

  const p = (a.purpose || '').toLowerCase()

  // Order matters: the most specific domain wins over generic verbs, so
  // "TTS Stimme prüfen" is an Audio job, not an Analysis job. Analysis is
  // therefore matched LAST among the domain rules.
  const table: [RegExp, string][] = [
    [/audio|stimme|voice|tts|stt|sprach/, 'Audio-Spezialist'],
    [/bild|image|grafik|visual|design/, 'Bild-Spezialist'],
    [/readme|doku|docs|übersetz|uebersetz|translat|i18n/, 'Dokumentations-Spezialist'],
    [/recherch|research|such|search|web/, 'Recherche-Spezialist'],
    [/code|refactor|implement|patch|build/, 'Code-Spezialist'],
    [/plan|konzept|architekt/, 'Planungs-Spezialist'],
    [/analys|review|prüf|pruef|test|verif/, 'Analyse-Spezialist'],
  ]

  for (const [re, label] of table) {
    if (re.test(p)) {
      return label
    }
  }

  return a.purpose || a.id
}

const clampPct = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

const BOX = 'flex flex-col gap-1.5 rounded-md border border-sky-500/40 bg-(--composer-fill) px-2 py-1.5 min-w-[9rem] flex-1'

interface BoxProps {
  title: string
  children: React.ReactNode
  className?: string
}

function Box({ title, children, className }: BoxProps) {
  return (
    <div className={cn(BOX, 'flex-1 min-w-0', className)}>
      <span className="text-[0.78rem] font-bold uppercase tracking-wider text-sky-400">
        {title}
      </span>
      {children}
    </div>
  )
}

function MiniBar({ pct, label }: { pct: number; label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between">
        <span className="truncate text-[0.78rem] font-semibold text-foreground" title={label}>{label}</span>
        <span className="ml-1 shrink-0 font-mono text-[0.78rem] font-bold tabular-nums text-foreground/90">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
        <div className="h-full rounded-full bg-sky-500 transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function AudioBar({ label, pct, tone }: { label: string; pct: number; tone: 'green' | 'blue' }) {
  const bar = tone === 'green' ? 'bg-green-500' : 'bg-sky-500'

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between">
        <span className="text-[0.75rem] font-medium text-foreground">{label}</span>
        <span className="ml-1 shrink-0 font-mono text-[0.75rem] font-bold tabular-nums text-foreground/90">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
        <div className={cn('h-full rounded-full transition-[width] duration-150', bar)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function BigBar({ pct, hint }: { pct: number; hint?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.88rem] font-bold tabular-nums text-foreground">{pct}%</span>
        {hint && <span className="truncate text-[0.75rem] font-medium text-muted-foreground" title={hint}>{hint}</span>}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
        <div className="h-full rounded-full bg-sky-500 transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/**
 * Task strip BELOW the composer. One box per active button, blue-bordered,
 * side by side. Each box shows REAL state for that button's function. The
 * whole strip is hidden unless at least one orchestration feature is active.
 */
export const OrchestrationStatus = () => {
  const [agents, setAgents] = useState<AgentNode[]>([])
  const [clones, setClones] = useState<Record<string, number>>({})
  const [voiceActive, setVoiceActive] = useState(false)
  const [voiceState, setVoiceState] = useState<string>('bereit')
  const [subagentActive, setSubagentActive] = useState(false)
  const [cloneActive, setCloneActive] = useState(false)
  const [harmonyActive, setHarmonyActive] = useState(false)
  const [audio, setAudio] = useState<{ mic: number; speaker: number; mic_available: boolean }>({ mic: 0, speaker: 0, mic_available: false })
  const [modelLoaded, setModelLoaded] = useState(false)
  const [currentModel, setCurrentModel] = useState<string | null>(null)
  const [lang, setLangState] = useState<Lang>(getLang())

  useEffect(() => {
    const onLang = (e: Event) => setLangState((e as CustomEvent<Lang>).detail)
    window.addEventListener('sonnerstudio:lang', onLang as EventListener)

    return () => window.removeEventListener('sonnerstudio:lang', onLang as EventListener)
  }, [])

  useEffect(() => {
    let alive = true

    const sync = async () => {
      try {
        const [orchRes, healthRes] = await Promise.all([
          fetch(ORCH_URL),
          fetch(HEALTH_URL),
        ])

        if (!alive) {return}

        if (orchRes.ok) {
          const orch = await orchRes.json()

          if (Array.isArray(orch?.agents)) {setAgents(orch.agents as AgentNode[])}

          if (orch?.clones && typeof orch.clones === 'object') {setClones(orch.clones)}

          if (orch?.audio && typeof orch.audio === 'object') {
            setAudio({
              mic: clampPct(Number(orch.audio.mic) || 0),
              speaker: clampPct(Number(orch.audio.speaker) || 0),
              mic_available: Boolean(orch.audio.mic_available),
            })
          }
        }

        if (healthRes.ok) {
          const h = await healthRes.json()
          const btns = h?.buttons ?? {}
          const vc = btns['voice_comms.toggle']
          setVoiceActive(Boolean(vc?.active))
          setVoiceState(vc?.active ? (vc?.pending ? 'startet…' : 'aktiv — hört zu') : 'bereit')
          setSubagentActive(Boolean(btns['subagent_orchestration.toggle']?.active))
          setCloneActive(Boolean(btns['orchestration.toggle']?.active))
          setHarmonyActive(Boolean(btns['double_mode.toggle']?.active))
          setModelLoaded(Boolean(h?.current_model))
          setCurrentModel(h?.current_model ?? null)
        }
      } catch {
        // Proxy unreachable — keep last known state; retry next tick.
      }
    }

    void sync()
    const id = setInterval(sync, 2000)

    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  const { utilization, harmony, runningAgents } = useMemo(() => {
    const running = agents.filter(a => a.status === 'running' || a.status === 'reassigned')
    const util = clampPct((running.length / MAX_AGENTS) * 100)

    // Harmonization = mean progress of RUNNING agents only. Idle (none running)
    // => 0%, never a false 100% from already-finished agents.
    const mean = running.length === 0
      ? 0
      : running.reduce((s, a) => s + clampPct(Number(a.progress) || 0), 0) / running.length

    return { utilization: util, harmony: clampPct(mean), runningAgents: running }
  }, [agents])

  // Show the strip only while at least one orchestration feature is active.
  // Each button gets EXACTLY ONE box. The Sub-Agenten-Team box shows the
  // running agents when present, otherwise a "Bereit — Crew steht" placeholder
  // (Jan's requirement: the box for Button 1 must always be visible when the
  // button is armed, even before any agent is running). All four boxes share
  // the full available width equally (flex-1, no wrap) so they form one even row.
  const anyActive = subagentActive || voiceActive || cloneActive || harmonyActive
  const showTeam = subagentActive
  const showVoice = voiceActive
  const showClones = cloneActive
  const showHarmony = harmonyActive

  if (!anyActive) {
    return null
  }

  return (
    <div
      aria-label="Live orchestration status"
      className={cn('flex w-full items-stretch gap-1.5')}
      role="status"
    >
      {showTeam && (
        <Box title={t('panel.subagents', lang)}>
          <div className="flex flex-col gap-1">
            {runningAgents.length > 0 ? (
              runningAgents.map(a => (
                <MiniBar key={a.id} label={localizeSpecialist(specialistOf(a), lang)} pct={clampPct(Number(a.progress) || 0)} />
              ))
            ) : (
              <span className="text-[0.78rem] font-medium text-muted-foreground">
                {t('panel.subagents_ready', lang)}
              </span>
            )}
          </div>
        </Box>
      )}

      {showVoice && (
        <Box title={t('secretary.sub', lang)}>
          <div className="flex items-center gap-2">
            <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full bg-sky-500/20 text-[0.85rem]">
              🔊
            </span>
            <div className="flex flex-col">
              <span className="text-[0.85rem] font-bold text-foreground">{t('secretary.title', lang)}</span>
              <span className="text-[0.75rem] font-medium text-muted-foreground">{voiceState}</span>
            </div>
          </div>
          <div className="mt-1 flex flex-col gap-1 border-t border-muted/20 pt-1">
            <AudioBar label={t('audio.speaker', lang) || (lang === 'de' ? 'Sprecher-Auslastung' : 'Speaker Load')} pct={audio.speaker} tone="green" />
            <AudioBar label={t('audio.mic', lang) || (lang === 'de' ? 'Mikrofon-Pegel' : 'Microphone Level')} pct={audio.mic} tone="blue" />
            {!audio.mic_available && (
              <span className="text-[0.75rem] text-amber-500/80">{t('mic.unavailable', lang)}</span>
            )}
          </div>
        </Box>
      )}

      {showClones && (
        <Box title={t('panel.clones', lang)}>
          <div className="flex flex-col gap-0.5">
            {Object.entries(clones).filter(([, n]) => n > 1).length > 0 ? (
              Object.entries(clones)
                .filter(([, n]) => n > 1)
                .map(([id, n]) => (
                  <div className="flex items-center justify-between text-[0.8rem]" key={id}>
                    <span className="truncate font-medium text-foreground" title={id}>{id}</span>
                    <span className="ml-1 shrink-0 font-mono font-bold tabular-nums text-foreground/90">×{n}</span>
                  </div>
                ))
            ) : (
              <span className="text-[0.78rem] font-medium text-muted-foreground">{t('panel.clones_ready', lang)}</span>
            )}
          </div>
        </Box>
      )}

      {showHarmony && (
        <Box title={t('panel.harmony', lang)}>
          <BigBar hint={modelLoaded ? `Modell: ${currentModel}` : 'kein Modell geladen'} pct={harmony} />
          <div className="mt-1 flex items-center justify-between border-t border-muted/20 pt-1">
            <span className="text-[0.78rem] font-medium text-muted-foreground">
              {runningAgents.length > 0 ? t('panel.harmony', lang) : t('panel.harmony_ready', lang)}
            </span>
            <span className="font-mono text-[0.82rem] font-bold tabular-nums text-foreground">
              {runningAgents.length}/{MAX_AGENTS} · {utilization}%
            </span>
          </div>
        </Box>
      )}
    </div>
  )
}
