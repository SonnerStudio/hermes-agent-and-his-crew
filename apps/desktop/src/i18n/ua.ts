import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const ua: Translations = defineLocale({
  "common": {
    "apply": "Застосувати",
    "back": "Назад",
    "save": "Зберегти",
    "saving": "Зберегти…",
    "cancel": "Скасувати",
    "clear": "Очистити",
    "close": "Закрити",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "Вільно",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "Надіслати",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "Артефакти",
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
    "search": "Пошук сеансів",
    "searchTitle": "Пошук сеансів…",
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
      "new-session": "Новий сеанс",
      "skills": "Навички",
      "messaging": "Повідомлення",
      "artifacts": "Артефакти"
    },
    "searchAria": "Пошук сеансів",
    "searchPlaceholder": "Пошук сеансів…",
    "clearSearch": "Очистити пошук",
    "pinned": "Закріплені",
    "sessions": "Сеанси",
    "cronJobs": "Завдання Cron",
    "shiftClickHint": "Shift-клік для закріплення",
    "noWorkspace": "Немає робочої області",
    "projectEmpty": "Поки немає сеансів",
    "noSessions": "Поки немає сеансів",
    "dateDivider": {
      "today": "Сьогодні",
      "yesterday": "Вчора",
      "thisWeek": "Цього тижня",
      "lastWeek": "Минулого тижня",
      "thisMonth": "Цього місяця"
    },
    "row": {
      "openInSplit": "Відкрити в розділеному вигляді"
    }
  },
  "composer": {
    "message": "Повідомлення",
    "placeholderStarting": "Запуск Hermes…",
    "placeholderReconnecting": "Повторне підключення до Hermes…",
    "placeholderFollowUp": "Надіслати наступне повідомлення",
    "newSessionPlaceholders": [
      "Що ми створюємо?",
      "Дайте завдання Hermes",
      "Про що ви думаєте?",
      "Опишіть, що вам потрібно",
      "За що візьмемося?",
      "Запитуйте про що завгодно",
      "Почніть з мети"
    ],
    "followUpPlaceholders": [
      "Надіслати уточнення",
      "Додати контекст",
      "Уточнити запит",
      "Що далі?",
      "Продовжувати",
      "Поглибити тему",
      "Скоригувати або продовжити"
    ],
    "startVoice": "Почати голосовий чат",
    "queueMessage": "Додати повідомлення в чергу",
    "steer": "Керувати виконанням",
    "stop": "Зупинити",
    "send": "Надіслати",
    "speaking": "Говорить",
    "transcribing": "Транскрипція",
    "thinking": "Думає"
  },
  "skills": {
    "tabSkills": "Навички",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "Навички…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "Артефакти…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "Артефакти -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "Пошук сеансів…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "Закрити",
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
