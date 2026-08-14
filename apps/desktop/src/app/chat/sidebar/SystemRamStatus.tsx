import { useEffect, useState } from 'react'

import { getLang, type Lang, t as tComposer } from '@/app/chat/composer/i18n'
import { useI18n } from '@/i18n'

const HEALTH_URL = 'http://127.0.0.1:1240/health'

export function SystemRamStatus() {
  const { t } = useI18n()
  const [ram, setRam] = useState<{ total: number; free: number; percent: number } | null>(null)
  const [lang, setLangState] = useState<Lang>(() => getLang())

  useEffect(() => {
    const onLang = (e: Event) => setLangState((e as CustomEvent<Lang>).detail)
    window.addEventListener('sonnerstudio:lang', onLang as EventListener)

    return () => window.removeEventListener('sonnerstudio:lang', onLang as EventListener)
  }, [])

  useEffect(() => {
    let alive = true

    const sync = async () => {
      try {
        const res = await fetch(HEALTH_URL)

        if (!alive || !res.ok) {
          return
        }

        const data = await res.json()

        if (data?.memory) {
          setRam({
            total: data.memory.total_gb || 16.0,
            free: data.memory.free_gb || 0,
            percent: data.memory.percent || 0
          })
        }
      } catch {
        // ignore
      }
    }

    void sync()
    const id = setInterval(sync, 2000)

    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  if (!ram) {
    return null
  }

  return (
    <div className="my-1 flex flex-col gap-1 rounded-md border border-(--ui-stroke-tertiary) bg-(--ui-control-background) px-3 py-2">
      <span className="text-[0.6rem] font-medium uppercase tracking-wider text-muted-foreground">
        {tComposer('system.ram', lang) || 'System RAM'}
      </span>
      <div className="flex items-center justify-between text-[0.6rem]">
        <span className="font-mono font-medium text-sky-400 tabular-nums">{Math.round(ram.percent)}%</span>
        <span className="font-mono text-muted-foreground tabular-nums">
          {t.common.free}: {ram.free.toFixed(1)} GB / {ram.total.toFixed(1)} GB
        </span>
      </div>
      <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-muted/40">
        <div
          className="h-full rounded-full bg-sky-500 transition-all duration-500"
          style={{ width: `${ram.percent}%` }}
        />
      </div>
    </div>
  )
}
