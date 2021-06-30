const shell = require('shelljs')
const env = process.env.APP_ENV || 'development'

shell.exec('yarn --production=false install')
if (env === 'production') shell.exec('yarn generate:services:prod')
else if (env === 'production') shell.exec('yarn generate:services:staging')

shell.cd('./android')
shell.exec('./gradlew clean')
shell.cd('../')

if (env === 'staging')
  shell.exec(
    `APP_ENV=${env} npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/staging/assets/index.android.bundle`
  )
else
  shell.exec(
    `APP_ENV=${env} npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/release/assets/index.android.bundle`
  )

shell.cd('./android')
if (env === 'staging') shell.exec('./gradlew assembleStaging')
else shell.exec('./gradlew assembleRelease')
