import pluginAngular from '@angular-eslint/eslint-plugin';
import parserAngular from '@angular-eslint/template-parser';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginPrettier from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      '@angular-eslint': pluginAngular,
      '@typescript-eslint': tseslint,
      prettier: pluginPrettier,
    },
    rules: {
      ...pluginAngular.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: parserAngular,
    },
    rules: {},
  },
  {
    ignores: ['**/*.spec.ts', 'coverage/*'],
  },
  prettier,
];
