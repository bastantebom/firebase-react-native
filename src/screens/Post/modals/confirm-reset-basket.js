import { BottomSheetHeader } from '@/components'
import Button from '@/components/Button'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

/**
 * @param {object} props
 * @param {function} props.onConfirmPress
 * @param {function} props.onCancelPress
 **/
const ConfirmResetBasketModal = ({ onConfirmPress, onCancelPress }) => {
  return (
    <View style={styles.container}>
      <BottomSheetHeader />

      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Start a New Basket?</Text>
        <Text style={[typography.body2, { marginTop: normalize(4) }]}>
          Adding this item will clear your current basket
        </Text>
      </View>
      <View style={styles.buttonsWrapper}>
        <Button label="Yes" type="primary" onPress={onConfirmPress} />
        <Button
          label="Cancel"
          style={{
            borderColor: Colors.contentEbony,
            borderWidth: normalize(2),
            marginTop: normalize(16),
          }}
          onPress={onCancelPress}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
  },
  titleWrapper: {
    margin: normalize(24),
    alignItems: 'center',
  },
  title: {
    ...typography.medium,
    fontSize: normalize(20),
    lineHeight: normalize(30),
    letterSpacing: normalize(0.15),
  },
  buttonsWrapper: {
    padding: normalize(24),
    paddingTop: normalize(8),
  },
})

export default ConfirmResetBasketModal
