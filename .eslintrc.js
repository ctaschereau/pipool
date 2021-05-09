module.exports = {
	extends: ['eslint:recommended'],
	plugins: ['jsdoc'],
	parserOptions: {
		ecmaVersion: 2018,
	},
	env: {
		es6: true,
		node: true,
	},
	rules: {
		'no-console': 0,
		'max-depth': ['error', 5],
		'no-useless-escape': ['off'],
		'no-extra-boolean-cast': ['error'],
		'no-unused-vars': [
			'error',
			{
				vars: 'all',
				args: 'none',
				ignoreRestSiblings: false,
			},
		],
		semi: ["error", "always"],
		'jsdoc/require-param': 2,
		'jsdoc/require-param-name': 2,
	},
};
