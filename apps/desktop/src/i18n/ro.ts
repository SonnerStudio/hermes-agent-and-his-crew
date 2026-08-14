import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const ro: Translations = defineLocale({
  "common": {
    "apply": "Aplică",
    "back": "Înapoi",
    "save": "Salvează",
    "saving": "Salvează…",
    "cancel": "Anulează",
    "clear": "Șterge",
    "close": "Închide",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "Liber",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "Trimite",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "Artefacte",
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
    "search": "Căutare sesiuni",
    "searchTitle": "Căutare sesiuni…",
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
      "new-session": "Sesiune nouă",
      "skills": "Abilități",
      "messaging": "Mesaje",
      "artifacts": "Artefacte"
    },
    "searchAria": "Căutare sesiuni",
    "searchPlaceholder": "Căutare sesiuni…",
    "clearSearch": "Șterge căutarea",
    "pinned": "Fixat",
    "sessions": "Sesiuni",
    "cronJobs": "Sarcini Cron",
    "shiftClickHint": "Shift-clic pentru fixare",
    "noWorkspace": "Fără spațiu de lucru",
    "projectEmpty": "Nicio sesiune încă",
    "noSessions": "Nicio sesiune încă",
    "dateDivider": {
      "today": "Astăzi",
      "yesterday": "Ieri",
      "thisWeek": "Săptămâna aceasta",
      "lastWeek": "Săptămâna trecută",
      "thisMonth": "Luna aceasta"
    },
    "row": {
      "openInSplit": "Deschide în vizualizare divizată"
    }
  },
  "composer": {
    "message": "Mesaj",
    "placeholderStarting": "Se pornește Hermes…",
    "placeholderReconnecting": "Reconectare la Hermes…",
    "placeholderFollowUp": "Trimite mesaj de continuare",
    "newSessionPlaceholders": [
      "Ce construim?",
      "Dă o sarcină lui Hermes",
      "La ce te gândești?",
      "Descrie ce ai nevoie",
      "Ce ar trebui să abordăm?",
      "Întreabă orice",
      "Începe cu un obiectiv"
    ],
    "followUpPlaceholders": [
      "Trimite mesaj de continuare",
      "Adaugă mai mult context",
      "Rafinează solicitarea",
      "Ce urmează?",
      "Continuă",
      "Aprofundează",
      "Ajustează sau continuă"
    ],
    "startVoice": "Pornește conversația vocală",
    "queueMessage": "Pune mesajul în coadă",
    "steer": "Ghidează execuția",
    "stop": "Oprește",
    "send": "Trimite",
    "speaking": "Vorbește",
    "transcribing": "Transcriere",
    "thinking": "Gândește"
  },
  "skills": {
    "tabSkills": "Abilități",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "Abilități…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "Artefacte…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "Artefacte -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "Căutare sesiuni…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "Închide",
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
