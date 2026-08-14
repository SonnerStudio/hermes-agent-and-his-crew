import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const pl: Translations = defineLocale({
  common: {
    apply: 'Zastosuj',
    back: 'Wstecz',
    save: 'Zapisz',
    saving: 'Zapisz…',
    cancel: 'Anuluj',
    clear: 'Wyczyść',
    close: 'Zamknij',
    copy: 'Copy',
    copied: 'Copied',
    delete: 'Delete',
    done: 'Done',
    error: 'Error',
    free: 'Wolne',
    loading: 'Loading…',
    refresh: 'Refresh',
    retry: 'Retry',
    run: 'Run',
    send: 'Wyślij',
    on: 'On',
    off: 'Off'
  },
  fileMenu: {
    revealFinder: 'Finder',
    revealExplorer: 'Explorer',
    revealFileManager: 'Folder',
    revealInSidebar: 'Artefakty',
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
    search: 'Szukaj sesji',
    searchTitle: 'Szukaj sesji…',
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
      'new-session': 'Nowa sesja',
      skills: 'Umiejętności',
      messaging: 'Wiadomości',
      artifacts: 'Artefakty'
    },
    searchAria: 'Szukaj sesji',
    searchPlaceholder: 'Szukaj sesji…',
    clearSearch: 'Wyczyść wyszukiwanie',
    pinned: 'Przypięte',
    sessions: 'Sesje',
    cronJobs: 'Zadania Cron',
    shiftClickHint: 'Shift-kliknięcie, aby przypiąć',
    noWorkspace: 'Brak obszaru roboczego',
    projectEmpty: 'Brak sesji',
    noSessions: 'Brak sesji',
    dateDivider: {
      today: 'Dzisiaj',
      yesterday: 'Wczoraj',
      thisWeek: 'W tym tygodniu',
      lastWeek: 'W zeszłym tygodniu',
      thisMonth: 'W tym miesiącu'
    },
    row: {
      openInSplit: 'Otwórz w widoku podzielonym'
    }
  },
  composer: {
    message: 'Wiadomość',
    placeholderStarting: 'Uruchamianie Hermes…',
    placeholderReconnecting: 'Ponowne łączenie z Hermes…',
    placeholderFollowUp: 'Wyślij wiadomość uzupełniającą',
    newSessionPlaceholders: [
      'Co dziś budujemy?',
      'Daj zadanie Hermesowi',
      'O czym myślisz?',
      'Opisz, czego potrzebujesz',
      'Czym się zajmiemy?',
      'Zapytaj o cokolwiek',
      'Zacznij od celu'
    ],
    followUpPlaceholders: [
      'Wyślij wiadomość',
      'Dodaj więcej kontekstu',
      'Doprecyzuj prośbę',
      'Co dalej?',
      'Kontynuuj',
      'Rozwiń to',
      'Dostosuj lub kontynuuj'
    ],
    startVoice: 'Rozpocznij rozmowę głosową',
    queueMessage: 'Dodaj wiadomość do kolejki',
    steer: 'Steruj wykonaniem',
    stop: 'Zatrzymaj',
    send: 'Wyślij',
    speaking: 'Mówi',
    transcribing: 'Transkrypcja',
    thinking: 'Myślenie'
  },
  skills: {
    tabSkills: 'Umiejętności',
    tabToolsets: 'Tools',
    tabMcp: 'MCP',
    tabHub: 'Hub',
    all: 'All',
    searchSkills: 'Umiejętności…',
    searchToolsets: 'Tools…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…'
  },
  artifacts: {
    search: 'Artefakty…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…',
    tabAll: 'All',
    tabImages: 'Images',
    tabFiles: 'Files',
    tabLinks: 'Links',
    noArtifactsTitle: 'Artefakty -'
  },
  commandCenter: {
    paletteTitle: 'Command palette',
    searchPlaceholder: 'Szukaj sesji…',
    branches: 'Branches',
    projects: 'Projects',
    openFolder: 'Open folder…'
  },
  settings: {
    closeSettings: 'Zamknij',
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
