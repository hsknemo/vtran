import { request } from '@/api/index.ts'
export const setFileToUserList = (data:FormData) => request({
  method: 'post',
  url: 'file/send/user',
  headers: {
    contentType: 'multipart/form-data'
  },
  data
})
