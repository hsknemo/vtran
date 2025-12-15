import request from '@/api/index.ts'
import { useLocalStorage } from '@vueuse/core'
import { downloadProxy, type DownloadProxyConfig, type RequestItem } from '@/api/download/dowloadProxy.ts'
const getToken = () => useLocalStorage('Auth', '{}').value

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

export const getMineFileList = () => request({
  method: 'get',
  headers: {
    Authorization: getToken(),
  },
  url: 'file/mine/list',
})


export const deleteFile = (data:object) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
  },
  url: 'file/delete',
  data
})


export const doubleUserFile = (data:object) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
  },
  url: 'file/doubleUser',
  data
})


export const upChunkFile = (data:FormData) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
    contentType: 'multipart/form-data',
  },
  url: 'file/chunk',
  data
})

export const mergeFile = (data:object) => request({
  method: 'post',
  headers: {
    Authorization: getToken(),
  },
  url: 'file/chunk/merge',
  data
})

export const downloadFile = async <T extends RequestItem>(data:T, config:DownloadProxyConfig) => {
  await downloadProxy('/api/file/download', data, config)
}
