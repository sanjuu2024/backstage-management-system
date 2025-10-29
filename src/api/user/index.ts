// 统一管理项目用户相关的接口
import request from '@/utils/request';
import type { LoginFormData, LoginResponseData, UserInfoResponseData } from './type';

// 🍉基本重写了
const API = {
	LOGIN_URL: '/admin/acl/index/login',
	USERINFO_URL: '/admin/acl/index/info',
	LOGOUT_URL: '/admin/acl/index/logout',
};

// 🍰登录接口
export const reqLogin = (data: LoginFormData) => {
	return request.post<LoginFormData, LoginResponseData>(API.LOGIN_URL, data);
};

// 🍰获取用户信息接口
export const reqUserInfo = () => {
	return request.get<any, UserInfoResponseData>(API.USERINFO_URL);
};

// 🍰退出登录接口
export const reqLogout = () => {
	return request.post<any, any>(API.LOGOUT_URL);
};
