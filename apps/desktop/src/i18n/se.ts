import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const se: Translations = defineLocale({
  "common": {
    "apply": "Tillämpa",
    "back": "Tillbaka",
    "save": "Spara",
    "saving": "Spara…",
    "cancel": "Avbryt",
    "clear": "Rensa",
    "close": "Stäng",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "Ledigt",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "Skicka",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "Artefakter",
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
    "search": "Sök sessioner",
    "searchTitle": "Sök sessioner…",
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
      "new-session": "Ny session",
      "skills": "Färdigheter",
      "messaging": "Meddelanden",
      "artifacts": "Artefakter"
    },
    "searchAria": "Sök sessioner",
    "searchPlaceholder": "Sök sessioner…",
    "clearSearch": "Rensa sökning",
    "pinned": "Fäst",
    "sessions": "Sessioner",
    "cronJobs": "Cron-jobb",
    "shiftClickHint": "Shift-klicka för att fästa",
    "noWorkspace": "Ingen arbetsyta",
    "projectEmpty": "Inga sessioner ännu",
    "noSessions": "Inga sessioner ännu",
    "dateDivider": {
      "today": "Idag",
      "yesterday": "Igår",
      "thisWeek": "Denna vecka",
      "lastWeek": "Förra veckan",
      "thisMonth": "Denna månad"
    },
    "row": {
      "openInSplit": "Öppna i delad vy"
    }
  },
  "composer": {
    "message": "Meddelande",
    "placeholderStarting": "Hermes startar…",
    "placeholderReconnecting": "Återansluter till Hermes…",
    "placeholderFollowUp": "Skicka uppföljningsmeddelande",
    "newSessionPlaceholders": [
      "Vad bygger vi?",
      "Ge Hermes en uppgift",
      "Vad tänker du på?",
      "Beskriv vad du behöver",
      "Vad ska vi ta itu med?",
      "Fråga vad som helst",
      "Börja med ett mål"
    ],
    "followUpPlaceholders": [
      "Skicka uppföljning",
      "Lägg till mer kontext",
      "Förfina förfrågan",
      "Vad är nästa steg?",
      "Fortsätt",
      "Gå djupare",
      "Justera eller fortsätt"
    ],
    "startVoice": "Starta röstkonversation",
    "queueMessage": "Köa meddelande",
    "steer": "Styr körning",
    "stop": "Stoppa",
    "send": "Skicka",
    "speaking": "Talar",
    "transcribing": "Transkriberar",
    "thinking": "Tänker"
  },
  "skills": {
    "tabSkills": "Färdigheter",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "Färdigheter…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "Artefakter…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "Artefakter -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "Sök sessioner…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "Stäng",
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
