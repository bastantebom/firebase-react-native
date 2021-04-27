import React, { useState } from 'react'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Icons } from '@/assets/images/icons'
import { iconSize, isEmail } from '@/globals/Utils'
import TextInput from '@/components/textinput'
import Button from '@/components/Button'
import Api from '@/services/Api'
import Toast from '@/components/toast'
import Loader from '@/components/loader'

/**
 * @typedef {object} SetPayoutMethodScreenProps
 * @property {string} method
 */

/**
 * @typedef {object} RootProps
 * @property {SetPayoutMethodScreenProps} SetPayoutMethodScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'SetPayoutMethodScreen'>} param0 */
const SetPayoutMethodScreen = ({ navigation, route }) => {
  const { method } = route.params
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({
    account_number: '',
    account_name: '',
    bank: '',
    email_address: '',
  })

  const title = {
    gcash: 'GCash',
    bank: 'Bank',
    paypal: 'PayPal',
  }

  const label = {
    gcash: 'Enter your GCash mobile number',
    bank: 'Enter your Bank account details',
    paypal: 'Enter your PayPal account details',
  }

  const handleOnSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await Api.savePayoutMethod({ body: { ...data, method } })
      if (!response.success) throw new Error(response.message)

      setIsLoading(false)
      navigation.navigate('success')
    } catch (error) {
      console.log(error)
      Toast.show({
        label: 'Oops! Something went wrong',
        type: 'error',
        dismissible: true,
        timeout: 5000,
        screenId: 'set-payout-method',
      })
    }
    setIsLoading(false)
  }

  const handleOnSelectBankPress = () => {
    navigation.navigate('banks', {
      onSelect: bank => {
        setData(data => ({ ...data, bank }))
        navigation.goBack()
      },
    })
  }

  const canSubmit = () => {
    if (method === 'gcash') {
      if (!/^\d{10}$/.test(data.account_number)) return false
    } else if (method === 'paypal') {
      if (!isEmail(data.email_address) || !data.account_name.length)
        return false
    } else if (method === 'bank') {
      if (
        !data.account_name.length ||
        !data.account_number.length ||
        !data.bank.length
      )
        return false
    }

    return true
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <Loader visible={isLoading} />
      <Toast
        containerStyle={{ marginTop: normalize(8) }}
        ref={ref => Toast.setRef(ref, 'set-payout-method')}
      />
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
              {title[method]}
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text style={[typography.body2, typography.medium]}>
            {label[method]}
          </Text>
          <Text
            style={[
              typography.caption,
              { color: Colors.contentPlaceholder, marginTop: normalize(8) },
            ]}>
            This is where your future payouts will be deposited weekly on
            Thursday for payments made using credit/debit, e-wallets, and
            PayPal.
          </Text>

          {method === 'gcash' && (
            <>
              <TextInput
                value={data.account_number}
                selectTextOnFocus={false}
                placeholder="10 digit number"
                onChangeText={account_number =>
                  setData(data => ({
                    ...data,
                    account_number,
                  }))
                }
                keyboardType="phone-pad"
                returnKeyType="done"
                maxLength={10}
                containerStyle={{
                  marginTop: normalize(16),
                }}
                inputStyle={{
                  marginLeft: normalize(40),
                }}>
                <Text
                  style={[
                    typography.body1,
                    {
                      color: Colors.icon,
                      position: 'absolute',
                      top: normalize(14.5),
                      left: normalize(16),
                    },
                  ]}>
                  +63
                </Text>
              </TextInput>
            </>
          )}

          {method === 'paypal' && (
            <>
              <TextInput
                value={data.account_name}
                label="Account Name"
                onChangeText={account_name =>
                  setData({
                    ...data,
                    account_name,
                  })
                }
                containerStyle={{ marginTop: normalize(16) }}
              />
              <TextInput
                value={data.email_address}
                label="Email Address"
                onChangeText={email_address =>
                  setData({
                    ...data,
                    email_address,
                  })
                }
                containerStyle={{ marginTop: normalize(16) }}
                keyboardType="email-address"
              />
            </>
          )}

          {method === 'bank' && (
            <>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleOnSelectBankPress}>
                <TextInput
                  value={data.bank}
                  label="Select Bank"
                  disabled={true}
                  editable={false}
                  containerStyle={{ marginTop: normalize(16) }}
                  rightIcon={() => (
                    <Icons.ChevronDown style={{ color: Colors.icon }} />
                  )}
                  inputStyle={{
                    color: Colors.contentEbony,
                  }}
                />
              </TouchableOpacity>
              <TextInput
                value={data.account_name}
                label="Account Name"
                onChangeText={account_name =>
                  setData({
                    ...data,
                    account_name,
                  })
                }
                containerStyle={{ marginTop: normalize(16) }}
              />

              <TextInput
                value={data.account_number}
                label="Account Number"
                onChangeText={account_number =>
                  setData({
                    ...data,
                    account_number,
                  })
                }
                containerStyle={{ marginTop: normalize(16) }}
              />
            </>
          )}
        </View>
        <View style={styles.buttonsWrapper}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: normalize(16),
            }}>
            <Icons.InfoCircle
              style={{ color: Colors.icon, marginRight: normalize(10) }}
              {...iconSize(16)}
            />
            <Text
              style={[
                typography.caption,
                { color: Colors.contentPlaceholder },
              ]}>
              Review all account details before you save.
            </Text>
          </View>
          <Button
            disabled={!canSubmit()}
            label="Save"
            type={!canSubmit() ? 'disabled' : 'primary'}
            onPress={handleOnSubmit}
          />
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
  buttonsWrapper: {
    padding: normalize(24),
  },
})

export default SetPayoutMethodScreen
