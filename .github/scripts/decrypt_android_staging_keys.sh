echo "$STAGING_KEYSTORE" > staging.keystore.asc 
gpg -d --passphrase="$STAGING_KEYSTORE_PASSPHRASE" --batch staging.keystore.asc > android/app/staging.keystore
rm staging.keystore.asc
