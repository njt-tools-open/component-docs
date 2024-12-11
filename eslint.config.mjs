import pluginJs from '@eslint/js';

import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{ts,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      '**/node_modules/**/*',
      '**/lib/**/*',
      '**/bin/**/*',
      '**/.s25c/**/*',
      'eslint.config.mjs',
      'packages/solidjs-component-docs-creator/public/**/*',
      'packages/solidjs-component-docs-creator/resources/**/*',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      quotes: ['error', 'single'],
      semi: 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];
