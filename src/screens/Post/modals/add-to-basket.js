import { Icons } from '@/assets/images/icons'
import { BottomSheetHeader, HorizontalView } from '@/components'
import Button from '@/components/Button'
import PostImage from '@/components/Post/post-image'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import utilStyles from '@/globals/util-styles'
import { iconSize, parseTime } from '@/globals/Utils'
import React, { useContext, useState } from 'react'
import TextInput from '@/components/textinput'
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Text,
  Keyboard,
} from 'react-native'
import CurrencyInput, { formatNumber } from 'react-native-currency-input'
import { Context } from '@/context'
import cloneDeep from 'lodash.clonedeep'
import { format } from 'date-fns'
import CustomDatePicker from '../components/custom-date-picker'
import { TouchableOpacity } from 'react-native-gesture-handler'

const DismissKeyboardView = ({ children, ...props }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View {...props}>{children}</View>
    </TouchableWithoutFeedback>
  )
}

/**
 * @typedef {object} PostItem
 * @property {string} name
 * @property {string} description
 * @property {string} image
 * @property {string} notes
 * @property {string} id
 * @property {number} quantity
 * @property {number} price
 */

/**
 * @param {object} props
 * @param {PostItem} props.item
 * @param {function} props.close
 * @param {object} props.post
 **/
const AddToBasketModal = ({ item, close, post, onAskResetBasket }) => {
  const { basket, setBasket } = useContext(Context)
  const [quantity, setQuantity] = useState(item.quantity || 1)
  const [notes, setNotes] = useState(item.notes || '')
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState()
  const [initDate, setInitDate] = useState(item.schedule || new Date())
  const [schedule, setSchedule] = useState(item.schedule)
  const inBasket = !!basket.items?.some?.(_item => _item.id === item.id)

  const handleOnSubmit = async () => {
    let shouldReset
    if (basket.postId && basket.postId !== post.id) {
      const result = await onAskResetBasket()
      if (!result) return

      shouldReset = true
    }

    const newItems = shouldReset ? [] : basket.items || []

    const index = newItems.findIndex(_item => _item.id === item.id)
    if (!!~index) {
      if (post.type === 'sell') {
        if (!quantity) {
          newItems.splice(index, 1)
        } else {
          newItems[index].quantity = quantity
          newItems[index].notes = notes
        }
      } else if (post.type === 'sell') {
        newItems[index].schedule = schedule
      }
    } else {
      if (post.type === 'sell') {
        newItems.push(
          cloneDeep({
            ...item,
            quantity,
            notes,
          })
        )
      } else if (post.type === 'service') {
        newItems.push(
          cloneDeep({
            ...item,
            schedule,
          })
        )
      }
    }

    const newBasket = {
      ...(shouldReset ? { postId: post.id } : basket),
      items: newItems,
    }

    setBasket(newBasket)
    close()
  }

  const handleOnBackPress = () => {
    datePickerVisible ? setDatePickerVisible(false) : close()
  }

  const handleOnSetSchedulePress = () => {
    setDatePickerVisible(true)
    setSelectedDate(initDate)
  }

  const handleOnDateSelected = date => {
    setSelectedDate(new Date(date))
  }

  const handleOnSaveSchedulePress = () => {
    setDatePickerVisible(false)
    setSchedule(selectedDate)
    setInitDate(selectedDate)
  }

  const canSubmit = () => {
    if (post.type === 'service' && !schedule) return false
    return true
  }

  return (
    <DismissKeyboardView style={styles.container}>
      <BottomSheetHeader />
      <TouchableOpacity
        style={{ marginTop: normalize(24) }}
        activeOpacity={0.7}
        onPress={handleOnBackPress}>
        {datePickerVisible ? (
          <Icons.Back
            style={{ color: Colors.primaryMidnightBlue }}
            {...iconSize(24)}
          />
        ) : (
          <Icons.Close
            style={{ color: Colors.primaryMidnightBlue }}
            {...iconSize(24)}
          />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        {datePickerVisible ? (
          <View>
            <Text
              style={[typography.subtitle1, { marginVertical: normalize(16) }]}>
              Set Schedule
            </Text>
            {!!initDate && (
              <CustomDatePicker
                minutes={['00', '30', '00']}
                initDate={initDate}
                onDateSelected={handleOnDateSelected}
              />
            )}

            <View style={styles.buttonWrapper}>
              <Button
                label="Save"
                type="primary"
                onPress={handleOnSaveSchedulePress}
              />
            </View>
          </View>
        ) : (
          <>
            <View style={styles.postDetails}>
              {!!item.image && (
                <PostImage
                  style={styles.postImage}
                  path={item.image}
                  size="128x128"
                  postType={post.type}
                />
              )}
              <View style={utilStyles.flex1}>
                <Text style={[typography.body1narrow, typography.medium]}>
                  {item.name}
                </Text>
                <Text
                  style={[
                    typography.body2,
                    { color: Colors.contentPlaceholder },
                  ]}>
                  {item.description}
                </Text>
              </View>
              <Text style={[typography.body1narrow, typography.medium]}>
                ₱
                {formatNumber(item.price, {
                  separator: '.',
                  precision: 2,
                  delimiter: ',',
                })}
              </Text>
            </View>
            {post.type === 'sell' ? (
              <View style={styles.quantityWrapper}>
                <Text style={[typography.body1, utilStyles.flex1]}>
                  Quantity
                </Text>
                <View style={[utilStyles.row, utilStyles.alignCenter]}>
                  <Button
                    type={
                      quantity > (inBasket ? 0 : 1) ? 'primary' : 'disabled'
                    }
                    style={styles.changeQuantityButton}
                    onPress={() =>
                      quantity > (inBasket ? 0 : 1) && setQuantity(quantity - 1)
                    }>
                    <Icons.Minus
                      style={{
                        color:
                          quantity === (inBasket ? 0 : 1)
                            ? Colors.contentEbony
                            : '#fff',
                      }}
                      {...iconSize(18)}
                    />
                  </Button>
                  <CurrencyInput
                    underlineColorAndroid="transparent"
                    style={styles.input}
                    value={quantity}
                    delimiter={null}
                    separator={null}
                    precision={0}
                    onChangeValue={setQuantity}
                    maxValue={20}
                    minValue={inBasket ? 0 : 1}
                  />
                  <Button
                    type={quantity < 20 ? 'primary' : 'disabled'}
                    style={styles.changeQuantityButton}
                    onPress={() => quantity < 20 && setQuantity(quantity + 1)}>
                    <Icons.Plus
                      style={{
                        color: quantity >= 20 ? Colors.contentEbony : '#fff',
                      }}
                      {...iconSize(18)}
                    />
                  </Button>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.scheduleInput}
                activeOpacity={0.7}
                onPress={handleOnSetSchedulePress}>
                <TextInput
                  inputStyle={{ color: Colors.contentEbony }}
                  label={item.schedule ? 'Schedule' : 'Set Schedule'}
                  disabled
                  filled
                  editable={false}
                  value={
                    schedule
                      ? format(
                          schedule,
                          `MMMM dd, yyyy 'at' '${parseTime(schedule)}'`
                        )
                      : undefined
                  }
                  placeholderTextColor={Colors.contentEbony}
                  rightIcon={() => (
                    <Icons.ChevronDown style={{ color: Colors.icon }} />
                  )}
                />
              </TouchableOpacity>
            )}
            {!!item.custom_requests && (
              <View style={styles.notesWrapper}>
                <TextInput
                  label="Notes (Optional)"
                  placeholder="e.g. no onions"
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>
            )}

            <View style={styles.buttonWrapper}>
              <Button
                style={styles.submitButton}
                type={
                  !canSubmit() ? 'disabled' : !quantity ? 'danger' : 'primary'
                }
                onPress={handleOnSubmit}
                disabled={!canSubmit()}>
                {!quantity ? (
                  <Text
                    style={[
                      typography.body1narrow,
                      typography.medium,
                      { color: '#fff', flex: 1, textAlign: 'center' },
                    ]}>
                    Remove
                  </Text>
                ) : post.type === 'sell' ? (
                  <>
                    <Text style={[typography.body1narrow, typography.medium]}>
                      Add to Order
                    </Text>
                    <Text style={[typography.body1narrow, typography.medium]}>
                      ₱
                      {formatNumber(item.price * quantity, {
                        separator: '.',
                        precision: 2,
                        delimiter: ',',
                      })}
                    </Text>
                  </>
                ) : (
                  <Text
                    style={[
                      typography.body1narrow,
                      typography.medium,
                      utilStyles.flex1,
                      typography.textCenter,
                    ]}>
                    Book
                  </Text>
                )}
              </Button>
            </View>
          </>
        )}
      </View>
    </DismissKeyboardView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
    paddingHorizontal: normalize(16),
  },
  buttonWrapper: {
    paddingVertical: normalize(16),
    paddingTop: 0,
  },
  content: {
    paddingVertical: normalize(16),
  },
  postDetails: {
    flexDirection: 'row',
    paddingBottom: normalize(16),
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors.Gainsboro,
  },
  postImage: {
    ...iconSize(60),
    borderRadius: normalize(4),
    marginRight: normalize(12),
  },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(16),
  },
  input: {
    borderWidth: normalize(1),
    borderColor: Colors.primaryYellow,
    borderRadius: normalize(4),
    width: normalize(66),
    textAlign: 'center',
    justifyContent: 'center',
    padding: 0,
    marginHorizontal: normalize(8),
    height: normalize(32),
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notesWrapper: {
    paddingTop: normalize(16),
    borderTopWidth: normalize(1),
    borderTopColor: Colors.Gainsboro,
    marginBottom: normalize(16),
  },
  changeQuantityButton: {
    ...iconSize(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleInput: {
    marginBottom: normalize(16),
    paddingTop: normalize(16),
    borderTopColor: Colors.neutralGray,
    borderTopWidth: normalize(1),
  },
})

export default AddToBasketModal
