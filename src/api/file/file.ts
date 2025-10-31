import { request } from '@/api/index.ts'
import { useLocalStorage } from '@vueuse/core'
const token = useLocalStorage('Auth', '').value
export const setFileToUserList = (data:FormData) => request({
  method: 'post',
  url: 'file/send/user',
  headers: {
    Authorization: token,
    contentType: 'multipart/form-data'
  },
  data
})

export const getFileList = () => request({
  method: 'get',
  headers: {
    Authorization: token,
  },
  url: 'file/list',
})
