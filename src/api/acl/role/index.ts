// 角色管理相关接口

import request from '@/utils/request';
import type {
	PermissionResponseData,
	RoleData,
	RoleResponseData,
} from './type';

// 各接口地址
const API = {
	// 获取角色分页列表
	ALL_ROLE_URL: '/admin/acl/role/', // {page}/{limit}
	// 新增角色
	ADD_ROLE_URL: '/admin/acl/role/save',
	// 更新角色
	UPDATE_ROLE_URL: '/admin/acl/role/update',
	// 删除角色
	DELETE_ROLE_URL: '/admin/acl/role/remove/', // {id}
	// 获取全部的权限列表(树状)
	ALL_PERMISSION_URL: '/admin/acl/permission/toAssign/', // {roleId}
	// 给角色分配权限
	ASSIGN_PERMISSION_URL: '/admin/acl/permission/doAssign', // ?roleId=number&&permissionId=number[]
};

// 获取角色数据分页列表
export const reqAllRole = async (
	page: number,
	limit: number,
	keyword?: string,
) => {
	return await request.get<any, RoleResponseData>(
		API.ALL_ROLE_URL +
			`${page}/${limit}` +
			`${keyword ? '?roleName=' + keyword : ''}`,
	);
};

// 新增角色
export const reqAddRole = async (role: RoleData) => {
	return await request.post<RoleData, any>(API.ADD_ROLE_URL, role);
};

// 更新角色
export const reqUpdateRole = async (role: RoleData) => {
	return await request.put<RoleData, any>(API.UPDATE_ROLE_URL, role);
};

// 删除角色
export const reqDeleteRole = async (id: string | number) => {
	return await request.delete<any, any>(API.DELETE_ROLE_URL + id);
};

// 获取全部的权限列表(树状)
export const reqAllPermission = async (roleId: number) => {
	return await request.get<any, PermissionResponseData>(
		API.ALL_PERMISSION_URL + roleId,
	);
};

// 给角色分配权限
export const reqAssignPermission = async (
	roleId: number,
	permissionId: number[],
) => {
	return await request.post<any, any>(
		API.ASSIGN_PERMISSION_URL +
			`?roleId=${roleId}&&permissionId=${permissionId}`,
	);
};
