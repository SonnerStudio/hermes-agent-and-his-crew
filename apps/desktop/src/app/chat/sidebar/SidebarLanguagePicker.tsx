import { useEffect, useState } from "react"

import { Codicon } from "@/components/ui/codicon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useI18n } from "@/i18n"
import type { Locale } from "@/i18n/types"

import { getLang, type Lang, LANGS, setLang } from "../composer/i18n"

// Sidebar language picker with national flags (SonnerStudio fork).
// Lives at the TOP of the left sidebar, above "New Session". Stores the
// choice in localStorage; dependent HUDs (OrchestrationStatus, Secretary
// footer) re-render via the "sonnerstudio:lang" custom event and core UI
// re-renders via useI18n().
export function SidebarLanguagePicker() {
  const [lang, setLocal] = useState<Lang>(getLang())
  const { setLocale } = useI18n()

  useEffect(() => {
    const activeLang = getLang()

    if (activeLang) {
      void setLocale(activeLang as Locale)
    }
  }, [setLocale])

  const choose = (next: Lang) => {
    setLang(next)
    setLocal(next)
    window.dispatchEvent(new CustomEvent("sonnerstudio:lang", { detail: next }))
    void setLocale(next as Locale)
  }

  const current = LANGS.find(l => l.code === lang) ?? LANGS[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Sprache wählen"
          className="flex h-7 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-transparent px-2 text-left text-[0.8125rem] font-medium text-(--ui-text-secondary) transition-colors duration-100 ease-out [-webkit-app-region:no-drag] hover:bg-(--ui-control-hover-background) hover:text-foreground hover:transition-none"
          title={`Sprache: ${current.label}`}
          type="button"
        >
          <div className="flex min-w-0 items-center gap-2">
            <span aria-hidden className="text-[0.95rem] leading-none">
              {current.flag}
            </span>
            <span className="min-w-0 truncate text-foreground">
              {current.label}
            </span>
          </div>
          <Codicon className="size-3 shrink-0 text-muted-foreground opacity-70" name="chevron-down" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="z-50 max-h-72 w-48 overflow-y-auto">
        {LANGS.map(l => (
          <DropdownMenuItem
            className="flex cursor-pointer items-center justify-between gap-2 text-xs"
            key={l.code}
            onSelect={() => choose(l.code)}
          >
            <div className="flex items-center gap-2">
              <span className="text-[0.95rem] leading-none">{l.flag}</span>
              <span className={l.code === lang ? "font-semibold text-sky-400" : "text-foreground"}>
                {l.label}
              </span>
            </div>
            {l.code === lang && (
              <Codicon className="size-3 text-sky-400" name="check" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
