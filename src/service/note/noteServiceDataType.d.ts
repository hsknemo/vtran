declare namespace noteServiceNamespace {
  interface NoteForm {
    name: string,
    content: string,
    desc: string,
    markColor: string,
  }

  interface NoteItem {
    id: string
    name: string
    desc: string
    markColor: string
    updateTime: string
    createTime: string
    contentUrl: string
  }

  interface NoteListResponse {
    data: NoteItem[]
  }

  interface NoteYearList {
    [key as number]: NoteItem[]
  }
}
