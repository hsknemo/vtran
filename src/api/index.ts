import axios from 'axios'
import router from '@/router'
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
    if (!response?.data?.status) {
      throw new Error(response.data.msg)
    }
    return response.data || []
  },
  (error) => {
    const { response } = error
    if (!response) return
    if (response.status === 401) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      window._user_online_timeout && clearTimeout(window._user_online_timeout)
      router.push('/login')
    }
    throw new Error(response.msg)
  },
)

export default service

