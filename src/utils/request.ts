import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import notification from 'ant-design-vue/es/notification';

import { state, action } from '@/store';



// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_APP_API_BASE_URL as string,
  timeout: 6000, // 请求超时时间
})


const errorHandlerMap: {[key: number]: string} = {
  302: '接口重定向了！',
  400: '参数不正确！',
  401: '您未登录，或者登录已经超时，请先登录！',
  403: '您没有权限操作！', 
  404: `请求地址出错: `,  // 在正确域名下
  408: '请求超时！', 
  409: '系统已存在相同数据！', 
  500: '服务器内部错误！', 
  501: '服务未实现！', 
  502: '网关错误！', 
  503: '服务不可用！', 
  504: '服务暂时无法访问，请稍后再试！', 
  505: 'HTTP版本不受支持！', 
}
// 异常拦截处理器
const errorHandler = (error: any) => {
  const response = error.response

  let message: string = ""
  if (response) {
    const { status, data } = response

    message = errorHandlerMap[status] || '异常问题，请联系管理员！'

    // const data = response.data
    // if (response.status === 403) {
    //   notification.error({
    //     message: 'Forbidden',
    //     description: data.message
    //   })
    // }
    // if (response.status === 401 && !(data.result && data.result.isLogin)) {
    //   notification.error({
    //     message: 'Unauthorized',
    //     description: 'Authorization verification failed'
    //   })
    //   if (token) {
    //     action.Logout()
    //     setTimeout(() => {
    //       window.location.reload()
    //     }, 1500)
    //   }
    // }
    // if (response.status === 404) {
    //   notification.error({
    //     message: response.status,
    //     description: 'Not Found'
    //   })
    // }
    if (status === 404) {
      message += response.request.responseURL
    }

    notification.error({
      message: 'Error',
      description: message
    })

    if (response.status === 401 && !(data.result && data.result.isLogin)) {
      action.Logout()
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }

  }

  if (error.message.includes('timeout')) {
    notification.error({
      message: 'Error',
      description: "网络请求超时！"
    })
  }
  if (error.message.includes('Network')) {
    notification.error({
      message: 'Error',
      description: window.navigator.onLine ? '服务端异常！' : '您断网了！'
    })
  }

  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = state.token
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token && typeof window !== "undefined") {
    // config.headers['Access-Token'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response: AxiosResponse) => {
  return response
}, errorHandler)

export default request

export function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request.get<T>(url, config).then(response => response.data).catch(error => error)
}

export function post<T>(url: string, data?: {[key: string]: any}, config?: AxiosRequestConfig): Promise<T> {
  return request.post<T>(url, data, config).then(response => response.data).catch(error => error)
}

export function put<T>(url: string, data?: {[key: string]: any}, config?: AxiosRequestConfig): Promise<T> {
  return request.put<T>(url, data, config).then(response => response.data).catch(error => error)
}

export function dele<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request.delete<T>(url, config).then(response => response.data).catch(error => error)
}
