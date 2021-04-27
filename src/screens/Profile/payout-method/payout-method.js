import React, { useCallback, useEffect, useState } from 'react'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Icons } from '@/assets/images/icons'
import { iconSize } from '@/globals/Utils'
import { Images } from '@/assets/images'
import Button from '@/components/Button'
import Loader from '@/components/loader'
import Api from '@/services/Api'
import { useFocusEffect } from '@react-navigation/native'

/**
 * @typedef {object} PayoutMethodScreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {PayoutMethodScreenProps} PayoutMethodScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'PayoutMethodScreen'>} param0 */
const PayoutMethodScreen = ({ navigation }) => {
  const [payoutMethod, setPayoutMethod] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const init = async () => {
    try {
      setIsLoading(true)
      const result = await Api.getPayoutMethod()
      if (!result.success) throw new Error(result.message)
      setPayoutMethod(result.data)
    } catch (error) {
      console.log(error.message)
    }
    setIsLoading(false)
  }

  const renderPayoutMethodIcon = () => {
    if (!payoutMethod) return

    switch (payoutMethod.method?.toLowerCase?.()) {
      case 'gcash':
        return <Icons.GCashActive />
      case 'paypal':
        return <Icons.PaypalActive />
      default:
        return <Icons.BankActive />
    }
  }

  const handleOnSetPayoutMethodPress = () => {
    navigation.navigate('select-payout-method')
  }

  useFocusEffect(
    useCallback(() => {
      init()
    }, [navigation])
  )

  const methodLabel = {
    gcash: 'GCash',
    Bank: 'Bank',
    paypal: 'PayPal',
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <Loader style={{ backgroundColor: '#fff' }} visible={isLoading} />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>
              Payout Method
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          {!!payoutMethod ? (
            <>
              <Text
                style={[
                  typography.body1,
                  { color: Colors.primaryMidnightBlue },
                ]}>
                Your preferred payout method
              </Text>
              <Text
                style={[
                  typography.caption,
                  { color: Colors.contentPlaceholder, marginTop: normalize(4) },
                ]}>
                This is where your payments paid via Credit/Debit, GCash,
                GrabPay, or PayPal will be credited.
              </Text>

              <View style={styles.payoutInput}>
                {renderPayoutMethodIcon()}
                <Text style={[typography.body2, { marginLeft: normalize(10) }]}>
                  <Text style={typography.medium}>
                    {methodLabel[payoutMethod.method?.toLowerCase?.()]}
                  </Text>{' '}
                  {!!payoutMethod.account_number.length
                    ? payoutMethod.account_number
                    : payoutMethod.email_address}
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  marginTop: normalize(12),
                }}
                activeOpacity={0.7}
                onPress={handleOnSetPayoutMethodPress}>
                <Text
                  style={[
                    typography.body2,
                    typography.medium,
                    typography.link,
                  ]}>
                  Change payout method
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.imageWrapper}>
                <Images.NoPayoutMethod />
              </View>
              <Text
                style={[
                  typography.body1,
                  typography.medium,
                  typography.textCenter,
                ]}>
                Add your preferred payout method
              </Text>
              <Text
                style={[
                  typography.body2,
                  typography.textCenter,
                  {
                    marginTop: normalize(8),
                  },
                ]}>
                The orders paid via Credit/Debit, GCash, GrabPay, or PayPal are
                credited to your preferred payout method after an order has been
                completed and the payment becomes eligible for payout.
              </Text>
              <View style={styles.infoWrapper}>
                <Text style={typography.caption}>
                  After your payment has been credited, you should receive a
                  confirmation via notification, SMS, or email.
                </Text>
              </View>
            </>
          )}
        </View>
        {!payoutMethod && (
          <View style={styles.buttonsWrapper}>
            <Button
              onPress={handleOnSetPayoutMethodPress}
              type="primary"
              label="Add payout method"
            />
          </View>
        )}
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
  content: {
    flex: 1,
    padding: normalize(24),
  },
  imageWrapper: {
    alignItems: 'center',
    marginTop: normalize(32),
    marginBottom: normalize(8),
  },
  infoWrapper: {
    backgroundColor: Colors.secondarySolitude,
    padding: normalize(16),
    borderRadius: normalize(8),
    marginTop: normalize(12),
  },
  buttonsWrapper: {
    padding: normalize(24),
  },
  payoutInput: {
    flexDirection: 'row',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(14),
    borderWidth: normalize(1),
    borderColor: Colors.neutralGray,
    borderRadius: normalize(4),
    marginTop: normalize(32),
  },
})

export default PayoutMethodScreen
