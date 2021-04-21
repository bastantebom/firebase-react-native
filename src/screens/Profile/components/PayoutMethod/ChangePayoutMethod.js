import React from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Text,
} from 'react-native'

import { PaddingView, AppText } from '@/components'
import { Colors, normalize } from '@/globals'
import { Bank, GCash, Icons, Paypal } from '@/assets/images/icons'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { iconSize } from '@/globals/Utils'
import typography from '@/globals/typography'

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
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>
              Payout Method
            </Text>
          </View>
        </View>
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
  payoutInput: {
    borderColor: Colors.neutralsZircon,
    borderWidth: 1,
    borderRadius: 4,
    padding: normalize(16),
    marginBottom: normalize(16),
  },
})

export default ChangePayoutMethod
