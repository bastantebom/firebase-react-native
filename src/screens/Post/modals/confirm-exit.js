import Button from '@/components/Button'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import React from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'

const { height } = Dimensions.get('window')

/**
 * @param {object} props
 * @param {function} props.close
 * @param {boolean} props.editing
 * @param {function} props.onConfirm
 **/
const ConfirmExitModal = ({ close, editing, onConfirm }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Cancel {editing && 'Editing '}Post?</Text>
      </View>
      <View style={styles.content}>
        <Text style={[typography.body2, typography.textCenter]}>
          Ooh, are you sure? All post details will be lost if you leave this
          page.
        </Text>
        <View style={styles.buttonsWrapper}>
          <Button label="Yes" type="primary" onPress={onConfirm} />
          <Button
            style={{
              marginTop: normalize(16),
              borderWidth: normalize(1),
              borderColor: Colors.primaryMidnightBlue,
            }}
            label="No"
            onPress={close}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: normalize(10),
    padding: normalize(16),
  },
  titleWrapper: {
    margin: normalize(16),
    alignItems: 'center',
  },
  title: {
    ...typography.medium,
    color: Colors.primaryMidnightBlue,
    fontSize: normalize(20),
    lineHeight: normalize(30),
    letterSpacing: normalize(0.15),
  },
  content: {
    paddingHorizontal: normalize(8),
  },
  buttonsWrapper: {
    marginTop: normalize(16),
    paddingVertical: normalize(16),
  },
})

export default ConfirmExitModal
