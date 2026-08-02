import { useEffect, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

import { getLang, type Lang, t } from './i18n'

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
  status: 'running' | 'done' | 'blocked' | 'reassigned' | string
  progress?: number // 0-100, set manually by the agent per task
}

const clampPct = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

const BOX = 'flex flex-col gap-1.5 rounded-md border border-sky-500/40 bg-(--composer-fill) px-2.5 py-1.5'

interface BoxProps {
  title: string
  children: React.ReactNode
  className?: string
}

function Box({ title, children, className }: BoxProps) {
  return (
    <div className={cn(BOX, 'min-w-[11rem] flex-1', className)}>
      <span className="text-[0.6rem] font-medium uppercase tracking-wide text-muted-foreground">
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
        <span className="truncate text-[0.62rem] text-muted-foreground" title={label}>{label}</span>
        <span className="ml-1 shrink-0 font-mono text-[0.6rem] tabular-nums text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted/40">
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
        <span className="text-[0.58rem] text-muted-foreground">{label}</span>
        <span className="ml-1 shrink-0 font-mono text-[0.58rem] tabular-nums text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted/40">
        <div className={cn('h-full rounded-full transition-[width] duration-150', bar)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function BigBar({ pct, hint }: { pct: number; hint?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.7rem] tabular-nums text-muted-foreground">{pct}%</span>
        {hint && <span className="truncate text-[0.55rem] text-muted-foreground/70" title={hint}>{hint}</span>}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
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

  // Show the strip only while something is genuinely active.
  const showTeam = runningAgents.length > 0
  const showVoice = voiceActive
  const showClones = Object.values(clones).some(n => n > 1)
  const showHarmony = runningAgents.length > 0

  if (!showTeam && !showVoice && !showClones && !showHarmony) {
    return null
  }

  return (
    <div
      aria-label="Live orchestration status"
      className={cn(
        'flex flex-wrap items-stretch gap-2 rounded-lg border border-sky-500/40 p-2',
        'bg-(--composer-fill) backdrop-blur-[0.75rem] [-webkit-backdrop-filter:blur(0.75rem)]'
      )}
      role="status"
    >
      {showTeam && (
        <Box title={t('panel.subagents', lang)}>
          <div className="flex flex-col gap-1">
            {runningAgents.map(a => (
              <MiniBar key={a.id} label={a.purpose} pct={clampPct(Number(a.progress) || 0)} />
            ))}
          </div>
        </Box>
      )}

      {showVoice && (
        <Box title={t('secretary.sub', lang)}>
          <div className="flex items-center gap-2">
            <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full bg-sky-500/20 text-[0.7rem]">
              🔊
            </span>
            <div className="flex flex-col">
              <span className="text-[0.65rem] font-medium text-foreground">{t('secretary.title', lang)}</span>
              <span className="text-[0.55rem] text-muted-foreground">{voiceState}</span>
            </div>
          </div>
          <div className="mt-1 flex flex-col gap-1 border-t border-muted/20 pt-1">
            <AudioBar label={t('panel.subagents', lang)} pct={audio.speaker} tone="green" />
            <AudioBar label="Mikrofon" pct={audio.mic} tone="blue" />
            {!audio.mic_available && (
              <span className="text-[0.5rem] text-amber-500/80">{t('mic.unavailable', lang)}</span>
            )}
          </div>
        </Box>
      )}

      {showClones && (
        <Box title={t('panel.clones', lang)}>
          <div className="flex flex-col gap-0.5">
            {Object.entries(clones)
              .filter(([, n]) => n > 1)
              .map(([id, n]) => (
                <div className="flex items-center justify-between text-[0.62rem]" key={id}>
                  <span className="truncate text-muted-foreground" title={id}>{id}</span>
                  <span className="ml-1 shrink-0 font-mono tabular-nums text-muted-foreground">×{n}</span>
                </div>
              ))}
          </div>
        </Box>
      )}

      {showHarmony && (
        <Box title={t('panel.harmony', lang)}>
          <BigBar hint={modelLoaded ? `Modell: ${currentModel}` : 'kein Modell geladen'} pct={harmony} />
          <div className="mt-1 flex items-center justify-between border-t border-muted/20 pt-1">
            <span className="text-[0.6rem] text-muted-foreground">{t('panel.harmony', lang)}</span>
            <span className="font-mono text-[0.65rem] tabular-nums text-muted-foreground">
              {runningAgents.length}/{MAX_AGENTS} · {utilization}%
            </span>
          </div>
        </Box>
      )}
    </div>
  )
}
