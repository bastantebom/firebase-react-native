import React from 'react'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Icons } from '@/assets/images/icons'
import { iconSize } from '@/globals/Utils'
import { ScrollView } from 'react-native-gesture-handler'
import StatusBar from '@/components/StatusBar'
import utilStyles from '@/globals/util-styles'

/**
 * @typedef {object} AddPayoutMethodScreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {AddPayoutMethodScreenProps} AddPayoutMethodScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'AddPayoutMethodScreen'>} param0 */
const AddPayoutMethodScreen = ({ navigation }) => {
  const handleOnCardPress = method => {
    navigation.navigate('set-payout-method', { method })
  }

  const handleOnInfoPress = () => {
    // TODO: add payout method info screen
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcon}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>
              Add Payout Methods
            </Text>
          </View>
          <TouchableOpacity
            style={styles.headerIcon}
            activeOpacity={0.7}
            onPress={handleOnInfoPress}>
            <Icons.InfoCircle style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
        </View>
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
                { color: Colors.contentPlaceholder, marginTop: normalize(4) },
              ]}>
              This is where your payments paid via Credit/Debit, GCash, or
              GrabPay will be credited.
            </Text>

            <View style={{ marginTop: normalize(16) }}>
              <TouchableOpacity
                onPress={() => handleOnCardPress('gcash')}
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
                onPress={() => handleOnCardPress('bank')}
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
            </View>

            <Text
              style={[
                typography.body1,
                typography.medium,
                { color: Colors.primaryMidnightBlue, marginTop: normalize(16) },
              ]}>
              PayPal Account
            </Text>
            <Text
              style={[
                typography.caption,
                { color: Colors.contentPlaceholder, marginTop: normalize(4) },
              ]}>
              Add your PayPal account to enable PayPal payments in your posts.
              This is where your payments paid PayPal will be credited.
            </Text>

            <View style={{ marginTop: normalize(16) }}>
              <TouchableOpacity
                onPress={() => handleOnCardPress('paypal')}
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
            </View>
          </View>
        </ScrollView>
        <View style={styles.infoSection}>
          <Text style={typography.eyebrow}>
            Additional fees may occur.{' '}
            <Text style={[typography.medium, typography.link]}>Learn More</Text>
          </Text>
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
    justifyContent: 'space-between',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  headerIcon: {
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

export default AddPayoutMethodScreen
