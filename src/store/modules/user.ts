// 创建用户相关的小仓库
import { defineStore } from 'pinia';
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user';
import { type UserState } from './types/type';
// import { ElMessage } from "element-plus";
import { SET_TOKEN, GET_TOKEN } from '@/utils/token';
// 🍉引入常量路由、异步路由、任意路由
import { constRoutes, asyncRoutes, anyRoute } from '@/router/routes';
import { REMOVE_TOKEN } from '@/utils/token';

// ❌userRouter获取到的router只能在setup中使用！！！
// import { useRouter } from 'vue-router';
// const router = useRouter();

// ✅pinia仓库中应该使用以下import router！！！
import router from '@/router';

import type {
	LoginFormData,
	LoginResponseData,
	UserInfoResponseData,
} from '@/api/user/type';

// 用第三方包的深拷贝方法(忽略一下ts类型校验)
// @ts-ignore
import cloneDeep from 'lodash/clonedeep';

// 过滤异步路由，返回符合用户权限的路由数组
function filterAsyncRoutes(asyncRoutes: any, routes: string[]) {
	return asyncRoutes.filter((item: any) => {
		if (routes.includes(item.name)) {
			if (item.children && item.children.length > 0) {
				item.children = filterAsyncRoutes(item.children, routes);
			}
			return true;
		}
	});
}

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
			// 🍉按钮权限
			buttons: [],
		};
	},
	actions: {
		// 用户请求登录
		async userLogin(data: LoginFormData) {
			// 其实貌似ts会自动推断res的类型的
			let res: LoginResponseData = await reqLogin(data);
			// console.log('登录返回：', res);
			if (res.code === 200) {
				this.token = res.data as string;
				SET_TOKEN(this.token);
				// ElMessage.success('登录成功');   // 转为在组件那边用ElNotification了
				return '登录成功'; // async会把返回结果封装成一个Promise，这里就不用return Promise了，否则就是Promise<Promise<string>>
			} else {
				// ElMessage.error(res.data.message);   // 转为在组件那边用ElNotification了
				throw new Error(res.message); // 让函数调用完回去组件可以进入catch，打印登录错误的纤细错误信息
			}
		},
		// 获取用户信息
		// 🍉获取路由权限在这里
		async getUserInfo() {
			let res: UserInfoResponseData = await reqUserInfo();
			if (res.code === 200) {
				this.userInfo.username = res.data.name;
				this.userInfo.avatar = res.data.avatar;
				// 🍉过滤出该用户的异步路由权限
				// ⚠️注意必须是深拷贝，filterAsyncRoutes函数中会修改路由对象的children属性的，如果传原值会导致路由丢失子路由(但是实际上前端不用写这个，一般都是后端给的路由权限照样写就行了)
				let userAsyncRoutes = filterAsyncRoutes(
					cloneDeep(asyncRoutes),
					res.data.routes,
				);
				this.menuRoutes = [
					...constRoutes,
					...userAsyncRoutes,
					anyRoute,
				];
				// console.log(this.menuRoutes);
				// 🍉注册路由(main.ts)中已经注册了常量路由，这里需要动态追加注册userAsyncRoutes和任意路由
				[...userAsyncRoutes, anyRoute].forEach((route) => {
					router.addRoute(route);
				});

				// 🍉按钮权限
				this.buttons = res.data.buttons;
			} else throw new Error(res.message);
		},
		// 用户退出登录
		async userLogout() {
			// if (!confirm('确认退出登录吗？')) return;
			let res = await reqLogout();
			if (res.code === 200) {
				this.token = this.userInfo.username = this.userInfo.avatar = '';
				REMOVE_TOKEN();
				return '退出登录成功';
			} else {
				return Promise.reject(new Error(res.message));
			}
		},
	},
});
