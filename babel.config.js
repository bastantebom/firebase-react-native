const rootImportOpts = {
  root: __dirname,
  rootPathPrefix: '@/',
  rootPathSuffix: 'src',
}

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: [
        'react-native-paper/babel',
        ['babel-plugin-root-import', rootImportOpts],
      ],
    },
  },
  plugins: [
    ['babel-plugin-root-import', rootImportOpts],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
}
