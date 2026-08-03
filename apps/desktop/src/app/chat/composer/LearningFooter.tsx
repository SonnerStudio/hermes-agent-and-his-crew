import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { getLang, type Lang, t } from './i18n'

// Live learning-score footer for the crew modules + every Sub-Agent. Shows a
// 0-100 self-improvement score per module/agent, computed by the Secretary's
// shared learning memory (Option B). The bar fills with the score; higher = the
// module/agent has learned more consistent, successful decisions over time.
// Polls the local proxy's /secretary-learning endpoint (real values, never demo).
//
// Layout (left → right):
//   1. Hermes Agent        (the core agent itself)
//   2..n. Sub-Agenten       (one bar per delegated Sub-Agent, named)
//   n+1. Planer
//   n+2. Sekretärin
// Rendered as a slim strip ABOVE the composer underside (a little higher than
// the window's very bottom edge) so it reads as a status footer. Hidden until
// at least one module has recorded a learning decision.
const SECRETARY_URL = 'http://127.0.0.1:1240/secretary-learning'

interface ModuleScore {
  score: number
  decisions: number
  trend: string
  name?: string
}

interface AgentScore extends ModuleScore {
  id: string
  name: string
}

interface SecretaryLearning {
  scores: {
    subagent: ModuleScore
    planner: ModuleScore
    secretary: ModuleScore
    agents?: Record<string, ModuleScore>
    /** Specialists pre-packed by the backend into at most two compact rows. */
    agent_lines?: AgentScore[][]
  }
}

// Fixed module labels (crew roles). Sub-Agent names come from the data.
const MODULE_LABELS: Record<string, string> = {
  subagent: 'Sub-Agenten',
  planner: 'Planer',
  secretary: 'Sekretärin',
}

const clampPct = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

function ScoreBar({ name, score, decisions, trend, lang }: {
  name: string
  score: number
  decisions: number
  trend: string
  lang: Lang
}) {
  const pct = clampPct(score)
  const tone = pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-sky-500' : 'bg-amber-500'
  const trendGlyph = trend === 'steigend' ? '▲' : trend === 'fallend' ? '▼' : '▬'

  return (
    <div className="flex min-w-[8rem] flex-1 flex-col gap-0.5">
      <div className="flex items-center justify-between">
        <span className="truncate text-[0.58rem] text-muted-foreground" title={name}>{name}</span>
        <span className="ml-1 shrink-0 font-mono text-[0.58rem] tabular-nums text-muted-foreground">
          {pct} {trendGlyph}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted/40">
        <div className={cn('h-full rounded-full transition-[width] duration-500', tone)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[0.5rem] text-muted-foreground/70">{decisions} Entsch.</span>
    </div>
  )
}

/**
 * Learning-score footer. One slim strip with a live score bar per crew module
 * and per Sub-Agent. Hidden until at least one module has recorded a learning
 * decision.
 */
export const LearningFooter = () => {
  const [scores, setScores] = useState<SecretaryLearning['scores'] | null>(null)
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

        if (!alive) {return}

        if (res.ok) {
          const json = (await res.json()) as SecretaryLearning
          setScores(json.scores ?? null)
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

  const modules = scores ? Object.keys(scores).filter(k => ['subagent', 'planner', 'secretary'].includes(k)) : []
  const agentList = scores?.agents ? Object.entries(scores.agents) : []
  const specialistLines = scores?.agent_lines ?? []

  // Build the data groups:
  //   A. Hermes Agent (core, own area)
  //   B. Sub-Agenten (each its own bar, vertically stacked)
  //   C. Sekretärin (own area)
  // Rendered as THREE stacked sections (never all side-by-side).

  const hermesScore = scores ? clampPct(
    ((scores.subagent?.score ?? 0) +
      (scores.planner?.score ?? 0) +
      (scores.secretary?.score ?? 0)) / 3,
  ) : 0

  const hermesDecisions = scores ? Math.max(
    1,
    (scores.subagent?.decisions ?? 0) +
      (scores.planner?.decisions ?? 0) +
      (scores.secretary?.decisions ?? 0) +
      agentList.reduce((s, [, a]) => s + (a.decisions ?? 0), 0),
  ) : 0

  if (!scores || (modules.length === 0 && agentList.length === 0 && specialistLines.length === 0)) {
    return null
  }

  return (
    <div
      aria-label="Live learning scores"
      className={cn(
        'flex flex-col gap-1.5 rounded-lg border border-sky-500/40 px-3 py-1.5',
        'bg-(--composer-fill) backdrop-blur-[0.75rem] [-webkit-backdrop-filter:blur(0.75rem)]',
      )}
      role="status"
    >
      {/* ── A. Hermes Agent (own area) ── */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[0.55rem] font-medium uppercase tracking-wide text-muted-foreground">
          {t('secretary.crew', lang)}
        </span>
        <ScoreBar
          decisions={hermesDecisions}
          key="hermes-agent"
          lang={lang}
          name="Hermes Agent"
          score={hermesScore}
          trend="steigend"
        />
      </div>

      {/* ── B. Sub-Agenten (JEDER einzeln mit Spezialisierung, vertikal gestapelt) ── */}
      {agentList.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-[0.55rem] font-medium uppercase tracking-wide text-muted-foreground">
            {t('secretary.subagents', lang)}
          </span>
          {agentList.map(([id, a]) => (
            <ScoreBar
              decisions={a.decisions}
              key={`agent-${id}`}
              lang={lang}
              name={a.name ?? id}
              score={a.score}
              trend={a.trend}
            />
          ))}
        </div>
      )}

      {/* Specialist summary lines (fallback if backend sends packed lines) */}
      {specialistLines.length > 0 && agentList.length === 0 && specialistLines.map((line, i) => (
        <div className="flex flex-col gap-1" key={`spec-line-${i}`}>
          <span className="text-[0.55rem] font-medium uppercase tracking-wide text-muted-foreground">
            {t('secretary.subagents', lang)}
          </span>
          {line.map(a => (
            <ScoreBar
              decisions={a.decisions}
              key={`spec-${a.id}`}
              lang={lang}
              name={a.name}
              score={a.score}
              trend={a.trend}
            />
          ))}
        </div>
      ))}

      {/* ── C. Sekretärin (own area) ── */}
      {scores.secretary && scores.secretary.decisions > 0 && (
        <div className="flex flex-col gap-0.5">
          <span className="text-[0.55rem] font-medium uppercase tracking-wide text-muted-foreground">
            {t('secretary.title', lang)}
          </span>
          <ScoreBar
            decisions={scores.secretary.decisions}
            key="secretary"
            lang={lang}
            name={MODULE_LABELS.secretary}
            score={scores.secretary.score}
            trend={scores.secretary.trend}
          />
        </div>
      )}
    </div>
  )
}
