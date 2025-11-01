// SPU管理模块接口

import request from '@/utils/request';
import type {
	AllBrandsResponseData,
	AllSaleAttrResponseData,
	SkuData,
	SpuData,
	SpuImgListResponseData,
	SpuResponseData,
	SpuSaleAttrListResponseData,
} from './type';

// 各接口地址
const API = {
	// 获取已有的SPU分页列表
	EXISTING_SPU_URL: '/admin/product/', // {page}/{limit}
	// 获取所有品牌
	ALL_BRANDS_URL: '/admin/product/baseTrademark/getTrademarkList',
	// 获取所有销售属性
	ALL_SALE_ATTR_URL: '/admin/product/baseSaleAttrList',
	// 获取某个SPU下所有商品图片
	IMAGE_URL: '/admin/product/spuImageList/', // {spuId}
	// 获取某个SPU下所有销售属性
	SALE_ATTR_URL: '/admin/product/spuSaleAttrList/', // {id}
	// 添加一个SPU
	ADD_SPU_URL: '/admin/product/saveSpuInfo',
	// 更新一个SPU
	UPDATE_SPU_URL: '/admin/product/updateSpuInfo',
	// 添加SKU
	ADD_SKU: '/admin/product/saveSkuInfo',
};

// 获取已有SPU分页列表
export const reqExistingSpu = async (
	page: number,
	limit: number,
	category3Id: string | number,
) => {
	return await request.get<any, SpuResponseData>(
		API.EXISTING_SPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
	);
};

// 获取所有品牌列表
export const reqAllBrands = async () => {
	return await request.get<any, AllBrandsResponseData>(API.ALL_BRANDS_URL);
};

// 获取所有销售属性
export const reqAllSaleAttr = async () => {
	return await request.get<any, AllSaleAttrResponseData>(
		API.ALL_SALE_ATTR_URL,
	);
};

// 获取某个SPU下所有商品图片
export const reqSpuImgList = async (spuId: number) => {
	return await request.get<any, SpuImgListResponseData>(
		API.IMAGE_URL + spuId,
	);
};

// 获取某个SPU下所有销售属性
export const reqSpuSaleAttrList = async (spuId: number) => {
	return await request.get<any, SpuSaleAttrListResponseData>(
		API.SALE_ATTR_URL + spuId,
	);
};

// 获取全部的销售图片+销售属性
export const reqImgAndSaleAttr = async (spuId: number) => {
	const imgResult = await reqSpuImgList(spuId);
	const saleAttrResult = await reqSpuSaleAttrList(spuId);
	return {
		imgList: imgResult.data,
		saleAttrList: saleAttrResult.data,
	};
};

// 添加SPU
export const reqAddSpu = async (data: SpuData) => {
	return await request.post<any, any>(API.ADD_SPU_URL, data);
};

// 更新SPU
export const reqUpdateSpu = async (data: SpuData) => {
	return await request.post<any, any>(API.UPDATE_SPU_URL, data);
};

export const reqAddSku = async (data: SkuData) => {
	return await request.post<SkuData, any>(API.ADD_SKU, data);
};
