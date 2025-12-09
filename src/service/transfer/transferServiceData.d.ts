
 declare namespace TransferNamespace {
  export interface VersionReactive {
    versionTitle: string
    versionList: VersionData[]
  }
  interface VersionResponse {
    data: VersionReactive[]
  }

  interface VersionData {
      type: VersionTag
      content: string
  }

  enum VersionTag  {
    BUG = 'bug',
    FEATURE = 'feature',
    WARN = 'warn',
  }
}
