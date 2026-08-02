import { atom } from 'nanostores'

// State atoms for the four composer toggle buttons that sit directly right of
// the `+` attach menu. Each flips optimistically in the renderer and is
// confirmed (or reverted) by the backend via the MLX proxy RPC endpoint
// (`/rpc`). `pending` marks the window between a click and the backend's
// acknowledgement — the button shows its yellow "Bereitstellung" state then.
export const $voiceCommsActive = atom(false)
export const $orchestrationActive = atom(false)
export const $doubleModeActive = atom(false)
// 4th button: sharp-enables orchestrated subagent use (sits right behind `+`).
export const $subagentOrchestrationActive = atom(false)

// Pending flags per button — true while the RPC round-trip is in flight.
export const $voiceCommsPending = atom(false)
export const $orchestrationPending = atom(false)
export const $doubleModePending = atom(false)
export const $subagentOrchestrationPending = atom(false)

export type ComposerButtonId = 'voice-comms' | 'orchestration' | 'double-mode' | 'subagent-orchestration'
