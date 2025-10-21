import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
const pathResolve = (dir: string) => path.resolve(__dirname, dir);

// 引入svg需要用到的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// mock配置
// import { UserConfigExport,ConfigEnv } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';

// https://vite.dev/config/
// mock配置：command 用于区分是开发环境还是生产环境,mock只能用于开发阶段。
export default defineConfig(({ command }) => {
	return {
		plugins: [
			vue(),
			// 配置svg图标插件
			createSvgIconsPlugin({
				iconDirs: [pathResolve('src/assets/icons')],
				symbolId: 'icon-[name]',
			}),
			// 配置mock插件
			viteMockServe({
				mockPath: 'mock',
				localEnabled: command === 'serve', // 保证开发阶段可以使用mock接口
			}),
		],
		resolve: {
			alias: {
				'@': pathResolve('./src'),
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					// 使用现代的 @use 语法代替 @import
					additionalData: `@use "@/assets/styles/variables.scss" as *;`,
				},
				// 如果用到了less和stylus可以如下配置：
				// less: {
				// 	javascriptEnabled: true,
				// 	additionalData: `@use "@/assets/styles/variables.less" as *;`,
				// },
				// stylus: {
				// 	additionalData: `@use "@/assets/styles/variables.styl" as *;`,
				// },
			},
		},
	};
});
