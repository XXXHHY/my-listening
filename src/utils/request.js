import axios from 'axios'
import QS from 'qs'

// 创建axios的实例
const instance = axios.create({
  baseURL: 'https://service-aghmdle0-1317994892.gz.apigw.tencentcs.com/release/',
  timeout: 5000
})


// 请求拦截
instance.interceptors.request.use(config => {
  return config
})

// 响应拦截
// instance.interceptors.response.use()

export default instance