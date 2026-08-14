import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const in_: Translations = defineLocale({
  common: {
    apply: 'लागू करें',
    back: 'वापस',
    save: 'सहेजें',
    saving: 'सहेजें…',
    cancel: 'रद्द करें',
    clear: 'खोज',
    close: 'बंद करें',
    copy: 'Copy',
    copied: 'Copied',
    delete: 'Delete',
    done: 'Done',
    error: 'Error',
    free: 'मुक्त',
    loading: 'Loading…',
    refresh: 'Refresh',
    retry: 'Retry',
    run: 'Run',
    send: 'भेजें',
    on: 'On',
    off: 'Off'
  },
  fileMenu: {
    revealFinder: 'Finder',
    revealExplorer: 'Explorer',
    revealFileManager: 'Folder',
    revealInSidebar: 'कलाकृतियां',
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
    search: 'सत्र खोजें',
    searchTitle: 'सत्र खोजें…',
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
      'new-session': 'नया सत्र',
      skills: 'कौशल',
      messaging: 'संदेश',
      artifacts: 'कलाकृतियां'
    },
    searchAria: 'सत्र खोजें',
    searchPlaceholder: 'सत्र खोजें…',
    clearSearch: 'खोज साफ़ करें',
    pinned: 'पिन किया गया',
    sessions: 'सत्र',
    cronJobs: 'क्रॉन कार्य',
    shiftClickHint: 'पिन करने के लिए Shift-क्लिक करें',
    noWorkspace: 'कोई कार्यस्थान नहीं',
    projectEmpty: 'अभी कोई सत्र नहीं',
    noSessions: 'अभी कोई सत्र नहीं',
    dateDivider: {
      today: 'आज',
      yesterday: 'कल',
      thisWeek: 'इस सप्ताह',
      lastWeek: 'पिछले सप्ताह',
      thisMonth: 'इस महीने'
    },
    row: {
      openInSplit: 'विभाजित दृश्य में खोलें'
    }
  },
  composer: {
    message: 'संदेश',
    placeholderStarting: 'Hermes शुरू हो रहा है…',
    placeholderReconnecting: 'Hermes से पुनः कनेक्ट हो रहा है…',
    placeholderFollowUp: 'फॉलो-अप संदेश भेजें',
    newSessionPlaceholders: [
      'हम क्या बना रहे हैं?',
      'Hermes को एक कार्य दें',
      'आपके मन में क्या है?',
      'बताएं कि आपको क्या चाहिए',
      'हम क्या हल करेंगे?',
      'कुछ भी पूछें',
      'एक लक्ष्य से शुरुआत करें'
    ],
    followUpPlaceholders: [
      'फॉलो-अप भेजें',
      'अधिक संदर्भ जोड़ें',
      'अनुरोध को परिष्कृत करें',
      'आगे क्या है?',
      'जारी रखें',
      'गहराई में जाएं',
      'समायोजित करें या जारी रखें'
    ],
    startVoice: 'ध्वनि बातचीत शुरू करें',
    queueMessage: 'संदेश को कतार में जोड़ें',
    steer: 'निष्पादन निर्देशित करें',
    stop: 'रोकें',
    send: 'भेजें',
    speaking: 'बोल रहा है',
    transcribing: 'ट्रांसक्राइब कर रहा है',
    thinking: 'सोच रहा है'
  },
  skills: {
    tabSkills: 'कौशल',
    tabToolsets: 'Tools',
    tabMcp: 'MCP',
    tabHub: 'Hub',
    all: 'All',
    searchSkills: 'कौशल…',
    searchToolsets: 'Tools…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…'
  },
  artifacts: {
    search: 'कलाकृतियां…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…',
    tabAll: 'All',
    tabImages: 'Images',
    tabFiles: 'Files',
    tabLinks: 'Links',
    noArtifactsTitle: 'कलाकृतियां -'
  },
  commandCenter: {
    paletteTitle: 'Command palette',
    searchPlaceholder: 'सत्र खोजें…',
    branches: 'Branches',
    projects: 'Projects',
    openFolder: 'Open folder…'
  },
  settings: {
    closeSettings: 'बंद करें',
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
