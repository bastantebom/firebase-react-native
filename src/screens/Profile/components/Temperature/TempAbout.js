import React from 'react'
import { View, SafeAreaView, ScrollView } from 'react-native'

import { PaddingView, AppText, AppButton } from '@/components'

import { BodyTemp } from '@/assets/images'
import { normalize, Colors } from '@/globals'

const TempAbout = ({ toggleTempAbout }) => {
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <PaddingView paddingSize={3} style={{ flex: 1 }}>
            <BodyTemp />
            <View>
              <AppText
                textStyle="body1"
                customStyle={{ marginBottom: 4, marginTop: normalize(15) }}>
                Monitor your body temperature
              </AppText>
              <AppText textStyle="caption" customStyle={{ marginBottom: 24 }}>
                To comply with DTI and DOLE JOINT MEMORANDUM CIRCULAR NO.
                20-04-A Series of 2020, everyone is highly encouraged to observe
                the COVID-19 health protocols and undergo temperature checks
                before delivering a service or product. If your temperature is
                at 37.5°C or higher, even after a 5-minute rest, it is best to
                stay home and get proper medication and care.
              </AppText>

              <AppText textStyle="caption" customStyle={{ marginBottom: 24 }}>
                Your safety is important to us. Let's work together in keeping
                our Servbees community safe and healthy.
              </AppText>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <AppButton
                text="Thanks, got it!"
                type="primary"
                size="l"
                height="xl"
                onPress={toggleTempAbout}
                customStyle={{ marginTop: normalize(20) }}
              />
            </View>
          </PaddingView>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default TempAbout
