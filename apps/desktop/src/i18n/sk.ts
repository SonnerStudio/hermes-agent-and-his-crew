import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const sk: Translations = defineLocale({
  "common": {
    "apply": "Uplatniť",
    "back": "Späť",
    "save": "Uložiť",
    "saving": "Uložiť…",
    "cancel": "Zrušiť",
    "clear": "Vymazať",
    "close": "Zavrieť",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "Voľné",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "Odoslať",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "Artefakty",
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
    "search": "Prehľadať relácie",
    "searchTitle": "Hľadať relácie…",
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
      "new-session": "Nová relácia",
      "skills": "Zručnosti",
      "messaging": "Správy",
      "artifacts": "Artefakty"
    },
    "searchAria": "Prehľadať relácie",
    "searchPlaceholder": "Hľadať relácie…",
    "clearSearch": "Vymazať hľadanie",
    "pinned": "Pripnuté",
    "sessions": "Relácie",
    "cronJobs": "Plánované úlohy",
    "shiftClickHint": "Shift-kliknutím pripnete",
    "noWorkspace": "Žiadny pracovný priestor",
    "projectEmpty": "Zatiaľ žiadne relácie",
    "noSessions": "Zatiaľ žiadne relácie",
    "dateDivider": {
      "today": "Dnes",
      "yesterday": "Včera",
      "thisWeek": "Tento týždeň",
      "lastWeek": "Minulý týždeň",
      "thisMonth": "Tento mesiac"
    },
    "row": {
      "openInSplit": "Otvoriť v rozdelenom zobrazení"
    }
  },
  "composer": {
    "message": "Správa",
    "placeholderStarting": "Hermes sa spúšťa…",
    "placeholderReconnecting": "Obnovovanie spojenia s Hermes…",
    "placeholderFollowUp": "Odoslať nadväzujúcu správu",
    "newSessionPlaceholders": [
      "Na čom pracujeme?",
      "Zadajte Hermesovi úlohu",
      "Čo máte na mysli?",
      "Popíšte, čo potrebujete",
      "Čo budeme riešiť?",
      "Spýtajte sa na čokoľvek",
      "Začnite s cieľom"
    ],
    "followUpPlaceholders": [
      "Odoslať nadväzujúcu správu",
      "Pridať ďalší kontext",
      "Spresniť požiadavku",
      "Čo ďalej?",
      "Pokračovať",
      "Prehĺbiť tému",
      "Upraviť alebo pokračovať"
    ],
    "startVoice": "Spustiť hlasovú konverzáciu",
    "queueMessage": "Zaradiť správu do frontu",
    "steer": "Riadiť vykonávanie",
    "stop": "Zastaviť",
    "send": "Odoslať",
    "speaking": "Hovorí",
    "transcribing": "Prepisuje",
    "thinking": "Premýšľa"
  },
  "skills": {
    "tabSkills": "Zručnosti",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "Zručnosti…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "Artefakty…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "Artefakty -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "Hľadať relácie…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "Zavrieť",
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
