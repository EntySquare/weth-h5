import request from '@/request' // 引入封装好的 axios 请求
import { getToken, setToken } from "@/utils/auth"; //*获取计划列表
// 获取计划详情
export function login(data: any) { // 定义接口函数，参数为 data
    return request({
        url: '/r0/account/register', // 请求地址
        method: 'post', // 请求类型 get/post
        data // post 请求传递的参数
    })
}
export function swap() { // 定义接口函数，参数为 data
    const token = getToken();
    console.log(token)
    // setToken(token);
    return request({
        url: '/r0/wallet/swap', // 请求地址
        method: 'post', // 请求类型 get/post
        headers: {
            'access-token': token,
        },
    })
}