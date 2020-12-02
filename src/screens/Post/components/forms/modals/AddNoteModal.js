import React, { useState, useContext } from 'react'
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native'
import { Divider } from 'react-native-paper'

import { AppText, AppInput, ScreenHeaderTitle } from '@/components'

import { normalize, Colors } from '@/globals'
import { Context } from '@/context'

const AddNoteModal = ({ closeModal }) => {
  const { deliveryMethod } = useContext(Context)
  const [note, setNote] = useState(null)

  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          padding: normalize(20),
        }}>
        <ScreenHeaderTitle
          close={closeModal}
          title={
            deliveryMethod === 'delivery'
              ? 'Add Delivery Notes'
              : 'Add Pick-up Notes'
          }
          iconSize={normalize(16)}
        />
        <View
          style={{
            position: 'relative',
            height: '100%',
            paddingTop: normalize(30),
          }}>
          <AppInput
            label="Notes"
            placeholder="(ex. Yellow Gate)"
            value={note}
            onChangeText={text => setNote(text)}
          />

          <TouchableOpacity
            onPress={closeModal}
            disabled={note == null ? true : false}
            style={{
              position: 'absolute',
              bottom: normalize(50),
              left: 0,
              right: 0,
            }}>
            <View
              style={
                note == null
                  ? styles.disabledBuyButtonContainer
                  : styles.buyButtonContainer
              }>
              <AppText textStyle="body1medium">Confirm</AppText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
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

export default AddNoteModal
