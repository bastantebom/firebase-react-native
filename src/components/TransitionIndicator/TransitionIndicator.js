import React from 'react'
import { StyleSheet, View, Modal, ActivityIndicator } from 'react-native'
import LottieView from 'lottie-react-native'
import assetLoader from '@/assets/animations/asset-loader.json'

const TransitionIndicator = ({ loading, backdropStyle }) => {
  return (
    <Modal transparent={true} animationType={'none'} visible={loading}>
      <View style={[styles.modalBackground, backdropStyle]}>
        <View style={styles.activityIndicatorWrapper}>
          <LottieView source={assetLoader} autoPlay />
        </View>
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
    backgroundColor: 'transparent',
    height: 40,
    width: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
})

export default TransitionIndicator
