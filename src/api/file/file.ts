import { request } from '@/api/index.ts'
import { useLocalStorage } from '@vueuse/core'
const getToken = () => useLocalStorage('Auth').value

export const setFileToUserList = (data:FormData) => request({
  method: 'post',
  url: 'file/send/user',
  headers: {
    Authorization: getToken(),
    contentType: 'multipart/form-data'
  },
  data
})

export const getFileList = () => request({
  method: 'get',
  headers: {
    Authorization: getToken(),
  },
  url: 'file/list',
})

export const deleteFile = (data:object) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
  },
  url: 'file/delete',
  data
})
