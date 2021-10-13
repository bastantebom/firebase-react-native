import React, { useState } from 'react'
import {
  View,
  StatusBar,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Api from '@/services/Api'

import { Colors, normalize } from '@/globals'
import { LogoPaypal } from '@/assets/images'
import { formatNumber } from 'react-native-currency-input'
import Button from '@/components/Button'
import Loader from '@/components/loader'
import { Icons } from '@/assets/images/icons'
import { iconSize } from '@/globals/Utils'
import typography from '@/globals/typography'

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

  const totalPrice =
    orderData.offer ||
    (orderData?.items || []).reduce(
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

      if (response.success) {
        const link = response.data.links.find(
          link => link.rel === 'approval_url'
        )?.href

        navigation.navigate('payments', {
          screen: 'payment-webview',
          params: {
            orderId: orderData.id,
            link,
            amount: totalPrice,
            title: 'PayPal',
            type: 'paypal',
          },
        })
      } else throw new Error(response.message)
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
        backgroundColor="#EDF0F8"
      />
      <View style={styles.wrapper}>
        <Loader visible={isLoading} />
        <View style={styles.backgroundHeader} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>PayPal</Text>
          </View>
        </View>
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
                <LogoPaypal width={normalize(150)} height={normalize(50)} />
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={typography.display6}>
                  ₱
                  {formatNumber(totalPrice, {
                    separator: '.',
                    precision: 2,
                    delimiter: ',',
                  })}
                </Text>
                <Text
                  style={[
                    typography.caption,
                    { color: Colors.contentPlaceholder },
                  ]}>
                  Amount
                </Text>
              </View>
            </View>
            <Text style={[typography.body2, typography.textCenter]}>
              Please confirm the transaction within{'\n'}
              <Text style={typography.medium} color={Colors.red}>
                15 minutes
              </Text>
            </Text>
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
    backgroundColor: '#fff',
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
  header: {
    flexDirection: 'row',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
  },
})

export default PaypalScreen
