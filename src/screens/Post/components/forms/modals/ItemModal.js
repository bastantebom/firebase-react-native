import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import Modal from 'react-native-modal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { AppText, AppInput, ScreenHeaderTitle, AppButton } from '@/components'

import { normalize, Colors } from '@/globals'

import { ChevronDown, MinusSign, PlusSign } from '@/assets/images/icons'
import { Context } from '@/context'
import { ImageModal } from '@/screens/Post/components/ImageModal'

const ItemModal = ({ closeModal, postType, item, postID }) => {
  const [notes, setNotes] = useState()
  const [qty, setQty] = useState(1)
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [showDate, setShowDate] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [selectedDate, setSelectedDate] = useState()
  const [selectedTime, setSelectedTime] = useState()
  const [subtotal, setSubtotal] = useState(0)
  const [currentItem, setCurrentItem] = useState(item)
  // const [deleteCurrentCartPrompt, showDeleteCurrentCartPrompt] = useState(false)
  const [imageModal, showImageModal] = useState(false)

  const {
    userCart,
    setUserCart,
    setCurrentPost,
    deleteCurrentOrderModal,
    showDeleteCurrentOrderModal,
  } = useContext(Context)

  const [animatedPadding] = useState(new Animated.Value(0))

  function onKeyboardDidShow(e) {
    const keyboardHeight = e.endCoordinates.height
    keyboardToggleAnimation(keyboardHeight)
  }

  function onKeyboardDidHide() {
    keyboardToggleAnimation(0)
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow)
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide)
    return () => {
      Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow)
      Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide)
    }
  }, [])

  const keyboardToggleAnimation = height => {
    Animated.timing(animatedPadding, {
      toValue: height,
      duration: 250,
      useNativeDriver: false,
    }).start()
  }

  const onChangeDate = selectedDate => {
    const currentDate = selectedDate || date
    setShowDate(Platform.OS === 'ios')
    setDate(currentDate)
    const dateSelected = moment(currentDate).format('LL')
    setSelectedDate(dateSelected)
  }

  const onChangeTime = selectedTime => {
    const currentTime = selectedTime || time
    setShowTime(Platform.OS === 'ios')
    setTime(currentTime)
    const timeSelected = moment(currentTime).format('h:mm A')

    return setSelectedTime(timeSelected)
  }

  const showDatepicker = () => {
    setShowDate(true)
  }

  const showTimepicker = () => {
    setShowTime(true)
  }

  const onAdd = () => {
    setQty(qty + 1)
  }

  const onMinus = () => {
    if (qty < 1) {
      setQty(0)
    } else {
      setQty(qty - 1)
    }
  }

  const onChangeTextHandler = qty => {
    setQty(Number(qty))
  }

  useEffect(() => {
    setSubtotal(qty * item.price)
  }, [qty])

  const addToCart = async () => {
    let isNewPost = await setCurrentPost(postID)

    if (!isNewPost) {
      let currentCart = userCart

      const found = currentCart.find(item => item.id === currentItem.id)

      const data = {
        id: currentItem.id,
        quantity: qty,
        name: currentItem.name,
        price: currentItem.price,
        note: notes,
      }

      if (found) {
        currentCart = currentCart.filter(item => {
          if (item.id !== currentItem.id) {
            return item
          }
        })

        currentCart.push(data)
      } else {
        currentCart.push(data)
      }

      currentCart = currentCart.filter(item => item.quantity)

      setUserCart(currentCart)
    }

    if (isNewPost) {
      let currentCart = []

      const data = {
        id: currentItem.id,
        quantity: qty,
        name: currentItem.name,
        price: currentItem.price,
        note: notes,
      }

      currentCart.push(data)
      setUserCart(currentCart)
    }

    closeModal()
  }

  let paddingAnimatedStyle = {
    paddingBottom: animatedPadding,
  }

  return (
    <View>
      <Animated.View
        style={[
          {
            backgroundColor: 'white',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
          paddingAnimatedStyle,
        ]}>
        <ScreenHeaderTitle
          close={closeModal}
          iconSize={normalize(16)}
          paddingSize={2}
        />
        <View
          style={{
            paddingBottom: 32,
            paddingHorizontal: 20,
          }}>
          <View style={styles.itemWrapper}>
            {currentItem?.image?.substring(0, 8) === 'https://' && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => showImageModal(true)}>
                <View style={styles.imageWrapper}>
                  <Image
                    style={styles.image}
                    source={{ uri: currentItem.image }}
                  />
                </View>
              </TouchableOpacity>
            )}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                paddingTop: 16,
                paddingBottom: 8,
                justifyContent: 'space-between',
              }}>
              <View style={styles.titleDesc}>
                <AppText textStyle="body1medium">{currentItem.name}</AppText>
                {currentItem?.description?.length > 0 && (
                  <AppText textStyle="body2">{currentItem.description}</AppText>
                )}
              </View>
              <View style={styles.itemPrice}>
                <AppText textStyle="subtitle1">₱{currentItem.price}</AppText>
              </View>
            </View>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#DADCE0',
              marginBottom: 16,
            }}
          />
          {postType === 'sell' ? (
            <>
              <View style={styles.quantityWrapper}>
                <AppText textStyle="body2">Quantity</AppText>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity onPress={onMinus} style={styles.qtyButton}>
                    <View>
                      <MinusSign />
                    </View>
                  </TouchableOpacity>
                  <TextInput
                    keyboardType="numeric"
                    style={styles.qtyInput}
                    value={qty.toString()}
                    onChangeText={qty => onChangeTextHandler(qty)}
                  />
                  <TouchableOpacity
                    onPress={onAdd}
                    style={{
                      backgroundColor: '#FFD400',
                      borderRadius: 4,
                      width: normalize(32),
                      height: normalize(32),
                    }}
                    style={styles.qtyButton}>
                    <View>
                      <PlusSign />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <AppInput
                style={{ marginVertical: normalize(16) }}
                label="Notes (Optional)"
                // placeholder="(ex. no onions)"
                value={notes}
                onChangeText={notes => setNotes(notes)}
              />
            </>
          ) : postType === 'service' ? (
            <>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{ marginBottom: 16 }}
                onPress={showDatepicker}>
                <View pointerEvents="none">
                  <AppInput
                    label="Date"
                    placeholder={selectedDate ? '' : 'Choose date'}
                  />
                  <AppText
                    textStyle="body1"
                    customStyle={{
                      position: 'absolute',
                      top: normalize(20),
                      left: normalize(18),
                    }}>
                    {selectedDate}
                  </AppText>
                  <View
                    style={{
                      position: 'absolute',
                      right: normalize(16),
                      top: normalize(18),
                    }}>
                    <ChevronDown width={normalize(18)} height={normalize(18)} />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{ marginBottom: 16 }}
                onPress={showTimepicker}>
                <View pointerEvents="none">
                  <AppInput
                    label="Time"
                    placeholder={selectedTime ? '' : 'Choose time'}
                  />
                  <AppText
                    textStyle="body1"
                    customStyle={{
                      position: 'absolute',
                      top: normalize(20),
                      left: normalize(18),
                    }}>
                    {selectedTime}
                  </AppText>
                  <View
                    style={{
                      position: 'absolute',
                      right: normalize(16),
                      top: normalize(18),
                    }}>
                    <ChevronDown width={normalize(18)} height={normalize(18)} />
                  </View>
                </View>
              </TouchableOpacity>
              <View>
                {showDate && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    onChange={onChangeDate}
                  />
                )}
                {showTime && (
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display="spinner"
                    onChange={onChangeTime}
                  />
                )}
              </View>
            </>
          ) : (
            <AppText>need</AppText>
          )}

          {postType === 'sell' ? (
            <TouchableOpacity onPress={addToCart}>
              <View
                style={
                  qty == 0
                    ? styles.disabledBuyButtonContainer
                    : styles.buyButtonContainer
                }>
                {qty == 0 ? (
                  <AppText textStyle="body1medium" color={Colors.neutralsWhite}>
                    Remove
                  </AppText>
                ) : (
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      width: '100%',
                      paddingHorizontal: normalize(30),
                    }}>
                    <AppText textStyle="body1medium">Add to order</AppText>
                    <AppText textStyle="subtitle1">₱{subtotal}</AppText>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ) : postType === 'service' ? (
            <AppButton
              text="Book"
              type="primary"
              customStyle={{ height: normalize(43) }}
            />
          ) : (
            <></>
          )}
        </View>
      </Animated.View>

      <Modal
        isVisible={imageModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={{
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ImageModal
          close={() => showImageModal(false)}
          data={[currentItem?.image]}
        />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: normalize(8),
  },
  imageWrapper: {
    position: 'relative',
    marginRight: normalize(10),
  },
  image: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: 4,
  },
  titleDesc: {
    flexDirection: 'column',
    flex: 0.8,
  },
  itemPrice: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  quantityWrapper: {
    paddingVertical: normalize(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyButton: {
    backgroundColor: '#FFD400',
    borderRadius: 4,
    width: normalize(32),
    height: normalize(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyInput: {
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFD400',
    width: normalize(66),
    height: normalize(32),
    marginHorizontal: normalize(8),
    textAlign: 'center',
    fontSize: normalize(14),
    padding: 0,
    fontFamily: 'RoundedMplus1c-Regular',
  },
  buyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12.5,
    alignItems: 'center',
    backgroundColor: Colors.primaryYellow,
    borderRadius: 5,
  },
  disabledBuyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.secondaryBrinkPink,
    borderRadius: 5,
  },
})

export default ItemModal
