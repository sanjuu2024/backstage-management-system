// 。🍉vite提供了loadEnv方法用于加载对应环境下的变量
import { defineConfig, loadEnv } from 'vite';
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
// mode 用于区分不同的环境（开发、测试、生产）对应的变量
export default defineConfig(({ command, mode }) => {
	// 🍉获取各种环境下对应的变量,参数一是defineConfig的参数mode,参数二是项目的根目录(vite的process模块提供了process.cwd())
	let env = loadEnv(mode, process.cwd());

	// 调试信息：打印环境变量
	// console.log('当前环境变量：');
	// console.log('VITE_APP_BASE_API:', env.VITE_APP_BASE_API);
	// console.log('VITE_SERVE:', env.VITE_SERVE);

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
		// 🍉配置跨域
		server: {
			proxy: {
				// 即VITE_APP_BASE_API
				// 开发环境下关键字(关键路径?)为/api,
				// 生产环境下关键字为/prod-api,
				// 测试环境下关键字为/test-api,
				// 所以不用一个个写如：'/api': {}，可以直接：
				[env.VITE_APP_BASE_API]: {
					// 🍰获取数据的服务器地址
					target: env.VITE_SERVE, // 🔺🔺🔺写成server了...然后卡大半天怀疑人生...
					// 🍰是否需要代理跨域
					changeOrigin: true,
					// 🍰路径重写(🔺🔺🔺注意不是`^/${...}`！！！VITE_APP_BASE_API自带`/`来着！！！)
					rewrite: (path) =>
						path.replace(
							new RegExp(`^${env.VITE_APP_BASE_API}`),
							'',
						),
				},
			},
		},
	};
});
