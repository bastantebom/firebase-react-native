import React, { useState } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  LayoutAnimation,
  UIManager,
  StatusBar,
} from 'react-native'
import { Guide, Images } from '@/assets/images'
import { Colors, normalize } from '@/globals'
import { Icons } from '@/assets/images/icons'
import Svg, { Circle } from 'react-native-svg'
import Button from '@/components/Button'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

/**
 * @typedef {object} PaymentFeesScreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {PaymentFeesScreenProps} PaymentFeesScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'PaymentFeesScreen'>} param0 */
const PaymentFeesScreen = ({ navigation }) => {
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
        </View>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.titleWrapper}>
              <Images.PaymentFees />
              <Text style={styles.title}>Payment Fees</Text>
            </View>
            <View>
              <Text style={typography.body2}>
                Your customers can pay using the payment methods you set on each
                post. Please note that for payments made using credit/debit,
                e-wallets, and PayPal, additional fees will be deducted per
                sale.
                {'\n\n'}
                We've partnered with PayMongo so you can make secure,
                convenient, and reliable payments via credit/debit cards and
                e-wallets.
              </Text>
              <Collapsible
                title="Card paymens: Visa and Mastercard"
                isOpen={true}>
                <Text
                  style={[
                    typography.caption,
                    typography.medium,
                    { marginBottom: normalize(16) },
                  ]}>
                  Payment Fee: 3.5% + ₱15
                </Text>
                <Text
                  style={[typography.body2, { marginBottom: normalize(16) }]}>
                  Your customers can pay using the payment methods you set on
                  each post. Please note that for payments made using
                  credit/debit, e-wallets, and PayPal, additional fees will be
                  deducted per sale.
                  {'\n\n'}
                  We've partnered with PayMongo so you can make secure,
                  convenient, and reliable payments via credit/debit cards and
                  e-wallets.
                </Text>
                <View style={styles.pill}>
                  <Text style={[typography.caption, { flex: 1 }]}>
                    Transaction Amount
                  </Text>
                  <Text style={[typography.caption, typography.textRight]}>
                    ₱360.00
                  </Text>
                </View>
                <View style={styles.pill}>
                  <Text style={[typography.caption, { flex: 1 }]}>
                    Payment Fee 3.5% + ₱15
                  </Text>
                  <Text style={[typography.caption, typography.textRight]}>
                    ₱27.60
                  </Text>
                </View>
                <View style={[styles.pill, styles.darkPill]}>
                  <Text
                    style={[
                      typography.caption,
                      typography.medium,
                      { flex: 1, color: Colors.primaryMidnightBlue },
                    ]}>
                    Net Amount
                  </Text>
                  <Text
                    style={[
                      typography.caption,
                      typography.medium,
                      typography.textRight,
                      { color: Colors.primaryMidnightBlue },
                    ]}>
                    ₱332.40
                  </Text>
                </View>
              </Collapsible>

              <Collapsible title="E-wallets: GCash and GrabPay" isOpen={true}>
                <Text
                  style={[
                    typography.caption,
                    typography.medium,
                    { marginBottom: normalize(16) },
                  ]}>
                  Payment Fee: 2.9%
                </Text>
                <Text
                  style={[typography.body2, { marginBottom: normalize(16) }]}>
                  If any of these payment channels is selected, customers will
                  be redirected to a new page where they can log in to their
                  account. After the transaction, they will be redirected back
                  to our app to confirm that the order has pushed through.
                </Text>
                <View style={styles.pill}>
                  <Text style={[typography.caption, { flex: 1 }]}>
                    Transaction Amount
                  </Text>
                  <Text style={[typography.caption, typography.textRight]}>
                    ₱360.00
                  </Text>
                </View>
                <View style={styles.pill}>
                  <Text style={[typography.caption, { flex: 1 }]}>
                    Payment Fee 2.9%
                  </Text>
                  <Text style={[typography.caption, typography.textRight]}>
                    ₱10.44
                  </Text>
                </View>
                <View style={[styles.pill, styles.darkPill]}>
                  <Text
                    style={[
                      typography.caption,
                      typography.medium,
                      { flex: 1, color: Colors.primaryMidnightBlue },
                    ]}>
                    Net Amount
                  </Text>
                  <Text
                    style={[
                      typography.caption,
                      typography.medium,
                      typography.textRight,
                      { color: Colors.primaryMidnightBlue },
                    ]}>
                    ₱349.56
                  </Text>
                </View>
              </Collapsible>

              <Collapsible title="PayPal" isOpen={true}>
                <Text
                  style={[
                    typography.caption,
                    typography.medium,
                    { marginBottom: normalize(10) },
                  ]}>
                  Payment Fee: 3.90% + ₱15
                </Text>
                <View
                  style={[styles.blockQuote, { marginBottom: normalize(16) }]}>
                  <Text
                    style={[
                      typography.caption,
                      { color: Colors.contentPlaceholder },
                    ]}>
                    Domestic payments: 3.9% + Fixed Fee International payments:
                    4.4% + Fixed Fee
                  </Text>
                </View>
                <Text
                  style={[typography.body2, { marginBottom: normalize(16) }]}>
                  Customers will be redirected to a new page where they can log
                  in to their account. After the transaction, they will be
                  redirected back to our app to confirm that the order has
                  pushed through.
                </Text>
                <View style={styles.pill}>
                  <Text style={[typography.caption, { flex: 1 }]}>
                    Transaction Amount
                  </Text>
                  <Text style={[typography.caption, typography.textRight]}>
                    ₱360.00
                  </Text>
                </View>
                <View style={styles.pill}>
                  <Text style={[typography.caption, { flex: 1 }]}>
                    Payment Fee: 3.90% + ₱15
                  </Text>
                  <Text style={[typography.caption, typography.textRight]}>
                    ₱29.04
                  </Text>
                </View>
                <View style={[styles.pill, styles.darkPill]}>
                  <Text
                    style={[
                      typography.caption,
                      typography.medium,
                      { flex: 1, color: Colors.primaryMidnightBlue },
                    ]}>
                    Net Amount
                  </Text>
                  <Text
                    style={[
                      typography.caption,
                      typography.medium,
                      typography.textRight,
                      { color: Colors.primaryMidnightBlue },
                    ]}>
                    ₱330.96
                  </Text>
                </View>
              </Collapsible>

              <Collapsible title="Cash" isOpen={true}>
                <Text
                  style={[typography.body2, { marginBottom: normalize(16) }]}>
                  Customers can still pay using cash. For this payment option,
                  the seller/service provider should send the payment
                  instructions and reminders directly to the customer using
                  chat.
                </Text>
              </Collapsible>
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonWrapper}>
          <Button
            label="Okay, got it!"
            type="primary"
            onPress={navigation.goBack}
          />
        </View>
      </View>
    </>
  )
}

/**
 * @param {object} props
 * @param {string} props.title
 * @param {boolean} props.isOpen
 **/
const Collapsible = ({ title, children, ...props }) => {
  const [isOpen, setIsOpen] = useState(!!props.isOpen)

  const handlePress = () => {
    LayoutAnimation.configureNext({
      duration: 120,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
    })
    setIsOpen(!isOpen)
  }

  return (
    <View style={styles.collapsible}>
      <TouchableOpacity
        style={styles.collapsibleHeader}
        activeOpacity={0.7}
        onPress={handlePress}>
        <Text
          style={[
            typography.body2,
            typography.medium,
            styles.collapsibleTitle,
          ]}>
          {title}
        </Text>
        <Icons.ChevronDown style={{ color: Colors.icon }} />
      </TouchableOpacity>
      {!!isOpen && <View style={styles.collapsibleContent}>{children}</View>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Platform.select({
      ios: 0,
      android: StatusBar.currentHeight - 2,
    }),
  },
  header: {
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  titleWrapper: { alignItems: 'center' },
  title: {
    ...typography.body1,
    ...typography.medium,
    marginVertical: normalize(16),
  },
  content: {
    flex: 1,
    padding: normalize(24),
  },
  buttonWrapper: {
    padding: normalize(24),
    paddingTop: 0,
  },
  collapsible: {
    paddingHorizontal: normalize(14),
    borderColor: Colors.neutralGray,
    borderRadius: normalize(4),
    borderWidth: normalize(1),
    marginTop: normalize(24),
  },
  collapsibleHeader: {
    paddingVertical: normalize(16),
    flexDirection: 'row',
  },
  collapsibleTitle: {
    flex: 1,
  },
  collapsibleContent: {
    marginBottom: normalize(16),
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(12),
    backgroundColor: Colors.secondarySolitude,
    marginBottom: normalize(8),
  },
  darkPill: {
    backgroundColor: Colors.primaryAliceBlue,
  },
  blockQuote: {
    borderLeftWidth: normalize(2),
    borderColor: Colors.ServbeesYellow,
    paddingLeft: normalize(10),
    paddingVertical: normalize(4),
  },
})

export default PaymentFeesScreen
