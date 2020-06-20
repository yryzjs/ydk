import axios, {AxiosRequestConfig as HttpConfig} from 'axios'
import {getAuth, loginOut} from './auth'
import {message} from 'antd'
const httpInit = axios.create({timeout: 10000})

httpInit.interceptors.request.use(async (config) => {
  const auth = getAuth()
  if (auth.isLogin) {
    config.headers.Authorization = 'Bearer ' + auth.accessToken
    config.headers.userId = auth.userId
  }

  return config
})
httpInit.interceptors.response.use(
  (res) => {
    const body = res.data
    if (body.code === 401) {
      loginOut()
      // store.dispatch({ type: "SIGN_OUT" })
      throw res
    } else if (parseInt(body.code, 10) !== 200) {
      console.warn('error', res)

      return Promise.reject(res)
    }
    return res
  },
  (error) => {
    message.error('系统出错，请联系管理员')
    console.warn('http error', error)
    return Promise.reject(error)
  },
)

export function httpPost<T = any>(
  url: string,
  data?: any,
  config?: HttpConfig,
): Promise<T> {
  return httpInit.post(url, data, config).then((res) => res.data.data)
}

export function httpGet<T = any>(url: string, config?: HttpConfig): Promise<T> {
  return httpInit.get(url, config).then((res) => res.data.data)
}
export function httpDelete<T = any>(url: string, data?: any): Promise<T> {
  return httpInit.delete(url, {data}).then((res) => res.data.data)
}

export function httpPut<T = any>(
  url: string,
  data?: any,
  config?: HttpConfig,
): Promise<T> {
  return httpInit.put(url, data, config).then((res) => res.data)
}

export default httpInit
