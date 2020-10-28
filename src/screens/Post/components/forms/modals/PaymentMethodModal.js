import React, { useState } from 'react'
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'

import { AppText, AppCheckbox, AppInput, ScreenHeaderTitle } from '@/components'
import { useNavigation } from '@react-navigation/native'

const PaymentMethodModal = ({
  close,
  parentPaymentMethod,
  setParentPaymentMethods,
}) => {
  const navigation = useNavigation()

  const [paymentMethods, setPaymentMethods] = useState(parentPaymentMethod)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScreenHeaderTitle
        close={close}
        title="Payment Methods"
        paddingSize={2}
      />
      <View style={{ padding: 16 }}>
        <AppText textStyle="body2">Something, something</AppText>
        <AppText textStyle="captionDashboard">Something, something</AppText>
        <View style={styles.withBorder}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <AppText>Cash</AppText>
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
        </View>
        <View style={styles.withBorder}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <AppText>GCash</AppText>
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
        </View>
        <View style={styles.withBorder}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <AppText>Paymaya</AppText>
            <AppCheckbox
              value={paymentMethods?.paymaya}
              valueChangeHandler={() => {
                setPaymentMethods({
                  ...paymentMethods,
                  paymaya: !paymentMethods?.paymaya,
                })
              }}
            />
          </View>
        </View>
        <View style={styles.withBorder}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <AppText>Online Banking</AppText>
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
          {paymentMethods?.onlineBanking && (
            <AppInput
              style={{ marginBottom: 16 }}
              label="Banks Preferred"
              placeholder="BDO, BPI"
              value={paymentMethods?.bank}
              onChangeText={text =>
                setPaymentMethods({
                  ...paymentMethods,
                  bank: text,
                })
              }
            />
          )}
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}>
            <AppText>Others</AppText>
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
          {paymentMethods?.others && (
            <AppInput
              style={{ marginBottom: 16 }}
              label="Other methods"
              placeholder="PayPal"
              value={paymentMethods?.otherMethods}
              // onChangeText={(text) => setBank(text)}
              onChangeText={text =>
                setPaymentMethods({
                  ...paymentMethods,
                  otherMethods: text,
                })
              }
            />
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          setParentPaymentMethods(paymentMethods)
          close()
        }}>
        <AppText>Save</AppText>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
})

export default PaymentMethodModal
