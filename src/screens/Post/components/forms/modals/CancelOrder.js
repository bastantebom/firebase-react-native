import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native'

import {
  AppText,
  AppRadio,
  ScreenHeaderTitle,
  PaddingView,
  AppButton,
  AppInput,
} from '@/components'
import Api from '@/services/Api'

import { normalize, GlobalStyle, Colors } from '@/globals'

const CancelOrder = ({ goBack, postType, orderDetails, userId }) => {
  const [notes, setNotes] = useState('')

  const cancelOrderHandler = async () => {
    const parameters = {
      uid: userId,
      id: orderDetails.id,
      body: {
        status: 'cancelled',
      },
    }

    const response = await Api.updateOrder(parameters)

    if (response.success) {
      goBack()
    } else {
      alert("Order can't be cancelled")
    }
  }

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            backgroundColor: '#EAEAEA',
            borderRadius: 100,
            width: normalize(40),
            height: normalize(5),
            marginTop: 10,
          }}
        />
      </View>
      <PaddingView paddingSize={3}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
            marginTop: 15,
          }}>
          <AppText textStyle="display6">
            {postType === 'sell'
              ? 'Cancel Order'
              : postType === 'service'
              ? 'Cancel Request'
              : null}
          </AppText>
          <AppText textStyle="body2">{'<copy>'}</AppText>
        </View>
        <View>
          <AppText
            textStyle="body2"
            customStyle={{
              position: 'absolute',
              top: 12,
              left: 16,
            }}>
            Add notes (optional)
          </AppText>
          <TextInput
            value={notes}
            style={styles.input}
            multiline={true}
            numberOfLines={Platform.OS === 'ios' ? null : 5}
            minHeight={Platform.OS === 'ios' && 8 ? 20 * 5 : null}
            onChangeText={notes => {
              setNotes(notes)
            }}
            underlineColorAndroid={'transparent'}
            textAlignVertical="top"
          />
        </View>
        <AppButton text="Cancel" type="primary" onPress={cancelOrderHandler} />

        <AppButton text="Go Back" onPress={goBack} />
      </PaddingView>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    position: 'relative',
    color: Colors.contentEbony,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    letterSpacing: 0.5,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 8,
    marginBottom: 16,
    // marginTop: 40
  },
})

export default CancelOrder
