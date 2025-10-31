import { request } from '@/api/index.ts'
import { useLocalStorage } from '@vueuse/core'
export const addUser = (data:object) => request({
  method: 'post',
  url: '/user/add',
  headers: {
    contentType: 'application/json'
  },
  data
})

export const loginUser = (data:object) => request({
  method: 'post',
  url: '/user/login',
  headers: {
    contentType: 'application/json'
  },
  data: data
})
export const onlineUser = (data:object) => request({
  method: 'get',
  headers: {
    Authorization: useLocalStorage('Auth', '').value
  },
  url: '/user/online',
  data: data
})
