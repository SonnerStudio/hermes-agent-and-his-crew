import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const vn: Translations = defineLocale({
  "common": {
    "apply": "Áp dụng",
    "back": "Quay lại",
    "save": "Lưu",
    "saving": "Lưu…",
    "cancel": "Hủy",
    "clear": "Xóa",
    "close": "Đóng",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "Trống",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "Gửi",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "Tạo phẩm",
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
    "search": "Tìm kiếm phiên",
    "searchTitle": "Tìm kiếm phiên…",
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
      "new-session": "Phiên mới",
      "skills": "Kỹ năng",
      "messaging": "Tin nhắn",
      "artifacts": "Tạo phẩm"
    },
    "searchAria": "Tìm kiếm phiên",
    "searchPlaceholder": "Tìm kiếm phiên…",
    "clearSearch": "Xóa tìm kiếm",
    "pinned": "Đã ghim",
    "sessions": "Phiên",
    "cronJobs": "Tác vụ Cron",
    "shiftClickHint": "Shift-nhấp để ghim",
    "noWorkspace": "Không có không gian làm việc",
    "projectEmpty": "Chưa có phiên nào",
    "noSessions": "Chưa có phiên nào",
    "dateDivider": {
      "today": "Hôm nay",
      "yesterday": "Hôm qua",
      "thisWeek": "Tuần này",
      "lastWeek": "Tuần trước",
      "thisMonth": "Tháng này"
    },
    "row": {
      "openInSplit": "Mở ở chế độ chia đôi"
    }
  },
  "composer": {
    "message": "Tin nhắn",
    "placeholderStarting": "Đang khởi động Hermes…",
    "placeholderReconnecting": "Đang kết nối lại với Hermes…",
    "placeholderFollowUp": "Gửi tin nhắn tiếp theo",
    "newSessionPlaceholders": [
      "Chúng ta đang xây dựng gì?",
      "Giao nhiệm vụ cho Hermes",
      "Bạn đang nghĩ gì?",
      "Mô tả những gì bạn cần",
      "Chúng ta nên giải quyết việc gì?",
      "Hỏi bất cứ điều gì",
      "Bắt đầu với một mục tiêu"
    ],
    "followUpPlaceholders": [
      "Gửi phản hồi tiếp theo",
      "Thêm bối cảnh",
      "Tinh chỉnh yêu cầu",
      "Tiếp theo là gì?",
      "Tiếp tục",
      "Đi sâu hơn",
      "Điều chỉnh hoặc tiếp tục"
    ],
    "startVoice": "Bắt đầu trò chuyện bằng giọng nói",
    "queueMessage": "Xếp hàng tin nhắn",
    "steer": "Điều hướng thực thi",
    "stop": "Dừng",
    "send": "Gửi",
    "speaking": "Đang nói",
    "transcribing": "Đang phiên âm",
    "thinking": "Đang suy nghĩ"
  },
  "skills": {
    "tabSkills": "Kỹ năng",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "Kỹ năng…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "Tạo phẩm…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "Tạo phẩm -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "Tìm kiếm phiên…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "Đóng",
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
