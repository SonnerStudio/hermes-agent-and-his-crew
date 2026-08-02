import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { getLang, LANGS, setLang, t, type Lang } from './i18n'

describe('i18n', () => {
  const KEY = 'sonnerstudio.lang'

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('exposes the five SonnerStudio languages', () => {
    const codes = LANGS.map((l) => l.code).sort()
    expect(codes).toEqual(['de', 'en', 'es', 'fr', 'nl'].sort())
  })

  it('returns the German title for the secretary', () => {
    expect(t('secretary.title', 'de')).toBe('Hermes-Sekretärin')
  })

  it('returns the English title for the secretary', () => {
    expect(t('secretary.title', 'en')).toBe('Hermes Secretary')
  })

  it('falls back to English for a missing key', () => {
    // 'xx' is not in the table; t() must fall back to EN, then to the key.
    expect(t('secretary.title', 'xx' as Lang)).toBe('Hermes Secretary')
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
