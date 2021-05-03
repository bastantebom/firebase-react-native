import React from 'react'
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
import { ScrollView } from 'react-native-gesture-handler'

/**
 * @typedef {object} SelectPayoutMethodScreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {SelectPayoutMethodScreenProps} SelectPayoutMethodScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'SelectPayoutMethodScreen'>} param0 */
const SelectPayoutMethodScreen = ({ navigation }) => {
  const payoutMethods = [
    {
      value: 'gcash',
      label: 'GCash',
      title: 'Add your existing GCash account details',
      info:
        'Additional Fees: May include fees\nProcessing time: Within 24 hours',
      icon: <Icons.GCashPayment />,
    },
    {
      value: 'bank',
      label: 'Bank',
      title: 'Add your existing bank account details',
      info:
        'Additional Fees: May include fees\nProcessing time: Within 24 hours',
      icon: <Icons.Bank />,
    },
    {
      value: 'paypal',
      label: 'PayPal',
      title: 'Add your existing PayPal account details',
      info:
        'Additional Fees: May include fees\nProcessing time: Get paid in 3-5 business days.',
      icon: <Icons.PayPalPayment />,
    },
  ]

  const handleOnCardPress = ({ value }) => {
    navigation.navigate('set-payout-method', {
      method: value,
    })
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content}>
          <Text
            style={[
              typography.body1,
              { color: Colors.primaryMidnightBlue, marginBottom: normalize(4) },
            ]}>
            Select your payout method
          </Text>
          <Text style={typography.caption}>
            This is where your future payouts will be deposited weekly on
            Thursday for payments made using credit/debit, e-wallets, and
            PayPal.
          </Text>

          <View style={styles.payoutMethodCards}>
            {payoutMethods.map(method => (
              <TouchableOpacity
                onPress={() => handleOnCardPress(method)}
                activeOpacity={0.7}
                key={method.value}
                style={styles.payoutMethodCard}>
                <View style={styles.payoutMethodCardHeader}>
                  {method.icon}
                  <Text
                    style={[
                      typography.body2,
                      typography.medium,
                      { flex: 1, marginLeft: normalize(10) },
                    ]}>
                    {method.label}
                  </Text>
                  <Icons.ChevronRight style={{ color: Colors.icon }} />
                </View>
                <Text
                  style={[
                    typography.body2,
                    typography.medium,
                    { marginTop: normalize(2) },
                  ]}>
                  {method.title}
                </Text>
                <Text
                  style={[
                    typography.caption,
                    {
                      color: Colors.contentPlaceholder,
                      marginTop: normalize(2),
                    },
                  ]}>
                  Additional Fees: May include fees {'\n'}Processing time:
                  Within 24 hours
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{ flexDirection: 'row', paddingVertical: normalize(16) }}>
            <Icons.Lock width={normalize(24)} height={normalize(24)} />
            <Text
              style={[
                typography.caption,
                {
                  marginLeft: 12,
                  maxWidth: '90%',
                },
              ]}>
              Your account details is securely stored and will never be shared
              to other Servbees users.
            </Text>
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
  payoutMethodCards: {
    marginTop: normalize(32),
  },
  payoutMethodCard: {
    padding: normalize(18),
    borderWidth: normalize(1),
    borderColor: Colors.neutralGray,
    borderRadius: normalize(4),
    marginBottom: normalize(16),
  },
  payoutMethodCardHeader: {
    flexDirection: 'row',
  },
})

export default SelectPayoutMethodScreen
