export interface ResponseData {
	code: number;
	message: string;
	ok: boolean;
}

// 菜单项的类型
export interface MenuData {
	children?: MenuData[];
	code: string;
	createTime?: {
		'time.Time': string;
	};
	id?: number;
	level: number;
	name: string;
	pid: number;
	select: boolean;
	status: string;
	toCode: string;
	type: number;
	updateTime?: {
		'time.Time': string;
	};
}

// 请求菜单列表的返回类型
export interface MenuListResponseData extends ResponseData {
	data: MenuData[];
}

// 新增 / 修改 菜单 / 功能 的参数类型
export interface MenuFormData {
	id?: number;
	code: string;
	level: number;
	name: string;
	pid?: number;
	type?: number;
}
