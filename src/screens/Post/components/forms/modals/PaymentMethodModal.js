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
  AngleDown,
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
  const [visa, showVisa] = useState(false)
  const [grab, showGrab] = useState(false)
  const [paypal, showPaypal] = useState(false)
  const [cash, showCash] = useState(false)

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
            <View>
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
              justifyContent: 'space-between',
              flexGrow: 1,
            }}>
            <View
              style={{
                alignItems: 'center',
                flex: 1,
                marginBottom: 16,
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

              <View
                style={{
                  marginTop: 32,
                  borderWidth: 1,
                  borderColor: Colors.neutralGray,
                  borderRadius: 4,
                  width: '100%',
                  padding: 12,
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => showVisa(!visa)}
                  style={{
                    marginBottom: visa ? 16 : 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <AppText textStyle="subtitle2">
                    Card payments: Visa and Mastercard
                  </AppText>
                  <AngleDown />
                </TouchableOpacity>
                {visa && (
                  <>
                    <AppText
                      textStyle="caption2"
                      customStyle={{ marginBottom: 16 }}>
                      Payment Fee: 3.5% + ₱15
                    </AppText>

                    <AppText
                      textStyle="caption"
                      customStyle={{ marginBottom: 16 }}>
                      Your customers can pay using the payment methods you set
                      on each post. Please note that for payments made using
                      credit/debit, e-wallets, and PayPal, additional fees will
                      be deducted per sale.
                    </AppText>
                    <AppText
                      textStyle="caption"
                      customStyle={{ marginBottom: 16 }}>
                      We've partnered with PayMongo so you can make secure,
                      convenient, and reliable payments via credit/debit cards
                      and e-wallets.
                    </AppText>

                    <View
                      style={{
                        backgroundColor: Colors.secondarySolitude,
                        padding: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}>
                      <AppText textStyle="caption">Transaction Amount</AppText>
                      <AppText textStyle="caption">₱360.00</AppText>
                    </View>
                    <View
                      style={{
                        backgroundColor: Colors.secondarySolitude,
                        padding: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}>
                      <AppText textStyle="caption">
                        Payment Fee 3.5% + ₱15
                      </AppText>
                      <AppText textStyle="caption">₱27.60</AppText>
                    </View>
                    <View
                      style={{
                        backgroundColor: Colors.primaryAliceBlue,
                        padding: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}>
                      <AppText textStyle="caption2">Net Amount</AppText>
                      <AppText textStyle="caption2">₱332.40</AppText>
                    </View>
                  </>
                )}
              </View>

              <View
                style={{
                  marginTop: 24,
                  borderWidth: 1,
                  borderColor: Colors.neutralGray,
                  borderRadius: 4,
                  width: '100%',
                  padding: 12,
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => showGrab(!grab)}
                  style={{
                    marginBottom: grab ? 16 : 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <AppText textStyle="subtitle2">
                    E-wallets: GCash and GrabPay
                  </AppText>
                  <AngleDown />
                </TouchableOpacity>

                {grab && (
                  <>
                    <AppText
                      textStyle="caption2"
                      customStyle={{ marginBottom: 16 }}>
                      Payment Fee: 2.9%
                    </AppText>

                    <AppText
                      textStyle="caption"
                      customStyle={{ marginBottom: 16 }}>
                      If any of these payment channels is selected, customers
                      will be redirected to a new page where they can log in to
                      their account. After the transaction, they will be
                      redirected back to our app to confirm that the order has
                      pushed through.
                    </AppText>

                    <View
                      style={{
                        backgroundColor: Colors.secondarySolitude,
                        padding: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}>
                      <AppText textStyle="caption">Transaction Amount</AppText>
                      <AppText textStyle="caption">₱360.00</AppText>
                    </View>
                    <View
                      style={{
                        backgroundColor: Colors.secondarySolitude,
                        padding: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}>
                      <AppText textStyle="caption">Payment Fee 2.9%</AppText>
                      <AppText textStyle="caption">₱10.44</AppText>
                    </View>
                    <View
                      style={{
                        backgroundColor: Colors.primaryAliceBlue,
                        padding: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}>
                      <AppText textStyle="caption2">Net Amount</AppText>
                      <AppText textStyle="caption2">₱349.56</AppText>
                    </View>
                  </>
                )}
              </View>

              <View
                style={{
                  marginTop: 24,
                  borderWidth: 1,
                  borderColor: Colors.neutralGray,
                  borderRadius: 4,
                  width: '100%',
                  padding: 12,
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => showPaypal(!paypal)}
                  style={{
                    marginBottom: paypal ? 16 : 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <AppText textStyle="subtitle2">PayPal</AppText>
                  <AngleDown />
                </TouchableOpacity>

                {paypal && (
                  <>
                    <AppText
                      textStyle="caption2"
                      customStyle={{ marginBottom: 16 }}>
                      Payment Fee: 3.90% + ₱15
                    </AppText>
                    <View
                      style={{
                        borderLeftWidth: 2,
                        borderLeftColor: Colors.primaryYellow,
                        paddingLeft: 12,
                        paddingVertical: 4,
                        marginBottom: 16,
                      }}>
                      <AppText textStyle="caption">
                        Domestic payments: 3.9% + Fixed Fee
                      </AppText>
                      <AppText textStyle="caption">
                        International payments: 4.4% + Fixed Fee
                      </AppText>
                    </View>

                    <AppText
                      textStyle="caption"
                      customStyle={{ marginBottom: 16 }}>
                      Customers will be redirected to a new page where they can
                      log in to their account. After the transaction, they will
                      be redirected back to our app to confirm that the order
                      has pushed through.
                    </AppText>

                    <View
                      style={{
                        backgroundColor: Colors.secondarySolitude,
                        padding: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}>
                      <AppText textStyle="caption">Transaction Amount</AppText>
                      <AppText textStyle="caption">₱360.00</AppText>
                    </View>
                    <View
                      style={{
                        backgroundColor: Colors.secondarySolitude,
                        padding: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}>
                      <AppText textStyle="caption">Payment Fee 3.9%</AppText>
                      <AppText textStyle="caption">₱25.44</AppText>
                    </View>
                    <View
                      style={{
                        backgroundColor: Colors.primaryAliceBlue,
                        padding: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}>
                      <AppText textStyle="caption2">Net Amount</AppText>
                      <AppText textStyle="caption2">₱334.56</AppText>
                    </View>
                  </>
                )}
              </View>

              <View
                style={{
                  marginTop: 24,
                  borderWidth: 1,
                  borderColor: Colors.neutralGray,
                  borderRadius: 4,
                  width: '100%',
                  padding: 12,
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => showCash(!cash)}
                  style={{
                    marginBottom: cash ? 16 : 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <AppText textStyle="subtitle2">
                    Cash, Online Banking, or other Payment Methods
                  </AppText>
                  <AngleDown />
                </TouchableOpacity>
                {cash && (
                  <>
                    <AppText
                      textStyle="caption"
                      customStyle={{ marginBottom: 16 }}>
                      Customers can still pay using cash, online banking, or
                      other payment methods not included in the app. For these
                      payment options, the seller/service provider should send
                      the payment instructions and reminders directly to the
                      customer using chat.
                    </AppText>
                  </>
                )}
              </View>
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
