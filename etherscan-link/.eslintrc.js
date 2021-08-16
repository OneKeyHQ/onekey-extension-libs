module.exports = {
  root: true,
  extends: [
  ],
  ignorePatterns: [
    '!.eslintrc.js',
    'dist/',
  ],
  overrides: [{
    extends: [
    ],
    files: [
      '.eslintrc.js',
      'test/**/*.js',
    ],
    parserOptions: {
      sourceType: 'script',
    },
  }, {
    extends: [
    ],
    files: ['**/*.ts'],
  }],
};
