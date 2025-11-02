// 用户管理相关接口

import request from '@/utils/request';
import type { AssignRoleData, UserData, UserRoleResponseData } from './type';

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
	// 批量删除用户
	DELETE_USERS_URL: '/admin/acl/user/batchRemove',
	// (请求)为用户分配角色
	SET_ROLE_URL: '/admin/acl/user/doAssignRole',
	// 根据用户获取其角色
	GET_ROLE_URL: '/admin/acl/user/toAssign/', // {userId}
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

// 为用户分配角色
export const reqSetRole = async (data: AssignRoleData) => {
	return await request.post<any, any>(API.SET_ROLE_URL, data);
};

// 根据用户获取其角色
export const reqGetRole = async (userId: number) => {
	return await request.get<any, UserRoleResponseData>(
		API.GET_ROLE_URL + userId,
	);
};

// 批量删除用户
export const reqDeleteUsers = async (idList: number[]) => {
	return await request({
		url: API.DELETE_USERS_URL,
		method: 'DELETE',
		data: idList,
	});
};
