import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginReactNative from 'eslint-plugin-react-native';

export default  ([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react: pluginReact,
      'react-native': pluginReactNative,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactNative.configs.all.rules,

      // Custom overrides (optional)
      'react/react-in-jsx-scope': 'off', // not needed in React 17+
      'react-native/no-inline-styles': 'warn',
      'react-native/split-platform-components': 'warn',
    },
  },
]);
