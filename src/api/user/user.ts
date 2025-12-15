import request from '@/api/index.ts'
import { useLocalStorage } from '@vueuse/core'
export const addUser = (data:object) => request({
  method: 'post',
  url: '/user/add',
  headers: {
    contentType: 'application/json'
  },
  data
})

export const loginUser = (data:object) => request({
  method: 'post',
  url: '/user/login',
  headers: {
    contentType: 'application/json'
  },
  data: data
})
export const onlineUser = (data:object) => request({
  method: 'get',
  headers: {
    Authorization: useLocalStorage('Auth', '').value
  },
  url: '/user/online',
  params: data
})

export const updateUserProfile = (formData:FormData) => request({
  method: 'post',
  headers: {
    Authorization: useLocalStorage('Auth', '').value,
    contentType: 'multipart/form-data',
  },
  url: '/user/profile/update',
  data: formData
})

export const getProfile = (data:object) => request({
  method: 'post',
  headers: {
    Authorization: useLocalStorage('Auth', '').value
  },
  url: '/user/profile',
  data,
})
