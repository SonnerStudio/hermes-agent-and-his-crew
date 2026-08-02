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

interface SecretaryLearningData {
  graph: { nodes: SecretaryNode[]; edges: [string, string][] }
  mlx: MlxStatus
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
  const routingNodes = nodes.filter(n => n.kind === 'routing')
  const skillNodes = nodes.filter(n => n.kind === 'skill')
  const crewNodes = nodes.filter(n => n.kind === 'crew')
  const hasLearning = nodes.length > 0
  const mlx = data.mlx

  // Only show when there is something real to show.
  if (!hasLearning && !(mlx.ready && mlx.current_model)) {
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
      <Box title={t('secretary.title', lang)}>
        <div className="flex items-center gap-2">
          <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full bg-sky-500/20 text-[0.7rem]">👩‍💼</span>
          <div className="flex flex-col">
            <span className="text-[0.65rem] font-medium text-foreground">{t('secretary.learned', lang)}</span>
            <span className="text-[0.55rem] text-muted-foreground">{t('secretary.sub', lang)}</span>
          </div>
        </div>
        <MlxBadge mlx={mlx} />
      </Box>

      {routingNodes.length > 0 && (
        <Box title={t('secretary.routing', lang)}>
          <div className="flex flex-col gap-0.5">
            {routingNodes.map(n => (
              <div className="flex flex-col" key={n.id}>
                <span className="truncate text-[0.6rem] text-foreground" title={n.label}>{n.label}</span>
                <span className="text-[0.52rem] text-muted-foreground">{n.detail}</span>
              </div>
            ))}
          </div>
        </Box>
      )}

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

      {crewNodes.length > 0 && (
        <Box title={t('secretary.crew', lang)}>
          <div className="flex flex-col gap-0.5">
            {crewNodes.map(n => (
              <div className="flex flex-col" key={n.id}>
                <span className="truncate text-[0.6rem] text-foreground" title={n.label}>{n.label}</span>
                <span className="text-[0.52rem] text-muted-foreground">{n.detail}</span>
              </div>
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
