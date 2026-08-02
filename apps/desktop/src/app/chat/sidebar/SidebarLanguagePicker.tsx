import { useState } from 'react'

import { getLang, type Lang, LANGS, setLang } from '../composer/i18n'

// Sidebar language picker with national flags (SonnerStudio fork).
// Lives at the TOP of the left sidebar, above "New Session". Stores the
// choice in localStorage; dependent HUDs (OrchestrationStatus, Secretary
// footer) re-render via the 'sonnerstudio:lang' custom event.
export function SidebarLanguagePicker() {
  const [lang, setLocal] = useState<Lang>(getLang())

  const choose = (next: Lang) => {
    setLang(next)
    setLocal(next)
    window.dispatchEvent(new CustomEvent('sonnerstudio:lang', { detail: next }))
  }

  return (
    <button
      aria-label="Sprache wählen"
      className="flex h-7 w-full items-center gap-2 rounded-md border border-transparent px-2 text-left text-[0.8125rem] font-medium text-(--ui-text-secondary) transition-colors duration-100 ease-out [-webkit-app-region:no-drag] hover:bg-(--ui-control-hover-background) hover:text-foreground hover:transition-none"
      onClick={() => {
        // Open a small inline menu: cycle to next, or show a popover. We use a
        // native <select> hidden behind the button for simplicity + a11y.
        const sel = document.getElementById('sidebar-lang-select') as HTMLSelectElement | null

        if (sel) {
          sel.focus()
          sel.click()
        }
      }}
      title={`Sprache: ${LANGS.find((l) => l.code === lang)?.label ?? lang}`}
      type="button"
    >
      <span aria-hidden className="text-[0.95rem] leading-none">
        {LANGS.find((l) => l.code === lang)?.flag ?? '🌐'}
      </span>
      <span className="min-w-0 flex-1 truncate">
        {LANGS.find((l) => l.code === lang)?.label ?? lang}
      </span>
      <select
        aria-hidden
        className="sr-only"
        id="sidebar-lang-select"
        onChange={(e) => choose(e.target.value as Lang)}
        tabIndex={-1}
        value={lang}
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            {l.flag} {l.label}
          </option>
        ))}
      </select>
    </button>
  )
}
