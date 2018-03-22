module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier'],
  env: {
    node: true,
    jest: true,
    jasmine: true,
  },
  rules: {
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'consistent-return': 'error',
    'operator-linebreak': ['error', 'before'],
    'no-console': 'off',
    strict: 'off',
    'import/prefer-default-export': 'off',
  },
};
