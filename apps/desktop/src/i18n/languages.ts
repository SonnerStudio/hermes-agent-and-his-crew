import { normalize } from '@/lib/text'

import type { Locale } from './types'

export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_OPTIONS = [
  { id: 'de', name: 'Deutsch', englishName: 'German', configValue: 'de' },
  { id: 'en', name: 'English', englishName: 'English', configValue: 'en' },
  { id: 'fr', name: 'Français', englishName: 'French', configValue: 'fr' },
  { id: 'es', name: 'Español', englishName: 'Spanish', configValue: 'es' },
  { id: 'it', name: 'Italiano', englishName: 'Italian', configValue: 'it' },
  { id: 'nl', name: 'Nederlands', englishName: 'Dutch', configValue: 'nl' },
  { id: 'pl', name: 'Polski', englishName: 'Polish', configValue: 'pl' },
  { id: 'zh', name: '简体中文', englishName: 'Simplified Chinese', configValue: 'zh' },
  { id: 'zh-hant', name: '繁體中文', englishName: 'Traditional Chinese', configValue: 'zh-hant' },
  { id: 'ja', name: '日本語', englishName: 'Japanese', configValue: 'ja' },
  { id: 'ar', name: 'العربية', englishName: 'Arabic', configValue: 'ar' },
  { id: 'pt', name: 'Português', englishName: 'Portuguese', configValue: 'pt' },
  { id: 'ru', name: 'Русский', englishName: 'Russian', configValue: 'ru' },
  { id: 'tr', name: 'Türkçe', englishName: 'Turkish', configValue: 'tr' },
  { id: 'el', name: 'Ελληνικά', englishName: 'Greek', configValue: 'el' },
  { id: 'ko', name: '한국어', englishName: 'Korean', configValue: 'ko' },
  { id: 'th', name: 'ไทย', englishName: 'Thai', configValue: 'th' },
  { id: 'cz', name: 'Čeština', englishName: 'Czech', configValue: 'cz' },
  { id: 'sk', name: 'Slovenčina', englishName: 'Slovak', configValue: 'sk' },
  { id: 'hu', name: 'Magyar', englishName: 'Hungarian', configValue: 'hu' },
  { id: 'ro', name: 'Română', englishName: 'Romanian', configValue: 'ro' },
  { id: 'fi', name: 'Suomi', englishName: 'Finnish', configValue: 'fi' },
  { id: 'dk', name: 'Dansk', englishName: 'Danish', configValue: 'dk' },
  { id: 'no', name: 'Norsk', englishName: 'Norwegian', configValue: 'no' },
  { id: 'se', name: 'Svenska', englishName: 'Swedish', configValue: 'se' },
  { id: 'il', name: 'עברית', englishName: 'Hebrew', configValue: 'il' },
  { id: 'in', name: 'हिन्दी', englishName: 'Hindi', configValue: 'in' },
  { id: 'sa', name: 'العربية (SA)', englishName: 'Arabic (Saudi)', configValue: 'sa' },
  { id: 'vn', name: 'Tiếng Việt', englishName: 'Vietnamese', configValue: 'vn' },
  { id: 'tw', name: '繁體中文 (TW)', englishName: 'Traditional Chinese (Taiwan)', configValue: 'tw' },
  { id: 'ua', name: 'Українська', englishName: 'Ukrainian', configValue: 'ua' },
  { id: 'au', name: 'English (AU)', englishName: 'English (Australia)', configValue: 'au' },
  { id: 'ca', name: 'English (CA)', englishName: 'English (Canada)', configValue: 'ca' },
  { id: 'gb', name: 'English (UK)', englishName: 'English (UK)', configValue: 'gb' },
  { id: 'us', name: 'English (US)', englishName: 'English (US)', configValue: 'us' },
  { id: 'za', name: 'Afrikaans', englishName: 'Afrikaans', configValue: 'za' },
  { id: 'yi', name: 'Jiddisch (Lateinisch)', englishName: 'Yiddish (Latin)', configValue: 'yi' },
  { id: 'run', name: 'Runenschrift', englishName: 'Runic', configValue: 'run' }
] as const satisfies readonly { configValue: string; englishName: string; id: Locale; name: string }[]

export const LOCALE_META: Record<Locale, { name: string; englishName: string }> = Object.fromEntries(
  LOCALE_OPTIONS.map(locale => [locale.id, { name: locale.name, englishName: locale.englishName }])
) as Record<Locale, { name: string; englishName: string }>

const LOCALE_ALIASES: Record<string, Locale> = {
  de: 'de',
  'de-de': 'de',
  de_de: 'de',
  'de-at': 'de',
  'de-ch': 'de',
  en: 'en',
  'en-us': 'en',
  en_us: 'en',
  'en-gb': 'gb',
  'en-au': 'au',
  'en-ca': 'ca',
  zh: 'zh',
  'zh-cn': 'zh',
  zh_cn: 'zh',
  'zh-hans': 'zh',
  zh_hans: 'zh',
  'zh-hans-cn': 'zh',
  zh_hans_cn: 'zh',
  'zh-tw': 'zh-hant',
  zh_tw: 'zh-hant',
  'zh-hk': 'zh-hant',
  zh_hk: 'zh-hant',
  'zh-mo': 'zh-hant',
  zh_mo: 'zh-hant',
  'zh-hant': 'zh-hant',
  zh_hant: 'zh-hant',
  'zh-hant-tw': 'zh-hant',
  zh_hant_tw: 'zh-hant',
  'zh-hant-hk': 'zh-hant',
  zh_hant_hk: 'zh-hant',
  ja: 'ja',
  'ja-jp': 'ja',
  ja_jp: 'ja',
  jp: 'ja',
  'jp-jp': 'ja',
  jp_jp: 'ja',
  cn: 'zh',
  'cn-cn': 'zh',
  cn_cn: 'zh',
  ar: 'ar',
  'ar-sa': 'ar',
  ar_sa: 'ar',
  'ar-ae': 'ar',
  ar_ae: 'ar',
  'ar-eg': 'ar',
  ar_eg: 'ar',
  arabic: 'ar',
  العربية: 'ar',
  fr: 'fr',
  'fr-fr': 'fr',
  es: 'es',
  'es-es': 'es',
  it: 'it',
  'it-it': 'it',
  nl: 'nl',
  'nl-nl': 'nl',
  pl: 'pl',
  'pl-pl': 'pl',
  pt: 'pt',
  'pt-pt': 'pt',
  'pt-br': 'pt',
  ru: 'ru',
  'ru-ru': 'ru',
  tr: 'tr',
  'tr-tr': 'tr',
  el: 'el',
  ko: 'ko',
  th: 'th',
  cz: 'cz',
  sk: 'sk',
  hu: 'hu',
  ro: 'ro',
  fi: 'fi',
  dk: 'dk',
  no: 'no',
  se: 'se',
  il: 'il',
  in: 'in',
  sa: 'sa',
  vn: 'vn',
  tw: 'tw',
  ua: 'ua',
  au: 'au',
  ca: 'ca',
  gb: 'gb',
  us: 'us',
  za: 'za',
  yi: 'yi',
  run: 'run'
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && LOCALE_OPTIONS.some(locale => locale.id === value)
}

export function normalizeLocale(value: unknown): Locale {
  if (typeof value !== 'string') {
    return DEFAULT_LOCALE
  }

  return LOCALE_ALIASES[normalize(value)] ?? DEFAULT_LOCALE
}

export function isSupportedLocaleValue(value: unknown): boolean {
  return typeof value === 'string' && LOCALE_ALIASES[normalize(value)] != null
}

export function localeConfigValue(locale: Locale): string {
  return LOCALE_OPTIONS.find(item => item.id === locale)?.configValue ?? DEFAULT_LOCALE
}
