import { request } from '@/api/index.ts'
import { useLocalStorage } from '@vueuse/core'
const getToken = () => useLocalStorage('Auth', '{}').value

export const getVersionList = () => request({
  method: 'get',
  headers: {
    Authorization: getToken(),
  },
  url: 'version/list',
})

export const saveVersionList = (data:object) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
  },
  data,
  url: 'version/save',
})
