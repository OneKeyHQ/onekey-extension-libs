module.exports = {
  root: true,
  extends: [],
  overrides: [
    {
      files: ['*.js'],
      env: {
        commonjs: true,
      },
    },
    {
      files: ['*.ts'],
      extends: [],
    },
  ],
  ignorePatterns: ['!.eslintrc.js', 'dist/'],
};
