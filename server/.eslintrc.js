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
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    strict: 'off',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'error',
  },
};
