module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: [
    'json',
  ],
  extends: [
  ],
  overrides: [{
    files: [
      '*.js',
      '*.json',
    ],
    parserOptions: {
      sourceType: 'script',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  }],
  ignorePatterns: [
    '!eslintrc.js',
    'dist/',
    'node_modules/',
  ],
};
