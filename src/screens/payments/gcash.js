import React, { useState } from 'react'
import { View, StatusBar, StyleSheet, Alert } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Api from '@/services/Api'
import { AppText, ScreenHeaderTitle, TransitionIndicator } from '@/components'

import { Colors, normalize } from '@/globals'
import { LogoGCash } from '@/assets/images'
import { formatNumber } from 'react-native-currency-input'
import Button from '@/components/Button'

/**
 * @typedef {object} GCashProps
 * @property {object} orderData
 */

/**
 * @typedef {object} RootProps
 * @property {GCashProps} GCash
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'GCash'>} param0 */
const GCashScreen = ({ navigation, route }) => {
  const { orderData } = route.params
  const [isLoading, setIsLoading] = useState(false)

  const totalPrice = (orderData?.items || []).reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  )

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await Api.createSourcePayment({
        body: {
          amount: totalPrice * 100,
          type: 'gcash',
          currency: 'PHP',
          order_id: orderData.id,
        },
      })

      if (!response.success) throw new Error(response.message)
      navigation.navigate('payments', {
        screen: 'payment-webview',
        params: {
          orderId: orderData.id,
          link: response.data.redirect.checkout_url,
          amount: totalPrice,
          title: 'GCash',
        },
      })
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
    setIsLoading(false)
  }

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <View style={styles.wrapper}>
        <View style={styles.backgroundHeader} />

        <TransitionIndicator loading={isLoading} />
        <ScreenHeaderTitle
          close={navigation.goBack}
          title="GCash"
          paddingSize={3}
        />
        <View style={styles.contentWrapper}>
          <View>
            <View
              style={{
                paddingHorizontal: normalize(25),
                paddingBottom: normalize(25),
                justifyent: 'space-between',
                backgroundColor: Colors.neutralsWhite,
                elevation: 3,
                borderRadius: 4,
                marginBottom: normalize(24),
              }}>
              <View
                style={{
                  paddingTop: normalize(25),
                  width: '100%',
                  alignItems: 'center',
                  paddingBottom: normalize(15),
                }}>
                <LogoGCash width={normalize(150)} height={normalize(50)} />
              </View>
              <View style={{ alignItems: 'center' }}>
                <AppText textStyle="display6">
                  ₱
                  {formatNumber(totalPrice, {
                    separator: '.',
                    precision: 2,
                    delimiter: ',',
                  })}
                </AppText>
                <AppText textStyle="caption">Amount</AppText>
              </View>
            </View>
            <AppText textStyle="body2" customStyle={{ textAlign: 'center' }}>
              Please confirm the transaction within{'\n'}
              <AppText textStyle="body2medium" color={Colors.red}>
                15 minutes
              </AppText>
            </AppText>
          </View>

          <Button
            type={isLoading ? 'disabled' : 'primary'}
            disabled={isLoading}
            label="Proceed"
            onPress={handleSubmit}
          />
        </View>
      </View>
    </>
  )
}
export default GCashScreen

const styles = StyleSheet.create({
  border: {
    borderColor: '#cacbcc',
    borderWidth: 1,
    padding: 16,
    width: '100%',
    marginVertical: 16,
    borderRadius: 4,
  },
  wrapper: {
    flex: 1,
    marginTop: getStatusBarHeight(),
  },
  backgroundHeader: {
    backgroundColor: '#EDF0F8',
    height: normalize(170),
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    opacity: 1,
    zIndex: -1,
  },
  safeArea: { flex: 1 },
  contentWrapper: {
    padding: normalize(24),
    paddingTop: 0,
    justifyContent: 'space-between',
    flex: 1,
  },
})
