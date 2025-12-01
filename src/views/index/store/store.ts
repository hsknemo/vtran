import { reactive } from 'vue'
import { type Data, type InterfaceOnlineUser } from './type/store.ts'
import { defineStore } from 'pinia'

export const onLineUserList: Data = reactive({
  curSelectUser: '',
  onlineList: [] as InterfaceOnlineUser[],
})

// ws 状态
export const connectStatus = reactive({
  status: 'danger',
  statusText: '未连接',
})


export const useStoreOnlineUserList = defineStore('onlineUserList', {
  state: () => {
    return { onlineList: [] as InterfaceOnlineUser[] }
  },
  actions: {
    updateOnlineList(data:InterfaceOnlineUser[]) {
      this.onlineList = data
    },
  },
})
