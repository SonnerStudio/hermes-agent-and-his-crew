// Language picker for the SonnerStudio Hermes fork. Stores the choice in
// localStorage; the OrchestrationStatus HUD reads it via getLang()/t().
// Mirrors sonnerstudio.net's language picker — shows each language's flag.
import { useState } from 'react'

import { getLang, type Lang, LANGS, setLang } from './i18n'

export function LanguagePicker() {
  const [lang, setLocal] = useState<Lang>(getLang())

  const choose = (next: Lang) => {
    setLang(next)
    setLocal(next)
    // re-render dependent components by bumping a custom event the HUD listens to
    window.dispatchEvent(new CustomEvent('sonnerstudio:lang', { detail: next }))
  }

  return (
    <div className="flex w-full items-center gap-1 rounded-md border border-(--ui-stroke-tertiary) bg-(--ui-control-background) px-1.5 py-1">
      <span aria-hidden className="text-[0.6rem]">🌐</span>
      <select
        aria-label="Language"
        className="w-full bg-transparent text-[0.7rem] text-foreground outline-none"
        onChange={(e) => choose(e.target.value as Lang)}
        value={lang}
      >
        {LANGS.map((l) => (
          <option className="bg-background text-foreground" key={l.code} value={l.code}>
            {l.flag} {l.label}
          </option>
        ))}
      </select>
    </div>
  )
}
