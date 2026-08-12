import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { getLang, type Lang, t } from './i18n'

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

const BOX = 'flex flex-col gap-1.5 rounded-md border border-sky-500/40 bg-(--composer-fill) px-2.5 py-1.5'

function Box({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(BOX, 'min-w-[11rem] flex-1', className)}>
      <span className="text-[0.6rem] font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </span>
      {children}
    </div>
  )
}

function MlxBadge({ mlx }: { mlx: MlxStatus }) {
  const state = mlx.loading_model
    ? `lädt ${mlx.loading_model}…`
    : mlx.ready && mlx.current_model
      ? mlx.current_model
      : 'kein Modell'

  const tone = mlx.ready && mlx.current_model
    ? 'bg-sky-500/20 text-sky-300'
    : 'bg-muted/30 text-muted-foreground'

  return (
    <div className="mt-0.5 flex items-center gap-1.5">
      <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-sky-500/20 text-[0.6rem]">🧠</span>
      <span className={cn('rounded px-1.5 py-0.5 text-[0.58rem] font-medium', tone)} title={state}>{state}</span>
    </div>
  )
}

/**
 * Secretary learning strip BELOW the composer. Shows her learned routing
 * preferences + skills (graph) and the native MLX runtime powering her.
 * Hidden when the Secretary has learned nothing yet and no model is loaded.
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
  const last = data.last_learning

  // Format the last learning success: which agent + what was achieved.
  const lastAgent = last?.agent_name || last?.agent_id || (last?.stage
    ? (last.stage.charAt(0).toUpperCase() + last.stage.slice(1))
    : null)

  const lastDetailParts: string[] = []

  if (last?.topology) {lastDetailParts.push(last.topology)}

  if (last?.clone_factor && last.clone_factor > 1) {lastDetailParts.push(`×${last.clone_factor} Klon`)}

  if (typeof last?.units === 'number') {lastDetailParts.push(`${last.units} Einh.`)}

  if (typeof last?.latency_s === 'number') {lastDetailParts.push(`${last.latency_s.toFixed(1)}s`)}
  const lastDetail = lastDetailParts.length > 0 ? lastDetailParts.join(' · ') : 'erfolgreich gelernt'
  const lastSuccess = last?.success === true || last?.success === undefined

  // Only show when there is something real to show.
  if (!lastAgent && !hasLearning && !(mlx.ready && mlx.current_model)) {
    return null
  }

  return (
    <div
      aria-label="Secretary learning & MLX runtime"
      className={cn(
        'flex flex-wrap items-stretch gap-2 rounded-lg border border-sky-500/40 p-2',
        'bg-(--composer-fill) backdrop-blur-[0.75rem] [-webkit-backdrop-filter:blur(0.75rem)]'
      )}
      role="status"
    >
      <Box title={t('secretary.learned', lang)}>
        {lastAgent ? (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-sky-500/20 text-[0.6rem]">✅</span>
              <span className="truncate text-[0.62rem] font-medium text-foreground" title={lastAgent}>{lastAgent}</span>
            </div>
            <span className="text-[0.52rem] text-muted-foreground">{lastDetail}</span>
            {!lastSuccess && (
              <span className="text-[0.5rem] text-amber-500/80">nicht erfolgreich</span>
            )}
          </div>
        ) : (
          <span className="text-[0.62rem] text-muted-foreground">{t('secretary.subagents', lang)}</span>
        )}
        <MlxBadge mlx={mlx} />
      </Box>

      {skillNodes.length > 0 && (
        <Box title={t('secretary.skills', lang)}>
          <div className="flex flex-wrap gap-1">
            {skillNodes.map(n => (
              <span
                className="rounded bg-muted/30 px-1.5 py-0.5 text-[0.55rem] text-muted-foreground"
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
          <span className="font-mono text-[0.6rem] tabular-nums text-muted-foreground">
            {nodes.length} Knoten · {edges.length} Kanten
          </span>
        </Box>
      )}
    </div>
  )
}
