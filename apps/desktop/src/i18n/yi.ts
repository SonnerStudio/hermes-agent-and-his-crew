import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const yi: Translations = defineLocale({
  "common": {
    "apply": "Onvendn",
    "back": "Tsurik",
    "save": "Ophefn",
    "saving": "Ophefn…",
    "cancel": "Batal",
    "clear": "Opwysh",
    "close": "Shlisn",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "Fray",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "Shikn",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "Artefaktn",
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
    "search": "Zukhn sesyes",
    "searchTitle": "Zukhn sesyes…",
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
      "new-session": "Naye Sesye",
      "skills": "Feyikayt",
      "messaging": "Brikhtn",
      "artifacts": "Artefaktn"
    },
    "searchAria": "Zukhn sesyes",
    "searchPlaceholder": "Zukhn sesyes…",
    "clearSearch": "Opwysh zukh",
    "pinned": "Tsugeheft",
    "sessions": "Sesyes",
    "cronJobs": "Cron-oyfgabn",
    "shiftClickHint": "Shift-klik tsu tsuheftn",
    "noWorkspace": "Keyn arbayt-plats",
    "projectEmpty": "Nisht do keyn sesyes",
    "noSessions": "Nisht do keyn sesyes",
    "dateDivider": {
      "today": "Haynt",
      "yesterday": "Gekhtn",
      "thisWeek": "Di vokh",
      "lastWeek": "Letste vokh",
      "thisMonth": "Dem khoydesh"
    },
    "row": {
      "openInSplit": "Efenen in geteyltn blik"
    }
  },
  "composer": {
    "message": "Brikht",
    "placeholderStarting": "Hermes heybt on…",
    "placeholderReconnecting": "Widerfarbindn mit Hermes…",
    "placeholderFollowUp": "Shikn naye brikht",
    "newSessionPlaceholders": [
      "Vos boyen mir?",
      "Git Hermes an oyfgabe",
      "Vos ligt oyfn hartsn?",
      "Bashraybt vos ir darft",
      "Vos nemen mir on?",
      "Fregt vos s'iz",
      "Heybt on mit a tsil"
    ],
    "followUpPlaceholders": [
      "Shikn vayter",
      "Tsugebn mer kontekst",
      "Farbesern di bakashe",
      "Vos kumt nokh?",
      "Geyt vayter",
      "Farzinkn tifer",
      "Tsugebn oder vayter geyn"
    ],
    "startVoice": "Onheybn shtim-shmues",
    "queueMessage": "Shteln brikht in reye",
    "steer": "Firin oysfirung",
    "stop": "Opsteln",
    "send": "Shikn",
    "speaking": "Redt",
    "transcribing": "Transkribirt",
    "thinking": "Trakht"
  },
  "skills": {
    "tabSkills": "Feyikayt",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "Feyikayt…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "Artefaktn…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "Artefaktn -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "Zukhn sesyes…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "Shlisn",
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
