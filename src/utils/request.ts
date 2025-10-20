// 使用请求与响应拦截器
import axios from 'axios';
// 引入
import { ElMessage } from 'element-plus';

// 1.利用axios对象的create方法，创建axios实例（其他配置：基础路径、超时时间）
const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,   // 基础路径
    timeout: 5000,  // 请求超时时间5s
});

// 2.request实例添加请求拦截器
request.interceptors.request.use((config) => {
    // console.log('发送请求的配置对象：',config);
    // config.headers.token = '123';
    // config配置对象:headers属性请求头，给服务器端携带公共参数
    // 必须返回配置对象否则报错
    return config;
});

// 3.request实例添加响应拦截器
request.interceptors.response.use((res) => {
    // 成功回调
    // 简化数据
    return res.data;
}, (err) => { 
    // 失败回调
    let msg = '';
    let status = err.response.status;
    switch(status){
        case 401:
            msg = 'TOKEN过期';
            break;
        case 403:
            msg = '没有权限访问';
            break;
        case 404:
            msg = '请求资源不存在';
            break;
        case 500:
            msg = '服务器错误，请稍后重试';
            break;
        default:
            msg = '网络错误，请稍后重试';
    }
    // 提示错误信息
    ElMessage({
        type: 'error',
        message: msg,
    });

    return Promise.reject(err);
});

// 4.对外暴露request实例
export default request;