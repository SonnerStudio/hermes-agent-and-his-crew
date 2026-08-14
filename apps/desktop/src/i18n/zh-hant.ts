import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const zhHant: Translations = defineLocale({
  "common": {
    "apply": "套用",
    "back": "返回",
    "save": "儲存",
    "saving": "儲存…",
    "cancel": "取消",
    "clear": "清除搜尋",
    "close": "關閉",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "可用",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "發送",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "產物",
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
    "search": "搜尋對話",
    "searchTitle": "搜尋對話…",
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
      "new-session": "新增對話",
      "skills": "功能",
      "messaging": "訊息",
      "artifacts": "產物"
    },
    "searchAria": "搜尋對話",
    "searchPlaceholder": "搜尋對話…",
    "clearSearch": "清除搜尋",
    "pinned": "已釘選",
    "sessions": "對話",
    "cronJobs": "排程任務",
    "shiftClickHint": "Shift-點擊以釘選",
    "noWorkspace": "無工作區",
    "projectEmpty": "尚無對話",
    "noSessions": "尚無對話",
    "dateDivider": {
      "today": "今天",
      "yesterday": "昨天",
      "thisWeek": "本週",
      "lastWeek": "上週",
      "thisMonth": "本月"
    },
    "row": {
      "openInSplit": "在分割視窗中開啟"
    }
  },
  "composer": {
    "message": "訊息",
    "placeholderStarting": "正在啟動 Hermes…",
    "placeholderReconnecting": "正在重新連線 Hermes…",
    "placeholderFollowUp": "發送後續訊息",
    "newSessionPlaceholders": [
      "我們要做什麼？",
      "給 Hermes 分派一個任務",
      "您在想什麼？",
      "描述您的需求",
      "我們要處理什麼？",
      "隨心提問",
      "從設定目標開始"
    ],
    "followUpPlaceholders": [
      "發送追問",
      "補充更多背景資訊",
      "進一步細化請求",
      "接下來做什麼？",
      "繼續進行",
      "深入探討",
      "調整或繼續"
    ],
    "startVoice": "開啟語音對話",
    "queueMessage": "加入訊息佇列",
    "steer": "引導執行",
    "stop": "停止",
    "send": "發送",
    "speaking": "正在講話",
    "transcribing": "正在轉錄",
    "thinking": "正在思考"
  },
  "skills": {
    "tabSkills": "功能",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "功能…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "產物…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "產物 -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "搜尋對話…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "關閉",
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
