const rules = require('./rules')

module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: null,
    ecmaVersion: 6,
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'prettier', 'vue'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    '@vue/typescript',
    'plugin:vue/recommended',
    'prettier',
    'prettier/vue',
  ],
  rules: {
    ...rules,
    'no-irregular-whitespace': 'off',
    'no-prototype-builtins': 'off',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/valid-v-for': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
}
