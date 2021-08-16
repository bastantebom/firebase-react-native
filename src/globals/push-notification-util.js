import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import messaging from '@react-native-firebase/messaging'
import firestore from '@react-native-firebase/firestore'

export const registerDeviceToken = async () => {
  try {
    const authStatus = await messaging().requestPermission()
    const enabled = [
      messaging.AuthorizationStatus.AUTHORIZED,
      messaging.AuthorizationStatus.PROVISIONAL,
    ].includes(authStatus)

    if (enabled) return await messaging().getToken()

    return ''
  } catch (error) {
    console.log(error || error?.message)
  }
}

export const createPushNotificationChannels = () => {
  const channelList = ['follow', 'announcement', 'messages']

  channelList.forEach(channel => {
    PushNotification.createChannel(
      {
        channelId: channel,
        channelName: channel,
        playSound: true,
        soundName: 'default',
        channelDescription: 'Notifications for Servbees',
        importance: 4,
        vibrate: true,
      },
      () => {}
    )
  })
}

export const initPushNotifications = () => {
  PushNotification.configure({
    onRegister: () => {},
    onNotification: notification => {
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    },
    onAction: () => {},
    onRegistrationError: () => {},
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    requestPermissions: false,
  })
}

export const getDeviceToken = async userInfo => {
  if (!userInfo?.uid) return
  const deviceTokenRef = firestore()
    .collection('devices_token')
    .doc(userInfo.uid)
    .collection('tokens')

  const snapshot = await deviceTokenRef.get()
  let tokens = []
  if (snapshot.size) {
    tokens = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }
  return tokens
}

export const saveDeviceToken = async (token, userInfo) => {
  if (!userInfo?.uid || !token) return

  const deviceTokenRef = firestore()
    .collection('devices_token')
    .doc(userInfo.uid)
    .collection('tokens')

  const date = firestore.Timestamp.fromDate(new Date())
  await deviceTokenRef.doc(token).set({ date })
}
