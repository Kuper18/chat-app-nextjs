import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
  ),
  {
    rules: {
      'no-param-reassign': 0,
      '@typescript-eslint/no-explicit-any': 'off',
      'no-useless-catch': 'off',
      'no-shadow': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'react/jsx-filename-extension': [
        2,
        { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      ],
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-no-constructed-context-values': 'off',
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      'import/prefer-default-export': 'off',
      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'arrow-body-style': 'off',
      'no-underscore-dangle': 'off',
      'no-use-before-define': 'off',
      'no-confusing-arrow': 'off',
      'no-restricted-syntax': 'off',
      'no-await-in-loop': 'off',
      camelcase: 'off',
    },
  },
];

export default eslintConfig;
