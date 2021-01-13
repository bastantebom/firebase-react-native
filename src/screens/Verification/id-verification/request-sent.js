import React, { useEffect } from 'react'
import { View, SafeAreaView } from 'react-native'
import { AppText, AppButton } from '@/components'
import { Verification } from '@/assets/images'
import { normalize } from '@/globals'
/**
 * @typedef {Object} RootProps
 * @property {RequestSentProps} RequestSent
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'RequestSent'>} param0 */
export const RequestSentScreen = ({ navigation }) => {
  const backPressHandler = event => {
    event.preventDefault()
    navigation.navigate('NBTScreen', {
      screen: 'Verification',
      params: {
        screen: 'verification',
      },
    })
  }

  useEffect(() => {
    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.addListener('beforeRemove', backPressHandler)

    return () => navigation.removeListener('beforeRemove', backPressHandler)
  }, [navigation])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: normalize(24) }}>
        <View style={{ justifyContent: 'space-between', height: '100%' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Verification />
            <AppText textStyle="body2medium" customStyle={{ marginTop: 35 }}>
              Yay! We have everything we need.
            </AppText>
            <AppText
              textStyle="body2"
              customStyle={{
                textAlign: 'center',
                marginTop: 10,
              }}>
              Thanks for completing the verification process. We're currently
              validating all your info. You’re on the way to getting verified!
            </AppText>
          </View>
          <View>
            <AppButton
              text="Go to Dashboard"
              type="primary"
              onPress={() => {
                navigation.navigate('TabStack', {
                  screen: 'Servbees',
                })
              }}
              customStyle={{ marginBottom: normalize(20) }}
            />
            <AppButton
              text="Review Verification"
              type="secondary"
              onPress={() => {
                navigation.navigate('NBTScreen', {
                  screen: 'Verification',
                  params: {
                    screen: 'verification',
                  },
                })
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
