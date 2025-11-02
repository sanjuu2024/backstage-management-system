export interface ResponseData {
	code: number;
	message: string;
	ok: boolean;
}

// 用户数据的ts类型
// 哪些字段需要打字段取决于到时新增用户的表单校验要求哪些可以没有(或者说取决于接口文档中哪些不是必须项)
export interface UserData {
	id?: string | number; // 没有id就是新增(此时值可能是'')
	name?: string;
	password: string;
	phone: string;
	roleName: string;
	createTime?: {
		'time.Time': string;
	};
	updateTime?: {
		'time.Time': string;
	};
	username: string;
}

// 获取用户分页列表时返回数据的ts类型
export interface UserResponseData extends ResponseData {
	data: {
		size: number;
		total: number;
		current: number;
		pages: number;
		records: UserData[];
	};
}

// 角色类型
export interface RoleData {
	createTime?: {
		'time.Time': string;
	};
	id: number;
	remark?: string;
	roleName: string;
	updateTime?: {
		'time.Time': string;
	};
}

// 根据用户角色返回数据的ts类型
export interface UserRoleResponseData extends ResponseData {
	data: {
		allRolesList: RoleData[];
		asssignRoles: RoleData[];
	};
}

// 为用户分配角色时所需的参数类型
export interface AssignRoleData {
	userId: number;
	roleIdList: number[];
}
