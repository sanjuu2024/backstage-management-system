// 属性管理模块接口参数/返回数据ts类型

interface ResponseData {
	code: number;
	message: string;
	ok: boolean;
}

// 每一个分类
export interface CategoryData {
	id: number | string;
	name: string;
	category1Id?: number;
	category2Id?: number;
}

// 获取一/二/三级分类返回的数据ts类型
export interface CategoryResponseData extends ResponseData {
	data: CategoryData[];
}

// 属性值ts类型
export interface AttrValue {
	id?: number;
	valueName: string;
	attrId?: number;
	flag?: boolean; // 控制添加属性值的时候是编辑模式(true)还是查看模式
}

// 属性ts类型
export interface Attr {
	id?: number;
	attrName: string;
	categoryId: number | string;
	categoryLevel: number;
	attrValueList: AttrValue[];
}

// 请求属性和属性值返回的数据ts类型
export interface AttrResponseData extends ResponseData {
	data: Attr[];
}
