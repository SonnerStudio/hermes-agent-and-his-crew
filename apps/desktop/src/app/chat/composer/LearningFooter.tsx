import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { getLang, type Lang, localizeModule, localizeSpecialist, localizeTrend, t } from './i18n'

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

const clampPct = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

function ScoreBar({
  name,
  score,
  decisions,
  trend,
  lang
}: {
  name: string
  score: number
  decisions: number
  trend: string
  lang: Lang
}) {
  const pct = clampPct(score)
  const tone = pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-sky-500' : 'bg-amber-500'

  const trendGlyph =
    /steig|ris|styg|haus|aument|cresc|stijg|rosn|alta|раст|yüks|rost|rast|növek|creșt|nous|stig|ανοδ|상승|เพิ่ม|tăng|зрост|עלייה|बढ़|上升|上昇|ارتفاع/.test(
      trend
    )
      ? '▲'
      : /fall|dal|baiss|desc|calo|spad|qued|сниж|düş|kles|csökk|scăd|lask|fald|πτωτ|하락|ลด|giảm|спад|ירידה|घट|下降|انخفاض/.test(
            trend
          )
        ? '▼'
        : '▬'

  const localizedName = localizeSpecialist(name, lang)
  const decSuffix = t('secretary.decisions_abbr', lang) || 'dec.'

  return (
    <div className="flex min-w-[8.5rem] flex-1 flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="truncate text-[0.75rem] font-semibold text-foreground" title={localizedName}>
          {localizedName}
        </span>
        <span className="ml-1 shrink-0 font-mono text-[0.75rem] font-bold tabular-nums text-foreground/90">
          {pct} {trendGlyph}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
        <div className={cn('h-full rounded-full transition-[width] duration-500', tone)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[0.65rem] font-medium text-muted-foreground">
        {decisions} {decSuffix}
      </span>
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

        if (!alive) {
          return
        }

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

  // Build the ordered bar list: Hermes Agent → Planer → Sekretärin, with the
  // specialists packed into at most two rows UNDER that line (never one row
  // per specialist — the crew would push the composer off-screen).
  const modules = scores ? Object.keys(scores).filter(k => ['subagent', 'planner', 'secretary'].includes(k)) : []
  const agentList = scores?.agents ? Object.entries(scores.agents) : []
  const agentLines = scores?.agent_lines ?? []

  // Resolve specialists into exactly 2 compact rows
  const resolvedLines: AgentScore[][] = (() => {
    if (agentLines && agentLines.length > 0) {
      return agentLines
    }

    if (agentList.length > 0) {
      const all: AgentScore[] = agentList.map(([id, a]) => ({
        id,
        name: a.name ?? id,
        score: a.score,
        decisions: a.decisions,
        trend: a.trend
      }))

      if (all.length <= 4) {
        return [all]
      }

      const mid = Math.ceil(all.length / 2)

      return [all.slice(0, mid), all.slice(mid)]
    }

    return []
  })()

  if (!scores || (modules.length === 0 && agentList.length === 0 && resolvedLines.length === 0)) {
    return null
  }

  const hermesScore = scores
    ? clampPct(((scores.subagent?.score ?? 0) + (scores.planner?.score ?? 0) + (scores.secretary?.score ?? 0)) / 3)
    : 0

  const hermesDecisions = scores
    ? Math.max(
        1,
        (scores.subagent?.decisions ?? 0) +
          (scores.planner?.decisions ?? 0) +
          (scores.secretary?.decisions ?? 0) +
          agentList.reduce((s, [, a]) => s + (a.decisions ?? 0), 0)
      )
    : 0

  return (
    <div
      aria-label="Live learning scores"
      className={cn(
        'flex w-full flex-col gap-1.5 rounded-lg border border-sky-500/40 px-3 py-1.5',
        'bg-(--composer-fill) backdrop-blur-[0.75rem] [-webkit-backdrop-filter:blur(0.75rem)]'
      )}
      role="status"
    >
      {/* ── Top Row: Crew (Hermes Agent, Planer, Sekretärin) ── */}
      <div className="flex items-stretch gap-3">
        <span className="flex shrink-0 items-center text-[0.72rem] font-bold uppercase tracking-wider text-sky-400">
          {t('secretary.crew', lang)}
        </span>
        <ScoreBar
          decisions={hermesDecisions}
          key="hermes-agent"
          lang={lang}
          name={localizeSpecialist('Hermes Agent', lang)}
          score={hermesScore}
          trend={localizeTrend('steigend', lang)}
        />
        {(['planner', 'secretary'] as const).map(k => {
          const m = scores[k]

          if (!m || m.decisions === 0) {
            return null
          }

          return (
            <ScoreBar
              decisions={m.decisions}
              key={k}
              lang={lang}
              name={localizeModule(k, lang)}
              score={m.score}
              trend={localizeTrend(m.trend, lang)}
            />
          )
        })}
      </div>

      {/* ── Specialists: 2 compact rows side-by-side beneath the crew line ── */}
      {resolvedLines.map((line, i) => (
        <div className="flex items-stretch gap-3 pl-2" key={`agent-line-${i}`}>
          {line.map(a => (
            <ScoreBar
              decisions={a.decisions}
              key={`agent-${a.id}`}
              lang={lang}
              name={a.name}
              score={a.score}
              trend={localizeTrend(a.trend, lang)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
