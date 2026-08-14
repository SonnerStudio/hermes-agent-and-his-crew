import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const ru: Translations = defineLocale({
  "common": {
    "apply": "Применить",
    "back": "Назад",
    "save": "Сохранить",
    "saving": "Сохранить…",
    "cancel": "Отмена",
    "clear": "Очистить",
    "close": "Закрыть",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "Свободно",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "Отправить",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "Артефакты",
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
    "search": "Поиск сессий",
    "searchTitle": "Поиск сессий…",
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
      "new-session": "Новая сессия",
      "skills": "Навыки",
      "messaging": "Сообщения",
      "artifacts": "Артефакты"
    },
    "searchAria": "Поиск сессий",
    "searchPlaceholder": "Поиск сессий…",
    "clearSearch": "Очистить поиск",
    "pinned": "Закрепленные",
    "sessions": "Сессии",
    "cronJobs": "Задачи Cron",
    "shiftClickHint": "Shift-клик для закрепления",
    "noWorkspace": "Нет рабочей области",
    "projectEmpty": "Пока нет сессий",
    "noSessions": "Пока нет сессий",
    "dateDivider": {
      "today": "Сегодня",
      "yesterday": "Вчера",
      "thisWeek": "На этой неделе",
      "lastWeek": "На прошлой неделе",
      "thisMonth": "В этом месяце"
    },
    "row": {
      "openInSplit": "Открыть в разделенном виде"
    }
  },
  "composer": {
    "message": "Сообщение",
    "placeholderStarting": "Запуск Hermes…",
    "placeholderReconnecting": "Переподключение к Hermes…",
    "placeholderFollowUp": "Отправить следующее сообщение",
    "newSessionPlaceholders": [
      "Что создаем?",
      "Дайте задачу Hermes",
      "О чем вы думаете?",
      "Опишите, что вам нужно",
      "За что возьмемся?",
      "Спросите что угодно",
      "Начните с цели"
    ],
    "followUpPlaceholders": [
      "Отправить уточнение",
      "Добавить контекст",
      "Уточнить запрос",
      "Что дальше?",
      "Продолжить",
      "Углубить тему",
      "Скорректировать или продолжить"
    ],
    "startVoice": "Начать голосовой чат",
    "queueMessage": "В очередь",
    "steer": "Управлять выполнением",
    "stop": "Остановить",
    "send": "Отправить",
    "speaking": "Говорит",
    "transcribing": "Транскрибация",
    "thinking": "Размышление"
  },
  "skills": {
    "tabSkills": "Навыки",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "Навыки…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "Артефакты…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "Артефакты -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "Поиск сессий…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "Закрыть",
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
