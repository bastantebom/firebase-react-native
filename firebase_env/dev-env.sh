echo “Switching to Firebase dev environment”
yes | cp -rf dev/google-services.json ../android/app
yes | cp -rf dev/GoogleService-Info.plist ../ios
yes | cp -rf dev/Info.plist ../ios/servbees