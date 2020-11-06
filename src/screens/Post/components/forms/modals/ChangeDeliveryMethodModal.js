import React, { useContext, useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-paper'

import { AppText, AppRadio, ScreenHeaderTitle } from '@/components'

import { normalize, GlobalStyle, Colors } from '@/globals'
import { Context } from '@/context'

const ChangeDeliveryMethodModal = ({ closeModal }) => {
  const { deliveryMethod, setDeliveryMethod } = useContext(Context)

  const [deliverNow, setDeliverNow] = useState(true)
  const [forLater, setForLater] = useState(false)

  const RadioStateHandler = val => {
    if (val === 'deliverNow') {
      setDeliverNow(true)
      setForLater(false)
    }
    if (val === 'forLater') {
      setForLater(true)
      setDeliverNow(false)
    }
  }

  const deliveryHandler = () => {
    if (deliveryMethod !== 'delivery') {
      setDeliveryMethod('delivery')
    }
  }

  const pickUpHandler = () => {
    if (deliveryMethod !== 'pickup') {
      setDeliveryMethod('pickup')
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
          Change Delivery Method
        </AppText>
        <View style={{ flexDirection: 'row', marginBottom: normalize(10) }}>
          <TouchableOpacity onPress={deliveryHandler}>
            <AppText
              textStyle="body3"
              color={
                deliveryMethod === 'delivery' ? Colors.contentOcean : '#000'
              }
              customStyle={{ marginRight: normalize(15) }}>
              Delivery
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickUpHandler}>
            <AppText
              textStyle="body3"
              color={
                deliveryMethod === 'pickup' ? Colors.contentOcean : '#000'
              }>
              Pick-up
            </AppText>
          </TouchableOpacity>
        </View>
        <AppRadio
          label={
            <AppText textStyle="body1medium">
              {deliveryMethod === 'delivery' ? 'Deliver Now' : 'Pick up Now'}
            </AppText>
          }
          value={deliverNow}
          style={{ paddingLeft: 0 }}
          valueChangeHandler={() => RadioStateHandler('deliverNow')}
        />
        <View
          style={{
            borderBottomColor: '#f9f9f9',
            borderBottomWidth: 1.5,
          }}></View>
        <AppRadio
          label={<AppText textStyle="body1medium">Schedule for later</AppText>}
          value={forLater}
          style={{ paddingLeft: 0 }}
          valueChangeHandler={() => RadioStateHandler('forLater')}
        />
        <TouchableOpacity>
          <AppText textStyle="body2">Select Date and Time</AppText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})

export default ChangeDeliveryMethodModal
