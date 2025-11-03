// 菜单管理相关接口

import request from '@/utils/request';
import type { MenuFormData, MenuListResponseData } from './type';

// 各接口地址
const API = {
	// 获取菜单列表
	GET_MENU_LIST: '/admin/acl/permission',
	// 新增菜单 / 功能
	Add_MENU: '/admin/acl/permission/save',
	// 更新菜单 / 功能
	UPDATE_MENU: '/admin/acl/permission/update',
	// 删除菜单 / 功能
	DELETE_MENU: '/admin/acl/permission/remove/', // {id}
};

// 获取菜单列表
export const reqGetMenuList = async () => {
	return await request.get<MenuListResponseData, any>(API.GET_MENU_LIST);
};

// 新增菜单 / 功能
export const reqAddMenu = async (data: MenuFormData) => {
	return await request.post<MenuFormData, any>(API.Add_MENU, data);
};

// 更新菜单 / 功能
export const reqUpdateMenu = async (data: MenuFormData) => {
	return await request.put<MenuFormData, any>(API.UPDATE_MENU, data);
};

// 删除菜单 / 功能
export const reqDeleteMenu = async (id: number) => {
	return await request.delete<any, any>(API.DELETE_MENU + id);
};
