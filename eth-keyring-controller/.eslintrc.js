module.exports = {

  root: true,

  parserOptions: {
    'ecmaVersion': 2017,
  },

  extends: [
  ],

  plugins: [
    'json',
  ],

  globals: {
    'window': true,
  },

  overrides: [{
    files: [
      '.eslintrc.js',
    ],
    parserOptions: {
      sourceType: 'script',
    },
  }],
}
