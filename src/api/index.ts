import axios, { type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
// axios 配置拦截器
axios.defaults.timeout = 30000;
axios.defaults.baseURL = import.meta.env.VITE_API_URL + '/api';
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  response => {
    if (!response?.data?.status) {
      throw new Error(response.data.msg)
    }
    return response.data;
  },
  error => {
    const { response } = error;
    ElMessage.error(response);
  }
);

export const request = (axiosRequestConfig:AxiosRequestConfig):Promise<never> => {
  return axios(axiosRequestConfig);
}

