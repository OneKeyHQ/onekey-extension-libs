module.exports = {
  root: true,

  extends: [],

  overrides: [
    {
      files: ['*.ts'],
      extends: [],
    },

    {
      files: ['*.js'],
      parserOptions: {
        sourceType: 'script',
      },
      extends: [],
    },

    {
      files: ['*.test.ts', '*.test.js'],
      extends: [],
    },
  ],

  ignorePatterns: ['!.eslintrc.js', 'dist/', 'dist-test/'],
};
