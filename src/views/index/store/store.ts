import { reactive } from 'vue'
import { type Data } from './type/store.ts'

export const onLineUserList: Data = reactive({
  curSelectUser: '',
  onlineList: [],
})

// ws 状态
export const connectStatus = reactive({
  status: 'danger',
  statusText: '未连接',
})
