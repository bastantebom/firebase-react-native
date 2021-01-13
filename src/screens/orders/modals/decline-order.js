import React, { useState } from 'react'
import { View, StyleSheet, TextInput, Platform, Text } from 'react-native'
import { AppButton } from '@/components'
import { normalize, Colors } from '@/globals'

const DeclineOrderModal = ({ onBackPress, onDeclinePress }) => {
  const [notes, setNotes] = useState('')

  return (
    <View style={styles.container}>
      <View style={{ padding: normalize(24) }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
            marginTop: 15,
          }}>
          <Text style={styles.title}>Decline Order?</Text>
          <Text style={styles.description}>
            Feel free to share your reason for declining so we can improve your
            Servbees experience.
          </Text>
        </View>
        <View>
          <TextInput
            value={notes}
            style={styles.input}
            multiline={true}
            numberOfLines={Platform.OS === 'ios' ? null : 5}
            minHeight={Platform.OS === 'ios' && 8 ? 20 * 5 : null}
            onChangeText={setNotes}
            underlineColorAndroid={'transparent'}
            textAlignVertical="top"
            placeholder="Add notes (optional)"
          />
        </View>
        <AppButton
          text="Decline"
          type="primary"
          onPress={() => onDeclinePress({ notes })}
        />
        <AppButton text="Go Back" onPress={onBackPress} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  input: {
    position: 'relative',
    color: Colors.contentEbony,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    letterSpacing: 0.5,
    borderColor: Colors.contentEbony,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  titleWrapper: {
    marginBottom: 32,
    marginTop: 15,
  },
  title: {
    color: Colors.contentEbony,
    fontSize: normalize(20),
    lineHeight: normalize(30),
    letterSpacing: 0.15,
    fontFamily: 'RoundedMplus1c-Medium',
  },
  description: {
    color: Colors.contentPlaceholder,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    letterSpacing: 0.25,
  },
})

export default DeclineOrderModal
