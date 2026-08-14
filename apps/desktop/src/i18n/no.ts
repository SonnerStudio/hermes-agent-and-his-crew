import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const no: Translations = defineLocale({
  common: {
    apply: 'Bruk',
    back: 'Tilbake',
    save: 'Lagre',
    saving: 'Lagre…',
    cancel: 'Avbryt',
    clear: 'Tøm',
    close: 'Lukk',
    copy: 'Copy',
    copied: 'Copied',
    delete: 'Delete',
    done: 'Done',
    error: 'Error',
    free: 'Ledig',
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
    search: 'Søk i økter',
    searchTitle: 'Søk i økter…',
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
      'new-session': 'Ny økt',
      skills: 'Ferdigheter',
      messaging: 'Meldinger',
      artifacts: 'Artefakter'
    },
    searchAria: 'Søk i økter',
    searchPlaceholder: 'Søk i økter…',
    clearSearch: 'Tøm søk',
    pinned: 'Festet',
    sessions: 'Økter',
    cronJobs: 'Cron-jobber',
    shiftClickHint: 'Shift-klikk for å feste',
    noWorkspace: 'Ingen arbeidsområde',
    projectEmpty: 'Ingen økter ennå',
    noSessions: 'Ingen økter ennå',
    dateDivider: {
      today: 'I dag',
      yesterday: 'I går',
      thisWeek: 'Denne uken',
      lastWeek: 'Forrige uke',
      thisMonth: 'Denne måneden'
    },
    row: {
      openInSplit: 'Åpne i delt visning'
    }
  },
  composer: {
    message: 'Melding',
    placeholderStarting: 'Hermes starter…',
    placeholderReconnecting: 'Kobler til Hermes på nytt…',
    placeholderFollowUp: 'Send oppfølgingsmelding',
    newSessionPlaceholders: [
      'Hva bygger vi?',
      'Gi Hermes en oppgave',
      'Hva tenker du på?',
      'Beskriv hva du trenger',
      'Hva skal vi ta tak i?',
      'Spør om hva som helst',
      'Start med et mål'
    ],
    followUpPlaceholders: [
      'Send oppfølging',
      'Legg til mer kontekst',
      'Avgrens forespørselen',
      'Hva er neste steg?',
      'Fortsett',
      'Gå dypere',
      'Juster eller fortsett'
    ],
    startVoice: 'Start stemmesamtale',
    queueMessage: 'Sett melding i kø',
    steer: 'Styr utførelse',
    stop: 'Stopp',
    send: 'Send',
    speaking: 'Snakker',
    transcribing: 'Transkriberer',
    thinking: 'Tenker'
  },
  skills: {
    tabSkills: 'Ferdigheter',
    tabToolsets: 'Tools',
    tabMcp: 'MCP',
    tabHub: 'Hub',
    all: 'All',
    searchSkills: 'Ferdigheter…',
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
    searchPlaceholder: 'Søk i økter…',
    branches: 'Branches',
    projects: 'Projects',
    openFolder: 'Open folder…'
  },
  settings: {
    closeSettings: 'Lukk',
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
