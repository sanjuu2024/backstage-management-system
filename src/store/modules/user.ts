// 创建用户相关的小仓库
import { defineStore } from 'pinia';
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user';
import { type UserState } from './types/type';
// import { ElMessage } from "element-plus";
import { SET_TOKEN, GET_TOKEN } from '@/utils/token';
// 引入常量路由(貌似一个用户对应一个路由数组会好一些，方便权限管理)
import { constRoutes } from '@/router/routes';
import { REMOVE_TOKEN } from '@/utils/token';

export const useUserStore = defineStore('user', {
	// ?ts类型限定还能这么写...
	state: (): UserState => {
		return {
			// 如果没存过则获得的是null
			token: GET_TOKEN(), // 用户令牌
			menuRoutes: constRoutes, // 该用户对应的路由数组,
			userInfo: {
				username: '',
				avatar: '',
			},
		};
	},
	actions: {
		// 用户请求登录
		async userLogin(data: any) {
			let res: any = await reqLogin(data);
			console.log('登录返回：',res);
			if (res.code === 200) {
				this.token = res.data as string;  
				// 本地永久存储
				// localStorage.setItem('TOKEN',this.token);
				SET_TOKEN(this.token);
				// ElMessage.success('登录成功');   // 转为在组件那边用ElNotification了
				return '登录成功'; // async会把返回结果封装成一个Promise，这里就不用return Promise了，否则就是Promise<Promise<string>>
			} else {
				// ElMessage.error(res.data.message);   // 转为在组件那边用ElNotification了
				throw new Error(res.message); // 让函数调用完回去组件可以进入catch，打印登录错误的纤细错误信息
			}
		},
		// 获取用户信息
		async getUserInfo() {
			let res = await reqUserInfo();
			if (res.code === 200) {
				this.userInfo.username = res.data.name;
				this.userInfo.avatar = res.data.avatar;
			} else throw new Error(res.message);
		},
		// 用户退出登录
		async userLogout() {
			if (!confirm('确认退出登录吗？')) return;
			let res = await reqLogout();
			if (res.code === 200) {
				this.token = this.userInfo.username = this.userInfo.avatar = '';
				REMOVE_TOKEN();
				return '退出登录成功';
			}
			else{
				return Promise.reject(new Error(res.message));
			}
		},
	},
});
