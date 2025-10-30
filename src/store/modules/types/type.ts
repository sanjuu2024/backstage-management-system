// ts的路由类型：RouteRecordRaw
import type { CategoryData } from '@/api/product/attr/type';
import { type RouteRecordRaw } from 'vue-router';
// userStore的state类型
export interface UserState {
	token: string | null;
	menuRoutes: RouteRecordRaw[];
	userInfo: {
		username: string;
		avatar: string;
	};
}

// categoryStore的state类型
export interface CategoryState {
	l1: CategoryData[];
	l2: CategoryData[];
	l3: CategoryData[];
	c1Id: number | string;
	c2Id: number | string;
	c3Id: number | string;
}