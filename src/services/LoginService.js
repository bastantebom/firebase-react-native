import BaseAPI from '@/services/BaseAPI'
import Config from '@/services/Config'

import auth from '@react-native-firebase/auth'
import { AccessToken, LoginManager } from 'react-native-fbsdk'
import { GoogleSignin } from '@react-native-community/google-signin'
import { appleAuth } from '@invertase/react-native-apple-authentication'

import SignUpService from '@/services/SignUpService'

GoogleSignin.configure({
  webClientId: Config.local.googleSignIn,
})

const loginMobile = payload => {
  return BaseAPI({
    url: 'users/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  })
}

const signInWithProvider = async provider => {
  try {
    let credential = await (async () => {
      switch (provider) {
        case 'facebook': {
          const result = await LoginManager.logInWithPermissions([
            'public_profile',
            'email',
          ])

          if (result.isCancelled)
            throw new Error('User cancelled the login process')

          const { accessToken } = await AccessToken.getCurrentAccessToken()

          if (!accessToken)
            throw new Error('Something went wrong obtaining access token')

          return auth.FacebookAuthProvider.credential(data.accessToken)
        }
        case 'google': {
          const { idToken } = await GoogleSignin.signIn()
          return auth.GoogleAuthProvider.credential(idToken)
        }
        case 'apple': {
          const appleAuthResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          })

          const { identityToken, nonce } = appleAuthResponse
          if (!identityToken)
            throw new Error('Apple Sign-In failed - no identify token returned')

          return auth.AppleAuthProvider.credential(identityToken, nonce)
        }
      }
    })()

    const authResponse = await auth().signInWithCredential(credential)
    const {
      uid,
      displayName: full_name,
      additionalUserInfo: { profile },
    } = authResponse.user
    const response = await SignUpService.saveSocials({
      uid,
      full_name,
      email: profile.email,
      provider,
    })

    if (!response.success) throw new Error(response.message)
  } catch (error) {
    console.log(error)
  }
}

const LoginService = {
  loginMobile,
  signInWithProvider,
}

export default LoginService
