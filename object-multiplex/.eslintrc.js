module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
  },
  extends: [
    
  ],
  overrides: [
    {
      files: ['*.ts'],
      extends: [],
    },
  ],
  ignorePatterns: ['!eslintrc.js', 'dist/', 'node_modules/'],
};
