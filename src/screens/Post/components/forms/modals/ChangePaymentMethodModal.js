import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { AppText, AppRadio, ScreenHeaderTitle } from '@/components'

import { normalize } from '@/globals'

const ChangePaymentMethodModal = ({ closeModal }) => {
  const [cod, setCod] = useState(true)
  const [gcash, setGcash] = useState(false)
  const [bankTransfer, setBankTransfer] = useState(false)

  const RadioStateHandler = val => {
    if (val === 'cod') {
      setCod(true)
      setGcash(false)
      setBankTransfer(false)
    }
    if (val === 'gcash') {
      setGcash(true)
      setCod(false)
      setBankTransfer(false)
    }
    if (val === 'bankTransfer') {
      setBankTransfer(true)
      setCod(false)
      setGcash(false)
    }
  }

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: normalize(20),
      }}>
      <ScreenHeaderTitle close={closeModal} iconSize={normalize(16)} />
      <View>
        <AppText
          textStyle="subtitle1"
          customStyle={{
            marginTop: normalize(25),
            marginVertical: normalize(10),
          }}>
          Change Payment Method
        </AppText>
        <AppRadio
          label={
            <>
              <AppText textStyle="body1medium">Cash on Delivery</AppText>
            </>
          }
          value={cod}
          style={{ paddingLeft: 0 }}
          valueChangeHandler={() => RadioStateHandler('cod')}
        />
        <View
          style={{
            borderBottomColor: '#f9f9f9',
            borderBottomWidth: 1.5,
          }}></View>
        <AppRadio
          label={
            <>
              <AppText textStyle="body1medium">GCash</AppText>
            </>
          }
          value={gcash}
          style={{ paddingLeft: 0 }}
          valueChangeHandler={() => RadioStateHandler('gcash')}
        />
        <View
          style={{
            borderBottomColor: '#f9f9f9',
            borderBottomWidth: 1.5,
          }}></View>
        <AppRadio
          label={
            <>
              <AppText textStyle="body1medium">Online Bank Transfer</AppText>
              <AppText
                textStyle="body1medium"
                customStyle={{ textTransform: 'uppercase' }}>
                {' '}
                (BDO, BPI)
              </AppText>
            </>
          }
          value={bankTransfer}
          style={{ paddingLeft: 0 }}
          valueChangeHandler={() => RadioStateHandler('bankTransfer')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})

export default ChangePaymentMethodModal
