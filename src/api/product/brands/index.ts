// 品牌管理模块接口

import request from '@/utils/request';
import type { Brand, ExistingBrandsResponseData } from './type';

// 各接口地址
const API = {
	// 获取已有品牌接口地址
	EXISTING_BRANDS_URL: '/admin/product/baseTrademark/', // {page}/{limit}
	// 新增品牌接口地址
	ADD_BRAND_URL: '/admin/product/baseTrademark/save',
	// 修改品牌接口地址
	UPDATE_BRAND_URL: '/admin/product/baseTrademark/update',
	// 删除品牌接口地址
	DELETE_BRAND_URL: '/admin/product/baseTrademark/remove/', // {id}
};

// 获取已有品牌
export const reqExistingBrands = async (page: number = 1, limit: number) => {
	return await request.get<any, ExistingBrandsResponseData>(
		API.EXISTING_BRANDS_URL + `${page}/${limit}`,
	);
};

// 新增品牌
export const reqAddBrand = async (data: any) => {
	return await request.post<any, any>(API.ADD_BRAND_URL, data);
};

// 修改品牌
export const reqUpdateBrand = async (data: any) => {
	return await request.put<any, any>(API.UPDATE_BRAND_URL, data);
};

// 删除品牌
export const reqDeleteBrand = async (id: number) => {
	return await request.delete<any, any>(API.DELETE_BRAND_URL + id);
};
