import { useStore } from '@nanostores/react'
import { type WritableAtom } from 'nanostores'
import { memo, useEffect, useState } from 'react'

import { Codicon } from '@/components/ui/codicon'
import { cn } from '@/lib/utils'
import {
  $doubleModeActive,
  $doubleModePending,
  $orchestrationActive,
  $orchestrationPending,
  $subagentOrchestrationActive,
  $subagentOrchestrationPending,
  $voiceCommsActive,
  $voiceCommsPending
} from '@/store/composer-buttons'
import { notifyError } from '@/store/notifications'

// Local RPC endpoint on the MLX proxy (127.0.0.1:1240). The composer buttons
// talk to it directly instead of the gateway WebSocket, so the handlers live at
// the edge (in mlx-proxy.py) and survive Hermes-core / desktop updates.
const RPC_URL = 'http://127.0.0.1:1240/rpc'
const HEALTH_URL = 'http://127.0.0.1:1240/health'

// Maps each RPC method to its active/pending atom pair, so the /health poll can
// reconcile the renderer's optimistic state with the proxy's ground truth.
const METHOD_ATOMS: Record<string, { active: WritableAtom<boolean>; pending: WritableAtom<boolean> }> = {
  'voice_comms.toggle': { active: $voiceCommsActive, pending: $voiceCommsPending },
  'orchestration.toggle': { active: $orchestrationActive, pending: $orchestrationPending },
  'double_mode.toggle': { active: $doubleModeActive, pending: $doubleModePending },
  'subagent_orchestration.toggle': { active: $subagentOrchestrationActive, pending: $subagentOrchestrationPending }
}

/**
 * Square icon control sized to the composer's own control height so the row
 * lines up with the `+` attach menu it sits beside. Same visual grammar as the
 * micro-action pills, minus the label.
 *
 * Color states (per your spec — driven by the BACKEND function state):
 *   - inactive:   red border/text   (function OFF)
 *   - pending:    yellow border/text (Bereitstellungsphase — RPC in flight OR
 *                  proxy reports the function mid-transition)
 *   - active:     green border/text  (function confirmed ON by the proxy)
 *
 * The active color is sourced from the proxy's /health `buttons` map (the real
 * function state), not just the optimistic local flip — so the button color
 * reflects what the backend actually did.
 *
 * NEVER `pointer-events-none` — the pop-out drag region is an absolute sibling
 * behind the composer chrome, so a control that stops taking pointer events
 * silently becomes a drag handle.
 */
const ICON_BUTTON = cn(
  'inline-flex size-(--composer-control-size) shrink-0 cursor-pointer items-center justify-center rounded-full',
  'border bg-(--composer-fill) backdrop-blur-[0.75rem] [-webkit-backdrop-filter:blur(0.75rem)]',
  'transition-colors',
  'disabled:cursor-default disabled:opacity-50',
  'focus-visible:outline-none focus-visible:ring-[0.1875rem] focus-visible:ring-current/50'
)

// Inactive = rot ("Aus"), Pending = gelb ("Bereitschaft herstellen"), Active = grün ("Bereit").
const BTN_INACTIVE = 'border-red-500/70 bg-red-500/10 text-red-400 hover:border-red-500/90 hover:bg-red-500/20 hover:text-red-300'
const BTN_PENDING = 'border-yellow-500/70 bg-yellow-500/20 text-yellow-300 hover:border-yellow-500/90 hover:bg-yellow-500/30 hover:text-yellow-200 animate-pulse'
const BTN_ACTIVE = 'border-green-500/70 bg-green-500/20 text-green-400 hover:border-green-500/90 hover:bg-green-500/30 hover:text-green-300'

// Pure decision: pending (yellow) > active (green) > inactive (red).
// Exported for tests; the button color must follow the real function state.
export function buttonColorClass(pending: boolean, active: boolean): string {
  return pending ? BTN_PENDING : active ? BTN_ACTIVE : BTN_INACTIVE
}

interface ToggleSpec {
  atom: WritableAtom<boolean>
  pendingAtom: WritableAtom<boolean>
  icon: string
  id: string
  label: string
  tip: string
  method: string
}

const TOGGLES: ToggleSpec[] = [
  {
    atom: $subagentOrchestrationActive,
    pendingAtom: $subagentOrchestrationPending,
    icon: 'type-hierarchy',
    id: 'subagent-orchestration',
    label: 'Sub-Agenten',
    tip: 'Sub-Agenten — spezialisierte Unteragenten scharf schalten (grün = bereit, gelb = in Bereitschaft, rot = aus)',
    method: 'subagent_orchestration.toggle'
  },
  {
    atom: $voiceCommsActive,
    pendingAtom: $voiceCommsPending,
    icon: 'mic',
    id: 'voice-comms',
    label: 'Sekretärin',
    tip: 'Sekretärin — Managerin der Agenten und Sprachschnittstelle (grün = bereit, gelb = in Bereitschaft, rot = aus)',
    method: 'voice_comms.toggle'
  },
  {
    atom: $orchestrationActive,
    pendingAtom: $orchestrationPending,
    icon: 'copy',
    id: 'orchestration',
    label: 'Temporäres Klonen',
    tip: 'Temporäres Klonen — Agenten für die Dauer einer Aufgabe vervielfältigen (grün = bereit, gelb = in Bereitschaft, rot = aus)',
    method: 'orchestration.toggle'
  },
  {
    atom: $doubleModeActive,
    pendingAtom: $doubleModePending,
    icon: 'git-merge',
    id: 'double-mode',
    label: 'Harmonisierte Orchestrierung',
    tip: 'Harmonisierte Orchestrierung — Agenten synchronisieren und gemeinsam steuern (grün = bereit, gelb = in Bereitschaft, rot = aus)',
    method: 'double_mode.toggle'
  }
]

function ComposerActionButton({ busy, onRun, spec }: { busy: boolean; onRun: (spec: ToggleSpec) => void; spec: ToggleSpec }) {
  const active = useStore(spec.atom)
  const pending = useStore(spec.pendingAtom)

  // Color follows the function state: pending (yellow) > active (green) > inactive (red).
  const colorClass = buttonColorClass(pending || busy, active)

  return (
    <button
      aria-busy={busy || pending}
      aria-label={spec.label}
      aria-pressed={active}
      className={cn(ICON_BUTTON, colorClass)}
      // NOT `disabled`: that greys the button out (opacity-50) and would hide
      // the yellow pending phase behind a dimmed icon. `run()` already ignores
      // re-entrant clicks per button, so the guard lives there, not here.
      onClick={() => onRun(spec)}
      title={spec.tip}
      type="button"
    >
      <Codicon className="shrink-0" name={(busy || pending) ? 'loading' : spec.icon} size="0.85rem" spinning={busy || pending} />
    </button>
  )
}

/**
 * The four composer toggles that sit directly right of the `+` attach menu.
 * The 4th (subagent-orchestration) is first, immediately behind the `+`.
 *
 * Renderer never touches Node/Electron: every native effect is an RPC to the
 * local MLX proxy. The atom flips optimistically, enters `pending` (yellow)
 * while the RPC is in flight, then the /health poll reconciles it with the
 * proxy's real `buttons` state — settling to green (ON) or reverting to red
 * (OFF) — so the button color always reflects the actual function state, not
 * just the local guess.
 */
export const ComposerActions = memo(function ComposerActions() {
  // Per-button in-flight set. A single shared `runningId` made one slow RPC
  // (the Secretary boots a voice process) freeze ALL four buttons; each button
  // must react instantly and independently.
  const [runningIds, setRunningIds] = useState<ReadonlySet<string>>(() => new Set())

  // Poll the proxy /health endpoint and reconcile each button's active atom
  // with the backend's ground-truth `buttons` map. This makes the color state
  // follow the real function status (red/yellow/green) instead of only the
  // optimistic local toggle.
  useEffect(() => {
    let alive = true

    const sync = async () => {
      try {
        const res = await fetch(HEALTH_URL)

        if (!res.ok) {
          return
        }

        const data = await res.json()

        if (!alive) {
          return // component unmounted — don't write into dead atoms
        }

        const buttons = data?.buttons

        if (!buttons || typeof buttons !== 'object') {
          return
        }

        for (const [method, atom] of Object.entries(METHOD_ATOMS)) {
          if (method in buttons) {
            const b = buttons[method]

            // New format: { active, pending }. Legacy format: bare bool.
            if (typeof b === 'object' && b !== null) {
              atom.active.set(Boolean(b.active))
              atom.pending.set(Boolean(b.pending))
            } else {
              atom.active.set(Boolean(b))
              atom.pending.set(false)
            }
          }
        }
      } catch {
        // Proxy unreachable — keep optimistic local state; will retry next tick.
      }
    }

    void sync()
    const id = setInterval(sync, 1500)

    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  const run = (spec: ToggleSpec) => {
    // Only this button is gated — a second click on the SAME button while its
    // RPC is in flight is ignored; the other three stay live.
    if (runningIds.has(spec.id)) {
      return
    }

    const previous = spec.atom.get()
    const next = !previous

    // Instant feedback: flip optimistically and go yellow (pending) in the
    // same tick as the click, before the RPC round-trip.
    spec.pendingAtom.set(true)
    setRunningIds(prev => new Set(prev).add(spec.id))

    void (async () => {
      try {
        const res = await fetch(RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ method: spec.method, params: { active: next } })
        })

        if (!res.ok) {
          const detail = await res.json().catch(() => ({}))
          throw new Error(detail?.error?.message || `RPC ${res.status}`)
        }

        const data = await res.json().catch(() => ({}))
        spec.atom.set(typeof data.active === 'boolean' ? data.active : next)
        spec.pendingAtom.set(Boolean(data.pending))
      } catch (error) {
        spec.atom.set(previous)
        spec.pendingAtom.set(false)
        notifyError(error, spec.label)
      } finally {
        setRunningIds(prev => {
          const nextIds = new Set(prev)

          nextIds.delete(spec.id)

          return nextIds
        })
      }
    })()
  }

  return (
    <>
      {TOGGLES.map(spec => (
        <ComposerActionButton busy={runningIds.has(spec.id)} key={spec.id} onRun={run} spec={spec} />
      ))}
    </>
  )
})
