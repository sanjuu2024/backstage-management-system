// 统一管理项目用户相关的接口
import request from '@/utils/request';
import { type loginFormData, type loginResponseData, type userInfoResponseData } from './type';

// 使用 const 对象代替 enum
const API = {
    LOGIN_URL: '/user/login',
    USERINFO_URL: '/user/info',
} as const;

// 暴露请求函数
// 登录接口方法
export const reqLogin = (data:loginFormData) => request.post<any,loginResponseData>(API.LOGIN_URL,data);

// 获取用户信息接口方法
export const reqUserInfo = () => request.get<any,userInfoResponseData>(API.USERINFO_URL);