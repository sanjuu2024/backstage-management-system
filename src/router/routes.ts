// 对外暴露配置路由(常量路由)
export const constRoute = [
    // 登录
    {
        name: 'login',
        path: '/login',
        component: () => import('@/views/login/index.vue'),
    },
    // 主页(登陆成功后)
    {
        name: 'home',
        path: '/',
        // component: () => import('@/views/home/index.vue'),
        // 封装成src/layout/index.vue布局组件
        component: () => import('@/layout/index.vue'),
    },
    // 404页面
    {
        name: '404',
        path: '/404',
        component: () => import('@/views/404/index.vue'),
    },
    // 任意路由
    {
        name: 'any',
        path: '/:pathMatch(.*)*',
        redirect: '/404',
    }
];