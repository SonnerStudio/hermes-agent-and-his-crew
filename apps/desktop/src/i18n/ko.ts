import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const ko: Translations = defineLocale({
  "common": {
    "apply": "적용",
    "back": "뒤로",
    "save": "저장",
    "saving": "저장…",
    "cancel": "취소",
    "clear": "검색",
    "close": "닫기",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "여유",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "보내기",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "아티팩트",
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
    "search": "세션 검색",
    "searchTitle": "세션 검색…",
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
      "new-session": "새 세션",
      "skills": "기능",
      "messaging": "메시지",
      "artifacts": "아티팩트"
    },
    "searchAria": "세션 검색",
    "searchPlaceholder": "세션 검색…",
    "clearSearch": "검색 지우기",
    "pinned": "고정됨",
    "sessions": "세션",
    "cronJobs": "예약된 작업",
    "shiftClickHint": "Shift-클릭으로 고정",
    "noWorkspace": "작업 영역 없음",
    "projectEmpty": "아직 세션이 없습니다",
    "noSessions": "아직 세션이 없습니다",
    "dateDivider": {
      "today": "오늘",
      "yesterday": "어제",
      "thisWeek": "이번 주",
      "lastWeek": "지난 주",
      "thisMonth": "이번 달"
    },
    "row": {
      "openInSplit": "분할 보기로 열기"
    }
  },
  "composer": {
    "message": "메시지",
    "placeholderStarting": "Hermes 시작 중…",
    "placeholderReconnecting": "Hermes에 다시 연결 중…",
    "placeholderFollowUp": "후속 메시지 보내기",
    "newSessionPlaceholders": [
      "무엇을 만들까요?",
      "Hermes에게 작업을 할당하세요",
      "무슨 생각을 하고 계신가요?",
      "필요한 내용을 설명해 주세요",
      "어떤 문제를 해결할까요?",
      "무엇이든 물어보세요",
      "목표부터 시작하세요"
    ],
    "followUpPlaceholders": [
      "후속 질문 보내기",
      "추가 맥락 제공",
      "요청 구체화",
      "다음 단계는 무엇인가요?",
      "계속 진행",
      "더 깊이 파고들기",
      "수정 또는 계속"
    ],
    "startVoice": "음성 대화 시작",
    "queueMessage": "메시지 대기열에 추가",
    "steer": "실행 제어",
    "stop": "중지",
    "send": "보내기",
    "speaking": "말하는 중",
    "transcribing": "텍스트 변환 중",
    "thinking": "생각 중"
  },
  "skills": {
    "tabSkills": "기능",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "기능…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "아티팩트…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "아티팩트 -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "세션 검색…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "닫기",
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
