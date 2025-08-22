import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(js.configs.recommended, ...tseslint.configs.recommended, {
  files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: './tsconfig.json',
      sourceType: 'module',
    },
    globals: {
      ...globals.node,
    },
  },
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error',
    eqeqeq: 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'prettier/prettier': 'error',
  },
  plugins: {
    prettier: require('eslint-plugin-prettier'),
  },
});
