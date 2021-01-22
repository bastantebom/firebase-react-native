import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, StyleSheet, Alert } from 'react-native'
import Api from '@/services/Api'
import {
  AppButton,
  AppCheckbox,
  AppText,
  PaddingView,
  ScreenHeaderTitle,
  TransitionIndicator,
} from '@/components'

import { Colors, normalize } from '@/globals'
import { LogoPaypal } from '@/assets/images'
import { commaSeparate } from '@/globals/Utils'

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

  const [terms, setTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const totalPrice = orderData.items.reduce(
    (total, item) => total + +(item.price * item.quantity),
    0
  )

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await Api.createPaypalPayment({
        body: {
          amount: totalPrice,
          currency: 'PHP',
          order_id: orderData.id,
        },
      })

      navigation.navigate('payments', {
        screen: 'payment-webview',
        params: {
          link: response.links[1].href,
          amount: totalPrice,
          title: 'Paypal',
        },
      })
    } catch (error) {
      console.log(error.message)
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
              disabled={!terms}
              onPress={handleSubmit}
              customStyle={{
                backgroundColor: !terms
                  ? Colors.neutralsZirconLight
                  : Colors.primaryYellow,
                borderColor: !terms
                  ? Colors.neutralsZirconLight
                  : Colors.primaryYellow,
              }}
            />
          </View>
        </PaddingView>
      </SafeAreaView>
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
