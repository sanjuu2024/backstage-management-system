// 品牌模块接口的参数、返回数据的ts类型限制

export interface ResponseData {
	code: number;
	message: string;
	ok: boolean;
}

// 品牌数据
export interface Brand {
	id?: number; // 貌似是因为以后新增的品牌，其id数据库会自动生成，所以?可选
	tmName: string;
	logoUrl: string;
}

// 获取已有品牌接口返回数据的ts类型
export interface ExistingBrandsResponseData extends ResponseData {
	data: {
		records: Brand[];
		total: number;
		size: number;
		current: number;
		searchCount: boolean;
		pages: number;
	};
}
