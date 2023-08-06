// 管理网络请求
import axios from 'axios'
// 创建 axios 副本对象
//基地址
//const baseUrl = 'https://api.universe.partners';
// const baseUrl = 'http://192.168.10.14:3001';
// const baseUrl = 'http://192.168.10.23:3001';
// const baseUrl = 'http://192.168.10.22:3001';
// const baseUrl = 'http://192.168.10.13:4001';
//const baseUrl = 'http://192.168.10.2:4001';
const baseUrl = 'https://api.wethswap.cc';
//const baseUrl = 'https://api.metagalaxylands.com';
let request = axios.create({
    baseURL: baseUrl,
    timeout: 5000
})
// 设置请求拦截器
request.interceptors.request.use(
    config => {
        //  config.headers['token'] = localStorage.getItem('token') || ''
        return config
    },
    err => {
        return Promise.reject(err)
    }
)
// 设置响应拦截器
request.interceptors.response.use(
    response => {
        return response
    },
    err => {
        return Promise.reject(err)
    }
)
// 暴露对象
export default request

