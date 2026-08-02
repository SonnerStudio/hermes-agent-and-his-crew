// i18n for the Hermes-Sekretärin / Composer control surface.
// SonnerStudio languages mirror sonnerstudio.net's language picker (32 langs).
// Keys are looked up per language; missing keys fall back to English.

export type Lang =
  | 'au'
  | 'ca'
  | 'cn'
  | 'cz'
  | 'de'
  | 'dk'
  | 'en'
  | 'es'
  | 'fi'
  | 'fr'
  | 'gb'
  | 'hu'
  | 'il'
  | 'in'
  | 'it'
  | 'jp'
  | 'nl'
  | 'no'
  | 'pl'
  | 'ru'
  | 'sa'
  | 'se'
  | 'sk'
  | 'tw'
  | 'us'
  | 'vn'
  | 'za'
  | 'pt'
  | 'ro'
  | 'tr'
  | 'el'
  | 'ko'
  | 'th'
  | 'ua'
  | 'run'

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🌐' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'cn', label: '中文', flag: '🇨🇳' },
  { code: 'jp', label: '日本語', flag: '🇯🇵' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'th', label: 'ไทย', flag: '🇹🇭' },
  { code: 'cz', label: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', label: 'Slovenčina', flag: '🇸🇰' },
  { code: 'hu', label: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
  { code: 'fi', label: 'Suomi', flag: '🇫🇮' },
  { code: 'dk', label: 'Dansk', flag: '🇩🇰' },
  { code: 'no', label: 'Norsk', flag: '🇳🇴' },
  { code: 'se', label: 'Svenska', flag: '🇸🇪' },
  { code: 'il', label: 'עברית', flag: '🇮🇱' },
  { code: 'in', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'sa', label: 'العربية', flag: '🇸🇦' },
  { code: 'vn', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'tw', label: '繁體中文', flag: '🇹🇼' },
  { code: 'ua', label: 'Українська', flag: '🇺🇦' },
  { code: 'au', label: 'English (AU)', flag: '🇦🇺' },
  { code: 'ca', label: 'English (CA)', flag: '🇨🇦' },
  { code: 'gb', label: 'English (UK)', flag: '🇬🇧' },
  { code: 'us', label: 'English (US)', flag: '🇺🇸' },
  { code: 'za', label: 'English (ZA)', flag: '🇿🇦' },
  { code: 'run', label: 'RUN', flag: '🌐' }
]

type Dict = Record<string, string>

const DE: Dict = {
  'secretary.title': 'Hermes-Sekretärin',
  'secretary.sub': 'Audio-Kommunikation',
  'panel.subagents': 'Sub-Agenten-Team',
  'panel.clones': 'Kopierte Agenten',
  'panel.harmony': 'Harmonisierung & Agentenauslastung',
  'btn.subagent': 'Sub-Agenten-Orchestrierung',
  'btn.voice': 'Sprachkommunikation',
  'btn.orchestration': 'Orchestrierung',
  'btn.double': 'Doppel-Modus',
  'mic.unavailable': 'Mikrofon nicht erreichbar',
  'mic.available': 'Mikrofon aktiv'
}

const EN: Dict = {
  'secretary.title': 'Hermes Secretary',
  'secretary.sub': 'Audio Communication',
  'panel.subagents': 'Sub-Agent Team',
  'panel.clones': 'Cloned Agents',
  'panel.harmony': 'Harmonization & Agent Load',
  'btn.subagent': 'Sub-Agent Orchestration',
  'btn.voice': 'Voice Communication',
  'btn.orchestration': 'Orchestration',
  'btn.double': 'Double Mode',
  'mic.unavailable': 'Microphone unavailable',
  'mic.available': 'Microphone active'
}

const FR: Dict = {
  'secretary.title': 'Hermes Secrétaire',
  'secretary.sub': 'Communication audio',
  'panel.subagents': 'Équipe de sous-agents',
  'panel.clones': 'Agents clonés',
  'panel.harmony': 'Harmonisation et charge des agents',
  'btn.subagent': 'Orchestration de sous-agents',
  'btn.voice': 'Communication vocale',
  'btn.orchestration': 'Orchestration',
  'btn.double': 'Mode double',
  'mic.unavailable': 'Microphone indisponible',
  'mic.available': 'Microphone actif'
}

const ES: Dict = {
  'secretary.title': 'Hermes Secretaria',
  'secretary.sub': 'Comunicación de audio',
  'panel.subagents': 'Equipo de sub-agentes',
  'panel.clones': 'Agentes clonados',
  'panel.harmony': 'Armonización y carga de agentes',
  'btn.subagent': 'Orquestación de sub-agentes',
  'btn.voice': 'Comunicación por voz',
  'btn.orchestration': 'Orquestación',
  'btn.double': 'Modo doble',
  'mic.unavailable': 'Micrófono no disponible',
  'mic.available': 'Micrófono activo'
}

const NL: Dict = {
  'secretary.title': 'Hermes Secretaresse',
  'secretary.sub': 'Audiocommunicatie',
  'panel.subagents': 'Sub-agententeam',
  'panel.clones': 'Gekloonde agenten',
  'panel.harmony': 'Harmonisatie & agentbelasting',
  'btn.subagent': 'Sub-agent-orchestratie',
  'btn.voice': 'Spraakcommunicatie',
  'btn.orchestration': 'Orchestratie',
  'btn.double': 'Dubbele modus',
  'mic.unavailable': 'Microfoon niet beschikbaar',
  'mic.available': 'Microfoon actief'
}

const IT: Dict = {
  'secretary.title': 'Hermes Segretaria',
  'secretary.sub': 'Comunicazione audio',
  'panel.subagents': 'Team di sotto-agenti',
  'panel.clones': 'Agenti clonati',
  'panel.harmony': 'Armonizzazione e carico agenti',
  'btn.subagent': 'Orchestrazione di sotto-agenti',
  'btn.voice': 'Comunicazione vocale',
  'btn.orchestration': 'Orchestrazione',
  'btn.double': 'Modalità doppia',
  'mic.unavailable': 'Microfono non disponibile',
  'mic.available': 'Microfono attivo'
}

const PL: Dict = {
  'secretary.title': 'Hermes Sekretarka',
  'secretary.sub': 'Komunikacja audio',
  'panel.subagents': 'Zespół pod-agentów',
  'panel.clones': 'Sklonowani agenci',
  'panel.harmony': 'Harmonizacja i obciążenie agentów',
  'btn.subagent': 'Orkiestracja pod-agentów',
  'btn.voice': 'Komunikacja głosowa',
  'btn.orchestration': 'Orkiestracja',
  'btn.double': 'Tryb podwójny',
  'mic.unavailable': 'Mikrofon niedostępny',
  'mic.available': 'Mikrofon aktywny'
}

const ZH: Dict = {
  'secretary.title': 'Hermes 秘书',
  'secretary.sub': '音频通信',
  'panel.subagents': '子代理团队',
  'panel.clones': '克隆代理',
  'panel.harmony': '协调与代理负载',
  'btn.subagent': '子代理编排',
  'btn.voice': '语音通信',
  'btn.orchestration': '编排',
  'btn.double': '双重模式',
  'mic.unavailable': '麦克风不可用',
  'mic.available': '麦克风已激活'
}

const JA: Dict = {
  'secretary.title': 'Hermes 秘書',
  'secretary.sub': '音声通信',
  'panel.subagents': 'サブエージェントチーム',
  'panel.clones': 'クローンエージェント',
  'panel.harmony': '調和とエージェント負荷',
  'btn.subagent': 'サブエージェントオーケストレーション',
  'btn.voice': '音声通信',
  'btn.orchestration': 'オーケストレーション',
  'btn.double': '二重モード',
  'mic.unavailable': 'マイクが利用できません',
  'mic.available': 'マイクアクティブ'
}

// Elder Futhark transliteration for the RUN language option.
const RUNE_MAP: Record<string, string> = {
  a: 'ᚨ',
  b: 'ᛒ',
  c: 'ᚲ',
  d: 'ᛞ',
  e: 'ᛖ',
  f: 'ᚠ',
  g: 'ᚷ',
  h: 'ᚺ',
  i: 'ᛁ',
  j: 'ᛃ',
  k: 'ᚲ',
  l: 'ᛚ',
  m: 'ᛗ',
  n: 'ᚾ',
  o: 'ᛟ',
  p: 'ᛈ',
  q: 'ᚲ',
  r: 'ᚱ',
  s: 'ᛋ',
  t: 'ᛏ',
  u: 'ᚢ',
  v: 'ᚢ',
  w: 'ᚹ',
  x: 'ᚲ',
  y: 'ᛁ',
  z: 'ᛋ'
}

function toRunic(text: string): string {
  return text
    .split('')
    .map(ch => {
      const lower = ch.toLowerCase()

      if (RUNE_MAP[lower]) {
        return RUNE_MAP[lower]
      }

      // keep spaces, punctuation, digits as-is
      return ch
    })
    .join('')
}

// Runic: same meaning as English, but rendered in Elder Futhark runes.
const RUN: Dict = {
  'secretary.title': toRunic('Hermes Secretary'),
  'secretary.sub': toRunic('Audio Communication'),
  'panel.subagents': toRunic('Sub-Agent Team'),
  'panel.clones': toRunic('Cloned Agents'),
  'panel.harmony': toRunic('Harmonization and Agent Load'),
  'btn.subagent': toRunic('Sub-Agent Orchestration'),
  'btn.voice': toRunic('Voice Communication'),
  'btn.orchestration': toRunic('Orchestration'),
  'btn.double': toRunic('Double Mode'),
  'mic.unavailable': toRunic('Microphone unavailable'),
  'mic.available': toRunic('Microphone active')
}

// Languages without a dedicated dictionary fall back to English via t().
const TABLE: Record<Lang, Dict> = {
  de: DE,
  en: EN,
  fr: FR,
  es: ES,
  nl: NL,
  it: IT,
  pl: PL,
  cn: ZH,
  jp: JA,
  // The remaining 23 codes resolve to EN through t()'s fallback chain.
  au: EN,
  ca: EN,
  cz: EN,
  dk: EN,
  fi: EN,
  gb: EN,
  hu: EN,
  il: EN,
  in: EN,
  ko: EN,
  no: EN,
  pt: EN,
  ro: EN,
  ru: EN,
  sa: EN,
  se: EN,
  sk: EN,
  th: EN,
  tr: EN,
  tw: EN,
  ua: EN,
  us: EN,
  vn: EN,
  za: EN,
  el: EN,
  run: RUN
}

export function t(key: string, lang: Lang): string {
  return TABLE[lang]?.[key] ?? EN[key] ?? key
}

const STORAGE_KEY = 'sonnerstudio.lang'

export function getLang(): Lang {
  if (typeof localStorage !== 'undefined') {
    const v = localStorage.getItem(STORAGE_KEY) as Lang | null

    if (v && v in TABLE) {
      return v
    }
  }

  return 'en'
}

export function setLang(lang: Lang): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lang)
  }
}
