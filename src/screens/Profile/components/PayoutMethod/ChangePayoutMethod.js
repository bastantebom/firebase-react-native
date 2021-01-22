import React, { useEffect } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native'

import { ScreenHeaderTitle, PaddingView, AppText } from '@/components'
import { Colors, normalize } from '@/globals'
import { Bank, GCash, Icons, Paypal } from '@/assets/images/icons'

const ChangePayoutMethod = ({ navigation, route }) => {
  const { payout } = route.params

  const payoutMethods = [
    {
      label: 'GCash',
      heading: 'Add your existing GCash account details',
      notes:
        'Additional Fees: May include fees\nProcessing time: Within 24 hours',
      icon: <GCash />,
    },
    {
      label: 'Bank',
      heading: 'Add your existing bank account details',
      notes:
        'Additional Fees: May include fees\nProcessing time: Within 24 hours',
      icon: <Bank />,
    },
    {
      label: 'PayPal',
      heading: 'Add your existing PayPal account details',
      notes:
        'Additional Fees: May include fees\nProcessing time: Get paid in 3-5 business days.',
      icon: <Paypal />,
    },
  ]

  const onSelect = item => {
    navigation.navigate('payout-details', {
      payout,
      method: item,
    })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle
        title="Payout Method"
        close={() => navigation.goBack()}
        paddingSize={3}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <PaddingView paddingSize={3} style={{ paddingBottom: 0 }}>
          <AppText
            textStyle="body1"
            color={Colors.primaryMidnightBlue}
            customStyle={{ marginBottom: normalize(4) }}>
            Select your payout method
          </AppText>
          <AppText
            textStyle="caption"
            customStyle={{ marginBottom: normalize(32) }}>
            This is where your future payouts will be deposited weekly on
            Thursday for payments made using credit/debit, e-wallets, and
            PayPal.
          </AppText>
          {payoutMethods.map((item, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={styles.payoutInput}
                onPress={() => onSelect(item.label)}
                activeOpacity={0.7}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{ flexDirection: 'row' }}>
                    {item.icon}
                    <AppText
                      textStyle="body1medium"
                      customStyle={{
                        marginBottom: normalize(4),
                        marginLeft: normalize(10),
                      }}>
                      {item.label}
                    </AppText>
                  </View>
                  <Icons.ChevronRightGray
                    height={normalize(20)}
                    width={normalize(20)}
                  />
                </View>
                <AppText
                  textStyle="body2medium"
                  customStyle={{ marginBottom: normalize(2) }}>
                  {item.heading}
                </AppText>
                <AppText textStyle="caption">{item.notes}</AppText>
              </TouchableOpacity>
            )
          })}
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
    marginBottom: normalize(16),
  },
})

export default ChangePayoutMethod
