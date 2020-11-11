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

import { normalize, GlobalStyle, Colors } from '@/globals'

const MoreActions = ({ goBack, postType }) => {
  const [noShow, setNoShow] = useState(true)
  const [cancelled, setCancelled] = useState(false)

  const RadioStateHandler = val => {
    if (val === 'noShow') {
      setNoShow(true)
      setCancelled(false)
    }
    if (val === 'cancelled') {
      setCancelled(true)
      setNoShow(false)
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
      <PaddingView paddingSize={2}>
        <View
          style={{
            marginBottom: 20,
            marginTop: 15,
          }}>
          <AppText textStyle="display6" customStyle={{ textAlign: 'center' }}>
            More Actions
          </AppText>
          <AppRadio
            label={
              <>
                <AppText textStyle="body1medium">No Show</AppText>
              </>
            }
            value={noShow}
            style={{ paddingLeft: 0 }}
            valueChangeHandler={() => RadioStateHandler('noShow')}
          />
          <View
            style={{
              borderBottomColor: '#f9f9f9',
              borderBottomWidth: 1.5,
            }}></View>
          <AppRadio
            label={
              <>
                <AppText textStyle="body1medium">Cancelled</AppText>
              </>
            }
            value={cancelled}
            style={{ paddingLeft: 0 }}
            valueChangeHandler={() => RadioStateHandler('cancelled')}
          />
        </View>
        <AppButton text="Select" type="primary" />
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
  },
})

export default MoreActions
