import React, { useState } from 'react'
import { View, SafeAreaView, StyleSheet, Alert } from 'react-native'
import Api from '@/services/Api'
import {
  AppButton,
  AppCheckbox,
  AppText,
  ScreenHeaderTitle,
  TransitionIndicator,
} from '@/components'

import { Colors, normalize } from '@/globals'
import { LogoGCash } from '@/assets/images'
import { commaSeparate } from '@/globals/Utils'

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
  const [terms, setTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const totalPrice = orderData.items.reduce(
    (total, item) =>
      total + +(parseFloat((item.price + '').replace(/,/, '')) * item.quantity),
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
      <View style={styles.backgroundHeader} />
      <SafeAreaView style={styles.safeArea}>
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
                  ₱{commaSeparate(totalPrice)}
                </AppText>
                <AppText textStyle="caption">Amount</AppText>
              </View>
              <View style={[styles.border, { marginBottom: 25 }]}>
                <AppText
                  textStyle="caption"
                  customStyle={{ textAlign: 'center' }}>
                  Reference No. / Payment ID: {orderData.id}
                </AppText>
              </View>
            </View>
            <AppText textStyle="body2" customStyle={{ textAlign: 'center' }}>
              Please confirm the transaction within{'\n'}
              <AppText textStyle="body2medium" color={Colors.red}>
                15 minutes
              </AppText>
            </AppText>
          </View>

          <View>
            <View style={{ flexDirection: 'row' }}>
              <AppCheckbox
                Icon=""
                label=""
                value={terms}
                valueChangeHandler={setTerms}
                style={{
                  paddingLeft: 0,
                  marginRight: 5,
                  paddingTop: 0,
                  backgroundColor: 'transparent',
                }}
              />
              <AppText
                textStyle="body2"
                customStyle={{
                  maxWidth: '90%',
                  paddingBottom: 20,
                }}>
                Check here to indicate that you have read and agree to
                Paymongo/Servbees’s Privacy Notice before providing your details
              </AppText>
            </View>
            <AppButton
              text="Proceed"
              type="primary"
              disabled={!terms || isLoading}
              onPress={handleSubmit}
              customStyle={{
                backgroundColor:
                  !terms || isLoading
                    ? Colors.neutralsZirconLight
                    : Colors.primaryYellow,
                borderColor:
                  !terms || isLoading
                    ? Colors.neutralsZirconLight
                    : Colors.primaryYellow,
              }}
            />
          </View>
        </View>
      </SafeAreaView>
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
