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

const DeclineOrder = ({ goBack, postType, declineOrderFunction }) => {
  const [notes, setNotes] = useState('')

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
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
            marginTop: 15,
          }}>
          <AppText textStyle="display6">Decline Order?</AppText>
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
        <AppButton
          text="Decline"
          type="primary"
          onPress={declineOrderFunction}
        />
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
  },
})

export default DeclineOrder
