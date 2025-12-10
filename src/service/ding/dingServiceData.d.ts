declare namespace DingServiceNamespace {
  interface DingItem {
    id: string
    fromUserName: string
    dingMsg: string
    insertTime: string
    toUser: string
  }

  interface DingListResponse {
    data: DingItem[]
  }
}
