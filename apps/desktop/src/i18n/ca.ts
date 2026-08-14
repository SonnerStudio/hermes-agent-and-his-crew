import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const ca: Translations = defineLocale({
  common: {
    apply: 'Apply',
    back: 'Back',
    save: 'Save',
    saving: 'Save…',
    cancel: 'Cancel',
    clear: 'Clear',
    close: 'Close',
    copy: 'Copy',
    copied: 'Copied',
    delete: 'Delete',
    done: 'Done',
    error: 'Error',
    free: 'Free',
    loading: 'Loading…',
    refresh: 'Refresh',
    retry: 'Retry',
    run: 'Run',
    send: 'Send',
    on: 'On',
    off: 'Off'
  },
  fileMenu: {
    revealFinder: 'Finder',
    revealExplorer: 'Explorer',
    revealFileManager: 'Folder',
    revealInSidebar: 'Artifacts',
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
    search: 'Search sessions',
    searchTitle: 'Search sessions…',
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
      'new-session': 'New session',
      skills: 'Capabilities',
      messaging: 'Messaging',
      artifacts: 'Artifacts'
    },
    searchAria: 'Search sessions',
    searchPlaceholder: 'Search sessions…',
    clearSearch: 'Clear search',
    pinned: 'Pinned',
    sessions: 'Sessions',
    cronJobs: 'Cron jobs',
    shiftClickHint: 'Shift-click a chat to pin',
    noWorkspace: 'No workspace',
    projectEmpty: 'No sessions yet',
    noSessions: 'No sessions yet',
    dateDivider: {
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'This week',
      lastWeek: 'Last week',
      thisMonth: 'This month'
    },
    row: {
      openInSplit: 'Open in split'
    }
  },
  composer: {
    message: 'Message',
    placeholderStarting: 'Starting Hermes…',
    placeholderReconnecting: 'Reconnecting to Hermes…',
    placeholderFollowUp: 'Send a follow-up',
    newSessionPlaceholders: [
      'What are we building?',
      'Give Hermes a task',
      "What's on your mind?",
      'Describe what you need',
      'What should we tackle?',
      'Ask anything',
      'Start with a goal'
    ],
    followUpPlaceholders: [
      'Send a follow-up',
      'Add more context',
      'Refine the request',
      "What's next?",
      'Keep it going',
      'Push it further',
      'Adjust or continue'
    ],
    startVoice: 'Start voice conversation',
    queueMessage: 'Queue message',
    steer: 'Steer execution',
    stop: 'Stop',
    send: 'Send',
    speaking: 'Speaking',
    transcribing: 'Transcribing',
    thinking: 'Thinking'
  },
  skills: {
    tabSkills: 'Capabilities',
    tabToolsets: 'Tools',
    tabMcp: 'MCP',
    tabHub: 'Hub',
    all: 'All',
    searchSkills: 'Capabilities…',
    searchToolsets: 'Tools…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…'
  },
  artifacts: {
    search: 'Artifacts…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…',
    tabAll: 'All',
    tabImages: 'Images',
    tabFiles: 'Files',
    tabLinks: 'Links',
    noArtifactsTitle: 'Artifacts -'
  },
  commandCenter: {
    paletteTitle: 'Command palette',
    searchPlaceholder: 'Search sessions…',
    branches: 'Branches',
    projects: 'Projects',
    openFolder: 'Open folder…'
  },
  settings: {
    closeSettings: 'Close',
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
