const processor = require('./preprocess');

module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	env: {
		node: true,
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'prettier',
		'plugin:prettier/recommended',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
	],
	// overrides: [
	// 	{
	// 		files: ['*.hbs'],
	// 		parser: './preprocess'
	// 	},
	// ],
	ignorePatterns: [
		'main.ts',
		'*.test.*',
		'__tests__/fixtures/**/*',
		'setupFile.ts',
		'__mocks__/**/*',
		'rollup.config.js',
		'vite.config.*',
		'jest.config.*',
		'lint-staged.config.*',
		'/dist',
		'/node_modules',
	],
};
