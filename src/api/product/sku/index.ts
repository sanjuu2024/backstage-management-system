// sku管理模块相关接口

import request from '@/utils/request';
import type { SkuDetailResponseData, SkuListResponseData } from './type';

// 各接口地址
const API = {
	// 获取SKU分页列表
	EXISITNG_SKU_URL: '/admin/product/list/', // {page}/{limit}
	// 上架SKU
	SKU_ONSALE_URL: '/admin/product/onSale/', // {skuId}
	// 下架SKU
	SKU_CANCELSALE_URL: '/admin/product/cancelSale/', // {skuId}
	// 获取SKU详情
	SKU_DETAIL_URL: '/admin/product/getSkuInfo/', // {skuId}
	// 删除SKU
	DELETE_SKU_URL: '/admin/product/deleteSku/', // {skuId}
};

// 获取SKU分页列表
export const reqExistingSku = async (page: number, limit: number) => {
	return await request.get<any, SkuListResponseData>(
		API.EXISITNG_SKU_URL + `${page}/${limit}`,
	);
};

// 上架SKU
export const reqOnsale = async (skuId: number) => {
	return await request.get<any, SkuListResponseData>(
		API.SKU_ONSALE_URL + skuId,
	);
};

// 下架SKU
export const reqCancelSale = async (skuId: number) => {
	return await request.get<any, any>(API.SKU_CANCELSALE_URL + skuId);
};

// 获取SKU详情
export const reqSkuDetail = async (skuId: number) => {
	return await request.get<any, SkuDetailResponseData>(
		API.SKU_DETAIL_URL + skuId,
	);
};

// 删除SKU
export const reqDeleteSku = async (skuId: number) => {
	return await request.delete<any, any>(API.DELETE_SKU_URL + skuId);
};
