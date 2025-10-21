// 创建用户相关的小仓库
import { defineStore } from 'pinia';
import { reqLogin } from '@/api/user';
import { type loginFormData, type loginResponseData } from '@/api/user/type';
import { type UserState } from './types/type';
// import { ElMessage } from "element-plus";
import { SET_TOKEN, GET_TOKEN } from '@/utils/token';
// 引入常量路由(貌似一个用户对应一个路由数组会好一些，方便权限管理)
import { constRoutes } from '@/router/routes';

export const useUserStore = defineStore('user', {
	// ?ts类型限定还能这么写...
	state: (): UserState => {
		return {
			// 如果没存过则获得的是null
			token: GET_TOKEN(), // 用户令牌
			menuRoutes: constRoutes, // 该用户对应的路由数组
		};
	},
	actions: {
		async userLogin(data: loginFormData) {
			let res: loginResponseData = await reqLogin(data);
			if (res.code === 200) {
				// TypeScript 现在知道 res.data 有 token 属性
				this.token = res.data.token as string;
				// 本地永久存储
				// localStorage.setItem('TOKEN',this.token);
				SET_TOKEN(this.token);
				// ElMessage.success('登录成功');   // 转为在组件那边用ElNotification了
				return '登录成功'; // async会把返回结果封装成一个Promise，这里就不用return Promise了，否则就是Promise<Promise<string>>
			} else {
				// TypeScript 现在知道 res.data 有 message 属性
				// ElMessage.error(res.data.message);   // 转为在组件那边用ElNotification了
				throw new Error(res.data.message); // 让函数调用完回去组件可以进入catch，打印登录错误的纤细错误信息
			}
		},
	},
});
