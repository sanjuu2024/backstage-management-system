import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-node';
import prettierConfig from 'eslint-config-prettier';

export default [
	// 1.忽略文件配置
	{
		ignores: ['dist/', 'node_modules/', '*.d.ts'],
	},

	// 2.基础 JavaScript 配置
	js.configs.recommended,

	// 3.TypeScript 配置
	...tseslint.configs.recommended,

	// 4.Vue 配置
	...pluginVue.configs['flat/essential'],

	// 5.Prettier 配置 - 禁用与 Prettier 冲突的规则
	prettierConfig,

	// 6.通用配置
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
		plugins: {
			prettier: prettierPlugin,
			import: importPlugin,
			node: nodePlugin,
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021,
			},
			ecmaVersion: 2021,
			sourceType: 'module',
		},
		rules: {
			// Prettier 规则
			'prettier/prettier': 'error',

			// Import/Export 规则
			'import/order': 'off', // 关闭自动排序 import
			'import/no-unresolved': 'off', // 关闭，因为 TypeScript 会处理
			'import/named': 'off', // 关闭，避免与 Vue 组件冲突
			'import/no-duplicates': 'error',
			'import/newline-after-import': 'error',

			// Node.js 规则
			'node/no-missing-import': 'off', // 关闭，避免与模块解析冲突
			'node/no-unsupported-features/es-syntax': 'off', // 允许 ES 模块语法

			// 通用 JavaScript/TypeScript 规则
			'no-console': 'warn', // 警告使用 console
			'no-debugger': 'warn', // 警告使用 debugger
			'no-unused-vars': 'off', // 关闭，让 TypeScript 处理
			'no-undef': 'off', // 关闭，让 TypeScript 处理

			// TypeScript 注释规则
			'@typescript-eslint/ban-ts-comment': 'off', // 允许使用 @ts-ignore

			// 代码质量规则
			'prefer-const': 'error',
			'no-var': 'error',
			'object-shorthand': 'error',
			'prefer-template': 'error',
			'prefer-arrow-callback': 'error',
		},
	},

	// 7.TypeScript 特定配置
	{
		files: ['**/*.{ts,mts,cts}'],
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-non-null-assertion': 'warn',
			'@typescript-eslint/prefer-as-const': 'error',
			'@typescript-eslint/ban-ts-comment': 'off', // 允许使用 @ts-ignore
		},
	},

	// 8.Vue 特定配置
	{
		files: ['**/*.vue'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: ['.vue'],
				ecmaFeatures: {
					jsx: false,
				},
			},
		},
		rules: {
			// Vue 规则
			'vue/multi-word-component-names': 'off', // 允许单词组件名
			'vue/component-definition-name-casing': ['error', 'PascalCase'],
			'vue/component-name-in-template-casing': ['error', 'kebab-case'],
			'vue/prop-name-casing': ['error', 'camelCase'],
			'vue/attribute-hyphenation': ['error', 'always'],
			'vue/v-on-event-hyphenation': ['error', 'always'],

			// Vue 最佳实践
			'vue/require-default-prop': 'error',
			'vue/require-prop-types': 'error',
			'vue/no-unused-components': 'warn',
			'vue/no-unused-vars': 'error',
			'vue/use-v-on-exact': 'error',
			'vue/no-mutating-props': 'error',

			// Vue 模板规则
			'vue/html-self-closing': [
				'error',
				{
					html: {
						void: 'always',
						normal: 'never',
						component: 'always',
					},
					svg: 'always',
					math: 'always',
				},
			],
			'vue/max-attributes-per-line': 'off', // 关闭，让 Prettier 处理换行
		},
	},
];
