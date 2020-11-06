import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { AppText, AppInput, ScreenHeaderTitle, AppButton } from '@/components'

import { normalize, Colors } from '@/globals'

import { ChevronDown, MinusSign, PlusSign } from '@/assets/images/icons'

const ItemModal = ({ closeModal, postType }) => {
  const [notes, setNotes] = useState()
  const [qty, setQty] = useState(0)
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [showDate, setShowDate] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [selectedDate, setSelectedDate] = useState()
  const [selectedTime, setSelectedTime] = useState()

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

  return (
    <View>
      <KeyboardAwareScrollView
        keyboardOpeningTime={50}
        // enableOnAndroid={true}
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingHorizontal: 20,
          paddingTop: normalize(20),
        }}>
        <ScreenHeaderTitle close={closeModal} iconSize={normalize(16)} />
        <View style={{ paddingBottom: 30 }}>
          <View style={styles.itemWrapper}>
            <View style={styles.imageWrapper}>
              <Image
                style={styles.image}
                source={require('@/assets/images/burger.jpg')}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                paddingVertical: normalize(10),
                justifyContent: 'space-between',
              }}>
              <View style={styles.titleDesc}>
                <AppText textStyle="body1medium">Cheesy Classic Burger</AppText>
                <AppText textStyle="body2">
                  Soo good you’ll forget your spouse’s name
                </AppText>
              </View>
              <View style={styles.itemPrice}>
                <AppText textStyle="subtitle1">₱0.00</AppText>
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
                placeholder="(ex. no onions)"
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
            <TouchableOpacity disabled={qty == 0 ? true : false}>
              <View
                style={
                  qty == 0
                    ? styles.disabledBuyButtonContainer
                    : styles.buyButtonContainer
                }>
                {qty == 0 ? (
                  <AppText textStyle="body1medium">Add to order</AppText>
                ) : (
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      width: '100%',
                      paddingHorizontal: normalize(30),
                    }}>
                    <AppText textStyle="body1medium">Add to order</AppText>
                    <AppText textStyle="subtitle1">₱0.00</AppText>
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
      </KeyboardAwareScrollView>
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
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: '#DADCE0',
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
    backgroundColor: Colors.buttonDisable,
    borderRadius: 5,
  },
})

export default ItemModal
