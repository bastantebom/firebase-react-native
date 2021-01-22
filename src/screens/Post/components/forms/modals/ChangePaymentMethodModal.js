import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { AppText, AppRadio, ScreenHeaderTitle } from '@/components'

import { normalize } from '@/globals'

const ChangePaymentMethodModal = ({
  closeModal,
  availablePaymentMethods,
  setPaymentChoice,
  paymentChoice,
}) => {
  const [cod, setCod] = useState(true)
  const [gcash, setGcash] = useState(false)
  const [bankTransfer, setBankTransfer] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedPayment, setSelectedPayment] = useState(
    paymentChoice ? paymentChoice : availablePaymentMethods[0]
  )

  useEffect(() => {
    setPaymentChoice(selectedPayment)
  }, [selectedPayment])

  const PaymentMethodsList = () => {
    return availablePaymentMethods.map((method, index) => {
      return (
        <View key={method}>
          <AppRadio
            label={
              <>
                <AppText textStyle="body1medium">{method}</AppText>
              </>
            }
            value={method === selectedPayment}
            style={{ paddingLeft: 0 }}
            valueChangeHandler={() => setSelectedPayment(method)}
          />
          {index !== availablePaymentMethods.length - 1 && (
            <View
              style={{
                borderBottomColor: '#f9f9f9',
                borderBottomWidth: 1.5,
              }}
            />
          )}
        </View>
      )
    })
  }

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: normalize(20),
      }}>
      <ScreenHeaderTitle close={closeModal} />
      <View style={{ paddingBottom: 16 }}>
        <AppText
          textStyle="subtitle1"
          customStyle={{
            marginTop: normalize(25),
            marginVertical: normalize(10),
          }}>
          Change Payment Method
        </AppText>
        <PaymentMethodsList paymentMethods={paymentMethods} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})

export default ChangePaymentMethodModal
