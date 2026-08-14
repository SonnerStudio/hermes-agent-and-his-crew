import { defineLocale } from './define-locale'
import type { Translations } from './types'

export const jp: Translations = defineLocale({
  common: {
    apply: '適用',
    back: '戻る',
    save: '保存',
    saving: '保存中…',
    cancel: 'キャンセル',
    change: '変更',
    choose: '選択',
    clear: 'クリア',
    close: '閉じる',
    collapse: '折りたたむ',
    confirm: '確認',
    connect: '接続',
    connecting: '接続中…',
    continue: '続行',
    copied: 'コピーしました',
    copy: 'コピー',
    copyFailed: 'コピーに失敗しました',
    delete: '削除',
    docs: 'ドキュメント',
    done: '完了',
    error: 'エラー',
    expand: '展開',
    failed: '失敗',
    formatJson: 'JSONを整形',
    free: '空き',
    loading: '読み込み中…',
    notSet: '未設定',
    refresh: '更新',
    remove: '削除',
    replace: '置換',
    retry: '再試行',
    run: '実行',
    send: '送信',
    set: '設定',
    skip: 'スキップ',
    update: '更新',
    on: 'オン',
    off: 'オフ'
  },
  fileMenu: {
    revealFinder: 'Finderで表示',
    revealExplorer: 'エクスプローラーで表示',
    revealFileManager: 'フォルダを開く',
    revealInSidebar: 'サイドバーで表示',
    copyPath: 'パスをコピー',
    copyRelativePath: '相対パスをコピー',
    rename: '名前を変更…',
    delete: '削除',
    renameTitle: '名前の変更',
    renameLabel: '新しい名前',
    deleteBody: 'この項目を削除してもよろしいですか？',
    pathCopied: 'パスをコピーしました'
  },
  boot: {
    ready: 'Hermes Desktopの準備が完了しました',
    steps: {
      connectingGateway: 'ライブゲートウェイに接続中',
      loadingSettings: '設定を読み込み中',
      loadingSessions: 'セッションを読み込み中',
      startingDesktopConnection: 'デスクトップ接続を開始中',
      startingHermesDesktop: 'Hermes Desktopを起動中…'
    },
    errors: {
      backgroundExited: 'バックグラウンドプロセスが終了しました',
      backendStopped: 'バックエンドが停止しました',
      desktopBootFailed: 'デスクトップの起動に失敗しました',
      gatewayConnectionLost: 'ゲートウェイ接続が切断されました',
      gatewaySignInRequired: 'サインインが必要です',
      ipcBridgeUnavailable: 'IPCブリッジが利用できません'
    },
    failure: {
      title: '接続に失敗しました',
      description: 'Hermesバックエンドに接続できませんでした。',
      remoteTitle: 'リモート接続エラー',
      remoteDescription: 'リモートゲートウェイに接続できません。',
      retry: '再試行',
      repairInstall: '修復インストール',
      useLocalGateway: 'ローカルゲートウェイを使用',
      gatewaySettings: 'ゲートウェイ設定',
      back: '戻る',
      openLogs: 'ログを開く',
      repairHint: 'バックエンドサービスを再起動してみてください。',
      signOutAndSignIn: 'サインアウトして再サインイン'
    }
  },
  titlebar: {
    hideSidebar: 'サイドバーを非表示',
    showSidebar: 'サイドバーを表示',
    search: '検索',
    searchTitle: 'セッション、ビュー、アクションを検索',
    swapSidebarSides: 'サイドバーの位置を入れ替え',
    hideRightSidebar: '右サイドバーを非表示',
    showRightSidebar: '右サイドバーを表示',
    muteHaptics: '触覚効果をミュート',
    unmuteHaptics: '触覚効果を有効化',
    openSettings: '設定を開く',
    openStarmap: 'スターマップを開く'
  },
  language: {
    label: '言語',
    description: 'デスクトップインターフェースの言語を選択します。',
    saving: '言語を保存中…',
    saveError: '言語の更新に失敗しました',
    switchTo: '言語を切り替え',
    searchPlaceholder: '言語を検索…',
    noResults: '言語が見つかりません'
  },
  sidebar: {
    nav: {
      'new-session': '新規セッション',
      skills: 'スキル',
      messaging: 'メッセージ',
      artifacts: '成果物'
    },
    searchAria: 'セッションを検索',
    searchPlaceholder: 'セッションを検索…',
    clearSearch: '検索をクリア',
    results: '結果',
    pinned: 'ピン留め済み',
    sessions: 'セッション',
    cronJobs: '定期タスク',
    shiftClickHint: 'Shift-クリックでピン留め',
    noWorkspace: 'ワークスペースなし',
    projectEmpty: 'セッションはまだありません',
    noSessions: 'セッションはまだありません',
    dateDivider: {
      today: '今日',
      yesterday: '昨日',
      thisWeek: '今週',
      lastWeek: '先週',
      thisMonth: '今月'
    },
    row: {
      openInSplit: '分割表示で開く'
    }
  },
  composer: {
    message: 'メッセージ',
    placeholderStarting: 'Hermesを起動中…',
    placeholderReconnecting: 'Hermesに再接続中…',
    placeholderFollowUp: 'フォローアップを送信',
    newSessionPlaceholders: [
      '何を作成しますか？',
      'Hermesにタスクを指示',
      '何かお困りですか？',
      '必要な内容を記入してください',
      '何に取り組みましょうか？',
      '何でも質問してください',
      '目標を設定して始めましょう'
    ],
    followUpPlaceholders: [
      'フォローアップを送信',
      'コンテキストを追加',
      'リクエストを詳細化',
      '次はどうしますか？',
      'そのまま続ける',
      'さらに掘り下げる',
      '調整または続行'
    ],
    startVoice: '音声対話を開始',
    queueMessage: 'メッセージをキューに追加',
    steer: '実行を制御',
    stop: '停止',
    send: '送信',
    speaking: '発話中',
    transcribing: '文字起こし中',
    thinking: '思考中'
  },
  skills: {
    tabSkills: 'スキル',
    tabToolsets: 'ツール',
    tabMcp: 'MCP',
    tabHub: 'ハブを閲覧',
    all: 'すべて',
    searchSkills: 'スキルを検索…',
    searchToolsets: 'ツールを検索…',
    refresh: 'スキルを更新',
    refreshing: 'スキルを更新中…'
  },
  artifacts: {
    search: '成果物を検索…',
    refresh: '成果物を更新',
    refreshing: '成果物を更新中…',
    indexing: '最近の成果物をインデックス中',
    tabAll: 'すべて',
    tabImages: '画像',
    tabFiles: 'ファイル',
    tabLinks: 'リンク',
    noArtifactsTitle: '成果物が見つかりません'
  },
  commandCenter: {
    close: 'コマンドセンターを閉じる',
    paletteTitle: 'コマンドパレット',
    back: '戻る',
    searchPlaceholder: 'セッション、ビュー、アクションを検索',
    goTo: '移動',
    goToSession: 'セッションへ移動',
    branches: 'ブランチ',
    projects: 'プロジェクト',
    openFolder: 'フォルダをプロジェクトとして開く…'
  },
  statusStack: {
    agents: 'エージェント',
    goalActive: '目標実行中',
    goalDone: '目標完了',
    goalPaused: '目標一時停止',
    goalWaiting: '目標待機中',
    running: '実行中'
  },
  modelPicker: {
    title: 'モデルを切り替え',
    current: '現在:',
    unknown: '(不明)',
    search: 'プロバイダーとモデルを検索…',
    noModels: 'モデルが見つかりません',
    addProvider: 'プロバイダーを追加',
    loadFailed: 'モデルを読み込めませんでした',
    pro: 'Pro'
  },
  desktop: {
    desktopCommands: 'デスクトップコマンド',
    audioReadFailed: '録音された音声を読み込めませんでした',
    sessionUnavailable: 'セッションは利用できません',
    createSessionFailed: '新規セッションを作成できませんでした',
    promptFailed: 'プロンプトの実行に失敗しました',
    emptySlashCommand: '空のスラッシュコマンド',
    resumeStrandedTitle: '中断されたセッション',
    resumeStrandedBody: 'このセッションは以前の実行から再開できます。',
    resumeRetry: '再開する'
  },
  settings: {
    closeSettings: '設定を閉じる',
    exportConfig: '設定をエクスポート',
    importConfig: '設定をインポート',
    resetToDefaults: 'デフォルトに戻す',
    resetConfirm: 'すべての設定をHermesのデフォルトにリセットしますか？',
    nav: {
      providers: 'プロバイダー',
      providerAccounts: 'アカウント',
      providerApiKeys: 'APIキー',
      providerCustomEndpoints: 'カスタムエンドポイント',
      gateway: 'ゲートウェイ',
      apiKeys: 'APIキー',
      keybinds: 'ショートカット',
      keysTools: 'ツール',
      keysSettings: '設定',
      mcp: 'MCP',
      archivedChats: 'アーカイブ',
      about: '情報',
      billing: '請求',
      notifications: '通知',
      plugins: 'プラグイン'
    }
  },
  profiles: {
    close: 'プロファイルを閉じる',
    title: 'プロファイル',
    search: 'プロファイルを検索…',
    loading: 'プロファイルを読み込み中…',
    newProfile: '新規プロファイル',
    allProfiles: 'すべてのプロファイル',
    showAllProfiles: 'すべてのプロファイルを表示'
  },
  cron: {
    close: '定期タスクを閉じる',
    title: 'スケジュール済みタスク',
    search: '定期タスクを検索…',
    loading: '定期タスクを読み込み中…'
  }
})
