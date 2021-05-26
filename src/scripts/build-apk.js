const shell = require('shelljs')
const env = process.env.APP_ENV || 'development'

shell.exec('yarn --production=false install')
if (env === 'production') shell.exec('yarn generate:services:prod')

shell.cp(
  '-rf',
  `./firebase_env/${
    env === 'production' ? 'prod' : 'dev'
  }/google-services.json`,
  './android/app'
)

shell.cd('./android')
shell.exec('./gradlew clean')
shell.cd('../')
shell.exec(
  `APP_ENV=${env} npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle`
)
shell.cd('./android')
shell.exec('./gradlew assembleRelease')
