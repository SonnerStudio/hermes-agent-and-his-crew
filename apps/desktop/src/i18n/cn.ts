import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const cn: Translations = defineLocale({
  common: {
    apply: '应用',
    back: '返回',
    save: '保存',
    saving: '保存…',
    cancel: '取消',
    clear: '清除搜索',
    close: '关闭',
    copy: 'Copy',
    copied: 'Copied',
    delete: 'Delete',
    done: 'Done',
    error: 'Error',
    free: '可用',
    loading: 'Loading…',
    refresh: 'Refresh',
    retry: 'Retry',
    run: 'Run',
    send: '发送',
    on: 'On',
    off: 'Off'
  },
  fileMenu: {
    revealFinder: 'Finder',
    revealExplorer: 'Explorer',
    revealFileManager: 'Folder',
    revealInSidebar: '产物',
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
    search: '搜索会话',
    searchTitle: '搜索会话…',
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
      'new-session': '新建会话',
      skills: '功能',
      messaging: '消息',
      artifacts: '产物'
    },
    searchAria: '搜索会话',
    searchPlaceholder: '搜索会话…',
    clearSearch: '清除搜索',
    pinned: '已置顶',
    sessions: '会话',
    cronJobs: '定时任务',
    shiftClickHint: 'Shift-点击以置顶',
    noWorkspace: '无工作区',
    projectEmpty: '暂无会话',
    noSessions: '暂无会话',
    dateDivider: {
      today: '今天',
      yesterday: '昨天',
      thisWeek: '本周',
      lastWeek: '上周',
      thisMonth: '本月'
    },
    row: {
      openInSplit: '在分屏中打开'
    }
  },
  composer: {
    message: '消息',
    placeholderStarting: '正在启动 Hermes…',
    placeholderReconnecting: '正在重新连接 Hermes…',
    placeholderFollowUp: '发送后续消息',
    newSessionPlaceholders: [
      '我们要做什么？',
      '给 Hermes 分配一个任务',
      '您在想什么？',
      '描述您的需求',
      '我们要处理什么？',
      '随心提问',
      '从设定目标开始'
    ],
    followUpPlaceholders: [
      '发送追问',
      '补充更多背景信息',
      '进一步细化请求',
      '接下来做什么？',
      '继续进行',
      '深入探讨',
      '调整或继续'
    ],
    startVoice: '开启语音对话',
    queueMessage: '加入消息队列',
    steer: '引导执行',
    stop: '停止',
    send: '发送',
    speaking: '正在讲话',
    transcribing: '正在转录',
    thinking: '正在思考'
  },
  skills: {
    tabSkills: '功能',
    tabToolsets: 'Tools',
    tabMcp: 'MCP',
    tabHub: 'Hub',
    all: 'All',
    searchSkills: '功能…',
    searchToolsets: 'Tools…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…'
  },
  artifacts: {
    search: '产物…',
    refresh: 'Refresh',
    refreshing: 'Refreshing…',
    tabAll: 'All',
    tabImages: 'Images',
    tabFiles: 'Files',
    tabLinks: 'Links',
    noArtifactsTitle: '产物 -'
  },
  commandCenter: {
    paletteTitle: 'Command palette',
    searchPlaceholder: '搜索会话…',
    branches: 'Branches',
    projects: 'Projects',
    openFolder: 'Open folder…'
  },
  settings: {
    closeSettings: '关闭',
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
