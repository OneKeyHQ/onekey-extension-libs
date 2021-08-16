module.exports = {
  root: true,

  plugins: ['import'],

  extends: [],

  rules: {
    'prefer-object-spread': 'off',
  },

  overrides: [
    {
      files: ['*.ts'],
      extends: [],
    },
    {
      files: ['test/*'],
      extends: [],
    },
  ],

  ignorePatterns: ['!.eslintrc.js', '.nyc*', 'coverage/', 'dist/'],
};
