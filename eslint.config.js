import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
   js.configs.recommended,
   {
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
         parser: tsParser,
         parserOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
         },
         globals: {
            console: 'readonly',
            process: 'readonly',
            Buffer: 'readonly',
            __dirname: 'readonly',
            __filename: 'readonly',
            module: 'readonly',
            require: 'readonly',
            global: 'readonly',
            setTimeout: 'readonly',
            setInterval: 'readonly',
            setImmediate: 'readonly',
            clearTimeout: 'readonly',
            clearInterval: 'readonly',
            clearImmediate: 'readonly',
            Express: 'readonly',
            NodeJS: 'readonly',
         },
      },
      plugins: {
         '@typescript-eslint': tseslint,
      },
      rules: {
         '@typescript-eslint/no-unused-vars': [
            'warn',
            { argsIgnorePattern: '^_' },
         ],
         'no-unused-vars': 'off',
         'no-console': 'warn',
         'no-undef': 'off',
         'no-useless-catch': 'off',
      },
   },
];
