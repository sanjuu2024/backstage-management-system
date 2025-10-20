import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 导入中文语言包,这样设置后所有ElementPlus的所有组件都会显示为中文文本
// @ts-ignore
import 'virtual:svg-icons-register';
// 导入全局样式
import '@/assets/styles/index.scss';

// svg配置
// 引入可以批量注册全局组件的自定义插件
// @/components即@/components/index.任意后缀名
import globalComponent from '@/components';

// 引入router
import router from '@/router/index.ts';

// 引入pinia
import pinia from '@/store/index.ts';

const app = createApp(App);
app.use(ElementPlus, {
	locale: zhCn,
});

// 注册下路由
app.use(router);

// 安装pinia
app.use(pinia);

// 安装批量注册全局组件的自定义插件
app.use(globalComponent);

app.mount('#app');

console.log(localStorage.getItem('test)'));