import { request } from '@/api/index.ts'
import { useLocalStorage } from '@vueuse/core'
import { downloadProxy, type DownloadProxyConfig, type RequestItem } from '@/api/download/dowloadProxy.ts'
const getToken = () => useLocalStorage('Auth', '{}').value
const apiName = 'software'
export const getSoftwareList = (params:object) => request({
  method: 'get',
  url: `${apiName}/list`,
  headers: {
    Authorization: getToken(),
  },
  params
})

export const uploadSoftware = (formData:FormData) => request({
  method: 'post',
  url: `${apiName}/upload`,
  headers: {
    Authorization: getToken(),
    contentType: 'multipart/form-data',
  },
  data: formData,
})

export const appRecordAdd = (data:object) => request({
  method: 'post',
  url: `${apiName}/recordAdd`,
  headers: {
    Authorization: getToken(),
  },
  data,
})


export const downloadSoftware = async <T extends RequestItem>(data:T, config:DownloadProxyConfig) => {
  await downloadProxy(`/api/${apiName}/download`, data, config)
}
