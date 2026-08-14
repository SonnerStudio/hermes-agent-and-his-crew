import { en } from './en'
import type { Translations } from './types'

type TranslationOverride<T> = T extends (...args: never[]) => string
  ? T
  : T extends readonly unknown[]
    ? T
    : T extends string
      ? string
      : T extends object
        ? { [K in keyof T]?: TranslationOverride<T[K]> }
        : T

export type TranslationOverrides = TranslationOverride<Translations>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function mergeTranslations<T>(base: T, overrides: TranslationOverride<T> | undefined): T {
  if (!isRecord(base) || !isRecord(overrides)) {
    return (overrides ?? base) as T
  }

  const result: Record<string, unknown> = { ...base }

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      continue
    }

    const baseValue = result[key]
    result[key] = isRecord(baseValue) && isRecord(value) ? mergeTranslations(baseValue, value) : value
  }

  return result as T
}

export function defineLocale(overrides: TranslationOverrides): Translations {
  let cached: Translations | null = null

  const getTarget = (): Translations => {
    if (!cached) {
      cached = mergeTranslations<Translations>(en, overrides)
    }
    return cached
  }

  return new Proxy({} as Translations, {
    get(_target, prop, receiver) {
      const target = getTarget()
      const val = Reflect.get(target, prop, receiver)
      return val
    },
    has(_target, prop) {
      return Reflect.has(getTarget(), prop)
    },
    ownKeys(_target) {
      return Reflect.ownKeys(getTarget())
    },
    getOwnPropertyDescriptor(_target, prop) {
      return Reflect.getOwnPropertyDescriptor(getTarget(), prop)
    }
  })
}
