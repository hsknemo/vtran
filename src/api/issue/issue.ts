import { request } from '@/api/index.ts'
import { useLocalStorage } from '@vueuse/core'
const getToken = () => useLocalStorage('Auth', '').value
const routeName = 'issue'

export const issueList = (data:object) => request({
  method: 'get',
  headers: {
    Authorization: getToken(),
  },
  url: `${routeName}/list`,
  data
})

export const issueAdd = (data:FormData) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
    'Content-Type': 'multipart/form-data',
  },
  url: `${routeName}/add`,
  data,
})

export const issueFind = (data:object) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
  },
  url: `${routeName}/find`,
  data,
})
