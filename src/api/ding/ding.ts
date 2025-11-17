import { request } from '@/api/index.ts'
import { useLocalStorage } from '@vueuse/core'
const getToken = () => useLocalStorage('Auth', '{}').value

export const sendDing = (data:object) => request({
  method: 'post',
  url: 'ding/add',
  headers: {
    Authorization: getToken(),
  },
  data
})

export const getDingList = () => request({
  method: 'get',
  url: 'ding/find',
  headers: {
    Authorization: getToken(),
  },
})
export const deleteDing = (data:object) => request({
  method: 'post',
  url: 'ding/delete',
  headers: {
    Authorization: getToken(),
  },
  data
})
