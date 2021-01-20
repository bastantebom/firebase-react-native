import React from 'react'
import { View, SafeAreaView } from 'react-native'

import { ScreenHeaderTitle, AppText, AppButton } from '@/components'
import { normalize } from '@/globals'
import { SuccessPayout } from '@/assets/images'

const Success = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScreenHeaderTitle
          close={() => navigation.goBack()}
          iconSize={normalize(20)}
          paddingSize={3}
        />
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
          <AppButton
            onPress={() => {
              navigation.navigate('Profile')
            }}
            text="Okay"
            type="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Success
