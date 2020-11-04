import React, { useState } from 'react'
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'

import { AppText, AppCheckbox, AppInput, ScreenHeaderTitle } from '@/components'
import { useNavigation } from '@react-navigation/native'

import { Colors } from '@/globals'
import FloatingAppInput from '@/components/AppInput/AppInput'

const PaymentMethodModal = ({
  close,
  parentPaymentMethod,
  setParentPaymentMethods,
}) => {
  const navigation = useNavigation()

  const [paymentMethods, setPaymentMethods] = useState(parentPaymentMethod)

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}>
      <View>
        <ScreenHeaderTitle
          close={close}
          title="Payment Methods"
          paddingSize={2}
        />
        <View style={{ padding: 24 }}>
          <AppText textStyle="body1">
            What are your preferred payment options?
          </AppText>
          <AppText textStyle="caption" customStyle={{ marginTop: 4 }}>
            Pick your preferred payment options, Please note that all payments
            are coordinated directly with your customer
          </AppText>
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
              <FloatingAppInput
                style={{ marginBottom: 16 }}
                label="Other methods"
                // placeholder="PayPal"
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
      </View>

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
