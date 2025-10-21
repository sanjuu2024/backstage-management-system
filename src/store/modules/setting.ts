// layout布局相关配置仓库
import { defineStore } from 'pinia';
export const useSettingStore = defineStore('setting', {
	state: () => {
		return {
			fold: false,   // 控制左侧菜单是收起还是打开
			refresh: false,   // 控制是否需要刷新页面
		};
	},
});
