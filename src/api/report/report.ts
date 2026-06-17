import request from '@/api'
import { useLocalStorage } from '@vueuse/core'
const getToken = () => useLocalStorage('Auth', '{}').value
export const addReport = (data: reportServiceNamespace.FormProp) =>
  request({
    method: 'post',
    headers: {
      Authorization: getToken(),
    },
    url: 'report/add',
    data,
  })

export const reportList = (data: reportServiceNamespace.filterProp) => {
  return request({
    method: 'post',
    headers: {
      Authorization: getToken(),
    },
    url: 'report/list',
    data,
  })
}

export const exportList = (data: reportServiceNamespace.filterProp) => {
  return request({
    method: 'post',
    headers: {
      Authorization: getToken(),
    },
    url: 'report/export',
    data,
    responseType: 'blob',
  })
}

