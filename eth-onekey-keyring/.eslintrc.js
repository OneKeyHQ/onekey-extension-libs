module.exports = {
  root: true,

  extends: [
  ],

  parser: 'babel-eslint',

  parserOptions: {
    ecmaVersion: 2017,
  },

  plugins: [
    'json',
    'import',
  ],

  overrides: [{
    files: [
      '.eslintrc.js',
    ],
    parserOptions: {
      sourceType: 'script',
    },
  }],

  ignorePatterns: ['dist'],
}
