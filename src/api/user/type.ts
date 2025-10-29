// 定义全部接口返回数据都拥有的ts类型
export interface ResponseDate{
	code: number,
	message: string,
	ok: boolean
}

// 登录接口需要携带的参数ts类型
export interface LoginFormData {
	username: string,
	password: string
}

// 登录接口返回的数据ts类型
export interface LoginResponseData extends ResponseDate {
	data: string
}

// 获取用户信息返回数据的ts类型
export interface UserInfoResponseData extends ResponseDate {
	data: {
		name: string,
		avatar: string,
		roles: string[],
		buttons: string[],
		routes: string[]
	}
}