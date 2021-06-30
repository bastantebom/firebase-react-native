echo "$RELEASE_KEYSTORE" > my-upload-key.keystore.asc 
gpg -d --passphrase="$RELEASE_KEYSTORE_PASSPHRASE" --batch my-upload-key.keystore.asc > android/app/my-upload-key.keystore 
rm my-upload-key.keystore.asc 
