import BaseAPI from '@/services/BaseAPI';
import Config from '@/services/Config';

import auth from '@react-native-firebase/auth';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';
import SignUpService from '@/services/SignUpService';

GoogleSignin.configure({
  webClientId: Config.prod.googleSignIn,
});

const loginMobile = (payload) => {
  return BaseAPI({
    url: 'user/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

async function facebookSignIn() {
  const result = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
  ]);
  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }
  const data = await AccessToken.getCurrentAccessToken();
  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  const facebookCredential = auth.FacebookAuthProvider.credential(
    data.accessToken,
  );
  auth()
    .signInWithCredential(facebookCredential)
    .then((result) => {
      console.log('Data', JSON.stringify(result));
      SignUpService.saveSocials({
        uid: result.user.uid,
        full_name: result.user.displayName,
      })
        .then((response) => {
          if (response.success) {
            console.log('SUCCESS');
          }
        })
        .catch((error) => {
          console.log('FAILED');
          console.log('With Error in the API Login ' + error);
        });
    })
    .catch((error) => {
      console.log('Error fetching data', error);
    });
}

async function googleLogin() {
  const {idToken} = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  auth()
    .signInWithCredential(googleCredential)
    .then((result) => {
      console.log('Data', JSON.stringify(result));
      SignUpService.saveSocials({
        uid: result.user.uid,
        full_name: result.user.displayName,
      })
        .then((response) => {
          if (response.success) {
            console.log('SUCCESS');
          }
        })
        .catch((error) => {
          console.log('FAILED');
          console.log('With Error in the API Login ' + error);
        });
    })
    .catch((error) => {
      console.log('Error fetching data', error);
    });
}

const LoginService = {
  loginMobile,
  facebookSignIn,
  googleLogin,
};

export default LoginService;
