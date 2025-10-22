// 封装本地存读token操作
// 存储
export const SET_TOKEN = (token: string) => {
	localStorage.setItem('TOKEN', token);
};

// 获取
export const GET_TOKEN = (): string | null => {
	return localStorage.getItem('TOKEN');
};

// 删
export const REMOVE_TOKEN = () => {
	localStorage.removeItem('TOKEN');
}