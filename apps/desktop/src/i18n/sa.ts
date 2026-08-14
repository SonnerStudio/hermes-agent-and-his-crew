import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const sa: Translations = defineLocale({
  common: {
    apply: 'تطبيق',
    back: 'رجوع',
    save: 'حفظ',
    saving: 'حفظ…',
    cancel: 'إلغاء',
    clear: 'مسح',
    close: 'إغلاق',
    copy: 'Copy',
    copied: 'Copied',
    delete: 'Delete',
    done: 'Done',
    error: 'Error',
    free: 'متاح',
    loading: 'Loading…',
    refresh: 'Refresh',
    retry: 'Retry',
    run: 'Run',
    send: 'إرسال',
    on: 'On',
    off: 'Off'
  },
  fileMenu: {
    revealFinder: 'Finder',
    revealExplorer: 'Explorer',
    revealFileManager: 'Folder',
    revealInSidebar: 'المخرجات',
    copyPath: 'Copy Path',
    copyRelativePath: 'Copy Relative Path',
    rename: 'Rename…',
    delete: 'Delete',
    renameTitle: 'Rename',
    renameLabel: 'New name',
    deleteBody: 'Are you sure?',
    pathCopied: 'Copied'
  },
  titlebar: {
    hideSidebar: 'Sidebar',
    showSidebar: 'Sidebar',
    search: 'البحث في الجلسات',
    searchTitle: 'البحث في الجلسات…',
    swapSidebarSides: 'Swap sidebar',
    hideRightSidebar: 'Right sidebar',
    showRightSidebar: 'Right sidebar',
    muteHaptics: 'Mute',
    unmuteHaptics: 'Unmute',
    openSettings: 'Settings',
    openStarmap: 'Starmap'
  },
  language: {
    label: 'Language',
    description: 'Choose language',
    saving: 'Saving…',
    saveError: 'Error',
    switchTo: 'Switch language',
    searchPlaceholder: 'Search languages…',
    noResults: 'No results'
  },
  sidebar: {
    nav: {
      'new-session': 'جلسة جديدة',
      skills: 'القدرات',
      messaging: 'الرسائل',
      artifacts: 'المخرجات'
    },
    searchAria: 'البحث في الجلسات',
    searchPlaceholder: 'البحث في الجلسات…',
    clearSearch: 'مسح البحث',
    pinned: 'مثبت',
    sessions: 'الجلسات',
    cronJobs: 'مهام مجدولة',
    shiftClickHint: 'Shift-انقر للتثبيت',
    noWorkspace: 'لا توجد مساحة عمل',
    projectEmpty: 'لا توجد جلسات بعد',
    noSessions: 'لا توجد جلسات بعد',
    dateDivider: {
      today: 'اليوم',
      yesterday: 'أمس',
      thisWeek: 'هذا الأسبوع',
      lastWeek: 'الأسبوع الماضي',
      thisMonth: 'هذا الشهر'
    },
    row: {
      openInSplit: 'فتح في عرض مقسم'
    }
  },
  composer: {
    message: 'رسالة',
    placeholderStarting: 'جارٍ تشغيل Hermes…',
    placeholderReconnecting: 'جارٍ إعادة الاتصال بـ Hermes…',
    placeholderFollowUp: 'إرسال متابعة',
    newSessionPlaceholders: [
      'ماذا سنبني؟',
      'أعطِ Hermes مهمة',
      'ما الذي يدور في ذهنك؟',
      'صف ما تحتاجه',
      'ماذا يجب أن نعالج؟',
      'اسأل عن أي شيء',
      'ابدأ بهدف'
    ],
    followUpPlaceholders: [
      'إرسال متابعة',
      'إضافة المزيد من السياق',
      'تحسين الطلب',
      'ما الخطوة التالية؟',
      'استمر هكذا',
      'التعمق أكثر',
      'تعديل أو متابعة'
    ],
    startVoice: 'بدء محادثة صوتية',
    queueMessage: 'إضافة إلى قائمة الانتظار',
    steer: 'توجيه التنفيذ',
    stop: 'إيقاف',
    send: 'إرسال',
    speaking: 'يتحدث',
    transcribing: 'جارٍ النسخ',
    thinking: 'يفكر'
  },
  skills: {
    tabSkills: 'القدرات',
    tabToolsets: 'Tools',
    tabMcp: 'MCP',
    tabHub: 'Hub',
    all: 'All',
    searchSkills: 'القدرات…',
    searchToolsets: 'Tools…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…'
  },
  artifacts: {
    search: 'المخرجات…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…',
    tabAll: 'All',
    tabImages: 'Images',
    tabFiles: 'Files',
    tabLinks: 'Links',
    noArtifactsTitle: 'المخرجات -'
  },
  commandCenter: {
    paletteTitle: 'Command palette',
    searchPlaceholder: 'البحث في الجلسات…',
    branches: 'Branches',
    projects: 'Projects',
    openFolder: 'Open folder…'
  },
  settings: {
    closeSettings: 'إغلاق',
    exportConfig: 'Export',
    importConfig: 'Import',
    resetToDefaults: 'Reset',
    nav: {
      providers: 'Providers',
      providerAccounts: 'Accounts',
      providerApiKeys: 'API Keys',
      providerCustomEndpoints: 'Endpoints',
      gateway: 'Gateway',
      apiKeys: 'API Keys',
      keybinds: 'Shortcuts',
      keysTools: 'Tools',
      keysSettings: 'Settings',
      mcp: 'MCP',
      archivedChats: 'Archive',
      about: 'About',
      billing: 'Billing',
      notifications: 'Notifications',
      plugins: 'Plugins'
    }
  },
  desktop: {
    desktopCommands: 'Desktop',
    resumeStrandedTitle: 'Resume',
    resumeStrandedBody: 'Resume session',
    resumeRetry: 'Resume'
  }
})
