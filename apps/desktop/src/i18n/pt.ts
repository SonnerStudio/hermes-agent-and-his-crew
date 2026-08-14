import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const pt: Translations = defineLocale({
  common: {
    apply: 'Aplicar',
    back: 'Voltar',
    save: 'Salvar',
    saving: 'Salvar…',
    cancel: 'Cancelar',
    clear: 'Limpar',
    close: 'Fechar',
    copy: 'Copy',
    copied: 'Copied',
    delete: 'Delete',
    done: 'Done',
    error: 'Error',
    free: 'Livre',
    loading: 'Loading…',
    refresh: 'Refresh',
    retry: 'Retry',
    run: 'Run',
    send: 'Enviar',
    on: 'On',
    off: 'Off'
  },
  fileMenu: {
    revealFinder: 'Finder',
    revealExplorer: 'Explorer',
    revealFileManager: 'Folder',
    revealInSidebar: 'Artefatos',
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
    search: 'Pesquisar sessões',
    searchTitle: 'Pesquisar sessões…',
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
      'new-session': 'Nova sessão',
      skills: 'Habilidades',
      messaging: 'Mensagens',
      artifacts: 'Artefatos'
    },
    searchAria: 'Pesquisar sessões',
    searchPlaceholder: 'Pesquisar sessões…',
    clearSearch: 'Limpar pesquisa',
    pinned: 'Fixado',
    sessions: 'Sessões',
    cronJobs: 'Tarefas Cron',
    shiftClickHint: 'Shift-clique para fixar',
    noWorkspace: 'Sem espaço de trabalho',
    projectEmpty: 'Nenhuma sessão ainda',
    noSessions: 'Nenhuma sessão ainda',
    dateDivider: {
      today: 'Hoje',
      yesterday: 'Ontem',
      thisWeek: 'Esta semana',
      lastWeek: 'Semana passada',
      thisMonth: 'Este mês'
    },
    row: {
      openInSplit: 'Abrir em exibição dividida'
    }
  },
  composer: {
    message: 'Mensagem',
    placeholderStarting: 'Iniciando Hermes…',
    placeholderReconnecting: 'Reconectando ao Hermes…',
    placeholderFollowUp: 'Enviar acompanhamento',
    newSessionPlaceholders: [
      'O que vamos construir?',
      'Dê uma tarefa ao Hermes',
      'O que está pensando?',
      'Descreva o que você precisa',
      'O que devemos resolver?',
      'Pergunte qualquer coisa',
      'Comece com um objetivo'
    ],
    followUpPlaceholders: [
      'Enviar acompanhamento',
      'Adicionar mais contexto',
      'Refinar o pedido',
      'Qual é o próximo passo?',
      'Continuar assim',
      'Avançar mais',
      'Ajustar ou continuar'
    ],
    startVoice: 'Iniciar conversa por voz',
    queueMessage: 'Enfileirar mensagem',
    steer: 'Direcionar execução',
    stop: 'Parar',
    send: 'Enviar',
    speaking: 'Falando',
    transcribing: 'Transcrevendo',
    thinking: 'Pensando'
  },
  skills: {
    tabSkills: 'Habilidades',
    tabToolsets: 'Tools',
    tabMcp: 'MCP',
    tabHub: 'Hub',
    all: 'All',
    searchSkills: 'Habilidades…',
    searchToolsets: 'Tools…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…'
  },
  artifacts: {
    search: 'Artefatos…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…',
    tabAll: 'All',
    tabImages: 'Images',
    tabFiles: 'Files',
    tabLinks: 'Links',
    noArtifactsTitle: 'Artefatos -'
  },
  commandCenter: {
    paletteTitle: 'Command palette',
    searchPlaceholder: 'Pesquisar sessões…',
    branches: 'Branches',
    projects: 'Projects',
    openFolder: 'Open folder…'
  },
  settings: {
    closeSettings: 'Fechar',
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
