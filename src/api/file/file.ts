import { request } from '@/api/index.ts'
import { useLocalStorage } from '@vueuse/core'
export const setFileToUserList = (data:FormData) => request({
  method: 'post',
  url: 'file/send/user',
  headers: {
    Authorization: useLocalStorage('Auth', '').value,
    contentType: 'multipart/form-data'
  },
  data
})

export const getFileList = () => request({
  method: 'get',
  headers: {
    Authorization: useLocalStorage('Auth', '').value,
  },
  url: 'file/list',
})
