module.exports = {
	// 基础配置
	extends: ['stylelint-config-standard'],

	// 不同文件对应的解析器
	overrides: [
		{
			files: ['**/*.vue'],
			customSyntax: 'postcss-html',
		},
		{
			files: ['**/*.scss'],
			customSyntax: 'postcss-scss',
		},
	],

	// 忽略的文件
	ignoreFiles: [
		'**/*.js',
		'**/*.jsx',
		'**/*.tsx',
		'**/*.ts',
		'**/*.json',
		'**/*.md',
		'**/*.yaml',
		'dist/**',
		'node_modules/**',
		'public/**',
	],

	// 自定义规则
	rules: {
		// 允许空的 style 标签
		'no-empty-source': null,
		
		// 忽略伪类选择器 ::v-deep
		'selector-pseudo-element-no-unknown': [
			true,
			{
				ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'],
			},
		],
		
		// 不验证@未知的名字，为了兼容scss的函数
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: ['apply', 'variants', 'responsive', 'screen'],
			},
		],
		
		// 禁止在具有较高优先级的选择器后出现优先级较低的选择器
		'no-descending-specificity': null,
	},
};
