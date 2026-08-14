import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const el: Translations = defineLocale({
  "common": {
    "apply": "Εφαρμογή",
    "back": "Πίσω",
    "save": "Αποθήκευση",
    "saving": "Αποθήκευση…",
    "cancel": "Ακύρωση",
    "clear": "Εκκαθάριση",
    "close": "Κλείσιμο",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "Ελεύθερο",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "Αποστολή",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "Τεχνουργήματα",
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
    "search": "Αναζήτηση συνεδριών",
    "searchTitle": "Αναζήτηση συνεδριών…",
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
      "new-session": "Νέα συνεδρία",
      "skills": "Δεξιότητες",
      "messaging": "Μηνύματα",
      "artifacts": "Τεχνουργήματα"
    },
    "searchAria": "Αναζήτηση συνεδριών",
    "searchPlaceholder": "Αναζήτηση συνεδριών…",
    "clearSearch": "Εκκαθάριση αναζήτησης",
    "pinned": "Καρφιτσωμένα",
    "sessions": "Συνεδρίες",
    "cronJobs": "Εργασίες Cron",
    "shiftClickHint": "Shift-κλικ για καρφίτσωμα",
    "noWorkspace": "Χωρίς χώρο εργασίας",
    "projectEmpty": "Δεν υπάρχουν συνεδρίες ακόμα",
    "noSessions": "Δεν υπάρχουν συνεδρίες ακόμα",
    "dateDivider": {
      "today": "Σήμερα",
      "yesterday": "Χθες",
      "thisWeek": "Αυτή την εβδομάδα",
      "lastWeek": "Προηγούμενη εβδομάδα",
      "thisMonth": "Αυτόν τον μήνα"
    },
    "row": {
      "openInSplit": "Άνοιγμα σε διαιρεμένη προβολή"
    }
  },
  "composer": {
    "message": "Μήνυμα",
    "placeholderStarting": "Εκκίνηση Hermes…",
    "placeholderReconnecting": "Επανασύνδεση με το Hermes…",
    "placeholderFollowUp": "Αποστολή μηνύματος συνέχειας",
    "newSessionPlaceholders": [
      "Τι χτίζουμε;",
      "Δώστε μια εργασία στον Hermes",
      "Τι σκέφτεστε;",
      "Περιγράψτε τι χρειάζεστε",
      "Με τι να ασχοληθούμε;",
      "Ρωτήστε οτιδήποτε",
      "Ξεκινήστε με έναν στόχο"
    ],
    "followUpPlaceholders": [
      "Αποστολή συνέχειας",
      "Προσθήκη περισσότερου πλαισίου",
      "Βελτίωση αιτήματος",
      "Τι ακολουθεί;",
      "Συνεχίστε",
      "Εμβάθυνση",
      "Προσαρμογή ή συνέχεια"
    ],
    "startVoice": "Έναρξη φωνητικής συνομιλίας",
    "queueMessage": "Προσθήκη μηνύματος στην ουρά",
    "steer": "Καθοδήγηση εκτέλεσης",
    "stop": "Διακοπή",
    "send": "Αποστολή",
    "speaking": "Μιλάει",
    "transcribing": "Μεταγραφή",
    "thinking": "Σκέφτεται"
  },
  "skills": {
    "tabSkills": "Δεξιότητες",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "Δεξιότητες…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "Τεχνουργήματα…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "Τεχνουργήματα -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "Αναζήτηση συνεδριών…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "Κλείσιμο",
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
