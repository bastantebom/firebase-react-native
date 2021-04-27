import React from 'react'
import { StyleSheet, View, Modal, ActivityIndicator } from 'react-native'

const TransitionIndicator = ({ loading, backdropStyle }) => {
  return (
    <Modal transparent={true} animationType={'none'} visible={loading}>
      <View style={[styles.modalBackground, backdropStyle]}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator color="#3781FC" size="large" animating={loading} />
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
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
})

export default TransitionIndicator
