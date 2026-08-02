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

// Inactive = red, Pending = yellow, Active = green.
const BTN_INACTIVE = 'border-red-500/70 text-red-400 hover:bg-red-500/10'
const BTN_PENDING = 'border-yellow-500/70 text-yellow-400 hover:bg-yellow-500/10'
const BTN_ACTIVE = 'border-green-500/70 bg-green-500/15 text-green-400 hover:bg-green-500/20'

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
    label: 'Orchestrierte Subagentenverwendung scharf schalten',
    tip: 'Orchestrierte Subagenten — Mehrfach-Delegation an Unteragenten scharf schalten',
    method: 'subagent_orchestration.toggle'
  },
  {
    atom: $voiceCommsActive,
    pendingAtom: $voiceCommsPending,
    icon: 'mic',
    id: 'voice-comms',
    label: 'Sprachkommunikation (Hey Hermes)',
    tip: 'Sprachkommunikation (Hey Hermes) — Mikrofon ein/aus',
    method: 'voice_comms.toggle'
  },
  {
    atom: $orchestrationActive,
    pendingAtom: $orchestrationPending,
    icon: 'git-merge',
    id: 'orchestration',
    label: 'Orchestration scharf schalten',
    tip: 'Orchestration — Aufgabenzerlegung in parallele Arbeitsströme scharf schalten',
    method: 'orchestration.toggle'
  },
  {
    atom: $doubleModeActive,
    pendingAtom: $doubleModePending,
    icon: 'copy',
    id: 'double-mode',
    label: 'Double-Mode (Subagenten klonen)',
    tip: 'Double-Mode — Subagenten klonen für redundante Ausführung ein/aus',
    method: 'double_mode.toggle'
  }
]

function ComposerActionButton({ busy, onRun, spec }: { busy: boolean; onRun: (spec: ToggleSpec) => void; spec: ToggleSpec }) {
  const active = useStore(spec.atom)
  const pending = useStore(spec.pendingAtom)

  // Color follows the function state: pending (yellow) > active (green) > inactive (red).
  const colorClass = buttonColorClass(pending, active)

  return (
    <button
      aria-label={spec.label}
      aria-pressed={active}
      className={cn(ICON_BUTTON, colorClass)}
      disabled={busy}
      onClick={() => onRun(spec)}
      title={spec.tip}
      type="button"
    >
      <Codicon className="shrink-0" name={busy ? 'loading' : spec.icon} size="0.85rem" spinning={busy} />
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
  const [runningId, setRunningId] = useState<null | string>(null)

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
            // Guard against the past: while this button is mid-RPC (pending),
            // the optimistic flip is the newer intent — don't let a slower
            // /health poll clobber it back to red. The poll only reconciles
            // once the round-trip has settled (pending === false).
            if (atom.pending.get()) {
              continue
            }

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
    const id = setInterval(sync, 2000)

    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  const run = (spec: ToggleSpec) => {
    if (runningId) {
      return
    }

    const previous = spec.atom.get()
    const next = !previous

    spec.atom.set(next)
    spec.pendingAtom.set(true)
    setRunningId(spec.id)

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
        // Success: leave pending as-is. The /health poll is authoritative for
        // clearing it (the proxy reports pending:true during its own boot work,
        // e.g. starting voice_comms.py). Only a failure rolls back hard.
      } catch (error) {
        spec.atom.set(previous)
        spec.pendingAtom.set(false)
        notifyError(error, spec.label)
      } finally {
        setRunningId(null)
      }
    })()
  }

  return (
    <>
      {TOGGLES.map(spec => (
        <ComposerActionButton busy={runningId === spec.id} key={spec.id} onRun={run} spec={spec} />
      ))}
    </>
  )
})
