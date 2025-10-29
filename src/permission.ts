// 🍉注意，该文件需要在入口文件引入一次(执行一次)
// 路由鉴权
import router from '@/router';
// (1) 🍰引入进度条
import NProgress from 'nprogress';
// (2) 🍰引入进度条样式(必需)(如果要改进度条样式也可以直接进去源码改，找#nprogress .bar)
import 'nprogress/nprogress.css';
// 引入 pinia 实例，在路由守卫等非组件环境下使用 store
import pinia from '@/store';
import { useUserStore } from './store/modules/user';
import setting from '@/setting';

// 🍰关闭进度条附带的页面右上角转不停的蓝色小圈
NProgress.configure({ showSpinner: false });

// 全部路由组件:
// Login Layout 404 Any
// Layout: Home Screen Acl(User,Role,Permission) Product(Trademark,Attr,Spu,Sku)
// 鉴权逻辑：
// 用户未登录：只能访问login，而且redirect指向目的路由(比如screen)
// 用户已登录：不可以访问login，其它都可以

// 全局前置路由守卫
router.beforeEach(async (to: any, from: any, next: any) => {
	// 🍰进度条
	NProgress.start();

	// 🍉鉴权
	// 🔺在守卫函数内部获取 store 实例，确保响应式
	const userStore = useUserStore(pinia);
	const token = userStore.token;

	// 已登录过
	if (token) {
		// 🔺🔺🔺🍉🍉🍉要注意token是在userStore中的！而store的数据是缓存在内存中的！也就是，如下情况是正常的：(吗？对的。)如果现在正常使用，然后f12调出application删掉了token，但其实之后的点击菜单路由跳转是正常的，要直到下一次刷新的时候，路由守卫才会发现token已经没了 / 过期 / 失效 / 错误，才会强制跳转到/login。
		if (to.path === '/login') {
			next({ path: '/' }); // 返回(且redirect去了)首页
		} else {
			// 🔺🔺🔺虽然存有token，但是比如是关掉浏览器再开的，则store中的用户信息是空的（比如用户名和头像）；
			// 🔺🔺🔺虽然能进首页之类的但是用户信息空，所以需要再判断一下、没有就请求信息！！！
			// 🍉即如果没有用户信息，则需要在守卫中发送请求直到获取了用户信息再放行！
			if (!userStore.userInfo.username) {
				try {
					await userStore.getUserInfo();
					next();
				} catch (err) {
					// 除了网速，还有可能是token过期。这里统一认为是token过期。
					alert('获取信息失败：' + err);
					await userStore.userLogout(); // token过期先退出登录，然后去到login界面
					next({ path: '/login',query: {redirect: to.path}});
				}
			} else next();
		}
	}
	// 未登录
	else {
		if (to.path === '/login') {
			next();
		} else {
			next({ path: '/login', query: { redirect: to.path } });
		}
	}
});

// 全局后置路由守卫
router.afterEach((to: any, from: any) => {
	// 🍰进度条
	NProgress.done();
	document.title = setting.title + '-' + to.meta.title;
});
