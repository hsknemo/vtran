import { request } from '@/api/index.ts'
import { useLocalStorage } from '@vueuse/core'
const getToken = () => useLocalStorage('Auth', '{}').value
const apiName = 'category'
export const getCategoryList = (params:object) => request({
  method: 'get',
  url: `${apiName}/list`,
  headers: {
    Authorization: getToken(),
  },
  params
})

export const addCategory = (data:object) => request({
  method: 'post',
  url: `${apiName}/add`,
  headers: {
    Authorization: getToken(),
  },
  data,
})
