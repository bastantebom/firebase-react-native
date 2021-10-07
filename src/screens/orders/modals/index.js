import React from 'react'
import Modal from 'react-native-modal'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

import { BottomSheetHeader } from '@/components'

const ModalComponent = ({
  children,
  isVisible,
  setIsVisible,
  swipeable = true,
  ...props
}) => {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={250}
      animationOutTiming={200}
      style={[styles.modal, props.containerStyle]}
      swipeDirection={swipeable ? 'down' : null}
      onSwipeComplete={() => setIsVisible(false)}
      customBackdrop={
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => setIsVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'black' }} />
        </TouchableWithoutFeedback>
      }
      statusBarTranslucent
      {...props}>
      {swipeable && <BottomSheetHeader />}
      {children}
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
})

export default ModalComponent
