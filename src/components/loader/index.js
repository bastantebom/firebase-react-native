import { Colors, normalize } from '@/globals'
import React from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import Modal from 'react-native-modal'

/**
 * @param {object} props
 * @property {boolean} props.visible
 */
const Loader = ({ visible, ...props }) => {
  return (
    <Modal
      style={[styles.wrapper, props.style]}
      isVisible={visible}
      statusBarTranslucent={true}
      animationIn="fadeIn"
      animationOut="fadeOut">
      <View style={styles.spinnerWrapper}>
        <ActivityIndicator animating color={Colors.link} size="large" />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
  },
  spinnerWrapper: {
    backgroundColor: '#fff',
    height: normalize(100),
    width: normalize(100),
    borderRadius: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default Loader
