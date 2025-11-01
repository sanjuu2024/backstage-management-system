import type { Brand } from '../brands/type';

interface ResponseData {
	code: number;
	message: string;
	ok: boolean;
}

// SPU的基础ts类型
export interface SpuData {
	id?: number;
	spuName: string;
	description: string;
	category3Id: string | number;
	tmId?: number; // 品牌id
	spuImageList: null | SpuImg[]; // 图片列表
	spuSaleAttrList: null | SpuSaleAttr[]; // 销售属性列表
}

// 获取SPU分页列表的返回数据ts类型
export interface SpuResponseData extends ResponseData {
	data: {
		records: SpuData[];
		total: number;
		size: number;
		current: number;
		searchCount: boolean;
		pages: number;
	};
}

// 获取所有品牌的返回数据ts类型
export interface AllBrandsResponseData extends ResponseData {
	data: Brand[];
}

// 下拉枚举的所有销售属性
export interface SaleAttr {
	id: number;
	createTime: string;
	updateTime: string;
	name: string;
}

// 获取所有销售属性的返回数据ts类型
export interface AllSaleAttrResponseData extends ResponseData {
	data: SaleAttr[];
}

// 商品图片的ts类型
export interface SpuImg {
	id?: number;
	createTime?: string;
	updateTime?: string;
	spuId: number;
	imgName: string;
	imgUrl: string;
	name?: string; // el-upload用的是name
	url?: string; // el-upload用的是url
}

// 获取商品图片列表的返回数据的ts类型
export interface SpuImgListResponseData extends ResponseData {
	data: SpuImg[];
}

// 商品销售属性的属性值的ts类型
export interface SpuSaleAttrValue {
	id?: number;
	createTime?: null | string;
	updateTime?: null | string;
	spuId: number;
	baseSaleAttrId: number;
	saleAttrValueName: string;
	saleAttrName?: string;
	isChecked?: null | string;
}

// 商品销售属性的ts类型
export interface SpuSaleAttr {
	id?: number;
	createTime?: null | string;
	updateTime?: null | string;
	spuId?: number;
	baseSaleAttrId: number;
	saleAttrName: string;
	spuSaleAttrValueList: SpuSaleAttrValue[];
	flag?: boolean; // 这个是为了前端页面服务的，添加属性值时控制input的显示。
}

// 获取商品销售属性的返回数据的ts类型
export interface SpuSaleAttrListResponseData extends ResponseData {
	data: SpuSaleAttr[];
}

// SPU的其它属性ts类型
export interface SpuOtherData {
	spuImageList: SpuImg[];
	spuSaleAttrList: SpuSaleAttr[];
}
