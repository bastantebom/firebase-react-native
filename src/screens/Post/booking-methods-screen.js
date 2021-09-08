import { Icons } from '@/assets/images/icons'
import Button from '@/components/Button'
import ToggleSwitch from '@/components/toggle'
import { UserContext } from '@/context/UserContext'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import React, { useContext, useState } from 'react'
import TextInput from '@/components/textinput'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  UIManager,
  LayoutAnimation,
  StatusBar,
} from 'react-native'
import { iconSize } from '@/globals/Utils'
import { getStatusBarHeight } from 'react-native-status-bar-height'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

/**
 * @typedef {object} BookingMethodsScreenProps
 * @property {any} data
 * @property {function} onSubmit
 */

/**
 * @typedef {object} RootProps
 * @property {BookingMethodsScreenProps} BookingMethodsScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'BookingMethodsScreen'>} param0 */
const BookingMethodsScreen = ({ navigation, route }) => {
  const { data, onSubmit } = route.params

  const [bookingMethods, setBookingMethods] = useState({
    appointment: {
      enabled: !!data.appointment,
      notes: data.appointment?.notes || '',
    },
    walkin: {
      enabled: !!data.walkin,
      notes: data.walkin?.notes || '',
    },
  })

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

  const handleMethodPress = method => {
    configureAnimation()
    setBookingMethods(methods => ({
      ...methods,
      [method]: { ...methods[method], enabled: !methods[method].enabled },
    }))
  }

  const handleSubmit = () => {
    const data = {}

    if (bookingMethods.appointment.enabled)
      data.appointment = bookingMethods.appointment
    if (bookingMethods.walkin.enabled) data.walkin = bookingMethods.walkin
    delete bookingMethods.appointment.enabled
    delete bookingMethods.walkin.enabled

    onSubmit(data)
  }

  const renderBookingMethods = () => {
    const setAppointmentNotes = notes => {
      setBookingMethods(methods => ({
        ...methods,
        appointment: {
          ...methods.appointment,
          notes,
        },
      }))
    }

    const setWalkinNotes = notes => {
      setBookingMethods(methods => ({
        ...methods,
        walkin: {
          ...methods.walkin,
          notes,
        },
      }))
    }

    return (
      <View style={styles.bookingMethods}>
        <View style={styles.bookingMethod}>
          <ToggleSwitch
            onPress={() => handleMethodPress('appointment')}
            value={bookingMethods.appointment.enabled}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  typography.body1narrow,
                  typography.medium,
                  { flex: 1, color: Colors.contentEbony },
                ]}>
                Appointments Only
              </Text>
              <Text
                style={[
                  typography.body2,
                  {
                    color: Colors.contentPlaceholder,
                    marginTop: normalize(4),
                  },
                ]}>
                Customers need to reserve their slot ahead with their preferred
                date and time.
              </Text>
            </View>
          </ToggleSwitch>
          {bookingMethods.appointment.enabled && (
            <View style={{ marginTop: normalize(16) }}>
              <TextInput
                value={bookingMethods.appointment.notes}
                onChangeText={setAppointmentNotes}
                placeholder="Additional Notes (Optional)"
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor="#A8AAB7"
              />
            </View>
          )}
        </View>
        <View style={[styles.bookingMethod, { borderBottomWidth: 0 }]}>
          <ToggleSwitch
            onPress={() => handleMethodPress('walkin')}
            value={bookingMethods.walkin.enabled}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  typography.body1narrow,
                  typography.medium,
                  { flex: 1, color: Colors.contentEbony },
                ]}>
                Walk-ins
              </Text>
              <Text
                style={[
                  typography.body2,
                  {
                    color: Colors.contentPlaceholder,
                    marginTop: normalize(4),
                  },
                ]}>
                Customers can avail the service anytime, within your specified
                operating hours.
              </Text>
            </View>
          </ToggleSwitch>
          {bookingMethods.walkin.enabled && (
            <View style={{ marginTop: normalize(16) }}>
              <TextInput
                value={bookingMethods.walkin.notes}
                onChangeText={setWalkinNotes}
                placeholder="Are there additional fees and options? (Optional)"
                placeholderTextColor="#A8AAB7"
                multiline={true}
                numberOfLines={6}
                containerStyle={{ height: 'auto' }}
                textAlignVertical="top"
              />
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Booking Methods</Text>
          </View>
        </View>
        <ScrollView>
          <View style={styles.content}>
            <Text style={[typography.body1, styles.contentTitle]}>
              Set your booking preferences
            </Text>

            {renderBookingMethods()}
          </View>
        </ScrollView>
        <View style={styles.buttonWrapper}>
          <Button label="Save" type="primary" onPress={handleSubmit} />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: getStatusBarHeight(),
  },
  header: {
    flexDirection: 'row',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
  },
  title: {
    ...typography.body2,
    ...typography.medium,
  },
  content: {
    flex: 1,
    padding: normalize(24),
  },
  contentTitle: {
    color: Colors.primaryMidnightBlue,
  },
  sub: {
    marginTop: normalize(4),
  },
  learnMore: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(4),
    marginTop: normalize(16),
  },
  buttonWrapper: {
    padding: normalize(24),
    paddingTop: 0,
  },
  contentTitle: {
    color: Colors.primaryMidnightBlue,
  },
  sub: {
    marginTop: normalize(4),
  },
  bookingMethods: {},
  bookingMethod: {
    paddingVertical: normalize(16),
    borderBottomColor: Colors.Gainsboro,
    borderBottomWidth: normalize(1),
  },
})

export default BookingMethodsScreen
