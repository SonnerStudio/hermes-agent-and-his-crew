import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const run: Translations = defineLocale({
  common: {
    apply: 'ᚠᛁᛏᛁᚱ',
    back: 'ᚨᛏᚱ',
    save: 'ᛋᛈᚨᚱ',
    saving: 'ᛋᛈᚨᚱ…',
    cancel: 'ᚨᚠᛚᚢᛋ',
    clear: 'ᚱᛁᛞ',
    close: 'ᛚᚢᚲᚨ',
    copy: 'Copy',
    copied: 'Copied',
    delete: 'Delete',
    done: 'Done',
    error: 'Error',
    free: 'ᚠᚱᛁ',
    loading: 'Loading…',
    refresh: 'Refresh',
    retry: 'Retry',
    run: 'Run',
    send: 'ᛋᛖᚾᛞ',
    on: 'On',
    off: 'Off'
  },
  fileMenu: {
    revealFinder: 'Finder',
    revealExplorer: 'Explorer',
    revealFileManager: 'Folder',
    revealInSidebar: 'ᚹᛖᚱᚲ',
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
    search: 'ᛋᛖᚲ ᛋᛖᛋ',
    searchTitle: 'ᛋᛖᚲ ᛋᛖᛋ…',
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
      'new-session': 'ᚾᛁᚱ ᛋᛖᛋ',
      skills: 'ᚲᚢᚾᛋᛏ',
      messaging: 'ᛒᛟᛞ',
      artifacts: 'ᚹᛖᚱᚲ'
    },
    searchAria: 'ᛋᛖᚲ ᛋᛖᛋ',
    searchPlaceholder: 'ᛋᛖᚲ ᛋᛖᛋ…',
    clearSearch: 'ᚱᛁᛞ ᛋᛖᚲ',
    pinned: 'ᚠᚨᛋᛏ',
    sessions: 'ᛋᛖᛋᛁᛟᚾᛋ',
    cronJobs: 'ᚲᚱᛟᚾ',
    shiftClickHint: 'ᛋᚺᛁᚠᛏ-ᚲᛚᛁᚲ ᚠᚨᛋᛏ',
    noWorkspace: 'ᛖᛁ ᚹᛖᚱᚲ',
    projectEmpty: 'ᛖᛁ ᛋᛖᛋ',
    noSessions: 'ᛖᛁ ᛋᛖᛋ',
    dateDivider: {
      today: 'ᛞᚨᚷ',
      yesterday: 'ᚷᚨᚱ',
      thisWeek: 'ᚢᚲᚨ',
      lastWeek: 'ᚠᛟᚱ-ᚢᚲᚨ',
      thisMonth: 'ᛗᚨᚾᚢᚦ'
    },
    row: {
      openInSplit: 'ᛖᚠᚾ ᛋᛈᛚᛁᛏ'
    }
  },
  composer: {
    message: 'ᛒᛟᛞ',
    placeholderStarting: 'ᚺᛖᚱᛗᛖᛋ ᛒᛁᚱ…',
    placeholderReconnecting: 'ᚺᛖᚱᛗᛖᛋ ᚨᛏᚱ…',
    placeholderFollowUp: 'ᛋᛖᚾᛞ ᛖᚠᛏᛁᚱ',
    newSessionPlaceholders: [
      'ᚺᚹᚨᛏ ᛒᚢᛁᛚᛞ?',
      'ᚷᛁᚠ ᚺᛖᚱᛗᛖᛋ ᚹᛖᚱᚲ',
      'ᚺᚹᚨᛏ ᚦᛖᚾᚲ?',
      'ᛋᛁᚷ ᚺᚹᚨᛏ ᚦᚨᚱᚠ',
      'ᚺᚹᚨᛏ ᛏᚨᚲᚨ?',
      'ᛋᛈᚢᚱ ᚨᛚᛏ',
      'ᛒᛁᚱ ᛗᛖᛞ ᛗᚨᛚ'
    ],
    followUpPlaceholders: [
      'ᛋᛖᚾᛞ ᛖᚠᛏᛁᚱ',
      'ᛚᛖᚷᚷ ᛏᛁᛚ ᛗᛖᛁᚱ',
      'ᛒᛖᛏᚱᛁ ᛒᛟᛞ',
      'ᚺᚹᚨᛏ ᚾᚢ?',
      'ᚠᚨᚱ ᚠᚱᚨᛗ',
      'ᛞᛁᚢᛈᚱᛁ',
      'ᚨᛞᛃᚢᛋᛏ ᛟᚱ ᚲᛟᚾᛏᛁᚾᚢᛖ'
    ],
    startVoice: 'ᛋᛏᛁᛗᛗᚨ',
    queueMessage: 'ᚲᛟ ᛒᛟᛞ',
    steer: 'ᛋᛏᛁᚱᚨ',
    stop: 'ᛋᛏᛟᛈ',
    send: 'ᛋᛖᚾᛞ',
    speaking: 'ᛏᚨᛚᚨ',
    transcribing: 'ᚱᚢᚾᚨ',
    thinking: 'ᚦᛖᚾᚲᚨ'
  },
  skills: {
    tabSkills: 'ᚲᚢᚾᛋᛏ',
    tabToolsets: 'Tools',
    tabMcp: 'MCP',
    tabHub: 'Hub',
    all: 'All',
    searchSkills: 'ᚲᚢᚾᛋᛏ…',
    searchToolsets: 'Tools…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…'
  },
  artifacts: {
    search: 'ᚹᛖᚱᚲ…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…',
    tabAll: 'All',
    tabImages: 'Images',
    tabFiles: 'Files',
    tabLinks: 'Links',
    noArtifactsTitle: 'ᚹᛖᚱᚲ -'
  },
  commandCenter: {
    paletteTitle: 'Command palette',
    searchPlaceholder: 'ᛋᛖᚲ ᛋᛖᛋ…',
    branches: 'Branches',
    projects: 'Projects',
    openFolder: 'Open folder…'
  },
  settings: {
    closeSettings: 'ᛚᚢᚲᚨ',
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
