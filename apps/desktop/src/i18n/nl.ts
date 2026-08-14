import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const nl: Translations = defineLocale({
  "common": {
    "apply": "Toepassen",
    "back": "Terug",
    "save": "Opslaan",
    "saving": "Opslaan…",
    "cancel": "Annuleren",
    "clear": "Zoekopdracht",
    "close": "Sluiten",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "Vrij",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "Verzenden",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "Artefacten",
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
    "search": "Sessies zoeken",
    "searchTitle": "Sessies zoeken…",
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
      "new-session": "Nieuwe sessie",
      "skills": "Vaardigheden",
      "messaging": "Berichten",
      "artifacts": "Artefacten"
    },
    "searchAria": "Sessies zoeken",
    "searchPlaceholder": "Sessies zoeken…",
    "clearSearch": "Zoekopdracht wissen",
    "pinned": "Vastgezet",
    "sessions": "Sessies",
    "cronJobs": "Cron-taken",
    "shiftClickHint": "Shift-klik om vast te zetten",
    "noWorkspace": "Geen werkruimte",
    "projectEmpty": "Nog geen sessies",
    "noSessions": "Nog geen sessies",
    "dateDivider": {
      "today": "Vandaag",
      "yesterday": "Gisteren",
      "thisWeek": "Deze week",
      "lastWeek": "Vorige week",
      "thisMonth": "Deze maand"
    },
    "row": {
      "openInSplit": "Openen in gesplitste weergave"
    }
  },
  "composer": {
    "message": "Bericht",
    "placeholderStarting": "Hermes wordt gestart…",
    "placeholderReconnecting": "Opnieuw verbinden met Hermes…",
    "placeholderFollowUp": "Vervolgbericht verzenden",
    "newSessionPlaceholders": [
      "Wat gaan we bouwen?",
      "Geef Hermes een taak",
      "Waar denk je aan?",
      "Beschrijf wat je nodig hebt",
      "Wat moeten we aanpakken?",
      "Vraag maar raak",
      "Begin met een doel"
    ],
    "followUpPlaceholders": [
      "Stuur een vervolgbericht",
      "Voeg meer context toe",
      "Verfijn het verzoek",
      "Wat is de volgende stap?",
      "Ga zo door",
      "Ga dieper in",
      "Aanpassen of doorgaan"
    ],
    "startVoice": "Spraakgesprek starten",
    "queueMessage": "Bericht in wachtrij",
    "steer": "Uitvoering sturen",
    "stop": "Stoppen",
    "send": "Verzenden",
    "speaking": "Spreekt",
    "transcribing": "Transcriberen",
    "thinking": "Nadenken"
  },
  "skills": {
    "tabSkills": "Vaardigheden",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "Vaardigheden…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "Artefacten…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "Artefacten -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "Sessies zoeken…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "Sluiten",
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
