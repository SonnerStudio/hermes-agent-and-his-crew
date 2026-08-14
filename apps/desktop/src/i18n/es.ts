import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const es: Translations = defineLocale({
  "common": {
    "apply": "Aplicar",
    "back": "Atrás",
    "save": "Guardar",
    "saving": "Guardar…",
    "cancel": "Cancelar",
    "clear": "Limpiar",
    "close": "Cerrar",
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
    "send": "Enviar",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "Artefactos",
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
    "search": "Buscar sesiones",
    "searchTitle": "Buscar sesiones…",
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
      "new-session": "Nueva sesión",
      "skills": "Habilidades",
      "messaging": "Mensajería",
      "artifacts": "Artefactos"
    },
    "searchAria": "Buscar sesiones",
    "searchPlaceholder": "Buscar sesiones…",
    "clearSearch": "Limpiar búsqueda",
    "pinned": "Fijado",
    "sessions": "Sesiones",
    "cronJobs": "Tareas Cron",
    "shiftClickHint": "Mayús-clic para fijar",
    "noWorkspace": "Sin espacio de trabajo",
    "projectEmpty": "No hay sesiones aún",
    "noSessions": "No hay sesiones aún",
    "dateDivider": {
      "today": "Hoy",
      "yesterday": "Ayer",
      "thisWeek": "Esta semana",
      "lastWeek": "La semana pasada",
      "thisMonth": "Este mes"
    },
    "row": {
      "openInSplit": "Abrir en vista dividida"
    }
  },
  "composer": {
    "message": "Mensaje",
    "placeholderStarting": "Iniciando Hermes…",
    "placeholderReconnecting": "Reconectando con Hermes…",
    "placeholderFollowUp": "Enviar seguimiento",
    "newSessionPlaceholders": [
      "¿Qué estamos construyendo?",
      "Dale una tarea a Hermes",
      "¿Qué tienes en mente?",
      "Describe lo que necesitas",
      "¿Qué deberíamos abordar?",
      "Pregunta cualquier cosa",
      "Comienza con un objetivo"
    ],
    "followUpPlaceholders": [
      "Enviar seguimiento",
      "Añadir más contexto",
      "Refinar la solicitud",
      "¿Qué sigue?",
      "Continuar",
      "Ir más lejos",
      "Ajustar o continuar"
    ],
    "startVoice": "Iniciar conversación por voz",
    "queueMessage": "Poner en cola",
    "steer": "Dirigir ejecución",
    "stop": "Detener",
    "send": "Enviar",
    "speaking": "Hablando",
    "transcribing": "Transcribiendo",
    "thinking": "Pensando"
  },
  "skills": {
    "tabSkills": "Habilidades",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "Habilidades…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "Artefactos…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "Artefactos -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "Buscar sesiones…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "Cerrar",
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
