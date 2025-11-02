// 定义SKU分页列表返回的sku数据
export interface ResponseData {
	code: number;
	message: string;
	ok: boolean;
}

// sku类型
export interface SkuData {
	ID: number;
	category3Id: number;
	id: number;
	isSale: boolean;
	price: number;
	skuAttrValueList: [
		{
			ID: number;
			attrId: number;
			attrName: string;
			id: number;
			skuId: number;
			valueId: number;
			valueName: string;
		},
	];
	skuDefaultImg: string;
	skuDesc: string;
	skuName: string;
	skuSaleAttrValueList: [
		{
			ID: number;
			id: number;
			saleAttrId: number;
			saleAttrName: string;
			saleAttrValueId: number;
			saleAttrValueName: string;
			skuId: number;
		},
	];
	spuID: number;
	tmId: number;
	weight: number;
}

// 获取sku分页列表的返回数据ts类型
export interface SkuListResponseData extends ResponseData {
	data: {
		size: number;
		total: number;
		searchCount: number;
		records: SkuData[];
		pages: number;
		current: number;
	};
}

// sku的详情数据ts类型
export interface SkuDetail {
	ID: number;
	category3Id: number;
	id: number;
	isSale: number;
	price: number;
	skuAttrValueList: [
		{
			ID: number;
			attrId: number;
			attrName: string;
			id: number;
			skuId: number;
			valueId: number;
			valueName: string;
		},
	];
	skuDefaultImg: string;
	skuDesc: string;
	skuImageList: [
		{
			ID: number;
			id: number;
			imgName: string;
			imgUrl: string;
			isDefault: string;
			skuId: number;
			spuImgId: number;
		},
	];
	skuName: string;
	skuSaleAttrValueList: [
		{
			ID: number;
			id: number;
			saleAttrId: number;
			saleAttrName: string;
			saleAttrValueId: number;
			saleAttrValueName: string;
			skuId: number;
		},
	];
	spuID: number;
	tmId: number;
	weight: number;
}

// 获取指定sku的详情数据的返回数据的ts类型
export interface SkuDetailResponseData extends ResponseData {
	data: SkuDetail;
}
