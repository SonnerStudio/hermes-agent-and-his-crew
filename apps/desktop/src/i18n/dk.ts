import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const dk: Translations = defineLocale({
  common: {
    apply: 'Anvend',
    back: 'Tilbage',
    save: 'Gem',
    saving: 'Gem…',
    cancel: 'Annuller',
    clear: 'Ryd',
    close: 'Luk',
    copy: 'Copy',
    copied: 'Copied',
    delete: 'Delete',
    done: 'Done',
    error: 'Error',
    free: 'Fri',
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
    revealInSidebar: 'Artefakter',
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
    search: 'Søg i sessioner',
    searchTitle: 'Søg i sessioner…',
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
      'new-session': 'Ny session',
      skills: 'Færdigheder',
      messaging: 'Beskeder',
      artifacts: 'Artefakter'
    },
    searchAria: 'Søg i sessioner',
    searchPlaceholder: 'Søg i sessioner…',
    clearSearch: 'Ryd søgning',
    pinned: 'Fastgjort',
    sessions: 'Sessioner',
    cronJobs: 'Cron-job',
    shiftClickHint: 'Shift-klik for at fastgøre',
    noWorkspace: 'Intet arbejdsområde',
    projectEmpty: 'Ingen sessioner endnu',
    noSessions: 'Ingen sessioner endnu',
    dateDivider: {
      today: 'I dag',
      yesterday: 'I går',
      thisWeek: 'Denne uge',
      lastWeek: 'Sidste uge',
      thisMonth: 'Denne måned'
    },
    row: {
      openInSplit: 'Åbn i opdelt visning'
    }
  },
  composer: {
    message: 'Besked',
    placeholderStarting: 'Hermes starter…',
    placeholderReconnecting: 'Genopretter forbindelse til Hermes…',
    placeholderFollowUp: 'Send opfølgende besked',
    newSessionPlaceholders: [
      'Hvad bygger vi?',
      'Giv Hermes en opgave',
      'Hvad tænker du på?',
      'Beskriv hvad du har brug for',
      'Hvad skal vi tage fat på?',
      'Spørg om hvad som helst',
      'Start med et mål'
    ],
    followUpPlaceholders: [
      'Send opfølgning',
      'Tilføj mere kontekst',
      'Finpuds anmodningen',
      'Hvad er det næste?',
      'Fortsæt',
      'Gå dybere',
      'Juster eller fortsæt'
    ],
    startVoice: 'Start stemmesamtale',
    queueMessage: 'Sæt besked i kø',
    steer: 'Styr udførelse',
    stop: 'Stop',
    send: 'Send',
    speaking: 'Taler',
    transcribing: 'Transskriberer',
    thinking: 'Tænker'
  },
  skills: {
    tabSkills: 'Færdigheder',
    tabToolsets: 'Tools',
    tabMcp: 'MCP',
    tabHub: 'Hub',
    all: 'All',
    searchSkills: 'Færdigheder…',
    searchToolsets: 'Tools…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…'
  },
  artifacts: {
    search: 'Artefakter…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…',
    tabAll: 'All',
    tabImages: 'Images',
    tabFiles: 'Files',
    tabLinks: 'Links',
    noArtifactsTitle: 'Artefakter -'
  },
  commandCenter: {
    paletteTitle: 'Command palette',
    searchPlaceholder: 'Søg i sessioner…',
    branches: 'Branches',
    projects: 'Projects',
    openFolder: 'Open folder…'
  },
  settings: {
    closeSettings: 'Luk',
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
