import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const th: Translations = defineLocale({
  "common": {
    "apply": "นำไปใช้",
    "back": "ย้อนกลับ",
    "save": "บันทึก",
    "saving": "บันทึก…",
    "cancel": "ยกเลิก",
    "clear": "ล้างการค้นหา",
    "close": "ปิด",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "ว่าง",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "ส่ง",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "สิ่งประดิษฐ์",
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
    "search": "ค้นหาเซสชัน",
    "searchTitle": "ค้นหาเซสชัน…",
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
      "new-session": "เซสชันใหม่",
      "skills": "ทักษะ",
      "messaging": "ข้อความ",
      "artifacts": "สิ่งประดิษฐ์"
    },
    "searchAria": "ค้นหาเซสชัน",
    "searchPlaceholder": "ค้นหาเซสชัน…",
    "clearSearch": "ล้างการค้นหา",
    "pinned": "ปักหมุดแล้ว",
    "sessions": "เซสชัน",
    "cronJobs": "งานตามกำหนดเวลา",
    "shiftClickHint": "Shift-คลิกเพื่อปักหมุด",
    "noWorkspace": "ไม่มีพื้นที่ทำงาน",
    "projectEmpty": "ยังไม่มีเซสชัน",
    "noSessions": "ยังไม่มีเซสชัน",
    "dateDivider": {
      "today": "วันนี้",
      "yesterday": "เมื่อวาน",
      "thisWeek": "สัปดาห์นี้",
      "lastWeek": "สัปดาห์ที่แล้ว",
      "thisMonth": "เดือนนี้"
    },
    "row": {
      "openInSplit": "เปิดในมุมมองแยก"
    }
  },
  "composer": {
    "message": "ข้อความ",
    "placeholderStarting": "กำลังเริ่ม Hermes…",
    "placeholderReconnecting": "กำลังเชื่อมต่อกับ Hermes ใหม่…",
    "placeholderFollowUp": "ส่งข้อความติดตาม",
    "newSessionPlaceholders": [
      "เรากำลังสร้างอะไร?",
      "มอบหมายงานให้ Hermes",
      "คุณกำลังคิดอะไรอยู่?",
      "อธิบายสิ่งที่คุณต้องการ",
      "เราควรจัดการเรื่องใด?",
      "ถามอะไรก็ได้",
      "เริ่มต้นด้วยเป้าหมาย"
    ],
    "followUpPlaceholders": [
      "ส่งข้อความติดตาม",
      "เพิ่มบริบทเพิ่มเติม",
      "ปรับแต่งคำขอ",
      "อะไรต่อไป?",
      "ทำต่อไป",
      "เจาะลึกยิ่งขึ้น",
      "ปรับเปลี่ยนหรือดำเนินการต่อ"
    ],
    "startVoice": "เริ่มการสนทนาด้วยเสียง",
    "queueMessage": "จัดคิวข้อความ",
    "steer": "ควบคุมการทำงาน",
    "stop": "หยุด",
    "send": "ส่ง",
    "speaking": "กำลังพูด",
    "transcribing": "กำลังแปลงเสียง",
    "thinking": "กำลังคิด"
  },
  "skills": {
    "tabSkills": "ทักษะ",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "ทักษะ…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "สิ่งประดิษฐ์…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "สิ่งประดิษฐ์ -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "ค้นหาเซสชัน…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "ปิด",
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
