import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  Text,
  Keyboard,
} from 'react-native'
import axios from 'axios'
import base64 from 'react-native-base64'
import { iconSize, validateCardNumber } from '@/globals/Utils'
import Api from '@/services/Api'

import { normalize, Colors } from '@/globals'
import { Icons, MasterCard, Visa } from '@/assets/images/icons'
import { Picker } from 'native-base'
import { provinces } from 'psgc'
import { UserContext } from '@/context/UserContext'
import typography from '@/globals/typography'
import Loader from '@/components/loader'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import TextInput from '@/components/textinput'
import Button from '@/components/Button'
import { formatNumber } from 'react-native-currency-input'
import firestore from '@react-native-firebase/firestore'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { PAYMONGO_SECRET_KEY } from '@env'

const DismissKeyboardView = ({ children, ...props }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View {...props}>{children}</View>
    </TouchableWithoutFeedback>
  )
}
const paymongoSK = base64.encode(PAYMONGO_SECRET_KEY)

/**
 * @typedef {object} CreditCardProps
 * @property {object} orderData
 */

/**
 * @typedef {object} RootProps
 * @property {CreditCardProps} CreditCard
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'CreditCard'>} param0 */
const CreditCardScreen = ({ navigation, route }) => {
  const { orderData } = route.params
  const { userInfo } = useContext(UserContext)

  const totalPrice =
    orderData.offer ||
    (orderData?.items || []).reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    )

  const [errors, setErrors] = useState({
    name: '',
    cardNumber: '',
    cvv: '',
    expiry: '',
    addressLine1: '',
    province: '',
    city: '',
    zipCode: '',
    country: '',
  })

  const [dirtyStates, setDirtyStates] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    cvv: '',
    expiry: '',
  })

  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    province: '',
    city: '',
    country: 'Philippines',
    zipCode: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const getProvinces = () =>
    provinces
      .all()
      .map(province => province.name)
      .sort()

  const getCities = province =>
    provinces.find(province)?.municipalities.sort() || []

  const createPaymentMethod = async () => {
    const {
      line1,
      line2,
      province: state,
      city,
      zipCode: postal_code,
    } = address
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://api.paymongo.com/v1/payment_methods',
        data: JSON.stringify({
          data: {
            attributes: {
              details: {
                card_number: formData.cardNumber.replace(/\s/g, ''),
                exp_month: parseInt(formData.expiry.split('/')[0]),
                exp_year: parseInt(formData.expiry.split('/')[1]),
                cvc: formData.cvv,
              },
              type: 'card',
              billing: {
                address: {
                  line1,
                  line2,
                  city,
                  state,
                  postal_code,
                  country: 'PH',
                },
                name: userInfo.full_name,
                email: userInfo.email,
              },
              metadata: null,
            },
          },
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${paymongoSK}`,
        },
      })
      return response.data.data.id
    } catch (error) {
      console.log(error.response.data.errors)
      throw error
    }
  }

  const checkErrors = () => {
    const errors = {
      name: '',
      cardNumber: '',
      cvv: '',
      expiry: '',
      addressLine1: '',
      province: '',
      city: '',
      zipCode: '',
      country: '',
    }

    if (!formData.name.length) errors.name = 'This field is required'
    if (
      formData.cardNumber.replace(/\s/g, '').length !== 16 ||
      !['visa', 'mastercard'].includes(
        validateCardNumber(formData.cardNumber.replace(/\s/g, ''))
      )
    )
      errors.cardNumber = 'Invalid card number'
    if (!/^[0-9]{3}$/.test(formData.cvv)) errors.cvv = 'Invalid CVC/CVV'

    const mm = parseInt(formData.expiry.slice(0, 2))
    if (!/^[0-9]{2}\/[0-9]{2}$/.test(formData.expiry) || mm > 12)
      errors.expiry = 'Invalid date'

    if (!address.line1.length) errors.addressLine1 = 'This field is required'
    if (!address.province.length) errors.province = 'This field is required'
    if (!address.city.length) errors.city = 'This field is required'
    if (!address.zipCode.length) errors.zipCode = 'This field is required'

    setErrors(errors)
    return Object.values(errors).some(error => error.length)
  }

  const canSubmit = () => {
    return !Object.values(errors).some(error => error.length)
  }

  const handleOnSubmit = async () => {
    setIsLoading(true)
    try {
      const amount = totalPrice * 100
      const paymentMethodId = await createPaymentMethod()
      const response = await Api.createCardPayment({
        body: {
          amount,
          order_id: orderData.id,
          payment_method_id: paymentMethodId,
        },
      })
      const { data: seller } = await Api.getUser({ uid: orderData.seller_id })
      setIsLoading(false)

      if (response.data.attributes.status === 'succeeded') {
        navigation.navigate('payment-status', {
          status: 'processing',
          amount: totalPrice,
          paymentId: response.data.id,
          sellerName: seller.display_name || seller.full_name,
        })
      } else if (response.data.attributes.status === 'awaiting_next_action') {
        navigation.navigate('card-authentication', {
          title: 'One-Time PIN',
          uri: response.data.data.attributes.next_action.redirect.url,
          onComplete: () => {
            navigation.goBack()
            navigation.navigate('payment-status', {
              status: 'processing',
              amount: totalPrice,
              paymentId: response.data.id,
              sellerName: seller.display_name || seller.full_name,
            })
          },
        })
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error, error.message)
      navigation.navigate('payment-status', {
        status: 'failed',
        amount: totalPrice,
      })
    }
  }

  const renderCardIcon = cardNumber => {
    switch (validateCardNumber(cardNumber.replace(/\s/g, ''))) {
      case 'visa':
        return <Visa width={normalize(25)} height={normalize(25)} />
      case 'mastercard':
        return <MasterCard width={normalize(25)} height={normalize(25)} />
    }

    return null
  }

  useEffect(() => {
    checkErrors()
  }, [formData, dirtyStates])

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <Loader visible={isLoading} />
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
              Visa / Mastercard
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <KeyboardAwareScrollView
            extraHeight={40}
            keyboardOpeningTime={50}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <DismissKeyboardView>
              <Text style={[typography.body1narrow, typography.medium]}>
                Card Details
              </Text>
              <Text
                style={[
                  typography.caption,
                  {
                    color: Colors.contentPlaceholder,
                    marginBottom: normalize(16),
                    marginTop: normalize(4),
                  },
                ]}>
                We do not store credit card information.
              </Text>

              <View style={styles.formGroup}>
                <TextInput
                  label="Cardholder Name"
                  value={formData.name}
                  onChangeText={name => {
                    setDirtyStates(dirtyStates => [
                      ...new Set([...dirtyStates, 'name']),
                    ])
                    setFormData(data => ({ ...data, name }))
                  }}
                  onBlur={() =>
                    setDirtyStates(dirtyStates => [
                      ...new Set([...dirtyStates, 'name']),
                    ])
                  }
                  containerStyle={
                    errors.name.length && dirtyStates.includes('name')
                      ? { borderColor: Colors.secondaryBrinkPink }
                      : {}
                  }
                />
                {!!errors.name.length && dirtyStates.includes('name') && (
                  <Text style={[typography.caption, styles.errorMessage]}>
                    {errors.name}
                  </Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <TextInput
                  label="Card Number"
                  value={formData.cardNumber}
                  onChangeText={cardNumber => {
                    setDirtyStates(dirtyStates => [
                      ...new Set([...dirtyStates, 'cardNumber']),
                    ])
                    setFormData(data => ({
                      ...data,
                      cardNumber: cardNumber
                        .replace(/\s?/g, '')
                        .replace(/(\d{4})/g, '$1 ')
                        .trim(),
                    }))
                  }}
                  onBlur={() =>
                    setDirtyStates(dirtyStates => [
                      ...new Set([...dirtyStates, 'cardNumber']),
                    ])
                  }
                  containerStyle={
                    errors.cardNumber.length &&
                    dirtyStates.includes('cardNumber')
                      ? { borderColor: Colors.secondaryBrinkPink }
                      : {}
                  }
                />
                {!!errors.cardNumber.length &&
                  dirtyStates.includes('cardNumber') &&
                  dirtyStates.includes('cardNumber') && (
                    <Text style={[typography.caption, styles.errorMessage]}>
                      {errors.cardNumber}
                    </Text>
                  )}

                <View
                  style={{
                    position: 'absolute',
                    top: normalize(15),
                    right: normalize(16),
                  }}>
                  {renderCardIcon(formData.cardNumber)}
                </View>
              </View>

              <View style={styles.formGroup}>
                <TextInput
                  label="CVV / CVC"
                  value={formData.cvv}
                  onChangeText={cvv => {
                    setDirtyStates(dirtyStates => [
                      ...new Set([...dirtyStates, 'cvv']),
                    ])
                    setFormData(data => ({ ...data, cvv }))
                  }}
                  onBlur={() =>
                    setDirtyStates(dirtyStates => [
                      ...new Set([...dirtyStates, 'cvv']),
                    ])
                  }
                  containerStyle={
                    errors.cvv.length && dirtyStates.includes('cvv')
                      ? { borderColor: Colors.secondaryBrinkPink }
                      : {}
                  }
                  secureTextEntry={true}
                  maxLength={3}
                  keyboardType="numeric"
                />
                <Text
                  style={[
                    typography.caption,
                    {
                      color: Colors.contentPlaceholder,
                      marginTop: normalize(4),
                    },
                  ]}>
                  The 3-digit number on the back of your card
                </Text>
                {!!errors.cvv.length && dirtyStates.includes('cvv') && (
                  <Text style={[typography.caption, styles.errorMessage]}>
                    {errors.cvv}
                  </Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <TextInput
                  label="MM / YY"
                  value={formData.expiry}
                  onChangeText={expiry => {
                    setDirtyStates(dirtyStates => [
                      ...new Set([...dirtyStates, 'expiry']),
                    ])
                    if (expiry.length === 2 && formData.expiry.length === 1)
                      expiry += '/'
                    else if (expiry.length > 2 && expiry.indexOf('/') !== 2)
                      return
                    setFormData(data => ({ ...data, expiry }))
                  }}
                  maxLength={5}
                  keyboardType="numeric"
                  onBlur={() =>
                    setDirtyStates(dirtyStates => [
                      ...new Set([...dirtyStates, 'expiry']),
                    ])
                  }
                  containerStyle={
                    errors.expiry.length && dirtyStates.includes('expiry')
                      ? { borderColor: Colors.secondaryBrinkPink }
                      : {}
                  }
                />
                <Text
                  style={[
                    typography.caption,
                    {
                      color: Colors.contentPlaceholder,
                      marginTop: normalize(4),
                    },
                  ]}>
                  Card expiry date
                </Text>
                {!!errors.expiry.length && dirtyStates.includes('expiry') && (
                  <Text style={[typography.caption, styles.errorMessage]}>
                    {errors.expiry}
                  </Text>
                )}
              </View>

              <Text
                style={[
                  typography.body1narrow,
                  typography.medium,
                  { marginVertical: normalize(16) },
                ]}>
                Billing Address
              </Text>

              <View style={styles.formGroup}>
                <View
                  style={[
                    styles.pickerWrapper,
                    address.country.length
                      ? { borderColor: Colors.contentEbony }
                      : {},
                  ]}>
                  <Picker
                    selectedValue={address.country}
                    textStyle={typography.body1}
                    itemTextStyle={typography.body1}
                    onValueChange={country =>
                      setAddress(address => ({ ...address, country }))
                    }>
                    <Picker.Item
                      label="Philippines"
                      value="Philippines"
                      color={Colors.contentEbony}
                    />
                  </Picker>
                </View>

                {!!errors.country.length && dirtyStates.includes('country') && (
                  <Text style={[typography.caption, styles.errorMessage]}>
                    {errors.country}
                  </Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <TextInput
                  label="Unit / House / Building / Street"
                  value={address.line1}
                  onChangeText={line1 => {
                    setDirtyStates(dirtyStates => [
                      ...new Set([...dirtyStates, 'addressLine1']),
                    ])
                    setAddress(address => ({
                      ...address,
                      line1,
                    }))
                  }}
                  wrapperStyle={
                    errors.addressLine1.length
                      ? { borderColor: Colors.secondaryBrinkPink }
                      : {}
                  }
                />

                {!!errors.addressLine1.length &&
                  dirtyStates.includes('addressLine1') && (
                    <Text style={[typography.caption, styles.errorMessage]}>
                      {errors.addressLine1}
                    </Text>
                  )}
              </View>

              <View style={styles.formGroup}>
                <TextInput
                  label="Subdivision / Apartment / Village"
                  value={address.line2}
                  onChangeText={line2 => {
                    setAddress(address => ({
                      ...address,
                      line2,
                    }))
                  }}
                />
              </View>

              <View style={styles.formGroup}>
                <View
                  style={[
                    styles.pickerWrapper,
                    errors.province.length && dirtyStates.includes('province')
                      ? { borderColor: Colors.secondaryBrinkPink }
                      : {},
                  ]}>
                  <Picker
                    selectedValue={address.province}
                    textStyle={typography.body1}
                    itemTextStyle={typography.body1}
                    onValueChange={province => {
                      setDirtyStates(dirtyStates => [
                        ...new Set([...dirtyStates, 'province']),
                      ])
                      setAddress(address => ({ ...address, province }))
                    }}>
                    <Picker.Item
                      key={0}
                      label="Select a province"
                      color={Colors.contentPlaceholder}
                      value=""
                    />
                    {getProvinces().map(province => (
                      <Picker.Item
                        label={province}
                        color={Colors.contentEbony}
                        value={province}
                        key={province}
                      />
                    ))}
                  </Picker>
                </View>

                {!!errors.province.length &&
                  dirtyStates.includes('province') && (
                    <Text style={[typography.caption, styles.errorMessage]}>
                      {errors.province}
                    </Text>
                  )}
              </View>

              <View style={styles.formGroup}>
                <View
                  style={[
                    styles.pickerWrapper,
                    errors.city.length && dirtyStates.includes('city')
                      ? { borderColor: Colors.secondaryBrinkPink }
                      : {},
                  ]}>
                  <Picker
                    selectedValue={address.city}
                    textStyle={typography.body1}
                    itemTextStyle={typography.body1}
                    enabled={!!address.province.length}
                    onValueChange={city => {
                      setDirtyStates(dirtyStates => [
                        ...new Set([...dirtyStates, 'city']),
                      ])
                      setAddress(address => ({ ...address, city }))
                    }}>
                    <Picker.Item
                      key={0}
                      label="Select a city"
                      color={Colors.contentPlaceholder}
                      value=""
                    />
                    {getCities(address.province).map(city => (
                      <Picker.Item
                        label={city}
                        color={Colors.contentEbony}
                        value={city}
                        key={city}
                      />
                    ))}
                  </Picker>
                </View>
                {!!errors.city.length && dirtyStates.includes('city') && (
                  <Text style={[typography.caption, styles.errorMessage]}>
                    {errors.city}
                  </Text>
                )}
              </View>

              <View>
                <TextInput
                  label="Zip Code"
                  value={address.zipCode}
                  onChangeText={zipCode => {
                    setDirtyStates(dirtyStates => [
                      ...new Set([...dirtyStates, 'zipCode']),
                    ])
                    setAddress(address => ({
                      ...address,
                      zipCode,
                    }))
                  }}
                  wrapperStyle={
                    errors.zipCode.length
                      ? { borderColor: Colors.secondaryBrinkPink }
                      : {}
                  }
                  keyboardType="numeric"
                  maxLength={4}
                />

                {!!errors.zipCode.length && dirtyStates.includes('zipCode') && (
                  <Text style={[typography.caption, styles.errorMessage]}>
                    {errors.zipCode}
                  </Text>
                )}
              </View>

              <View style={styles.buttonWrapper}>
                <Button
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  onPress={handleOnSubmit}
                  disabled={!canSubmit()}
                  type={!canSubmit() ? 'disabled' : 'primary'}>
                  <Text style={[typography.body1narrow, typography.medium]}>
                    Confirm and Pay
                  </Text>
                  <Text style={[typography.subtitle1]}>
                    ₱
                    {formatNumber(totalPrice, {
                      separator: '.',
                      precision: 2,
                      delimiter: ',',
                    })}
                  </Text>
                </Button>
              </View>
            </DismissKeyboardView>
          </KeyboardAwareScrollView>
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
  buyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.primaryYellow,
    borderRadius: 5,
  },
  pickerWrapper: {
    paddingHorizontal: normalize(8),
    borderColor: Colors.neutralGray,
    borderWidth: 1,
    borderRadius: 4,
    height: normalize(54),
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
    paddingBottom: 0,
  },
  errorMessage: {
    color: Colors.secondaryBrinkPink,
    display: 'flex',
    marginTop: normalize(4),
  },
  formGroup: {
    marginBottom: normalize(16),
  },
  buttonWrapper: {
    paddingVertical: normalize(24),
  },
})

export default CreditCardScreen
