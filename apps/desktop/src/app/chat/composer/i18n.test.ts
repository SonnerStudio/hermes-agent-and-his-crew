import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { getLang, type Lang, LANGS, setLang, t } from './i18n'

describe('i18n', () => {
  const KEY = 'sonnerstudio.lang'

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('exposes the SonnerStudio languages (mirrors sonnerstudio.net picker)', () => {
    const codes = LANGS.map((l) => l.code)

    for (const c of ['de', 'en', 'fr', 'es', 'it', 'nl', 'pl', 'cn', 'jp', 'ru', 'pt', 'tr']) {
      expect(codes).toContain(c)
    }

    // every entry carries a flag emoji for the picker
    expect(LANGS.every((l) => l.flag.length > 0)).toBe(true)
  })

  it('returns the German title for the secretary', () => {
    expect(t('secretary.title', 'de')).toBe('Hermes-Sekretärin')
  })

  it('returns the English title for the secretary', () => {
    expect(t('secretary.title', 'en')).toBe('Hermes Secretary')
  })

  it('returns the Italian title for the secretary', () => {
    expect(t('secretary.title', 'it')).toBe('Hermes Segretaria')
  })

  it('falls back to English for an untranslated language', () => {
    // 'ru' has no dedicated dict -> t() falls back to EN.
    expect(t('secretary.title', 'ru' as Lang)).toBe('Hermes Secretary')
  })

  it('falls back to the key when the key is unknown in every language', () => {
    expect(t('nonexistent.key', 'de')).toBe('nonexistent.key')
  })

  it('default language is English when storage is empty', () => {
    expect(getLang()).toBe('en')
  })

  it('reads the language from localStorage', () => {
    localStorage.setItem(KEY, 'fr')
    expect(getLang()).toBe('fr')
  })

  it('ignores an unknown stored language and defaults to English', () => {
    localStorage.setItem(KEY, 'klingon')
    expect(getLang()).toBe('en')
  })

  it('persists the chosen language', () => {
    setLang('nl')
    expect(localStorage.getItem(KEY)).toBe('nl')
    expect(getLang()).toBe('nl')
  })
})
