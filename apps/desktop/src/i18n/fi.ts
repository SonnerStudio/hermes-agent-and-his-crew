import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const fi: Translations = defineLocale({
  common: {
    apply: 'Käytä',
    back: 'Takaisin',
    save: 'Tallenna',
    saving: 'Tallenna…',
    cancel: 'Peruuta',
    clear: 'Tyhjennä',
    close: 'Sulje',
    copy: 'Copy',
    copied: 'Copied',
    delete: 'Delete',
    done: 'Done',
    error: 'Error',
    free: 'Vapaa',
    loading: 'Loading…',
    refresh: 'Refresh',
    retry: 'Retry',
    run: 'Run',
    send: 'Lähetä',
    on: 'On',
    off: 'Off'
  },
  fileMenu: {
    revealFinder: 'Finder',
    revealExplorer: 'Explorer',
    revealFileManager: 'Folder',
    revealInSidebar: 'Artifaktit',
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
    search: 'Etsi istuntoja',
    searchTitle: 'Etsi istuntoja…',
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
      'new-session': 'Uusi istunto',
      skills: 'Taidot',
      messaging: 'Viestit',
      artifacts: 'Artifaktit'
    },
    searchAria: 'Etsi istuntoja',
    searchPlaceholder: 'Etsi istuntoja…',
    clearSearch: 'Tyhjennä haku',
    pinned: 'Kiinnitetty',
    sessions: 'Istunnot',
    cronJobs: 'Ajastetut tehtävät',
    shiftClickHint: 'Shift-klikkaa kiinnittääksesi',
    noWorkspace: 'Ei työtilaa',
    projectEmpty: 'Ei vielä istuntoja',
    noSessions: 'Ei vielä istuntoja',
    dateDivider: {
      today: 'Tänään',
      yesterday: 'Eilen',
      thisWeek: 'Tällä viikolla',
      lastWeek: 'Viime viikolla',
      thisMonth: 'Tässä kuussa'
    },
    row: {
      openInSplit: 'Avaa jaetussa näkymässä'
    }
  },
  composer: {
    message: 'Viesti',
    placeholderStarting: 'Hermes käynnistyy…',
    placeholderReconnecting: 'Yhdistetään uudelleen Hermekseen…',
    placeholderFollowUp: 'Lähetä jatkoviesti',
    newSessionPlaceholders: [
      'Mitä rakennamme?',
      'Anna Hermesille tehtävä',
      'Mitä mietit?',
      'Kuvaile mitä tarvitset',
      'Mihin tartutaan?',
      'Kysy mitä vain',
      'Aloita tavoitteella'
    ],
    followUpPlaceholders: [
      'Lähetä jatkoviesti',
      'Lisää kontekstia',
      'Tarkenna pyyntöä',
      'Mitä seuraavaksi?',
      'Jatka näin',
      'Syvennä',
      'Muokkaa tai jatka'
    ],
    startVoice: 'Aloita äänikeskustelu',
    queueMessage: 'Lisää viesti jonoon',
    steer: 'Ohjaa suoritusta',
    stop: 'Pysäytä',
    send: 'Lähetä',
    speaking: 'Puhuu',
    transcribing: 'Litteroidaan',
    thinking: 'Ajattelee'
  },
  skills: {
    tabSkills: 'Taidot',
    tabToolsets: 'Tools',
    tabMcp: 'MCP',
    tabHub: 'Hub',
    all: 'All',
    searchSkills: 'Taidot…',
    searchToolsets: 'Tools…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…'
  },
  artifacts: {
    search: 'Artifaktit…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…',
    tabAll: 'All',
    tabImages: 'Images',
    tabFiles: 'Files',
    tabLinks: 'Links',
    noArtifactsTitle: 'Artifaktit -'
  },
  commandCenter: {
    paletteTitle: 'Command palette',
    searchPlaceholder: 'Etsi istuntoja…',
    branches: 'Branches',
    projects: 'Projects',
    openFolder: 'Open folder…'
  },
  settings: {
    closeSettings: 'Sulje',
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
