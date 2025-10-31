import { reactive } from 'vue'
import { type Data } from './type/store.ts'

export const onLineUserList: Data = reactive({
  curSelectUser: '',
  onlineList: [],
})

