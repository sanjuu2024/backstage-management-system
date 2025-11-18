import { createRouter, createWebHistory } from 'vue-router';
import { constRoutes } from './routes';
export default createRouter({
	// 🍉使用 import.meta.env.BASE_URL 自动适配 vite.config.ts 中的 base 配置
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: constRoutes,
	// 滚动行为(这个倒是第一次学),效果：每次通过 Vue Router 进行页面跳转后，都会自动将滚动条滚回到页面最顶部。
	scrollBehavior() {
		return {
			left: 0,
			top: 0,
		};
	},
});
