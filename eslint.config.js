// eslint.config.js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-n';
import promisePlugin from 'eslint-plugin-promise';

export default tseslint.config(
  // Ignorar pastas
  {
    ignores: ['dist', 'node_modules', 'coverage'],
  },
  // Configurações base
  eslint.configs.recommended,
  // Regras recomendadas para TypeScript com verificação de tipos (mais rigoroso)
  ...tseslint.configs.recommendedTypeChecked,
  // Regras de estilo para TypeScript (opcional)
  ...tseslint.configs.stylisticTypeChecked,
  // Configurações personalizadas
  {
    plugins: {
      import: importPlugin,
      n: nodePlugin,
      promise: promisePlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname, // diretório atual (ESM)
      },
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      // Importação
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      }],

      // Node.js
      'n/no-unsupported-features/es-syntax': ['error', {
        ignores: ['modules'], // Permite ES Modules
      }],

      // Promises
      'promise/always-return': 'error',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-native': 'off',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-callback-in-promise': 'warn',
      'promise/avoid-new': 'off',
      'promise/no-new-statics': 'error',
      'promise/no-return-in-finally': 'warn',
      'promise/valid-params': 'warn',
    },
    settings: {
      'import/resolver': {
        typescript: true, // Respeita aliases do tsconfig
        node: true,
      },
    },
  }
);