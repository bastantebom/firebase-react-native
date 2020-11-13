import BaseAPI from '@/services/BaseAPI'
import Config from '@/services/Config'

import auth from '@react-native-firebase/auth'
import { AccessToken, LoginManager } from 'react-native-fbsdk'
import { GoogleSignin } from '@react-native-community/google-signin'
import { appleAuth } from '@invertase/react-native-apple-authentication'

import SignUpService from '@/services/SignUpService'
import AsyncStorage from '@react-native-community/async-storage'

GoogleSignin.configure({
  webClientId: Config.dev.googleSignIn,
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

          return auth.FacebookAuthProvider.credential(accessToken)
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
    const uid = authResponse.user.uid
    const { displayName: full_name, email } = authResponse.user
    const response = await SignUpService.saveSocials({
      uid,
      full_name,
      email,
      provider,
    })

    if (!response.success && response.message !== 'Account already exist')
      throw new Error(response.message)
  } catch (error) {
    console.log(error)
  }
}

const LoginService = {
  loginMobile,
  signInWithProvider,
}

export default LoginService
