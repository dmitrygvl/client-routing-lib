module.exports = {
    env: {
      browser: true,
      es2021: true,
      'jest/globals': true,
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'jest'],
    extends: [
      'airbnb-base',
      'plugin:jest/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
    ],
    overrides: [
      {
        env: {
          node: true,
        },
        files: ['.eslintrc.{js,cjs}'],
        parserOptions: {
          sourceType: 'script',
        },
      },
    ],
    ignorePatterns: ['main.js'],
    rules: {
      'max-len': [
        'error',
        {
          code: 140,
          ignoreComments: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': 0,
      'no-param-reassign': ['error', { props: false }],
      'import/prefer-default-export': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': ['warn', 'never'],
    },
  };