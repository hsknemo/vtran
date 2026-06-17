import request from '@/api'
import { useLocalStorage } from '@vueuse/core'
const getToken = () => useLocalStorage('Auth', '{}').value
export const addDict = (data: DictServiceNamespace.dictForm) =>
  request({
    method: 'post',
    headers: {
      Authorization: getToken(),
    },
    url: 'dict/add',
    data,
  })


export const dictList = (data: DictServiceNamespace.filterProp) =>
  request({
    method: 'post',
    headers: {
      Authorization: getToken(),
    },
    url: 'dict/list',
    data,
  })
