export interface Data {
  curSelectUser: string
  onlineList: InterfaceOnlineUser[]
}

export interface InterfaceOnlineUser {
  id: string
  username: string
  ip: string
  insertTime: number
}

