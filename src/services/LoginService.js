import BaseAPI from '@/services/BaseAPI';

import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';

GoogleSignin.configure({
  webClientId: '717890893531-jkj7upleeejblmrto3b4iktq6u5k90ti.apps.googleusercontent.com',
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
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }
  const data = await AccessToken.getCurrentAccessToken();
  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  return auth().signInWithCredential(facebookCredential);
}

async function googleLogin() {
  const { idToken } = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  return auth().signInWithCredential(googleCredential);
};

const LoginService = {
  loginMobile,
  facebookSignIn,
  googleLogin
};

export default LoginService;
