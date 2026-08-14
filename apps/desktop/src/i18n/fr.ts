import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const fr: Translations = defineLocale({
  "common": {
    "apply": "Appliquer",
    "back": "Retour",
    "save": "Enregistrer",
    "saving": "Enregistrer…",
    "cancel": "Annuler",
    "clear": "Effacer",
    "close": "Fermer",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "Libre",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "Envoyer",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "Artefacts",
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
    "search": "Rechercher des sessions",
    "searchTitle": "Rechercher des sessions…",
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
      "new-session": "Nouvelle session",
      "skills": "Compétences",
      "messaging": "Messagerie",
      "artifacts": "Artefacts"
    },
    "searchAria": "Rechercher des sessions",
    "searchPlaceholder": "Rechercher des sessions…",
    "clearSearch": "Effacer la recherche",
    "pinned": "Épinglé",
    "sessions": "Sessions",
    "cronJobs": "Tâches Cron",
    "shiftClickHint": "Maj-clic pour épingler",
    "noWorkspace": "Aucun espace de travail",
    "projectEmpty": "Aucune session pour le moment",
    "noSessions": "Aucune session pour le moment",
    "dateDivider": {
      "today": "Aujourd'hui",
      "yesterday": "Hier",
      "thisWeek": "Cette semaine",
      "lastWeek": "La semaine dernière",
      "thisMonth": "Ce mois-ci"
    },
    "row": {
      "openInSplit": "Ouvrir en vue divisée"
    }
  },
  "composer": {
    "message": "Message",
    "placeholderStarting": "Démarrage d'Hermes…",
    "placeholderReconnecting": "Reconnexion à Hermes…",
    "placeholderFollowUp": "Envoyer un suivi",
    "newSessionPlaceholders": [
      "Que construisons-nous ?",
      "Donnez une tâche à Hermes",
      "À quoi pensez-vous ?",
      "Décrivez ce dont vous avez besoin",
      "Que devrions-nous aborder ?",
      "Posez n'importe quelle question",
      "Commencez par un objectif"
    ],
    "followUpPlaceholders": [
      "Envoyer un suivi",
      "Ajouter plus de contexte",
      "Affiner la demande",
      "Quelle est la suite ?",
      "Continuer",
      "Aller plus loin",
      "Ajuster ou continuer"
    ],
    "startVoice": "Démarrer la voix",
    "queueMessage": "Mettre en file d'attente",
    "steer": "Diriger l'exécution",
    "stop": "Arrêter",
    "send": "Envoyer",
    "speaking": "Parle",
    "transcribing": "Transcription",
    "thinking": "Réflexion"
  },
  "skills": {
    "tabSkills": "Compétences",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "Compétences…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "Artefacts…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "Artefacts -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "Rechercher des sessions…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "Fermer",
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
