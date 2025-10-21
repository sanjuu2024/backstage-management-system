// 登录接口需要携带的参数ts类型
export interface loginFormData {
	username: string;
	password: string;
}

// ==================================

// 登录成功响应
interface LoginSuccessResponse {
	code: 200; // 固定为 200
	data: {
		token: string;
	};
}

// 登录失败响应
interface LoginFailResponse {
	code: 201; // 固定为 201
	data: {
		message: string;
	};
}

// 登录接口返回的数据类型(使用联合类型，支持类型缩窄)
export type loginResponseData = LoginSuccessResponse | LoginFailResponse;

// ==================================

interface userInfo {
	userId: number;
	avatar: string;
	username: string;
	password: string;
	desc: string; // 身份
	roles: string[]; // 角色
	buttons: string[]; // 按钮权限
	routes: string[]; // 可访问路由(路由权限),
	token: string;
}

interface user {
	checkUser: userInfo; // 不懂为什么接口定义得那么不语义化...
}

// 获取用户信息接口返回的数据类型(参考mock/user.ts中返回的数据)
export interface userInfoResponseData {
	code: number;
	data: user;
}
