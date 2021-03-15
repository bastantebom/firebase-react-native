import { BottomSheetHeader } from '@/components'
import Button from '@/components/Button'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

/**
 * @param {object} props
 * @param {function} props.close
 **/
const ArchivePostModal = ({ onConfirm, close }) => {
  return (
    <View style={styles.container}>
      <BottomSheetHeader />

      <View style={styles.content}>
        <Text style={[typography.display6, typography.medium]}>
          Archive Post?
        </Text>
        <Text
          style={[
            typography.body2,
            typography.textCenter,
            { marginTop: normalize(4) },
          ]}>
          Hide your post from your profile and republish anytime you want. All
          active orders will still be processed.{' '}
        </Text>
      </View>
      <View style={styles.buttonsWrapper}>
        <Button
          style={{ marginBottom: normalize(16) }}
          label="Yes"
          type="primary"
          onPress={onConfirm}
        />
        <Button label="Cancel" type="disabled" onPress={close} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonsWrapper: {
    padding: normalize(24),
    paddingTop: 0,
  },
  container: {
    backgroundColor: '#fff',
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
  },
  content: {
    padding: normalize(16),
    alignItems: 'center',
    marginBottom: normalize(16),
  },
})

export default ArchivePostModal
