// 用户管理相关接口

import request from '@/utils/request';
import type { UserData } from './type';

// 各接口地址
const API = {
	// 获取用户数据分页列表
	ALL_USER_URL: '/admin/acl/user/', // {page}/{limit}
	// 新增用户
	ADD_USER_URL: '/admin/acl/user/save',
	// 更新用户
	UPDATE_USER_URL: '/admin/acl/user/update',
	// 删除用户
	DELETE_USER_URL: '/admin/acl/user/remove/', // {id}
};

// 获取用户数据分页列表
export const reqAllUser = async (page: number, limit: number) => {
	return await request.get<any, any>(API.ALL_USER_URL + `${page}/${limit}`);
};

// 新增用户
export const reqAddUser = async (user: UserData) => {
	return await request.post<UserData, any>(API.ADD_USER_URL, user);
};

// 更新用户
export const reqUpdateUser = async (user: UserData) => {
	return await request.put<UserData, any>(API.UPDATE_USER_URL, user);
};

// 删除用户
export const reqDeleteUser = async (id: string | number) => {
	return await request.delete<any, any>(API.DELETE_USER_URL + id);
};
