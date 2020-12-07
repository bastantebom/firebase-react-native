import React, { useState } from 'react'
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import axios from 'axios'
import base64 from 'react-native-base64'
import { cardValidator } from '@/globals/Utils'
import Api from '@/services/Api'

import {
  AppText,
  AppInput,
  ScreenHeaderTitle,
  FloatingAppInput,
} from '@/components'

import { normalize, Colors } from '@/globals'
import {
  PostCalendar,
  ArrowDown,
  MasterCard,
  Visa,
} from '@/assets/images/icons'

const CreditCardModal = ({ closeModal, orderDetails }) => {
  const [name, setName] = useState('')
  const [cardNum, setCardNum] = useState('')
  const [cvv, setCvv] = useState('')
  const [date, setDate] = useState(new Date())
  const [showDate, setShowDate] = useState(false)
  const [selectedDate, setSelectedDate] = useState(moment().format('MM / YY'))
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [showAddressOptions, setShowAddressOptions] = useState(false)

  const onChangeDate = (_, selectedDate) => {
    const currentDate = selectedDate || date
    setShowDate(Platform.OS === 'ios')
    setDate(currentDate)
    const dateSelected = moment(currentDate).format('MM / YY')
    setSelectedDate(dateSelected)
  }

  const toggleAddressOptions = () => {
    setShowAddressOptions(!showAddressOptions)
  }

  const showDatepicker = () => {
    setShowDate(true)
  }

  const createPaymentMethod = async () => {
    try {
      const paymongoSK = base64.encode('sk_test_Hf4GQS4e8sBEzUe6a3rwyfGx')
      const paymentMethodResponse = await axios({
        method: 'POST',
        url: 'https://api.paymongo.com/v1/payment_methods',
        data: JSON.stringify({
          data: {
            attributes: {
              details: {
                card_number: cardNum,
                exp_month: parseInt(selectedDate.split(' / ')[0]),
                exp_year: parseInt(selectedDate.split(' / ')[1]),
                cvc: cvv,
              },
              type: 'card',
              billing: null,
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
      console.log(error)
    }
  }

  const submitPayment = async () => {
    const paymentMethodId = await createPaymentMethod()

    const response = await Api.createCardPayment({
      body: {
        amount: orderDetails.totalPrice * 100,
        currency: 'PHP',
        order_id: orderDetails.id,
        payment_method_id: paymentMethodId,
      },
    })

    if (response.success) {
      //successful payment goes here...
    }
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
      <ScreenHeaderTitle
        close={closeModal}
        title="Visa / Mastercard"
        iconSize={normalize(16)}
        paddingSize={3}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: normalize(25),
        }}
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

        <View style={{ marginBottom: normalize(16) }}>
          <AppInput
            label="Card Holder Name"
            value={name}
            onChangeText={name => setName(name)}
          />
        </View>

        <View style={{ marginBottom: normalize(16) }}>
          <AppInput
            label="Card Number"
            value={cardNum}
            onChangeText={cardNum => setCardNum(cardNum)}
            keyboardType="numeric"
          />
          <View
            style={{
              position: 'absolute',
              top: normalize(15),
              right: normalize(16),
            }}>
            {cardValidator(cardNum) === 'visa' ? (
              <Visa width={normalize(25)} height={normalize(25)} />
            ) : cardValidator(cardNum) === 'mastercard' ? (
              <MasterCard width={normalize(25)} height={normalize(25)} />
            ) : null}
          </View>
        </View>

        <View style={{ marginBottom: normalize(16) }}>
          <AppInput
            label="CVV / CVC"
            value={cvv}
            onChangeText={cvv => setCvv(cvv)}
            secureTextEntry={true}
            maxLength={3}
            keyboardType="numeric"
          />
          <AppText
            textStyle="caption"
            customStyle={{ marginTop: normalize(5) }}>
            The 3-digit number on the back of your card
          </AppText>
        </View>

        <TouchableOpacity onPress={showDatepicker}>
          <View pointerEvents="none">
            <AppInput
              label="Expiry Date"
              placeholder={selectedDate ? '' : 'Expiry date'}
            />
            <AppText
              textStyle="body1"
              customStyle={{
                position: 'absolute',
                top: normalize(20),
                left: normalize(18),
              }}>
              {selectedDate}
            </AppText>
            <View
              style={{
                position: 'absolute',
                right: normalize(16),
                top: normalize(18),
              }}>
              <PostCalendar width={normalize(22)} height={normalize(22)} />
            </View>
          </View>
        </TouchableOpacity>
        <View>
          {showDate && (
            <DateTimePicker
              value={date}
              mode="date"
              onChange={onChangeDate}
              display={Platform.OS === 'android' && 'spinner'}
            />
          )}
        </View>
        <AppText
          textStyle="body1medium"
          customStyle={{
            marginTop: normalize(30),
            marginBottom: normalize(10),
          }}>
          Billing Details
        </AppText>
        <View style={{ marginBottom: normalize(16) }}>
          <AppInput
            label="Unit/House/Building/Street"
            value={addressLine1}
            onChangeText={addressLine1 => setAddressLine1(addressLine1)}
          />
        </View>
        <View style={{ marginBottom: normalize(16) }}>
          <AppInput
            label="Subdivision / Apartment / Village"
            value={addressLine2}
            onChangeText={addressLine2 => setAddressLine2(addressLine2)}
          />
        </View>

        <View style={{ position: 'relative' }}>
          <TouchableOpacity onPress={toggleAddressOptions}>
            <FloatingAppInput
              value={province}
              label="Province"
              customStyle={{ marginBottom: normalize(16) }}
              editable={false}
            />
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: 12,
                right: 12,
              }}>
              <ArrowDown height={normalize(24)} width={normalize(24)} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ position: 'relative' }}>
          <TouchableOpacity onPress={toggleAddressOptions}>
            <FloatingAppInput
              value={city}
              label="City"
              customStyle={{ marginBottom: normalize(16) }}
              editable={false}
            />
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: 12,
                right: 12,
              }}>
              <ArrowDown height={normalize(24)} width={normalize(24)} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ position: 'relative' }}>
          <TouchableOpacity onPress={toggleAddressOptions}>
            <FloatingAppInput
              value={country}
              label="Country"
              customStyle={{ marginBottom: normalize(16) }}
              editable={false}
            />
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: 12,
                right: 12,
              }}>
              <ArrowDown height={normalize(24)} width={normalize(24)} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: normalize(16) }}>
          <AppInput
            label="Zip Code"
            value={zipCode}
            onChangeText={zipCode => setZipCode(zipCode)}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <View style={{ marginTop: normalize(20), marginBottom: normalize(30) }}>
          <TouchableOpacity
            onPress={submitPayment}
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
  disabledBuyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.buttonDisable,
    borderRadius: 5,
  },
})

export default CreditCardModal
