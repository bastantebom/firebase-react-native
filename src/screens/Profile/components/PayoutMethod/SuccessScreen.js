import React, { useCallback } from 'react'
import { View, SafeAreaView } from 'react-native'

import { ScreenHeaderTitle, AppText } from '@/components'
import { normalize } from '@/globals'
import { SuccessPayout } from '@/assets/images'
import { CommonActions, useFocusEffect } from '@react-navigation/native'
import Button from '@/components/Button'

const Success = ({ navigation }) => {
  const backPressHandler = event => {
    if (navigation.isFocused()) {
      event.preventDefault()
      const state = navigation.dangerouslyGetState()
      const index = state.routes.findIndex(
        route => route.name === 'payout-method'
      )

      navigation.removeListener('beforeRemove', backPressHandler)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [...state.routes.slice(0, index), { name: 'payout-method' }],
        })
      )
    }
  }

  useFocusEffect(
    useCallback(() => {
      navigation.removeListener('beforeRemove', backPressHandler)
      navigation.addListener('beforeRemove', backPressHandler)

      return () => navigation.removeListener('beforeRemove', backPressHandler)
    }, [navigation])
  )

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScreenHeaderTitle close={() => navigation.goBack()} paddingSize={3} />
        <View
          style={{
            paddingHorizontal: normalize(24),
            height: '85%',
            justifyContent: 'space-between',
            paddingTop: normalize(24),
          }}>
          <View style={{ alignItems: 'center' }}>
            <SuccessPayout />
            <AppText
              textStyle="body1medium"
              customStyle={{
                marginTop: normalize(32),
                marginBottom: normalize(8),
              }}>
              Payout Method Successfully Saved
            </AppText>
            <AppText textStyle="body2" customStyle={{ textAlign: 'center' }}>
              Your future payouts will be deposited to your preferred payout
              method.
            </AppText>
          </View>
          <Button label="Okay" type="primary" onPress={navigation.goBack} />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Success
