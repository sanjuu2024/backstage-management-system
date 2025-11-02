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

export interface UserResponseDate extends ResponseData {
	data: {
		size: number;
		total: number;
		current: number;
		pages: number;
		records: UserData[];
	};
}
