echo “Switching to Firebase staging environment”
yes | cp -rf staging/google-services.json ../android/app
yes | cp -rf staging/GoogleService-Info.plist ../ios
yes | cp -rf staging/Info.plist ../ios/servbees
