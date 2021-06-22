import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';


import notification from 'ant-design-vue/es/notification'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  // baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error: any) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    // const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      // if (token) {
      //   store.dispatch('Logout').then(() => {
      //     setTimeout(() => {
      //       window.location.reload()
      //     }, 1500)
      //   })
      // }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use((config: AxiosRequestConfig) => {
  // const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  // if (token) {
  //   config.headers['Access-Token'] = token
  // }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response: AxiosResponse) => {
  return response
}, errorHandler)

export default request

export function get<T>(url: string, data?: {[key: string]: any}): Promise<T> {
  return request.get<T>(url).then(response => response.data).catch(error => error)
}

export function post<T>(url: string, data?: {[key: string]: any}): Promise<T> {
  return request.post<T>(url, data).then(response => response.data).catch(error => error)
}

export function put<T>(url: string, data?: {[key: string]: any}): Promise<T> {
  return request.put<T>(url, data).then(response => response.data).catch(error => error)
}

export function del<T>(url: string, data?: {[key: string]: any}): Promise<T> {
  return request.delete<T>(url).then(response => response.data).catch(error => error)
}
