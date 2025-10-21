// 封装本地存读token操作
export const SET_TOKEN = (token: string) => {
	localStorage.setItem('TOKEN', token);
};

export const GET_TOKEN = (): string | null => {
	return localStorage.getItem('TOKEN');
};
