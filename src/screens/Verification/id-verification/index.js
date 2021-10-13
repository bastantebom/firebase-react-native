import React, { useContext, useState } from 'react'
import { Icons } from '@/assets/images/icons'
import {
  AppButton,
  AppText,
  PaddingView,
  ScreenHeaderTitle,
  TransitionIndicator,
} from '@/components'
import { Colors, normalize } from '@/globals'
import { SafeAreaView, View, Platform } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { IdVerify } from '@/assets/images'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import IdTypeScreen from './id-type'
import CaptureIdScreen from './capture-id'
import { CaptureSelfieInfoScreen, CaptureSelfieScreen } from './capture-selfie'
import { RequestSentScreen } from './request-sent'
import storage from '@react-native-firebase/storage'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'

/** @param {import('@react-navigation/stack').StackScreenProps<{}, 'IdVerification'>} param0 */
const IdVerificationScreen = ({ navigation }) => {
  const { user } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)
  const requestData = {
    id: {
      type: '',
      image_url: '',
    },
    selfie: {
      image_url: '',
    },
  }

  const onIdPhotoSubmit = uri => {
    requestData.id.image_url = uri
    navigation.navigate('capture-selfie-info', { onSubmit: onSelfieSubmit })
  }

  const onIdTypeSelect = type => {
    requestData.id.type = type
    navigation.navigate('capture-id', {
      type,
      onSubmit: onIdPhotoSubmit,
    })
  }

  const onSelfieSubmit = uri => {
    requestData.selfie.image_url = uri
    submitRequest()
  }

  const submitRequest = async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        uploadImage(requestData.id.image_url).then(
          url => (requestData.id.image_url = url)
        ),
        uploadImage(requestData.selfie.image_url).then(
          url => (requestData.selfie.image_url = url)
        ),
      ])

      const response = await Api.verifyAccount({
        body: requestData,
      })

      if (!response.success) throw new Error(response.message)

      navigation.navigate('request-sent')
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
  }

  const uploadImage = async uri => {
    const fileName = [...Array(24)]
      .map(() => (~~(Math.random() * 36)).toString(36))
      .join('')
    const ref = storage()
      .ref(`${user.uid}/verification-requests/images`)
      .child(fileName)
    await ref.putFile(Platform.OS === 'ios' ? uri.replace('file://', '') : uri)

    return await ref.getDownloadURL()
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TransitionIndicator loading={isLoading} />

      <View style={{ padding: normalize(24) }}>
        <ScreenHeaderTitle close={navigation.goBack} />
      </View>

      <ScrollView>
        <IdVerify />
        <View style={{ padding: normalize(24) }}>
          <AppText
            textStyle="body1"
            customStyle={{
              marginBottom: normalize(8),
              marginTop: normalize(16),
            }}>
            Verify Your Identity
          </AppText>
          <AppText
            textStyle="body2"
            customStyle={{
              color: Colors.contentPlaceholder,
              fontSize: normalize(14),
              lineHeight: normalize(21),
            }}>
            Let's keep Servbees secure for you and all Buzzybees. Verify your
            account by uploading a government-issued valid ID. It will also help
            your customer feel more secure during transactions.
          </AppText>

          <View style={{ flexDirection: 'row', marginTop: 30 }}>
            <Icons.Lock width={normalize(24)} height={normalize(24)} />
            <AppText
              textStyle="caption"
              customStyle={{
                fontSize: normalize(12),
                lineHeight: normalize(18),
                marginLeft: 12,
                maxWidth: '90%',
              }}>
              Your personal information will never be shared to other Servbees
              users.
            </AppText>
          </View>
        </View>

        <PaddingView paddingSize={3}>
          <AppButton
            text="Next"
            type="primary"
            onPress={() =>
              navigation.navigate('id-type', {
                onSelect: onIdTypeSelect,
              })
            }
          />
        </PaddingView>
      </ScrollView>
    </SafeAreaView>
  )
}

const IdVerificationStack = () => {
  const Stack = createStackNavigator()
  const defaultScreenOptions = {
    cardStyle: {
      backgroundColor: '#fff',
    },
  }

  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name="id-verification"
        component={IdVerificationScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="id-type"
        component={IdTypeScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="capture-id"
        component={CaptureIdScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="capture-selfie-info"
        component={CaptureSelfieInfoScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="capture-selfie"
        component={CaptureSelfieScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="request-sent"
        component={RequestSentScreen}
        options={defaultScreenOptions}
      />
    </Stack.Navigator>
  )
}

export default IdVerificationStack
