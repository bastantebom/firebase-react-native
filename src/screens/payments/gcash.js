import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Alert,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native'
import Api from '@/services/Api'

import { Colors, normalize } from '@/globals'
import { LogoGCash } from '@/assets/images'
import { formatNumber } from 'react-native-currency-input'
import Button from '@/components/Button'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Icons } from '@/assets/images/icons'
import { iconSize } from '@/globals/Utils'
import typography from '@/globals/typography'
import Loader from '@/components/loader'

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

  const totalPrice =
    orderData.offer ||
    (orderData?.items || []).reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    )

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await Api.createPaymentSource({
        body: {
          amount: totalPrice * 100,
          type: 'gcash',
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
          sourceId: response.data.id,
          type: 'gcash',
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
        translucent={true}
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
            <Text style={[typography.body2, typography.medium]}>GCash</Text>
          </View>
        </View>
        <View style={styles.contentWrapper}>
          <View>
            <View
              style={{
                padding: normalize(30),
                justifyent: 'space-between',
                backgroundColor: Colors.neutralsWhite,
                elevation: 3,
                borderRadius: 4,
                marginBottom: normalize(24),
              }}>
              <View style={{ width: '100%', alignItems: 'center' }}>
                <LogoGCash width={normalize(150)} height={normalize(50)} />
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
                <Text style={[typography.caption, { color: Colors.icon }]}>
                  Amount
                </Text>
              </View>
            </View>
            <Text style={[typography.body2, typography.textCenter]}>
              Please confirm the transaction within
            </Text>
            <Text
              style={[
                typography.body2,
                typography.medium,
                typography.textCenter,
                { color: Colors.secondaryBrinkPink },
              ]}>
              15 minutes
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
export default GCashScreen

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: getStatusBarHeight(),
    backgroundColor: '#fff',
  },
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
  contentWrapper: {
    padding: normalize(24),
    paddingTop: 0,
    justifyContent: 'space-between',
    flex: 1,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
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
})
