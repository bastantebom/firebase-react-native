import { Icons } from '@/assets/images/icons'
import { BottomSheetHeader } from '@/components'
import Button from '@/components/Button'
import RadioButton from '@/components/radio-button'
import { Context } from '@/context'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize, parseTime } from '@/globals/Utils'
import React, { useContext, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  UIManager,
  Platform,
  LayoutAnimation,
} from 'react-native'
import TextInput from '@/components/textinput'
import { format } from 'date-fns'
import CustomDatePicker from '../components/custom-date-picker'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

/**
 * @param {object} props
 * @param {function} props.close
 * @param {object} props.post
 **/
const ChangeShippingMethodModal = ({ close, post }) => {
  const { basket, setBasket } = useContext(Context)
  const [method, setMethod] = useState(
    post.type === 'sell' ? basket.shippingMethod : basket.bookingMethod
  )
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [initDate, setInitDate] = useState(basket.schedule || new Date())
  const [selectedDate, setSelectedDate] = useState()
  const [schedule, setSchedule] = useState(basket.schedule)
  const title =
    post.type === 'sell' ? 'Change Shipping Method' : 'Change Booking Method'

  const handleOnConfirmPress = () => {
    const newBasket = { ...basket, schedule }
    if (post.type === 'sell') newBasket.shippingMethod = method
    else if (post.type === 'service') newBasket.bookingMethod = method

    setBasket(newBasket)
    close()
  }

  const handleOnMethodPress = method => {
    configureAnimation()
    setMethod(method)
  }

  const handleOnSetSchedulePress = () => {
    setDatePickerVisible(true)
    setSelectedDate(new Date(basket.schedule || initDate))
  }

  const handleOnDateSelected = date => {
    setSelectedDate(new Date(date))
  }

  const handleOnSaveSchedulePress = () => {
    setDatePickerVisible(false)
    setSchedule(selectedDate)
    setInitDate(selectedDate)
  }

  const handleOnBackPress = () => {
    datePickerVisible ? setDatePickerVisible(false) : close()
  }

  const canSubmit = () => {
    if (post.type === 'service' && !schedule && method === 'appointment')
      return false

    return true
  }

  const configureAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 120,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
    })
  }

  return (
    <View style={styles.container}>
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
              minimumDate={new Date()}
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
        <View>
          <Text style={[typography.subtitle1, { marginTop: normalize(16) }]}>
            {title}
          </Text>

          {post.type === 'sell' ? (
            <>
              <View
                style={{
                  borderBottomWidth: normalize(1),
                  borderBottomColor: Colors.Gainsboro,
                }}>
                <RadioButton
                  containerStyle={styles.shippingMethod}
                  value={method === 'delivery'}
                  onPress={() => handleOnMethodPress('delivery')}>
                  <Text
                    style={[
                      typography.body1narrow,
                      typography.medium,
                      { flex: 1 },
                    ]}>
                    Delivery
                  </Text>
                  <Icons.Truck
                    style={{ color: Colors.icon, marginRight: normalize(8) }}
                    {...iconSize(24)}
                  />
                </RadioButton>

                {method === 'delivery' && (
                  <TouchableOpacity
                    style={{ marginBottom: normalize(16) }}
                    activeOpacity={0.7}
                    onPress={handleOnSetSchedulePress}></TouchableOpacity>
                )}
              </View>

              <View>
                <RadioButton
                  containerStyle={styles.shippingMethod}
                  value={method === 'pickup'}
                  onPress={() => handleOnMethodPress('pickup')}>
                  <Text
                    style={[
                      typography.body1narrow,
                      typography.medium,
                      { flex: 1 },
                    ]}>
                    Pick up
                  </Text>
                  <Icons.Pickup
                    style={{ color: Colors.icon, marginRight: normalize(8) }}
                    {...iconSize(24)}
                  />
                </RadioButton>

                {method === 'pickup' && (
                  <TouchableOpacity
                    style={{ marginBottom: normalize(16) }}
                    activeOpacity={0.7}
                    onPress={handleOnSetSchedulePress}></TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  borderBottomWidth: normalize(1),
                  borderBottomColor: Colors.Gainsboro,
                }}>
                <RadioButton
                  containerStyle={styles.shippingMethod}
                  value={method === 'appointment'}
                  onPress={() => handleOnMethodPress('appointment')}>
                  <Text
                    style={[
                      typography.body1narrow,
                      typography.medium,
                      { flex: 1 },
                    ]}>
                    By Appointment
                  </Text>
                  <Icons.Appointment
                    style={{ color: Colors.icon, marginRight: normalize(8) }}
                    {...iconSize(24)}
                  />
                </RadioButton>

                {method === 'appointment' && (
                  <TouchableOpacity
                    style={{
                      marginBottom: normalize(16),
                      height: normalize(54),
                      width: '100%',
                      zIndex: 2000,
                    }}
                    activeOpacity={0.7}
                    onPress={handleOnSetSchedulePress}>
                    <View pointerEvents="none">
                      <TextInput
                        inputStyle={{ color: Colors.contentEbony }}
                        label={basket.schedule ? 'Schedule' : 'Set Schedule'}
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
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              <View>
                <RadioButton
                  containerStyle={styles.shippingMethod}
                  value={method === 'walkin'}
                  onPress={() => handleOnMethodPress('walkin')}>
                  <Text
                    style={[
                      typography.body1narrow,
                      typography.medium,
                      { flex: 1 },
                    ]}>
                    Walk-in
                  </Text>
                  <Icons.Pickup
                    style={{ color: Colors.icon, marginRight: normalize(8) }}
                    {...iconSize(24)}
                  />
                </RadioButton>
              </View>
            </>
          )}

          <View style={styles.buttonWrapper}>
            <Button
              label="Confirm"
              type={!canSubmit() ? 'disabled' : 'primary'}
              disabled={!canSubmit()}
              onPress={handleOnConfirmPress}
            />
          </View>
        </View>
      )}
    </View>
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
    paddingTop: 0,
    paddingBottom: normalize(24),
  },
  shippingMethod: {
    paddingVertical: normalize(16),
    flexDirection: 'row-reverse',
  },
})

export default ChangeShippingMethodModal
