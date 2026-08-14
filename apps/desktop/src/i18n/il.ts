import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const il: Translations = defineLocale({
  "common": {
    "apply": "החל",
    "back": "חזרה",
    "save": "שמור",
    "saving": "שמור…",
    "cancel": "ביטול",
    "clear": "נקה",
    "close": "סגור",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "פנוי",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "שלח",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "ארטיפקטים",
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
    "search": "חיפוש הפעלות",
    "searchTitle": "חיפוש הפעלות…",
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
      "new-session": "הפעלה חדשה",
      "skills": "כישורים",
      "messaging": "הודעות",
      "artifacts": "ארטיפקטים"
    },
    "searchAria": "חיפוש הפעלות",
    "searchPlaceholder": "חיפוש הפעלות…",
    "clearSearch": "נקה חיפוש",
    "pinned": "נעוץ",
    "sessions": "הפעלות",
    "cronJobs": "משימות Cron",
    "shiftClickHint": "Shift-לחיצה כדי לנעוץ",
    "noWorkspace": "אין סביבת עבודה",
    "projectEmpty": "אין עדיין הפעלות",
    "noSessions": "אין עדיין הפעלות",
    "dateDivider": {
      "today": "היום",
      "yesterday": "אתמול",
      "thisWeek": "השבוע",
      "lastWeek": "שבוע שעבר",
      "thisMonth": "החודש"
    },
    "row": {
      "openInSplit": "פתח בתצוגה מפוצלת"
    }
  },
  "composer": {
    "message": "הודעה",
    "placeholderStarting": "Hermes מתחיל…",
    "placeholderReconnecting": "מתחבר מחדש ל-Hermes…",
    "placeholderFollowUp": "שלח הודעת המשך",
    "newSessionPlaceholders": [
      "מה אנחנו בונים?",
      "תן משימה ל-Hermes",
      "על מה אתה חושב?",
      "תאר מה אתה צריך",
      "במה נטפל?",
      "שאל כל דבר",
      "התחל עם מטרה"
    ],
    "followUpPlaceholders": [
      "שלח הודעת המשך",
      "הוסף עוד הקשר",
      "דייק את הבקשה",
      "מה הלאה?",
      "המשך כך",
      "העמק עוד",
      "התאם או המשך"
    ],
    "startVoice": "התחל שיחה קולית",
    "queueMessage": "הוסף הודעה לתור",
    "steer": "כוון ביצוע",
    "stop": "עצור",
    "send": "שלח",
    "speaking": "מדבר",
    "transcribing": "מתמלל",
    "thinking": "חושב"
  },
  "skills": {
    "tabSkills": "כישורים",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "כישורים…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "ארטיפקטים…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "ארטיפקטים -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "חיפוש הפעלות…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "סגור",
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
