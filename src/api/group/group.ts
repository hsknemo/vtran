import { request } from '@/api/index.ts'
import { useLocalStorage } from '@vueuse/core'
const getToken = () => useLocalStorage('Auth').value
export const createGroup = (data:object) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
  },
  url: 'group/create',
  data
})


export const findOwnGroup = (params:object) => request({
  method: 'get',
  headers: {
    Authorization: getToken(),
  },
  url: 'group/find',
  params
})


export const findOwnGroupUser = (params:object) => request({
  method: 'get',
  headers: {
    Authorization: getToken(),
  },
  url: 'group/find/userList',
  params
})

export const addUserToGroup = (data:object) => request({
    method: 'post',
    headers: {
      Authorization: getToken(),
    },
    url: 'group/add/user',
    data
  })

