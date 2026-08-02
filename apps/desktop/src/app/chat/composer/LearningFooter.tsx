import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { getLang, type Lang, t } from './i18n'

// Live learning-score footer for the crew modules (Sub-Agenten, Planer,
// Sekretärin). Shows a 0-100 self-improvement score per module, computed by
// the Secretary's shared learning memory (Option B). The bar fills with the
// score; higher = the module has learned more consistent, successful
// routing/planning decisions over time. Polls the local proxy's
// /secretary-learning endpoint (real values, never demo).
//
// Rendered as a slim strip ABOVE the composer underside (a little higher than
// the window's very bottom edge) so it reads as a status footer, not a
// buried corner. Hidden when no module has learned anything yet.
const SECRETARY_URL = 'http://127.0.0.1:1240/secretary-learning'

interface ModuleScore {
  score: number
  decisions: number
  trend: string
}

interface SecretaryLearning {
  scores: Record<string, ModuleScore>
}

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
 * Learning-score footer. One slim strip with a live score bar per crew module.
 * Hidden until at least one module has recorded a learning decision.
 */
export const LearningFooter = () => {
  const [scores, setScores] = useState<Record<string, ModuleScore>>({})
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
          setScores(json.scores ?? {})
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

  const modules = Object.keys(scores).filter(k => (scores[k]?.decisions ?? 0) > 0)

  if (modules.length === 0) {
    return null
  }

  return (
    <div
      aria-label="Live learning scores"
      className={cn(
        'flex items-stretch gap-3 rounded-lg border border-sky-500/40 px-3 py-1.5',
        'bg-(--composer-fill) backdrop-blur-[0.75rem] [-webkit-backdrop-filter:blur(0.75rem)]'
      )}
      role="status"
    >
      <span className="flex shrink-0 items-center text-[0.55rem] font-medium uppercase tracking-wide text-muted-foreground">
        {t('secretary.crew', lang)}
      </span>
      {modules.map(k => (
        <ScoreBar
          decisions={scores[k].decisions}
          key={k}
          lang={lang}
          name={MODULE_LABELS[k] ?? k}
          score={scores[k].score}
          trend={scores[k].trend}
        />
      ))}
    </div>
  )
}
