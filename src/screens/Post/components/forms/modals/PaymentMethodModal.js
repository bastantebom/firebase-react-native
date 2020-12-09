import React, { useState } from 'react'
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native'

import {
  AppText,
  AppCheckbox,
  ScreenHeaderTitle,
  AppButton,
} from '@/components'
import { useNavigation } from '@react-navigation/native'

import { Colors, normalize } from '@/globals'
import FloatingAppInput from '@/components/AppInput/AppInput'
import {
  Cash,
  CashActive,
  CreditCard,
  CreditCardActive,
  GCash,
  GCashActive,
  GrabPay,
  GrabPayActive,
  Paypal,
  PaypalActive,
  Bank,
  BankActive,
} from '@/assets/images/icons'
import { Clipboard } from '@/assets/images'

const PaymentMethodModal = ({
  close,
  parentPaymentMethod,
  setParentPaymentMethods,
}) => {
  const navigation = useNavigation()

  const [showLearnMore, setShowLearnMore] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState(parentPaymentMethod)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 8 }}>
      {!showLearnMore ? (
        <>
          <ScreenHeaderTitle
            close={close}
            title="Payment Methods"
            paddingSize={2}
            iconSize={normalize(20)}
          />
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingVertical: 16,
            }}>
            <AppText textStyle="body1" color={Colors.primaryMidnightBlue}>
              What are your preferred payment options?
            </AppText>
            <AppText
              textStyle="caption"
              customStyle={{ marginTop: 4, marginBottom: 12 }}>
              Customers can pay using your preferred payment options. For
              payments made using credit/debit, e-wallets, and PayPal,
              additional fees will be deducted per order.
            </AppText>
            <TouchableOpacity
              style={{ marginBottom: 16 }}
              onPress={() => setShowLearnMore(true)}>
              <AppText textStyle="caption" color={Colors.contentOcean}>
                Learn more
              </AppText>
            </TouchableOpacity>
            <View style={styles.withBorder}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setPaymentMethods({
                    ...paymentMethods,
                    cash: !paymentMethods?.cash,
                  })
                }}>
                <View style={styles.methodContainer}>
                  <View style={styles.iconContainer}>
                    {paymentMethods?.cash ? (
                      <CashActive
                        width={normalize(36)}
                        height={normalize(24)}
                      />
                    ) : (
                      <Cash width={normalize(36)} height={normalize(24)} />
                    )}
                    <AppText
                      textStyle={paymentMethods?.cash ? 'body1medium' : 'body1'}
                      customStyle={styles.methodText}>
                      Cash
                    </AppText>
                  </View>
                  <AppCheckbox
                    value={paymentMethods?.cash}
                    valueChangeHandler={() => {
                      setPaymentMethods({
                        ...paymentMethods,
                        cash: !paymentMethods?.cash,
                      })
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.withBorder}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setPaymentMethods({
                    ...paymentMethods,
                    card: !paymentMethods?.card,
                  })
                }}>
                <View style={styles.methodContainer}>
                  <View style={styles.iconContainer}>
                    {paymentMethods?.card ? (
                      <CreditCardActive
                        width={normalize(36)}
                        height={normalize(24)}
                      />
                    ) : (
                      <CreditCard
                        width={normalize(36)}
                        height={normalize(24)}
                      />
                    )}
                    <AppText
                      textStyle={paymentMethods?.card ? 'body1medium' : 'body1'}
                      customStyle={styles.methodText}>
                      Visa / MasterCard
                    </AppText>
                  </View>
                  <AppCheckbox
                    value={paymentMethods?.card}
                    valueChangeHandler={() => {
                      setPaymentMethods({
                        ...paymentMethods,
                        card: !paymentMethods?.card,
                      })
                    }}
                  />
                </View>
              </TouchableOpacity>
              {paymentMethods?.card && (
                <AppText textStyle="caption" customStyle={{ marginBottom: 16 }}>
                  3.5% + ₱15.00 for cards issued in the Philippines; 4.5% +
                  ₱15.00 for cards issued outside the Philippines
                </AppText>
              )}
            </View>
            <View style={styles.withBorder}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setPaymentMethods({
                    ...paymentMethods,
                    gcash: !paymentMethods?.gcash,
                  })
                }}>
                <View style={styles.methodContainer}>
                  <View style={styles.iconContainer}>
                    {paymentMethods?.gcash ? (
                      <GCashActive
                        width={normalize(36)}
                        height={normalize(24)}
                      />
                    ) : (
                      <GCash width={normalize(36)} height={normalize(24)} />
                    )}
                    <AppText
                      textStyle={
                        paymentMethods?.gcash ? 'body1medium' : 'body1'
                      }
                      customStyle={styles.methodText}>
                      GCash
                    </AppText>
                  </View>
                  <AppCheckbox
                    value={paymentMethods?.gcash}
                    valueChangeHandler={() => {
                      setPaymentMethods({
                        ...paymentMethods,
                        gcash: !paymentMethods?.gcash,
                      })
                    }}
                  />
                </View>
              </TouchableOpacity>
              {paymentMethods?.gcash && (
                <AppText textStyle="caption" customStyle={{ marginBottom: 16 }}>
                  2.9% fee will be deducted from your entire bill
                </AppText>
              )}
            </View>
            <View style={styles.withBorder}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setPaymentMethods({
                    ...paymentMethods,
                    grabpay: !paymentMethods?.grabpay,
                  })
                }}>
                <View style={styles.methodContainer}>
                  <View style={styles.iconContainer}>
                    {paymentMethods?.grabpay ? (
                      <GrabPayActive
                        width={normalize(36)}
                        height={normalize(24)}
                      />
                    ) : (
                      <GrabPay width={normalize(36)} height={normalize(24)} />
                    )}
                    <AppText
                      textStyle={
                        paymentMethods?.grabpay ? 'body1medium' : 'body1'
                      }
                      customStyle={styles.methodText}>
                      GrabPay
                    </AppText>
                  </View>
                  <AppCheckbox
                    value={paymentMethods?.grabpay}
                    valueChangeHandler={() => {
                      setPaymentMethods({
                        ...paymentMethods,
                        grabpay: !paymentMethods?.grabpay,
                      })
                    }}
                  />
                </View>
              </TouchableOpacity>
              {paymentMethods?.grabpay && (
                <AppText textStyle="caption" customStyle={{ marginBottom: 16 }}>
                  2.9% fee will be deducted from your entire bill
                </AppText>
              )}
            </View>
            <View style={styles.withBorder}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setPaymentMethods({
                    ...paymentMethods,
                    paypal: !paymentMethods?.paypal,
                  })
                }}>
                <View style={styles.methodContainer}>
                  <View style={styles.iconContainer}>
                    {paymentMethods?.paypal ? (
                      <PaypalActive
                        width={normalize(36)}
                        height={normalize(24)}
                      />
                    ) : (
                      <Paypal width={normalize(36)} height={normalize(24)} />
                    )}
                    <AppText
                      textStyle={
                        paymentMethods?.paypal ? 'body1medium' : 'body1'
                      }
                      customStyle={styles.methodText}>
                      PayPal
                    </AppText>
                  </View>
                  <AppCheckbox
                    value={paymentMethods?.paypal}
                    valueChangeHandler={() => {
                      setPaymentMethods({
                        ...paymentMethods,
                        paypal: !paymentMethods?.paypal,
                      })
                    }}
                  />
                </View>
              </TouchableOpacity>
              {paymentMethods?.paypal && (
                <AppText textStyle="caption" customStyle={{ marginBottom: 16 }}>
                  2.9% fee will be deducted from your entire bill
                </AppText>
              )}
            </View>
            <View style={styles.withBorder}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setPaymentMethods({
                    ...paymentMethods,
                    onlineBanking: !paymentMethods?.onlineBanking,
                  })
                }}>
                <View style={styles.methodContainer}>
                  <View style={styles.iconContainer}>
                    {paymentMethods?.onlineBanking ? (
                      <BankActive
                        width={normalize(36)}
                        height={normalize(24)}
                      />
                    ) : (
                      <Bank width={normalize(36)} height={normalize(24)} />
                    )}
                    <AppText
                      textStyle={
                        paymentMethods?.onlineBanking ? 'body1medium' : 'body1'
                      }
                      customStyle={styles.methodText}>
                      Online Banking
                    </AppText>
                  </View>
                  <AppCheckbox
                    value={paymentMethods?.onlineBanking}
                    valueChangeHandler={() => {
                      setPaymentMethods({
                        ...paymentMethods,
                        onlineBanking: !paymentMethods?.onlineBanking,
                      })
                    }}
                  />
                </View>
              </TouchableOpacity>
              {paymentMethods?.onlineBanking && (
                <>
                  <AppText
                    textStyle="caption"
                    customStyle={{ paddingBottom: 16 }}>
                    Send the payment instructions and reminders directly to the
                    customer using chat.
                  </AppText>
                  <FloatingAppInput
                    style={{ marginBottom: 16 }}
                    label="Banks Preferred"
                    // placeholder="BDO, BPI"
                    value={paymentMethods?.bank}
                    onChangeText={text =>
                      setPaymentMethods({
                        ...paymentMethods,
                        bank: text,
                      })
                    }
                  />
                </>
              )}
            </View>
            <View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setPaymentMethods({
                    ...paymentMethods,
                    others: !paymentMethods?.others,
                  })
                }}>
                <View style={styles.methodContainer}>
                  <AppText
                    textStyle={
                      paymentMethods?.others ? 'body1medium' : 'body1'
                    }>
                    Others
                  </AppText>
                  <AppCheckbox
                    value={paymentMethods?.others}
                    valueChangeHandler={() => {
                      setPaymentMethods({
                        ...paymentMethods,
                        others: !paymentMethods?.others,
                      })
                    }}
                  />
                </View>
              </TouchableOpacity>
              {paymentMethods?.others && (
                <>
                  <AppText
                    textStyle="caption"
                    customStyle={{ paddingBottom: 16 }}>
                    Send the payment instructions and reminders directly to the
                    customer using chat.
                  </AppText>
                  <FloatingAppInput
                    style={{ marginBottom: 16 }}
                    label="Other payment methods"
                    value={paymentMethods?.otherMethods}
                    onChangeText={text =>
                      setPaymentMethods({
                        ...paymentMethods,
                        otherMethods: text,
                      })
                    }
                  />
                </>
              )}
            </View>
          </ScrollView>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setParentPaymentMethods(paymentMethods)
              close()
            }}
            style={{
              backgroundColor: Colors.primaryYellow,
              paddingVertical: 8,
              marginHorizontal: 24,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
              borderRadius: 4,
            }}>
            <AppText textStyle="body3">Save</AppText>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <ScreenHeaderTitle
            close={() => setShowLearnMore(false)}
            paddingSize={2}
            iconSize={normalize(20)}
          />
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 16,
              paddingBottom: 24,
              justifyContent: 'space-between',
              height: '100%',
              flexGrow: 1,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Clipboard height={normalize(70)} width={normalize(70)} />
              <AppText
                textStyle="body1medium"
                customStyle={{ paddingBottom: 16, paddingTop: 8 }}>
                Payment Fees
              </AppText>
              <AppText textStyle="body2" customStyle={{ paddingBottom: 24 }}>
                Your customers can pay using the payment methods you set on each
                post. Please note that for payments made using credit/debit,
                e-wallets, and PayPal, additional fees will be deducted per
                sale.
              </AppText>
              <AppText textStyle="body2">
                We've partnered with PayMongo so you can make secure,
                convenient, and reliable payments via credit/debit cards and
                e-wallets.
              </AppText>
            </View>
            <AppButton
              text="Okay, got it!"
              type="primary"
              onPress={() => setShowLearnMore(false)}
            />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '95%',
  },
  methodText: {
    marginLeft: 12,
    maxWidth: '80%',
  },
})

export default PaymentMethodModal
