import pinia from '@/store';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore(pinia);

export const has = (app: any) => {
	app.directive('has', {
		// 🔺代表使用这个全局自定义指令的DOM组件挂载完毕时会执行一次
		mounted(el: any, binding: any) {
			// 判断用户是否有权限
			console.log(
				'binding.value: ',
				binding.value,
				'includes: ',
				userStore.buttons.includes(binding.value),
			);
			if (!userStore.buttons.includes(binding.value)) {
				// el.style.display = 'none';
				// el.style.setProperty('display', 'none', 'important');  // ✅ 支持!important
				el.disabled = true; // 设置禁用
			}
		},
	});
};
