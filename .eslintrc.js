module.exports = {
  root: true,
  plugins: ['prettier'],
  extends: ['@react-native-community', 'plugin:prettier/recommended'],
  rules: {
    'no-catch-shadow': 0,
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-var': 0,
    'prettier/prettier': [
      'error',
      {},
      {
        usePrettierrc: 'true',
      },
    ],
  },
}
