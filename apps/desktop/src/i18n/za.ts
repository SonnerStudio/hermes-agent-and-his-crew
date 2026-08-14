import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const za: Translations = defineLocale({
  "common": {
    "apply": "Pas toe",
    "back": "Terug",
    "save": "Stoor",
    "saving": "Stoor…",
    "cancel": "Kanselleer",
    "clear": "Vee",
    "close": "Maak toe",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "Vry",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "Stuur",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "Artefakte",
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
    "search": "Deursoek sessies",
    "searchTitle": "Deursoek sessies…",
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
      "new-session": "Nuwe sessie",
      "skills": "Vaardighede",
      "messaging": "Boodskappe",
      "artifacts": "Artefakte"
    },
    "searchAria": "Deursoek sessies",
    "searchPlaceholder": "Deursoek sessies…",
    "clearSearch": "Vee soektog uit",
    "pinned": "Vasgespeld",
    "sessions": "Sessies",
    "cronJobs": "Cron-take",
    "shiftClickHint": "Shift-klik om vas te speld",
    "noWorkspace": "Geen werkruimte",
    "projectEmpty": "Nog geen sessies nie",
    "noSessions": "Nog geen sessies nie",
    "dateDivider": {
      "today": "Vandag",
      "yesterday": "Gister",
      "thisWeek": "Hierdie week",
      "lastWeek": "Laas week",
      "thisMonth": "Hierdie maand"
    },
    "row": {
      "openInSplit": "Maak oop in verdeelde aansig"
    }
  },
  "composer": {
    "message": "Boodskap",
    "placeholderStarting": "Hermes begin tans…",
    "placeholderReconnecting": "Herverbind tans met Hermes…",
    "placeholderFollowUp": "Stuur opvolgboodskap",
    "newSessionPlaceholders": [
      "Wat bou ons?",
      "Gee Hermes 'n taak",
      "Waaraan dink jy?",
      "Beskryf wat jy nodig het",
      "Wat moet ons aanpak?",
      "Vra enigiets",
      "Begin met 'n doelwit"
    ],
    "followUpPlaceholders": [
      "Stuur opvolgboodskap",
      "Voeg meer konteks by",
      "Verfyn die versoek",
      "Wat is volgende?",
      "Gaan so voort",
      "Gaan verder",
      "Pas aan of gaan voort"
    ],
    "startVoice": "Begin stemgesprek",
    "queueMessage": "Plaas in ry",
    "steer": "Stuur uitvoering",
    "stop": "Stop",
    "send": "Stuur",
    "speaking": "Praat tans",
    "transcribing": "Transkribeer tans",
    "thinking": "Dink tans"
  },
  "skills": {
    "tabSkills": "Vaardighede",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "Vaardighede…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "Artefakte…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "Artefakte -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "Deursoek sessies…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "Maak toe",
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
