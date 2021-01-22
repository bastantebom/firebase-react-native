import React from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native'

import { ScreenHeaderTitle, PaddingView, AppText } from '@/components'
import { normalize } from '@/globals'

const BankList = ({ close, payoutData, setPayoutData }) => {
  const bankList = [
    {
      label: 'AllBank',
      icon: require('@/assets/images/icons/bank-icons/all-bank.png'),
      withBorder: true,
    },
    {
      label: 'Asia United Bank',
      icon: require('@/assets/images/icons/bank-icons/aub.png'),
      withBorder: false,
    },
    {
      label: 'BDO',
      icon: require('@/assets/images/icons/bank-icons/bdo.png'),
      withBorder: false,
    },
    {
      label: 'BDO Network Bank',
      icon: require('@/assets/images/icons/bank-icons/bdo-network.png'),
      withBorder: true,
    },
    {
      label: 'BPI/BPI Family Savings Bank',
      icon: require('@/assets/images/icons/bank-icons/bpi.png'),
      withBorder: false,
    },
    {
      label: 'BanKo, A subsidiary of BPI',
      icon: require('@/assets/images/icons/bank-icons/banko.png'),
      withBorder: true,
    },
    {
      label: 'Bangko Mabuhay',
      icon: require('@/assets/images/icons/bank-icons/bangko-mabuhay.png'),
      withBorder: true,
    },
    {
      label: 'Bank of Commerce',
      icon: require('@/assets/images/icons/bank-icons/bank-of-commerce.png'),
      withBorder: false,
    },
    {
      label: 'CTBC Bank (Philippines) Corp.',
      icon: require('@/assets/images/icons/bank-icons/cbtc.png'),
      withBorder: false,
    },
    {
      label: 'Cebuana Lhuillier Rural Bank, Inc.',
      icon: require('@/assets/images/icons/bank-icons/cebuana.png'),
      withBorder: false,
    },
    {
      label: 'China Bank',
      icon: require('@/assets/images/icons/bank-icons/cb.png'),
      withBorder: false,
    },
    {
      label: 'China Bank Savings',
      icon: require('@/assets/images/icons/bank-icons/cbs.png'),
      withBorder: false,
    },
    {
      label: 'Dungganon Bank',
      icon: require('@/assets/images/icons/bank-icons/dungganon.png'),
      withBorder: true,
    },
    {
      label: 'EastWest Rural Bank / Komo',
      icon: require('@/assets/images/icons/bank-icons/ewb.png'),
      withBorder: false,
    },
    {
      label: 'Equicom Savings Bank',
      icon: require('@/assets/images/icons/bank-icons/equicom.png'),
      withBorder: false,
    },
    {
      label: 'ING Bank N.V.',
      icon: require('@/assets/images/icons/bank-icons/ing.png'),
      withBorder: false,
    },
    {
      label: 'Isla Bank Inc',
      icon: require('@/assets/images/icons/bank-icons/isla.png'),
      withBorder: true,
    },
    {
      label: 'Land Bank of the Philippines',
      icon: require('@/assets/images/icons/bank-icons/lb.png'),
      withBorder: true,
    },
    {
      label: 'Malayan Savings Bank',
      icon: require('@/assets/images/icons/bank-icons/malayan.png'),
      withBorder: false,
    },
    {
      label: 'Maybank Phils. Inc.',
      icon: require('@/assets/images/icons/bank-icons/maybank.png'),
      withBorder: false,
    },
    {
      label: 'Metropolitan Bank and Trust Co.',
      icon: require('@/assets/images/icons/bank-icons/metrobank.png'),
      withBorder: false,
    },
    {
      label: 'PNB',
      icon: require('@/assets/images/icons/bank-icons/pnb.png'),
      withBorder: true,
    },
    {
      label: 'PSBank',
      icon: require('@/assets/images/icons/bank-icons/psb.png'),
      withBorder: true,
    },
    {
      label: 'Partner Rural bank',
      icon: require('@/assets/images/icons/bank-icons/partner.png'),
      withBorder: false,
    },
    {
      label: 'Phil Bank of Communication',
      icon: require('@/assets/images/icons/bank-icons/pbcom.png'),
      withBorder: true,
    },
    {
      label: 'Phil Business Bank',
      icon: require('@/assets/images/icons/bank-icons/business-bank.png'),
      withBorder: false,
    },
    {
      label: 'Phil Trust Company',
      icon: require('@/assets/images/icons/bank-icons/phil-trust.png'),
      withBorder: true,
    },
    {
      label: 'Philippine Veterans Bank',
      icon: require('@/assets/images/icons/bank-icons/veterans.png'),
      withBorder: true,
    },
    {
      label: 'Quezon Capital Rural Bank',
      icon: require('@/assets/images/icons/bank-icons/quezon.png'),
      withBorder: false,
    },
    {
      label: 'RCBC/DiskarTech',
      icon: require('@/assets/images/icons/bank-icons/rcbc.png'),
      withBorder: false,
    },
    {
      label: 'Robinsons Bank',
      icon: require('@/assets/images/icons/bank-icons/bdo.png'),
      withBorder: false,
    },
    {
      label: 'Security Bank Corporation',
      icon: require('@/assets/images/icons/bank-icons/sb.png'),
      withBorder: false,
    },
    {
      label: 'StarPay',
      icon: require('@/assets/images/icons/bank-icons/starpay.png'),
      withBorder: false,
    },
    {
      label: 'Sterling Bank of Asia',
      icon: require('@/assets/images/icons/bank-icons/sterling.png'),
      withBorder: false,
    },
    {
      label: 'Sun Savings Bank',
      icon: require('@/assets/images/icons/bank-icons/sun.png'),
      withBorder: false,
    },
    {
      label: 'UCPB',
      icon: require('@/assets/images/icons/bank-icons/ucpb.png'),
      withBorder: false,
    },
    {
      label: 'Wealth Development Bank',
      icon: require('@/assets/images/icons/bank-icons/wealth.png'),
      withBorder: true,
    },
  ]

  const onSelect = item => {
    setPayoutData({
      ...payoutData,
      bank: item,
    })
    close()
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle title="Select Bank" close={close} paddingSize={3} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <PaddingView paddingSize={3} style={{ paddingVertical: 0 }}>
          {bankList.map((item, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={styles.payoutInput}
                onPress={() => onSelect(item.label)}
                activeOpacity={0.7}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      borderWidth: item.withBorder === true ? 1 : 0,
                      borderRadius: 4,
                      borderColor: '#91919c',
                      width: normalize(36),
                      height: normalize(25),
                    }}
                    source={item.icon}
                  />
                  <AppText
                    textStyle="body1"
                    customStyle={{
                      marginLeft: normalize(10),
                      maxWidth: '83%',
                    }}>
                    {item.label}
                  </AppText>
                </View>
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
    padding: normalize(16),
    marginBottom: normalize(8),
  },
})

export default BankList
