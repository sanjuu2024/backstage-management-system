// 引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue';
import Pagination from './Pagination/index.vue';
import type { App } from 'vue';
// 全局组件们的对象
const allGlobalComponent = { SvgIcon, Pagination };
// 对外暴露插件对象们
export default {
	install(app: App) {
		Object.keys(allGlobalComponent).forEach((key) => {
			app.component(
				key,
				allGlobalComponent[key as keyof typeof allGlobalComponent],
			);
		});
	},
};
