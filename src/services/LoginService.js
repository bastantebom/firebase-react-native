import BaseAPI from '@/services/BaseAPI'
import Config from '@/services/Config'

import auth from '@react-native-firebase/auth'
import { AccessToken, LoginManager } from 'react-native-fbsdk'
import { GoogleSignin } from '@react-native-community/google-signin'
import { appleAuth } from '@invertase/react-native-apple-authentication'

import Api from '@/services/Api'
import { Alert } from 'react-native'

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

          return {
            ...auth.AppleAuthProvider.credential(identityToken, nonce),
            fullName: appleAuthResponse.fullName,
          }
        }
      }
    })()

    let full_name
    if (provider === 'apple')
      full_name = `${credential.fullName.givenName} ${credential.fullName.familyName}`
    delete credential.fullName

    const authResponse = await auth().signInWithCredential(credential)
    if (provider !== 'apple') full_name = authResponse.user.displayName
    const uid = authResponse.user.uid
    const { email } = authResponse.user
    const response = await Api.saveSocials({
      body: {
        uid,
        full_name,
        email,
        provider,
      },
    })

    if (!response.success && response.message !== 'Account already exist')
      throw new Error(response.message)
  } catch (error) {
    console.log(error)
    if (~error.message?.indexOf('already exist'))
      throw new Error(error.message.slice(error.message.indexOf(']') + 1))
  }
}

const LoginService = {
  loginMobile,
  signInWithProvider,
}

export default LoginService
