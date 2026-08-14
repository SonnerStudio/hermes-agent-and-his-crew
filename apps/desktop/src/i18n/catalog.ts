import { en } from './en'
import { ar } from './ar'
import { cz } from './cz'
import { de } from './de'
import { dk } from './dk'
import { el } from './el'
import { es } from './es'
import { fi } from './fi'
import { fr } from './fr'
import { hu } from './hu'
import { il } from './il'
import { in_ as inLocale } from './in'
import { it } from './it'
import { ja } from './ja'
import { ko } from './ko'
import { nl } from './nl'
import { no } from './no'
import { pl } from './pl'
import { pt } from './pt'
import { ro } from './ro'
import { ru } from './ru'
import { run } from './run'
import { se } from './se'
import { sk } from './sk'
import { th } from './th'
import { tr } from './tr'
import type { Locale, Translations } from './types'
import { ua } from './ua'
import { vn } from './vn'
import { yi } from './yi'
import { za } from './za'
import { zh } from './zh'
import { zhHant } from './zh-hant'

export const TRANSLATIONS: Record<Locale, Translations> = {
  en,
  de,
  fr,
  es,
  it,
  nl,
  pl,
  pt,
  ru,
  tr,
  za,
  cz,
  sk,
  hu,
  ro,
  fi,
  dk,
  no,
  se,
  el,
  ko,
  th,
  vn,
  ua,
  il,
  in: inLocale,
  yi,
  run,
  sa: ar,
  zh,
  'zh-hant': zhHant,
  ja,
  jp: ja,
  cn: zh,
  ar,
  au: en,
  ca: en,
  gb: en,
  us: en,
  tw: zhHant
}
