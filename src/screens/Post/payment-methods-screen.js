import { Icons } from '@/assets/images/icons'
import Button from '@/components/Button'
import Checkbox from '@/components/checkbox'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import React, { useState } from 'react'
import {
  LayoutAnimation,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  StatusBar,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { getStatusBarHeight } from 'react-native-status-bar-height'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

/**
 * @typedef {object} PaymentMethodsScreenProps
 * @property {string[]} data
 * @property {function} onSubmit
 * @property {string[]} disabledMethods
 */

/**
 * @typedef {object} RootProps
 * @property {PaymentMethodsScreenProps} PaymentMethodsScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'PaymentMethodsScreen'>} param0 */
const PaymentMethodsScreen = ({ navigation, route }) => {
  const { data, onSubmit, disabledMethods } = route.params
  const [paymentMethods, setPaymentMethods] = useState(data || [])

  const handleSubmit = () => {
    onSubmit(paymentMethods)
  }

  const handleOnLearnMorePress = () => {
    navigation.navigate('payment-fees')
  }

  const handleCheckboxPress = method => {
    const index = paymentMethods.findIndex(
      paymentMethod => paymentMethod === method
    )
    if (~index) paymentMethods.splice(index, 1)
    else paymentMethods.push(method)

    LayoutAnimation.configureNext({
      duration: 120,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
    })

    setPaymentMethods([...paymentMethods])
  }

  const methods = [
    {
      renderActiveIcon: () => <Icons.CashPaymentActive />,
      renderDisabledIcon: () => <Icons.CashPaymentActive />,
      renderInactiveIcon: () => <Icons.CashPayment />,
      label: 'Cash',
      value: 'cash',
      renderContent: () => null,
      disabled: disabledMethods.includes('cash'),
    },
    {
      renderActiveIcon: () => <Icons.PayPalPaymentActive />,
      renderDisabledIcon: () => <Icons.PayPalPaymentActive />,
      renderInactiveIcon: () => <Icons.PayPalPayment />,
      label: 'PayPal',
      value: 'paypal',
      renderContent: () => (
        <View style={styles.checkboxContent}>
          <Text
            style={[typography.caption, { color: Colors.contentPlaceholder }]}>
            3.9% + ₱15.00 will be deducted from your entire bill
          </Text>
        </View>
      ),
      disabled: disabledMethods.includes('paypal'),
    },

    {
      renderActiveIcon: () => <Icons.GCashPaymentActive />,
      renderInactiveIcon: () => <Icons.GCashPayment />,
      renderDisabledIcon: () => <Icons.GCashDisabled />,
      label: 'GCash',
      value: 'gcash',
      renderContent: () => (
        <View style={styles.checkboxContent}>
          <Text
            style={[
              typography.caption,
              {
                color: Colors.contentPlaceholder,
              },
            ]}>
            2.9% fee will be deducted from your entire bill
          </Text>
        </View>
      ),
      disabled: disabledMethods.includes('gcash'),
    },
    {
      renderActiveIcon: () => <Icons.CardPaymentActive />,
      renderInactiveIcon: () => <Icons.CardPayment />,
      renderDisabledIcon: () => <Icons.CardDisabled />,
      label: 'Visa/Mastercard',
      value: 'card',
      renderContent: () => (
        <View style={styles.checkboxContent}>
          <Text
            style={[
              typography.caption,
              {
                color: Colors.contentPlaceholder,
              },
            ]}>
            3.5% + ₱15.00 for cards issued in the Philippines; 4.5% + ₱15.00 for
            cards issued outside the Philippines
          </Text>
        </View>
      ),
      disabled: disabledMethods.includes('card'),
    },
    {
      renderActiveIcon: () => <Icons.GrabPayPaymentActive />,
      renderInactiveIcon: () => <Icons.GrabPayPayment />,
      renderDisabledIcon: () => <Icons.GrabPayDisabled />,
      label: 'GrabPay',
      value: 'grabpay',
      renderContent: () => (
        <View style={styles.checkboxContent}>
          <Text
            style={[
              typography.caption,
              {
                color: Colors.contentPlaceholder,
              },
            ]}>
            2.9% fee will be deducted from your entire bill
          </Text>
        </View>
      ),
      disabled: disabledMethods.includes('grabpay'),
    },
  ]

  const renderPaymentMethod = (item, index, arr) => {
    return (
      <View
        key={item.value}
        style={[
          styles.checkboxWrapper,
          index === arr.length - 1 ? { borderBottomWidth: 0 } : {},
        ]}>
        <Checkbox
          onPress={() => handleCheckboxPress(item.value)}
          disabled={item.disabled}
          containerStyle={[
            styles.checkbox,
            paymentMethods.includes(item.value) && item.renderContent()
              ? { paddingBottom: 10 }
              : {},
          ]}
          checked={paymentMethods.includes(item.value)}>
          <Text
            style={[
              typography.body1,
              styles.checkboxLabel,
              item.disabled ? { color: Colors.icon } : {},
            ]}>
            {item.label}
          </Text>
          {item.disabled
            ? item.renderDisabledIcon()
            : paymentMethods.includes(item.value)
            ? item.renderActiveIcon()
            : item.renderInactiveIcon()}
        </Checkbox>
        {paymentMethods.includes(item.value) && item.renderContent()}
      </View>
    )
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
            <Text style={styles.title}>Payment Methods</Text>
          </View>
        </View>
        <ScrollView>
          <View style={styles.content}>
            <Text style={[typography.body1, styles.contentTitle]}>
              What are your preferred payment options?
            </Text>
            <Text style={[typography.caption, styles.sub]}>
              Note: payment processing fee will be applied to purchases made
              through GCash, PayPal, Visa, and Mastercard.
            </Text>
            <TouchableOpacity
              style={styles.learnMore}
              activeOpacity={0.7}
              onPress={handleOnLearnMorePress}>
              <Text style={[typography.caption, typography.link]}>
                Learn More
              </Text>
            </TouchableOpacity>
            {methods.map(renderPaymentMethod)}
            {disabledMethods.includes('gcash') && (
              <View style={styles.disabledInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icons.DisabledPayment />
                  <Text
                    style={[
                      typography.body2,
                      typography.medium,
                      {
                        color: Colors.primaryMidnightBlue,
                        marginLeft: normalize(8),
                      },
                    ]}>
                    ₱100 minimum amount
                  </Text>
                </View>
                <Text style={[typography.caption, { marginTop: normalize(4) }]}>
                  To enable other payment options, total amount of the product
                  or service you will avail of must be at least ₱100 and up.{' '}
                </Text>

                <TouchableOpacity
                  style={[styles.linkWrapper, { marginTop: normalize(8) }]}
                  activeOpacity={0.7}
                  onPress={navigation.goBack}>
                  <Text
                    style={[
                      typography.body2,
                      typography.link,
                      typography.medium,
                    ]}>
                    Edit Item/Service
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
        <View>
          <LinearGradient
            style={{
              height: normalize(20),
              width: '100%',
              position: 'absolute',
              top: normalize(-20),
              zIndex: 1,
            }}
            colors={['transparent', 'rgba(65,65,65,0.05)']}
            locations={[0, 1]}
            pointerEvents="none"
          />
          <View style={styles.buttonWrapper}>
            <Button label="Save" type="primary" onPress={handleSubmit} />
          </View>
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
  title: {
    ...typography.body2,
    ...typography.medium,
  },
  content: {
    flex: 1,
    padding: normalize(24),
  },
  contentTitle: {
    color: Colors.primaryMidnightBlue,
  },
  sub: {
    marginTop: normalize(4),
  },
  learnMore: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(4),
    marginBottom: normalize(16),
    marginTop: normalize(16),
  },
  buttonWrapper: {
    padding: normalize(24),
  },
  checkbox: {
    flexDirection: 'row-reverse',
    paddingVertical: normalize(16),
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: normalize(12),
  },
  checkboxContent: {
    marginBottom: normalize(16),
  },
  checkboxWrapper: {
    borderBottomColor: Colors.Gainsboro,
    borderBottomWidth: normalize(1),
  },
  disabledInfo: {
    padding: normalize(16),
    backgroundColor: Colors.secondarySolitude,
    marginTop: normalize(24),
  },
  linkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(8),
  },
})

export default PaymentMethodsScreen
