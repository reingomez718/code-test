module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  env: {
    browser: true,
    commonjs: true
  },
  globals: {
    Rmodules: false
  },
  extends: 'eslint:recommended',
  rules: {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ]
  }
};
