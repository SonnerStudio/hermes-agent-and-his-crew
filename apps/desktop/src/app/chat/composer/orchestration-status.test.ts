import { describe, expect, it } from 'vitest'

import { specialistOf } from './orchestration-status'

const node = (purpose: string, specialist?: string) => ({
  id: 'A1',
  progress: 0,
  purpose,
  specialist,
  status: 'running',
})

describe('sub-agent team labels', () => {
  it('prefers an explicit specialist label from the backend', () => {
    expect(specialistOf(node('irgendein Freitext', 'Audio-Spezialist'))).toBe('Audio-Spezialist')
  })

  it('derives the specialisation from the purpose text', () => {
    expect(specialistOf(node('Recherche zu MLX-Modellen'))).toBe('Recherche-Spezialist')
    expect(specialistOf(node('Refactor the composer code'))).toBe('Code-Spezialist')
    expect(specialistOf(node('Review und Test der Gates'))).toBe('Analyse-Spezialist')
    expect(specialistOf(node('Bild/Grafik für das HUD'))).toBe('Bild-Spezialist')
    expect(specialistOf(node('TTS Stimme prüfen'))).toBe('Audio-Spezialist')
    expect(specialistOf(node('READMEs übersetzen'))).toBe('Dokumentations-Spezialist')
  })

  it('is case-insensitive', () => {
    expect(specialistOf(node('WEB SEARCH batch'))).toBe('Recherche-Spezialist')
  })

  it('falls back to the purpose, then the id, when nothing matches', () => {
    expect(specialistOf(node('völlig unbekannt'))).toBe('völlig unbekannt')
    expect(specialistOf(node(''))).toBe('A1')
  })

  it('never returns an empty label (the bar must always be named)', () => {
    for (const p of ['', 'x', 'Recherche', 'zzz']) {
      expect(specialistOf(node(p)).length).toBeGreaterThan(0)
    }
  })
})
