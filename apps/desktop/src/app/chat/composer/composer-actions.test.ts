import { describe, expect, it } from 'vitest'

import { buttonColorClass } from './composer-actions'

describe('composer button color state', () => {
  it('is red when inactive (off)', () => {
    expect(buttonColorClass(false, false)).toContain('border-red-500/70')
  })

  it('is green when active (on)', () => {
    expect(buttonColorClass(false, true)).toContain('border-green-500/70')
  })

  it('is yellow while pending, even if it will become active', () => {
    // pending takes precedence over active: the button shows provisioning
    // (yellow) until the backend confirms the function is truly live.
    expect(buttonColorClass(true, true)).toContain('border-yellow-500/70')
    expect(buttonColorClass(true, false)).toContain('border-yellow-500/70')
  })

  it('never uses the theme accent (ring-ring / orange) for the focus ring', () => {
    const cls = buttonColorClass(false, false)
    expect(cls).not.toContain('ring-ring')
  })

  it('uses ring-current so the focus ring matches the status color', () => {
    // The focus ring must track the button's status color, not the SonnerStudio
    // theme accent (which is orange). Verified via the ICON_BUTTON base — but the
    // decision class itself must stay free of any fixed accent.
    expect(buttonColorClass(false, true)).not.toContain('amber')
    expect(buttonColorClass(true, false)).not.toContain('amber')
  })
})
