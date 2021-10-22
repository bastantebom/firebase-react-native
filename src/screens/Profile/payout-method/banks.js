import React from 'react'
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
import StatusBar from '@/components/StatusBar'

export const banks = [
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

/**
 * @typedef {object} BanksScreenProps
 * @property {(string) => void} onSelect
 */

/**
 * @typedef {object} RootProps
 * @property {BanksScreenProps} BanksScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'BanksScreen'>} param0 */
const BanksScreen = ({ navigation, route }) => {
  const { onSelect } = route.params

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
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
              Select Bank
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flexGrow: 1 }}>
            {banks.map(bank => (
              <TouchableOpacity
                key={bank.label}
                activeOpacity={0.7}
                style={styles.listItem}
                onPress={() => onSelect(bank.label)}>
                <Image
                  style={[
                    styles.bankIcon,
                    {
                      borderWidth: bank.withBorder === true ? 1 : 0,
                    },
                  ]}
                  source={bank.icon}
                />
                <Text style={[typography.body2, { marginLeft: normalize(8) }]}>
                  {bank.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(24),
  },
  bankIcon: {
    borderRadius: 4,
    borderColor: Colors.icon,
    width: normalize(36),
    height: normalize(25),
  },
})

export default BanksScreen
