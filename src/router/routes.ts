// 对外暴露配置路由(常量路由)
import type { RouteRecordRaw } from 'vue-router';

// 通过控制该路由是否需要在菜单中展示。
export const constRoutes = [
	// 登录
	{
		name: 'Login',
		path: '/login',
		component: () => import('@/views/login/index.vue'),
		meta:{
			title:'登录',
			hidden: true,
			icon: 'UserFilled'
		}
	},
	// 登陆成功后展示数据的布局页面
	{
		name: 'Layout',
		path: '/',
		// component: () => import('@/views/home/index.vue'),
		// 封装成src/layout/index.vue布局组件
		component: () => import('@/layout/index.vue'),
		redirect: '/home',   // 重定向到首页
		meta: {
			title: 'layout',
			hidden: true,  // Layout 本身在菜单中隐藏
			icon: 'Avatar'
		},
		children: [
			{
				path: '/home',
				name: 'Home',
				component: () => import('@/views/home/index.vue'),
				meta: {
					title: '首页',
					hidden: false,
					icon: 'HomeFilled'
				}
			},
			// 数据大屏
			{
				name: 'Screen',
				path: 'screen',
				component: () => import('@/views/screen/index.vue'),
				meta: {
					title: '数据大屏',
					hidden: false,
					icon: 'DataAnalysis'
				}
			},
			// 权限管理
			{
				name: 'Acl',
				path: 'acl',
				component: () => import('@/views/acl/index.vue'),
				meta: {
					title: '权限管理',
					hidden: false,
					icon: 'Lock'
				},
				children: [
					{
						name: 'User',
						path: 'user',
						component: () => import('@/views/acl/user/index.vue'),
						meta: {
							title: '用户管理',
							hidden: false,
							icon: 'User'
						}
					},
					{
						name: 'Role',
						path: 'role',
						component: () => import('@/views/acl/role/index.vue'),
						meta: {
							title: '角色管理',
							hidden: false,
							icon: 'UserFilled'
						}
					},
					{
						name: 'Permission',
						path: 'permission',
						component: () => import('@/views/acl/permission/index.vue'),
						meta: {
							title: '菜单管理',
							hidden: false,
							icon: 'Monitor'
						}
					},
				]
			},
			// 商品管理
			{
				name: 'Product',
				path: 'product',
				component: () => import('@/views/product/index.vue'),
				meta: {
					title: '商品管理',
					hidden: false,
					icon: 'Goods'
				},
				children: [
					{
						name: 'Brands',
						path: 'brands',
						component: () => import('@/views/product/brands/index.vue'),
						meta: {
							title: '品牌管理',
							hidden: false,
							icon: 'ShoppingCartFull'
						}
					},
					{
						name: 'Attr',
						path: 'attr',
						component: () => import('@/views/product/attr/index.vue'),
						meta: {
							title: '属性管理',
							hidden: false,
							icon: 'SetUp'
						}
					},
					{
						name: 'Spu',
						path: 'spu',
						component: () => import('@/views/product/spu/index.vue'),
						meta: {
							title: 'SPU管理',
							hidden: false,
							icon: 'Calendar'
						}
					},
					{
						name: 'Sku',
						path: 'sku',
						component: () => import('@/views/product/sku/index.vue'),
						meta: {
							title: 'SKU管理',
							hidden: false,
							icon: 'Orange'
						}
					}
				]
			}
		]
	},
	// 404页面
	{
		name: '404',
		path: '/404',
		component: () => import('@/views/404/index.vue'),
		meta: {
			title: '404 Not Found(っ °Д °;)っ',	
			hidden: true,
			icon: 'DocumentDeleted'
		}
	},
	// 任意路由
	{
		name: 'Any',
		path: '/:pathMatch(.*)*',
		redirect: '/404',
		meta: {
			title: '任意路由重定向404',
			hidden: true,
			icon: 'Promotion'
		}
	},
] as RouteRecordRaw[];