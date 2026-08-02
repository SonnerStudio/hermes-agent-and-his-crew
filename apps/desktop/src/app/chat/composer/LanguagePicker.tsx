// Language picker for the SonnerStudio Hermes fork. Stores the choice in
// localStorage; the OrchestrationStatus HUD reads it via getLang()/t().
import { useState } from 'react'
import { LANGS, getLang, setLang, type Lang } from './i18n'

export function LanguagePicker() {
  const [lang, setLocal] = useState<Lang>(getLang())

  const choose = (next: Lang) => {
    setLang(next)
    setLocal(next)
    // re-render dependent components by bumping a custom event the HUD listens to
    window.dispatchEvent(new CustomEvent('sonnerstudio:lang', { detail: next }))
  }

  return (
    <div className="flex items-center gap-1 rounded-md border border-sky-500/40 bg-(--composer-fill) px-1.5 py-0.5">
      <span className="text-[0.6rem] text-muted-foreground">🌐</span>
      <select
        aria-label="Language"
        value={lang}
        onChange={(e) => choose(e.target.value as Lang)}
        className="bg-transparent text-[0.65rem] text-foreground outline-none"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code} className="bg-background text-foreground">
            {l.label}
          </option>
        ))}
      </select>
    </div>
  )
}
