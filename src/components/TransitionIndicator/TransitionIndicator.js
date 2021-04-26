import React from 'react'
import { StyleSheet, View, Modal, ActivityIndicator } from 'react-native'
import LottieView from 'lottie-react-native'
import loadingBee from '@/assets/animations/transition-indicator.json'

const TransitionIndicator = ({ loading, backdropStyle }) => {
  return (
    <Modal transparent={true} animationType={'none'} visible={loading}>
      <View style={[styles.modalBackground, backdropStyle]}>
        <LottieView source={loadingBee} autoPlay />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    flex: 1,
    alignItems: 'center',
  },
})

export default TransitionIndicator
