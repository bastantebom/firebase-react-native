import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native'

import {
  ScreenHeaderTitle,
  PaddingView,
  AppText,
  AppButton,
} from '@/components'
import { EmptyPayout } from '@/assets/images'
import { Icons } from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'
import Api from '@/services/Api'

const PayoutMethod = ({ navigation }) => {
  const [payout, setPayout] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const result = await Api.getPayout()
        if (result.success && result.data) {
          setPayout(result.data)
        }

        if (!result.success) throw new Error('Error getting payout method')
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScreenHeaderTitle
        title="Payout Method"
        close={() => navigation.goBack()}
        paddingSize={3}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}>
        <PaddingView paddingSize={3}>
          {!payout ? (
            <View
              style={{
                justifyContent: 'space-between',
                height: '100%',
              }}>
              <View style={{ alignItems: 'center' }}>
                <EmptyPayout />
                <AppText
                  textStyle="body1medium"
                  customStyle={{
                    marginTop: normalize(25),
                    marginBottom: normalize(8),
                  }}>
                  Add your preferred payout method
                </AppText>
                <AppText
                  textStyle="body2"
                  customStyle={{
                    textAlign: 'center',
                    marginBottom: normalize(14),
                  }}>
                  The orders paid via Credit/Debit, GCash, GrabPay, or PayPal
                  are credited to your preferred payout method after an order
                  has been completed and the payment becomes eligible for
                  payout.
                </AppText>
                <View
                  style={{
                    backgroundColor: Colors.secondarySolitude,
                    padding: normalize(16),
                    borderRadius: 8,
                    marginBottom: normalize(25),
                  }}>
                  <AppText
                    textStyle="caption"
                    customStyle={{ marginBottom: normalize(16) }}>
                    After your payment has been credited, you should receive a
                    confirmation via notification, SMS, or email.
                  </AppText>
                </View>
              </View>
              <AppButton
                text="Add payout method"
                type="primary"
                onPress={() =>
                  navigation.navigate('change-payout-method', {
                    payout,
                  })
                }
              />
            </View>
          ) : (
            <View>
              <AppText
                textStyle="body1"
                color={Colors.primaryMidnightBlue}
                customStyle={{ marginBottom: normalize(4) }}>
                Your preferred payout method
              </AppText>
              <AppText
                textStyle="caption"
                customStyle={{ marginBottom: normalize(32) }}>
                This is where your payments paid via Credit/Debit, GCash,
                GrabPay, or PayPal will be credited.
              </AppText>
              <View style={styles.payoutInput}>
                {payout.method === 'GCash' ? (
                  <Icons.GCashActive />
                ) : payout.method === 'PayPal' ? (
                  <Icons.PaypalActive />
                ) : (
                  <Icons.BankActive />
                )}
                <AppText
                  textStyle="body2medium"
                  customStyle={{ marginLeft: 10 }}>
                  {payout.method}
                  {'  '}
                  <AppText textStyle="body2">
                    {payout.account_number || payout.email_address}
                  </AppText>
                </AppText>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('change-payout-method', {
                    payout,
                  })
                }>
                <AppText textStyle="body2medium" color={Colors.contentOcean}>
                  Change payout method
                </AppText>
              </TouchableOpacity>
            </View>
          )}
        </PaddingView>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  payoutInput: {
    borderColor: Colors.neutralsZircon,
    borderWidth: 1,
    borderRadius: 4,
    padding: normalize(16),
    marginBottom: normalize(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default PayoutMethod
