import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { getLang, type Lang, localizeSpecialist, t } from './i18n'

// Secretary learning HUD — shows the Secretary's self-learned journey (her
// routing preferences + private planning skills as a graph) AND the native
// MLX runtime that powers her. Polls the local proxy's /secretary-learning
// endpoint (real values, never demo).
//
// The Secretary is the Managerin of Hermes Agent and runs natively on the
// local MLX runtime (per user requirement). This panel surfaces both her
// learning (so the user can SEE her improve) and the MLX model behind her.
const SECRETARY_URL = 'http://127.0.0.1:1240/secretary-learning'

interface SecretaryNode {
  id: string
  kind: 'routing' | 'skill' | 'crew'
  label: string
  detail: string
  related: string[]
}

interface MlxStatus {
  current_model: string | null
  ready: boolean
  loading_model: string | null
  catalog: string[]
}

// Shape of the `last_learning` field emitted by /secretary-learning.
// It is the most recent successful learning outcome: which agent improved and
// what was achieved (topology, clone factor, units, latency).
interface LastLearning {
  stage?: string
  agent_id?: string
  agent_name?: string
  success?: boolean
  latency_s?: number
  topology?: string
  clone_factor?: number
  units?: number
  ts?: number
}

interface SecretaryLearningData {
  graph: { nodes: SecretaryNode[]; edges: [string, string][] }
  mlx: MlxStatus
  last_learning?: LastLearning | null
  updated_at: number
}

function MlxBadge({ mlx, lang }: { mlx: MlxStatus; lang: Lang }) {
  const state = mlx.loading_model
    ? `${t('status.loading', lang)} ${mlx.loading_model}…`
    : mlx.ready && mlx.current_model
      ? mlx.current_model
      : t('status.ready', lang)

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[0.72rem] font-semibold',
        mlx.ready
          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
          : 'bg-muted/40 text-muted-foreground border border-border/40'
      )}
      title={
        mlx.ready
          ? `MLX Server ${t('status.active', lang)}: ${mlx.current_model || t('status.ready', lang)}`
          : `MLX Server ${t('status.ready', lang)}`
      }
    >
      <span
        className={cn('h-2 w-2 rounded-full', mlx.ready ? 'bg-emerald-400 animate-pulse' : 'bg-muted-foreground')}
      />
      <span className="font-bold">MLX</span>
      <span className="opacity-90 truncate max-w-[14rem]">{state}</span>
    </div>
  )
}

const BOX = 'flex flex-col gap-1.5 rounded-md border border-sky-500/40 bg-(--composer-fill) px-2.5 py-1.5'

interface BoxProps {
  title: string
  right?: React.ReactNode
  children: React.ReactNode
}

function Box({ title, right, children }: BoxProps) {
  return (
    <div className={BOX}>
      <div className="flex items-center justify-between">
        <span className="text-[0.78rem] font-bold uppercase tracking-wider text-sky-400">{title}</span>
        {right}
      </div>
      {children}
    </div>
  )
}

/**
 * Learning graph + MLX runtime status strip for the composer.
 */
export const SecretaryLearning = () => {
  const [data, setData] = useState<SecretaryLearningData | null>(null)
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
        const res = await fetch(SECRETARY_URL)

        if (!alive) {
          return
        }

        if (res.ok) {
          const json = (await res.json()) as SecretaryLearningData
          setData(json)
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

  if (!data) {
    return null
  }

  const nodes = data.graph?.nodes ?? []
  const edges = data.graph?.edges ?? []
  const skillNodes = nodes.filter(n => n.kind === 'skill')
  const hasLearning = nodes.length > 0
  const mlx = data.mlx
  const last = data.last_learning ?? null

  const AGENT_LABELS: Record<string, string> = {
    subagent: t('agent.hermes', lang),
    planner: t('agent.hermes', lang),
    secretary: t('secretary.title', lang)
  }

  function agentLabel(ev: NonNullable<typeof last>): string {
    if (ev.agent_name) {
      return localizeSpecialist(ev.agent_name, lang)
    }

    if (ev.agent_id && AGENT_LABELS[ev.agent_id]) {
      return AGENT_LABELS[ev.agent_id]
    }

    if (ev.stage && AGENT_LABELS[ev.stage]) {
      return AGENT_LABELS[ev.stage]
    }

    if (ev.agent_id) {
      return localizeSpecialist(ev.agent_id, lang)
    }

    return ev.stage ? localizeSpecialist(ev.stage, lang) : t('agent.hermes', lang)
  }

  // Only show when there is something real to show.
  if (!hasLearning && !(mlx.ready && mlx.current_model) && !last) {
    return null
  }

  const lastAgent = last ? agentLabel(last) : null
  const lastDetailParts: string[] = []

  if (last?.topology) {
    lastDetailParts.push(last.topology === 'peer' ? t('topology.peer', lang) : t('topology.managed', lang))
  }

  if (last?.clone_factor && last.clone_factor > 1) {
    lastDetailParts.push(`${last.clone_factor}× ${t('unit.clone', lang)}`)
  }

  if (typeof last?.units === 'number' && last.units > 1) {
    lastDetailParts.push(`${last.units} ${t('unit.units', lang)}`)
  }

  if (typeof last?.latency_s === 'number' && last.latency_s > 0) {
    lastDetailParts.push(`${last.latency_s.toFixed(1)}s`)
  }

  const lastDetail =
    lastDetailParts.length > 0 ? lastDetailParts.join(' · ') : t('secretary.last_detail', lang) || 'erfolgreich gelernt'

  const lastSuccess = last?.success === true || last?.success === undefined

  return (
    <div aria-label="Secretary learning & MLX runtime" className={cn('flex w-full flex-col gap-1.5')} role="status">
      {/* ── Field 1: Letzter Lernerfolg (single compact horizontal line) ── */}
      <Box title={t('secretary.learned', lang)}>
        {lastAgent ? (
          <div className="flex min-w-0 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2 truncate">
              <span
                aria-hidden
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sky-500/20 text-[0.75rem]"
              >
                {lastSuccess ? '✅' : '⚠️'}
              </span>
              <span
                className="shrink-0 text-[0.85rem] font-bold text-foreground"
                title={localizeSpecialist(lastAgent, lang)}
              >
                {localizeSpecialist(lastAgent, lang)}
              </span>
              <span className="text-muted-foreground/60 font-bold">·</span>
              <span className="truncate text-[0.78rem] font-medium text-muted-foreground" title={lastDetail}>
                {lastDetail}
              </span>
            </div>
            <MlxBadge lang={lang} mlx={mlx} />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-[0.78rem] font-medium text-muted-foreground">{t('panel.subagents_ready', lang)}</span>
            <MlxBadge lang={lang} mlx={mlx} />
          </div>
        )}
      </Box>

      {skillNodes.length > 0 && (
        <Box title={t('secretary.skills', lang)}>
          <div className="flex flex-wrap gap-1.5">
            {skillNodes.map(n => (
              <span
                className="rounded bg-muted/40 px-2 py-0.5 text-[0.72rem] font-medium text-foreground"
                key={n.id}
                title={n.detail}
              >
                {n.label}
              </span>
            ))}
          </div>
        </Box>
      )}

      {edges.length > 0 && (
        <Box title={t('secretary.graph', lang)}>
          <span className="font-mono text-[0.75rem] font-semibold tabular-nums text-foreground/90">
            {nodes.length} Nodes · {edges.length} Edges
          </span>
        </Box>
      )}
    </div>
  )
}
