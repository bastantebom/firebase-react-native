module.exports = {
  root: true,
  plugins: ['prettier'],
  extends: ['@react-native-community', 'plugin:prettier/recommended'],
  rules: {
    'no-catch-shadow': 0,
    'prettier/prettier': [
      'error',
      {},
      {
        usePrettierrc: 'true',
      },
    ],
  },
}
