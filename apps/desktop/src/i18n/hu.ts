import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const hu: Translations = defineLocale({
  "common": {
    "apply": "Alkalmaz",
    "back": "Vissza",
    "save": "Mentés",
    "saving": "Mentés…",
    "cancel": "Mégse",
    "clear": "Keresés",
    "close": "Bezárás",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "Szabad",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "Küldés",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "Munkadarabok",
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
    "search": "Munkamenetek keresése",
    "searchTitle": "Munkamenetek keresése…",
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
      "new-session": "Új munkamenet",
      "skills": "Képességek",
      "messaging": "Üzenetek",
      "artifacts": "Munkadarabok"
    },
    "searchAria": "Munkamenetek keresése",
    "searchPlaceholder": "Munkamenetek keresése…",
    "clearSearch": "Keresés törlése",
    "pinned": "Rögzített",
    "sessions": "Munkamenetek",
    "cronJobs": "Ütemezett feladatok",
    "shiftClickHint": "Shift-kattintás a rögzítéshez",
    "noWorkspace": "Nincs munkaterület",
    "projectEmpty": "Még nincsenek munkamenetek",
    "noSessions": "Még nincsenek munkamenetek",
    "dateDivider": {
      "today": "Ma",
      "yesterday": "Tegnap",
      "thisWeek": "Ezen a héten",
      "lastWeek": "Múlt héten",
      "thisMonth": "Ebben a hónapban"
    },
    "row": {
      "openInSplit": "Megnyitás osztott nézetben"
    }
  },
  "composer": {
    "message": "Üzenet",
    "placeholderStarting": "Hermes indítása…",
    "placeholderReconnecting": "Újracsatlakozás a Hermeshez…",
    "placeholderFollowUp": "Követő üzenet küldése",
    "newSessionPlaceholders": [
      "Mit építünk?",
      "Adjon feladatot Hermesnek",
      "Mire gondol?",
      "Írja le, mire van szüksége",
      "Mivel foglalkozzunk?",
      "Kérdezzen bármit",
      "Kezdje egy céllal"
    ],
    "followUpPlaceholders": [
      "Követő üzenet küldése",
      "További kontextus hozzáadása",
      "Kérés pontosítása",
      "Mi a következő lépés?",
      "Folytatás",
      "Tovább mélyítés",
      "Módosítás vagy folytatás"
    ],
    "startVoice": "Hangbeszélgetés indítása",
    "queueMessage": "Üzenet sorba állítása",
    "steer": "Végrehajtás irányítása",
    "stop": "Leállítás",
    "send": "Küldés",
    "speaking": "Beszél",
    "transcribing": "Átírás",
    "thinking": "Gondolkodik"
  },
  "skills": {
    "tabSkills": "Képességek",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "Képességek…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "Munkadarabok…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "Munkadarabok -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "Munkamenetek keresése…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "Bezárás",
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
