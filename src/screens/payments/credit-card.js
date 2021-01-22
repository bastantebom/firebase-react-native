import React, { useContext, useState } from 'react'
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import axios from 'axios'
import base64 from 'react-native-base64'
import { validateCardNumber } from '@/globals/Utils'
import Api from '@/services/Api'

import {
  AppText,
  AppInput,
  ScreenHeaderTitle,
  TransitionIndicator,
} from '@/components'

import { normalize, Colors } from '@/globals'
import { MasterCard, Visa } from '@/assets/images/icons'
import { Picker } from 'native-base'
import { provinces } from 'psgc'
import { UserContext } from '@/context/UserContext'

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

  const totalPrice = orderData.items.reduce(
    (total, item) => total + +(item.price * item.quantity),
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
      country,
      zipCode: postal_code,
    } = address
    const paymongoSK = base64.encode('sk_test_Hf4GQS4e8sBEzUe6a3rwyfGx')
    try {
      const paymentMethodResponse = await axios({
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
      return paymentMethodResponse.data.data.id
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

  const handleSubmit = async () => {
    if (checkErrors()) return
    let status = 'failed'
    setIsLoading(true)
    try {
      const paymentMethodId = await createPaymentMethod()
      const response = await Api.createCardPayment({
        body: {
          amount: totalPrice * 100,
          currency: 'PHP',
          order_id: orderData.id,
          payment_method_id: paymentMethodId,
        },
      })
      if (!response.success) {
        throw new Error(response.message)
      }
      status = 'success'
    } catch (error) {
      console.log(error, error.message)
      Alert.alert('Error', 'Oops, something went wrong.')
    }

    navigation.navigate('payment-status', { status, amount: totalPrice })
    setIsLoading(false)
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

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
      <TransitionIndicator loading={isLoading} />
      <ScreenHeaderTitle
        close={navigation.goBack}
        title="Visa / Mastercard"
        paddingSize={3}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: normalize(25),
        }}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <AppText textStyle="body1medium">Card Details</AppText>
        <AppText
          textStyle="body2"
          customStyle={{
            marginTop: normalize(10),
            marginBottom: normalize(20),
          }}>
          We do not store credit card information.
        </AppText>

        <View>
          <AppInput
            label="Card Holder Name"
            value={formData.name}
            onChangeText={name => {
              setErrors(errors => ({ ...errors, name: '' }))
              setFormData(data => ({ ...data, name }))
            }}
            debounce={false}
            wrapperStyle={
              errors.name.length ? { borderColor: 'red' } : {}
            }></AppInput>

          <AppText
            color="red"
            customStyle={{
              display: 'flex',
              marginBottom: errors.name.length ? 8 : 0,
            }}>
            {errors.name}
          </AppText>
        </View>

        <View>
          <AppInput
            label="Card Number"
            value={formData.cardNumber}
            onChangeText={cardNumber => {
              setErrors(errors => ({ ...errors, cardNumber: '' }))
              setFormData(data => ({
                ...data,
                cardNumber: cardNumber
                  .replace(/\s?/g, '')
                  .replace(/(\d{4})/g, '$1 ')
                  .trim(),
              }))
            }}
            keyboardType="numeric"
            maxLength={19}
            debounce={false}
            wrapperStyle={
              errors.cardNumber.length ? { borderColor: 'red' } : {}
            }></AppInput>

          <AppText
            color="red"
            customStyle={{
              display: 'flex',
              marginBottom: errors.cardNumber.length ? 8 : 0,
            }}>
            {errors.cardNumber}
          </AppText>
          <View
            style={{
              position: 'absolute',
              top: normalize(15),
              right: normalize(16),
            }}>
            {renderCardIcon(formData.cardNumber)}
          </View>
        </View>

        <View>
          <AppInput
            label="CVV / CVC"
            value={formData.cvv}
            onChangeText={cvv => {
              setErrors(errors => ({ ...errors, cvv: '' }))
              setFormData(data => ({ ...data, cvv }))
            }}
            secureTextEntry={true}
            maxLength={3}
            keyboardType="numeric"
            debounce={false}
            wrapperStyle={
              errors.cvv.length ? { borderColor: 'red' } : {}
            }></AppInput>

          <AppText
            textStyle="caption"
            customStyle={{ marginTop: normalize(5) }}>
            The 3-digit number on the back of your card
          </AppText>
          <AppText
            color="red"
            customStyle={{
              display: 'flex',
              marginBottom: errors.cvv.length ? 8 : 0,
            }}>
            {errors.cvv}
          </AppText>
        </View>
        <View>
          <AppInput
            label="MM / YY"
            value={formData.expiry}
            onChangeText={expiry => {
              if (expiry.length === 2 && formData.expiry.length === 1)
                expiry += '/'
              else if (expiry.length > 2 && expiry.indexOf('/') !== 2) return
              setErrors(errors => ({ ...errors, expiry: '' }))
              setFormData(data => ({ ...data, expiry }))
            }}
            maxLength={5}
            keyboardType="numeric"
            debounce={false}
            wrapperStyle={
              errors.expiry.length ? { borderColor: 'red' } : {}
            }></AppInput>
          <AppText
            textStyle="caption"
            customStyle={{ marginTop: normalize(5) }}>
            Card expiry
          </AppText>

          <AppText
            color="red"
            customStyle={{
              display: 'flex',
              marginBottom: errors.expiry.length ? 8 : 0,
            }}>
            {errors.expiry}
          </AppText>
        </View>
        <AppText
          textStyle="body1medium"
          customStyle={{
            marginTop: normalize(30),
            marginBottom: normalize(10),
          }}>
          Billing Details
        </AppText>

        <View>
          <AppInput
            label="Unit / House / Building / Street"
            value={address.line1}
            onChangeText={line1 => {
              setErrors(errors => ({ ...errors, addressLine1: '' }))
              setAddress(address => ({
                ...address,
                line1,
              }))
            }}
            debounce={false}
            wrapperStyle={
              errors.addressLine1.length ? { borderColor: 'red' } : {}
            }
          />

          <AppText
            color="red"
            customStyle={{
              display: 'flex',
              marginBottom: errors.addressLine1.length ? 8 : 0,
            }}>
            {errors.addressLine1}
          </AppText>
        </View>

        <View style={{ marginBottom: normalize(16) }}>
          <AppInput
            label="Subdivision / Apartment / Village"
            value={address.line2}
            onChangeText={line2 =>
              setAddress(address => ({
                ...address,
                line2,
              }))
            }
          />
        </View>

        <View>
          <View
            style={[
              styles.pickerWrapper,
              errors.province.length ? { borderColor: 'red' } : {},
            ]}>
            <Picker
              selectedValue={address.province}
              onValueChange={province => {
                setErrors(errors => ({ ...errors, province: '' }))
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
          <AppText
            color="red"
            customStyle={{
              display: 'flex',
              marginBottom: errors.province.length ? 8 : 0,
            }}>
            {errors.province}
          </AppText>
        </View>

        <View>
          <View
            style={[
              styles.pickerWrapper,
              errors.city.length ? { borderColor: 'red' } : {},
            ]}>
            <Picker
              selectedValue={address.city}
              enabled={!!address.province.length}
              onValueChange={city => {
                setErrors(errors => ({ ...errors, city: '' }))
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
          <AppText
            color="red"
            customStyle={{
              display: 'flex',
              marginBottom: errors.province.length ? 8 : 0,
            }}>
            {errors.province}
          </AppText>
        </View>

        <View>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={address.country}
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

          <AppText
            color="red"
            customStyle={{
              display: 'flex',
              marginBottom: errors.country.length ? 8 : 0,
            }}>
            {errors.country}
          </AppText>
        </View>

        <View>
          <AppInput
            label="Zip Code"
            value={address.zipCode}
            onChangeText={zipCode => {
              setErrors(errors => ({ ...errors, zipCode: '' }))
              setAddress(address => ({
                ...address,
                zipCode,
              }))
            }}
            debounce={false}
            keyboardType="numeric"
            maxLength={4}
            wrapperStyle={errors.zipCode.length ? { borderColor: 'red' } : {}}
          />

          <AppText
            color="red"
            customStyle={{
              display: 'flex',
              marginBottom: errors.zipCode.length ? 8 : 0,
            }}>
            {errors.zipCode}
          </AppText>
        </View>

        <View style={{ marginTop: normalize(20), marginBottom: normalize(30) }}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.buyButtonContainer}>
            <AppText textStyle="body1medium" maxLength={4}>
              Confirm and Pay
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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
    height: normalize(50),
  },
})

export default CreditCardScreen
