// 引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue';
import Pagination from './Pagination/index.vue';
import type { App } from 'vue';
// 引入element-plus提供全部图标组件(虽然性能上来说不推荐，但是有时候网络不好自动引入会导致图标加载不出来。用全局注册是为了加载不出错。)
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// 全局组件们的对象
const allGlobalComponent = { SvgIcon, Pagination };
// 对外暴露插件对象们
export default {
	install(app: App) {
		// 注册项目全部的全局组件
		Object.keys(allGlobalComponent).forEach((key) => {
			app.component(
				key,
				allGlobalComponent[key as keyof typeof allGlobalComponent],
			);
		});
		// 注册element-plus的全部图标组件(p.s. 注册完之后使用：<el-icon><Plus/></el-icon>)
		for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
			app.component(key, component);
		}
	},
};
