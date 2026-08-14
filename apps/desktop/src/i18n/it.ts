import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const it: Translations = defineLocale({
  "common": {
    "apply": "Applica",
    "back": "Indietro",
    "save": "Salva",
    "saving": "Salva…",
    "cancel": "Annulla",
    "clear": "Cancella",
    "close": "Chiudi",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "Libero",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "Invia",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "Artefatti",
    "copyPath": "Copy Path",
    "copyRelativePath": "Copy Relative Path",
    "rename": "Rename…",
    "delete": "Delete",
    "renameTitle": "Rename",
    "renameLabel": "New name",
    "deleteBody": "Are you sure?",
    "pathCopied": "Copied"
  },
  "titlebar": {
    "hideSidebar": "Sidebar",
    "showSidebar": "Sidebar",
    "search": "Cerca sessioni",
    "searchTitle": "Cerca sessioni…",
    "swapSidebarSides": "Swap sidebar",
    "hideRightSidebar": "Right sidebar",
    "showRightSidebar": "Right sidebar",
    "muteHaptics": "Mute",
    "unmuteHaptics": "Unmute",
    "openSettings": "Settings",
    "openStarmap": "Starmap"
  },
  "language": {
    "label": "Language",
    "description": "Choose language",
    "saving": "Saving…",
    "saveError": "Error",
    "switchTo": "Switch language",
    "searchPlaceholder": "Search languages…",
    "noResults": "No results"
  },
  "sidebar": {
    "nav": {
      "new-session": "Nuova sessione",
      "skills": "Abilità",
      "messaging": "Messaggistica",
      "artifacts": "Artefatti"
    },
    "searchAria": "Cerca sessioni",
    "searchPlaceholder": "Cerca sessioni…",
    "clearSearch": "Cancella ricerca",
    "pinned": "Fissato",
    "sessions": "Sessioni",
    "cronJobs": "Attività Cron",
    "shiftClickHint": "Maiusc-clic per fissare",
    "noWorkspace": "Nessuno spazio di lavoro",
    "projectEmpty": "Nessuna sessione ancora",
    "noSessions": "Nessuna sessione ancora",
    "dateDivider": {
      "today": "Oggi",
      "yesterday": "Ieri",
      "thisWeek": "Questa settimana",
      "lastWeek": "La settimana scorsa",
      "thisMonth": "Questo mese"
    },
    "row": {
      "openInSplit": "Apri in vista divisa"
    }
  },
  "composer": {
    "message": "Messaggio",
    "placeholderStarting": "Avvio di Hermes…",
    "placeholderReconnecting": "Riconnessione a Hermes…",
    "placeholderFollowUp": "Invia messaggio successivo",
    "newSessionPlaceholders": [
      "Cosa stiamo creando?",
      "Assegna un compito a Hermes",
      "A cosa stai pensando?",
      "Descrivi ciò di cui hai bisogno",
      "Cosa dovremmo affrontare?",
      "Chiedi qualsiasi cosa",
      "Inizia con un obiettivo"
    ],
    "followUpPlaceholders": [
      "Invia un messaggio di risposta",
      "Aggiungi più contesto",
      "Perfeziona la richiesta",
      "Qual è il prossimo passo?",
      "Continua così",
      "Approfondisci",
      "Modifica o continua"
    ],
    "startVoice": "Avvia conversazione vocale",
    "queueMessage": "Accoda messaggio",
    "steer": "Guida esecuzione",
    "stop": "Arresta",
    "send": "Invia",
    "speaking": "Parla",
    "transcribing": "Trascrizione",
    "thinking": "Pensiero"
  },
  "skills": {
    "tabSkills": "Abilità",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "Abilità…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "Artefatti…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "Artefatti -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "Cerca sessioni…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "Chiudi",
    "exportConfig": "Export",
    "importConfig": "Import",
    "resetToDefaults": "Reset",
    "nav": {
      "providers": "Providers",
      "providerAccounts": "Accounts",
      "providerApiKeys": "API Keys",
      "providerCustomEndpoints": "Endpoints",
      "gateway": "Gateway",
      "apiKeys": "API Keys",
      "keybinds": "Shortcuts",
      "keysTools": "Tools",
      "keysSettings": "Settings",
      "mcp": "MCP",
      "archivedChats": "Archive",
      "about": "About",
      "billing": "Billing",
      "notifications": "Notifications",
      "plugins": "Plugins"
    }
  },
  "desktop": {
    "desktopCommands": "Desktop",
    "resumeStrandedTitle": "Resume",
    "resumeStrandedBody": "Resume session",
    "resumeRetry": "Resume"
  }
})
