module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'prettier/react', 'plugin:react/recommended'],
  env: {
    node: true,
    jest: true,
    jasmine: true,
    browser: true,
    es6: true,
  },
  rules: {
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'consistent-return': 'error',
    'operator-linebreak': ['error', 'before'],
    'no-console': 'off',
    strict: 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/prefer-stateless-function': [0, { ignorePureComponents: true }],
    'jsx-a11y/anchor-is-valid': [
      1,
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
  },
};
