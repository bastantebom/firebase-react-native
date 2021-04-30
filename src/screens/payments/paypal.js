import React, { useState } from 'react'
import { View, StatusBar, StyleSheet, Alert } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Api from '@/services/Api'
import {
  AppText,
  PaddingView,
  ScreenHeaderTitle,
  TransitionIndicator,
} from '@/components'

import { Colors, normalize } from '@/globals'
import { LogoPaypal } from '@/assets/images'
import { formatNumber } from 'react-native-currency-input'
import Button from '@/components/Button'

/**
 * @typedef {object} PaypalProps
 * @property {object} orderData
 */

/**
 * @typedef {object} RootProps
 * @property {PaypalProps} Paypal
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'Paypal'>} param0 */
const PaypalScreen = ({ navigation, route }) => {
  const { orderData } = route.params

  const [isLoading, setIsLoading] = useState(false)

  const totalPrice = (orderData?.items || []).reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  )

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const paypalItems = []
      orderData.items.map(item =>
        paypalItems.push({
          name: item.title,
          sku: item.title,
          price: item.price,
          currency: 'PHP',
          quantity: item.quantity || 1,
        })
      )

      const response = await Api.createPaypalPayment({
        body: {
          amount: totalPrice,
          currency: 'PHP',
          order_id: orderData.id,
          items: paypalItems,
        },
      })

      if (response.success)
        navigation.navigate('payments', {
          screen: 'payment-webview',
          params: {
            orderId: orderData.id,
            link: response.data.links[1].href,
            amount: totalPrice,
            title: 'PayPal',
          },
        })
      else throw new Error(response.message)
    } catch (error) {
      console.log(error.message)
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
          title="PayPal"
          paddingSize={3}
        />
        <PaddingView
          paddingSize={3}
          style={{
            paddingTop: 0,
            justifyContent: 'space-between',
            flex: 1,
          }}>
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
                <LogoPaypal width={normalize(150)} height={normalize(50)} />
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
        </PaddingView>
      </View>
    </>
  )
}

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

export default PaypalScreen
