// i18n for the Hermes-Sekretärin / Composer control surface.
// SonnerStudio languages: de, en, fr, es, nl (+ others from sonnerstudio.net).
// Keys are looked up per language; missing keys fall back to English.

export type Lang = "de" | "en" | "fr" | "es" | "nl";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "nl", label: "Nederlands" },
];

type Dict = Record<string, string>;

const DE: Dict = {
  "secretary.title": "Hermes-Sekretärin",
  "secretary.sub": "Audio-Kommunikation",
  "panel.subagents": "Sub-Agenten-Team",
  "panel.clones": "Kopierte Agenten",
  "panel.harmony": "Harmonisierung & Agentenauslastung",
  "btn.subagent": "Sub-Agenten-Orchestrierung",
  "btn.voice": "Sprachkommunikation",
  "btn.orchestration": "Orchestrierung",
  "btn.double": "Doppel-Modus",
  "mic.unavailable": "Mikrofon nicht erreichbar",
  "mic.available": "Mikrofon aktiv",
};

const EN: Dict = {
  "secretary.title": "Hermes Secretary",
  "secretary.sub": "Audio Communication",
  "panel.subagents": "Sub-Agent Team",
  "panel.clones": "Cloned Agents",
  "panel.harmony": "Harmonization & Agent Load",
  "btn.subagent": "Sub-Agent Orchestration",
  "btn.voice": "Voice Communication",
  "btn.orchestration": "Orchestration",
  "btn.double": "Double Mode",
  "mic.unavailable": "Microphone unavailable",
  "mic.available": "Microphone active",
};

const FR: Dict = {
  "secretary.title": "Hermes Secrétaire",
  "secretary.sub": "Communication audio",
  "panel.subagents": "Équipe de sous-agents",
  "panel.clones": "Agents clonés",
  "panel.harmony": "Harmonisation et charge des agents",
  "btn.subagent": "Orchestration de sous-agents",
  "btn.voice": "Communication vocale",
  "btn.orchestration": "Orchestration",
  "btn.double": "Mode double",
  "mic.unavailable": "Microphone indisponible",
  "mic.available": "Microphone actif",
};

const ES: Dict = {
  "secretary.title": "Hermes Secretaria",
  "secretary.sub": "Comunicación de audio",
  "panel.subagents": "Equipo de sub-agentes",
  "panel.clones": "Agentes clonados",
  "panel.harmony": "Armonización y carga de agentes",
  "btn.subagent": "Orquestación de sub-agentes",
  "btn.voice": "Comunicación por voz",
  "btn.orchestration": "Orquestación",
  "btn.double": "Modo doble",
  "mic.unavailable": "Micrófono no disponible",
  "mic.available": "Micrófono activo",
};

const NL: Dict = {
  "secretary.title": "Hermes Secretaresse",
  "secretary.sub": "Audiocommunicatie",
  "panel.subagents": "Sub-agententeam",
  "panel.clones": "Gekloonde agenten",
  "panel.harmony": "Harmonisatie & agentbelasting",
  "btn.subagent": "Sub-agent-orchestratie",
  "btn.voice": "Spraakcommunicatie",
  "btn.orchestration": "Orchestratie",
  "btn.double": "Dubbele modus",
  "mic.unavailable": "Microfoon niet beschikbaar",
  "mic.available": "Microfoon actief",
};

const TABLE: Record<Lang, Dict> = { de: DE, en: EN, fr: FR, es: ES, nl: NL };

export function t(key: string, lang: Lang): string {
  return TABLE[lang]?.[key] ?? EN[key] ?? key;
}

const STORAGE_KEY = "sonnerstudio.lang";

export function getLang(): Lang {
  if (typeof localStorage !== "undefined") {
    const v = localStorage.getItem(STORAGE_KEY) as Lang | null;

    if (v && v in TABLE) {return v;}
  }

  return "en";
}

export function setLang(lang: Lang): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, lang);
  }
}
