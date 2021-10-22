import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import {
  Image,
  ScrollView,
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
import StatusBar from '@/components/StatusBar'
import utilStyles from '@/globals/util-styles'
import TextInput from '@/components/textinput'
import firestore from '@react-native-firebase/firestore'
import { UserContext } from '@/context/UserContext'
import { banks } from './banks'

/**
 * @typedef {object} PayoutMethodScreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {PayoutMethodScreenProps} PayoutMethodScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'PayoutMethodScreen'>} param0 */
const PayoutMethodScreen = ({ navigation }) => {
  const { user } = useContext(UserContext)
  const [payoutMethods, setPayoutMethods] = useState([])
  const [paymongoAccount, setPaymongoAccount] = useState(null)
  const [paypalAccount, setPaypalAccount] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleOnSetPayoutMethodPress = () => {
    navigation.navigate('add-payout-method')
  }

  const setPayoutMethod = method => {
    const params = { method }
    if (
      ['gcash', 'bank'].includes(method) &&
      ['gcash', 'bank'].includes(paymongoAccount?.method)
    )
      params.payoutMethodData = paymongoAccount
    else if (method === 'paypal' && paypalAccount)
      params.payoutMethodData = paypalAccount
    navigation.navigate('set-payout-method', params)
  }

  const getBankIcon = bankName => {
    const bank = banks.find(({ label }) => label === bankName)

    return bank ? (
      <Image
        style={[
          styles.bankIcon,
          {
            borderWidth: bank.withBorder ? 1 : 0,
          },
        ]}
        source={bank.icon}
      />
    ) : null
  }

  useEffect(() => {
    const existingPaymongoAccount = payoutMethods.find(({ method }) =>
      ['gcash', 'bank'].includes(method)
    )
    const existingPaypalAccount = payoutMethods.find(
      ({ method }) => method === 'paypal'
    )
    setPaymongoAccount(existingPaymongoAccount)
    setPaypalAccount(existingPaypalAccount)
  }, [payoutMethods])

  useEffect(() => {
    setIsLoading(true)

    return firestore()
      .collection('payout_methods')
      .where('uid', '==', user.uid)
      .onSnapshot(snap => {
        if (isLoading) setIsLoading(false)
        setPayoutMethods(snap.docs.map(doc => doc.data()) || [])
      })
  }, [])

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
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
              Payout Methods
            </Text>
          </View>
        </View>
        {!paymongoAccount && !paypalAccount ? (
          <>
            <ScrollView contentContainerStyle={styles.content}>
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
                <Text style={[typography.body2, typography.medium]}>
                  How to get your payout:
                </Text>
                <View style={[utilStyles.row, { marginTop: normalize(8) }]}>
                  <Text
                    style={[typography.body2, { marginRight: normalize(8) }]}>
                    1.
                  </Text>
                  <Text style={typography.body2}>
                    Set your preferred payout method: Debit Card, GCash, or
                    PayPal.
                  </Text>
                </View>
                <View style={[utilStyles.row, { marginTop: normalize(8) }]}>
                  <Text
                    style={[typography.body2, { marginRight: normalize(8) }]}>
                    2.
                  </Text>
                  <Text style={typography.body2}>
                    Payouts are automatically credited to your account weekly,
                    every Friday.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  utilStyles.flex1,
                  utilStyles.alignCenter,
                  utilStyles.justifyCenter,
                  { marginTop: normalize(4) },
                ]}>
                <Text
                  style={[
                    typography.body2,
                    typography.medium,
                    typography.link,
                  ]}>
                  Learn more about payouts
                </Text>
              </TouchableOpacity>
            </ScrollView>
            <View style={styles.buttonsWrapper}>
              <Button
                onPress={handleOnSetPayoutMethodPress}
                type="primary"
                label="Add payout method"
              />
            </View>
          </>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.content}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    typography.body1,
                    typography.medium,
                    { color: Colors.primaryMidnightBlue },
                  ]}>
                  Bank or GCash Account
                </Text>
                <Text
                  style={[
                    typography.caption,
                    {
                      color: Colors.contentPlaceholder,
                      marginTop: normalize(4),
                    },
                  ]}>
                  This is where your payments paid via Credit/Debit, GCash, or
                  GrabPay will be credited.
                </Text>

                <View style={{ marginTop: normalize(16) }}>
                  {paymongoAccount ? (
                    <>
                      <>
                        <TextInput
                          label={paymongoAccount.account_name}
                          value={`${
                            paymongoAccount.method === 'gcash' ? '+63 ' : ''
                          }${paymongoAccount.account_number.replace(
                            /(\d{3})(\d{3})(\d{4})/,
                            ($0, $1, $2, $3) => `${$1} ${$2} ${$3}`
                          )}`}
                          leftIcon={() =>
                            paymongoAccount.method === 'gcash' ? (
                              <Icons.GCashActive />
                            ) : (
                              getBankIcon(paymongoAccount.bank)
                            )
                          }
                          labelStyle={{ paddingLeft: normalize(64) }}
                          inputStyle={{
                            paddingLeft: normalize(64),
                            color: Colors.contentEbony,
                          }}
                          editable={false}
                        />
                        <TouchableOpacity
                          style={{ marginTop: normalize(8) }}
                          onPress={() =>
                            setPayoutMethod(paymongoAccount.method)
                          }
                          activeOpacity={0.7}>
                          <Text style={[typography.caption, typography.link]}>
                            Update GCash/Bank Account
                          </Text>
                        </TouchableOpacity>
                      </>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => setPayoutMethod('gcash')}
                        activeOpacity={0.7}
                        style={styles.payoutMethodCard}>
                        <View style={[utilStyles.row, utilStyles.alignCenter]}>
                          <Icons.GCashPayment />
                          <Text
                            style={[
                              typography.body2,
                              { flex: 1, marginLeft: normalize(10) },
                            ]}>
                            Add GCash Account
                          </Text>
                          <Icons.ChevronRight style={{ color: Colors.icon }} />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setPayoutMethod('bank')}
                        activeOpacity={0.7}
                        style={styles.payoutMethodCard}>
                        <View style={[utilStyles.row, utilStyles.alignCenter]}>
                          <Icons.Bank />
                          <Text
                            style={[
                              typography.body2,
                              { flex: 1, marginLeft: normalize(10) },
                            ]}>
                            Add Bank Account
                          </Text>
                          <Icons.ChevronRight style={{ color: Colors.icon }} />
                        </View>
                      </TouchableOpacity>
                    </>
                  )}
                </View>

                <Text
                  style={[
                    typography.body1,
                    typography.medium,
                    {
                      color: Colors.primaryMidnightBlue,
                      marginTop: normalize(16),
                    },
                  ]}>
                  PayPal Account
                </Text>
                <Text
                  style={[
                    typography.caption,
                    {
                      color: Colors.contentPlaceholder,
                      marginTop: normalize(4),
                    },
                  ]}>
                  {paypalAccount
                    ? 'This is where your payments paid PayPal will be credited.'
                    : 'Add your PayPal account to enable PayPal payments in your posts. This is where your payments paid PayPal will be credited.'}
                </Text>

                <View style={{ marginTop: normalize(16) }}>
                  {paypalAccount ? (
                    <>
                      <TextInput
                        label={paypalAccount.account_name}
                        value={paypalAccount.email_address}
                        leftIcon={() => <Icons.PayPalPaymentActive />}
                        labelStyle={{ paddingLeft: normalize(64) }}
                        inputStyle={{
                          paddingLeft: normalize(64),
                          color: Colors.contentEbony,
                        }}
                        editable={false}
                      />
                      <TouchableOpacity
                        style={{ marginTop: normalize(8) }}
                        onPress={() => setPayoutMethod('paypal')}
                        activeOpacity={0.7}>
                        <Text style={[typography.caption, typography.link]}>
                          Update PayPal Account
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setPayoutMethod('paypal')}
                      activeOpacity={0.7}
                      style={styles.payoutMethodCard}>
                      <View style={[utilStyles.row, utilStyles.alignCenter]}>
                        <Icons.PayPalPayment />
                        <Text
                          style={[
                            typography.body2,
                            { flex: 1, marginLeft: normalize(10) },
                          ]}>
                          Add PayPal Account
                        </Text>
                        <Icons.ChevronRight style={{ color: Colors.icon }} />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ScrollView>
          </>
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
  payoutMethodCard: {
    padding: normalize(16),
    borderWidth: normalize(1),
    borderColor: Colors.neutralGray,
    borderRadius: normalize(4),
    marginBottom: normalize(16),
  },
  infoSection: {
    backgroundColor: Colors.secondarySolitude,
    padding: normalize(8),
    marginHorizontal: normalize(24),
    marginBottom: normalize(24),
    borderRadius: normalize(8),
  },
})

export default PayoutMethodScreen
