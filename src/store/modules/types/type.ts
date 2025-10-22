// ts的路由类型：RouteRecordRaw
import { type RouteRecordRaw } from 'vue-router';
// userStore的state类型
export interface UserState {
	token: string | null;
	menuRoutes: RouteRecordRaw[];
	userInfo: {
		username: string,
		avatar: string
	}
}
