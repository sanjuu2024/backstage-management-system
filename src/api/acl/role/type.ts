export interface ResponseData {
	code: number;
	message: string;
	ok: boolean;
}

// 角色类型的ts类型
export interface RoleData {
	ID: number;
	createTime?: {
		'time.Time': string;
	};
	id?: string | number;
	remark?: string;
	roleName: string;
	updateTime?: {
		'time.Time': string;
	};
}

// 获取角色分页列表时返回数据的ts类型
export interface RoleResponseData extends ResponseData {
	data: {
		size: number;
		total: number;
		current: number;
		pages: number;
		records: RoleData[];
	};
}

// 权限类型的ts类型
export interface PermissionData {
	ID: number;
	children: [PermissionData];
	code: string;
	createTime: {
		'time.Time': string;
	};
	id: number;
	level: number;
	name: string;
	pid: number;
	select: true;
	status: string;
	toCode: string;
	type: number;
	updateTime: {
		'time.Time': string;
	};
}

// 获取权限返回数据的ts类型
export interface PermissionResponseData extends ResponseData {
	data: PermissionData[];
}
