import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

// 401 全局只提示一次，避免多个接口并发失败时重复弹窗
let hasAuthExpiredNotified = false
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  timeout: 30000,
})
// axios 配置拦截器
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
service.interceptors.response.use(
  (response) => {
    const resData = response?.data || {}
    const isSuccess = typeof resData.success === 'boolean'
      ? resData.success
      : !!resData.status
    if (!isSuccess) {
      throw new Error(resData.message || resData.msg || '请求失败')
    }
    return resData || []
  },
  (error) => {
    const { response } = error
    if (!response) {
      return Promise.reject(error)
    }
    if (response.status === 401) {
      if (!hasAuthExpiredNotified) {
        hasAuthExpiredNotified = true
        ElMessage.error('身份过期，请重新登录')
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      window._user_online_timeout && clearTimeout(window._user_online_timeout)
      localStorage.removeItem('Auth')
      localStorage.removeItem('user')
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }

      // 关键修复：吞掉 401，避免每个业务接口 catch 再次弹错
      return new Promise(() => {})
    }
    return Promise.reject(new Error(response?.data?.message || response?.data?.msg || error.message || '请求失败'))
  },
)

export default service

