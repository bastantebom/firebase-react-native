import { Images } from '@/assets/images'
import Button from '@/components/Button'
import typography from '@/globals/typography'
import { normalize } from '@/globals/Utils'
import React from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { getStatusBarHeight } from 'react-native-status-bar-height'

/**
 * @typedef {object} TemperatureAboutScreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {TemperatureAboutScreenProps} TemperatureAboutScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'TemperatureAboutScreen'>} param0 */
const TemperatureAboutScreen = ({ navigation }) => {
  return (
    <>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor="#fff"
      />
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.content}>
          <Images.BodyTemp
            style={{ marginTop: normalize(48) }}
            height={normalize(277)}
            width="100%"
          />
          <View style={styles.contentWrapper}>
            <Text style={typography.body1}>Monitor your body temperature</Text>
            <Text style={[typography.caption, { marginTop: normalize(8) }]}>
              To comply with DTI and DOLE JOINT MEMORANDUM CIRCULAR NO. 20-04-A
              Series of 2020, everyone is highly encouraged to observe the
              COVID-19 health protocols and undergo temperature checks before
              delivering a service or product. If your temperature is at 37.5°C
              or higher, even after a 5-minute rest, it is best to stay home and
              get proper medication and care.
              {'\n\n'}
              Your safety is important to us. Let's work together in keeping our
              Servbees community safe and healthy.
            </Text>
          </View>
          <View style={styles.buttonsWrapper}>
            <Button
              style={{ width: '100%' }}
              label="Thanks, got it!"
              type="primary"
              onPress={navigation.goBack}
            />
          </View>
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
  content: {
    flex: 1,
  },
  contentWrapper: {
    paddingHorizontal: normalize(24),
    marginTop: normalize(32),
    flex: 1,
  },
  buttonsWrapper: {
    padding: normalize(24),
  },
})

export default TemperatureAboutScreen
