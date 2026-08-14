import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const tr: Translations = defineLocale({
  "common": {
    "apply": "Uygula",
    "back": "Geri",
    "save": "Kaydet",
    "saving": "Kaydet…",
    "cancel": "İptal",
    "clear": "Aramayı",
    "close": "Kapat",
    "copy": "Copy",
    "copied": "Copied",
    "delete": "Delete",
    "done": "Done",
    "error": "Error",
    "free": "Boş",
    "loading": "Loading…",
    "refresh": "Refresh",
    "retry": "Retry",
    "run": "Run",
    "send": "Gönder",
    "on": "On",
    "off": "Off"
  },
  "fileMenu": {
    "revealFinder": "Finder",
    "revealExplorer": "Explorer",
    "revealFileManager": "Folder",
    "revealInSidebar": "Yapıtlar",
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
    "search": "Oturumları ara",
    "searchTitle": "Oturumları ara…",
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
      "new-session": "Yeni Oturum",
      "skills": "Yetenekler",
      "messaging": "Mesajlaşma",
      "artifacts": "Yapıtlar"
    },
    "searchAria": "Oturumları ara",
    "searchPlaceholder": "Oturumları ara…",
    "clearSearch": "Aramayı temizle",
    "pinned": "Sabitlendi",
    "sessions": "Oturumlar",
    "cronJobs": "Zamanlanmış Görevler",
    "shiftClickHint": "Sabitlemek için Shift-tıklayın",
    "noWorkspace": "Çalışma alanı yok",
    "projectEmpty": "Henüz oturum yok",
    "noSessions": "Henüz oturum yok",
    "dateDivider": {
      "today": "Bugün",
      "yesterday": "Dün",
      "thisWeek": "Bu hafta",
      "lastWeek": "Geçen hafta",
      "thisMonth": "Bu ay"
    },
    "row": {
      "openInSplit": "Bölünmüş görünümde aç"
    }
  },
  "composer": {
    "message": "Mesaj",
    "placeholderStarting": "Hermes başlatılıyor…",
    "placeholderReconnecting": "Hermes ile yeniden bağlantı kuruluyor…",
    "placeholderFollowUp": "Takip mesajı gönder",
    "newSessionPlaceholders": [
      "Ne inşa ediyoruz?",
      "Hermes'e bir görev verin",
      "Aklınızda ne var?",
      "İhtiyacınızı açıklayın",
      "Hangi konuyu ele alalım?",
      "İstediğinizi sorun",
      "Bir hedefle başlayın"
    ],
    "followUpPlaceholders": [
      "Takip mesajı gönder",
      "Daha fazla bağlam ekle",
      "İsteği hassaslaştır",
      "Sırada ne var?",
      "Devam et",
      "Daha derine in",
      "Ayarla veya devam et"
    ],
    "startVoice": "Sesli sohbet başlat",
    "queueMessage": "Mesajı kuyruğa al",
    "steer": "Yönlendir",
    "stop": "Durdur",
    "send": "Gönder",
    "speaking": "Konuşuyor",
    "transcribing": "Metne dönüştürülüyor",
    "thinking": "Düşünüyor"
  },
  "skills": {
    "tabSkills": "Yetenekler",
    "tabToolsets": "Tools",
    "tabMcp": "MCP",
    "tabHub": "Hub",
    "all": "All",
    "searchSkills": "Yetenekler…",
    "searchToolsets": "Tools…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…"
  },
  "artifacts": {
    "search": "Yapıtlar…",
    "refresh": "Refresh",
    "refreshing": "Refreshing…",
    "tabAll": "All",
    "tabImages": "Images",
    "tabFiles": "Files",
    "tabLinks": "Links",
    "noArtifactsTitle": "Yapıtlar -"
  },
  "commandCenter": {
    "paletteTitle": "Command palette",
    "searchPlaceholder": "Oturumları ara…",
    "branches": "Branches",
    "projects": "Projects",
    "openFolder": "Open folder…"
  },
  "settings": {
    "closeSettings": "Kapat",
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
