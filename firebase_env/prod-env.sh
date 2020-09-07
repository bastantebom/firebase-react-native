echo “Switching to Firebase prod environment”
yes | cp -rf prod/google-services.json ../android/app
yes | cp -rf prod/GoogleService-Info.plist ../ios
yes | cp -rf prod/Info.plist ../ios/servbees