import { Icons } from '@/assets/images/icons'
import Button from '@/components/Button'
import Checkbox from '@/components/checkbox'
import ToggleSwitch from '@/components/toggle'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import React, { useState } from 'react'
import Modal from 'react-native-modal'

import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from 'react-native'
import SetTimeModal from './modals/set-time'
import { capitalize } from 'lodash'
import { iconSize } from '@/globals/Utils'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import StatusBar from '@/components/StatusBar'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

/**
 * @typedef {object} ScheduleData
 * @property {boolean} is24Hour
 * @property {string} opens
 * @property {string} closes
 * @property {string} day
 */

/**
 * @typedef {object} StoreScheduleScreenProps
 * @property {function} onSubmit
 * @property {ScheduleData[]} scheduleData
 * @property {'sell'|'service'} postType
 */

/**
 * @typedef {object} RootProps
 * @property {StoreScheduleScreenProps} StoreScheduleScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'StoreScheduleScreen'>} param0 */
const StoreScheduleScreen = ({ navigation, route }) => {
  const [setTimeModalVisible, setSetTimeModalVisible] = useState(false)
  const [editingTimeDay, setEditingTimeDay] = useState(null)
  const [editingTime, setEditingTime] = useState(null)
  const [editingTimeType, setEditingTimeType] = useState('opening')
  const { onSubmit, scheduleData, postType } = route.params
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]

  const [daysData, setDaysData] = useState(
    days.reduce((data, day) => {
      const existingData = scheduleData?.find(schedule => schedule.day === day)
      data[day] = {
        enabled: !!existingData,
        opens: existingData?.opens || '08:00AM',
        closes: existingData?.closes || '08:00PM',
        is24Hour: !!existingData?.is24Hour,
      }
      return data
    }, {})
  )

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

  const toggleDayEnabled = day => {
    configureAnimation()

    setDaysData(data => ({
      ...data,
      [day]: { ...daysData[day], enabled: !daysData[day].enabled },
    }))
  }

  const toggleIs24Hour = day => {
    configureAnimation()
    setDaysData(data => ({
      ...data,
      [day]: { ...daysData[day], is24Hour: !daysData[day].is24Hour },
    }))
  }

  const showSetTimeModal = ({ day, type, time }) => {
    setEditingTimeDay(day)
    setEditingTimeType(type)
    setEditingTime(time)
    setSetTimeModalVisible(true)
  }

  const handleOnSetTimeSumbit = value => {
    setDaysData(data => ({
      ...data,
      [editingTimeDay]: {
        ...data[editingTimeDay],
        [editingTimeType === 'opening' ? 'opens' : 'closes']: value,
      },
    }))
    setSetTimeModalVisible(false)
  }

  const handleSubmit = () => {
    const data = Object.entries(daysData)
      .filter(object => object[1].enabled)
      .map(([day, value]) => {
        const scheduleData = { day }

        if (!value.is24Hour) {
          scheduleData.opens = value.opens
          scheduleData.closes = value.closes
        } else {
          scheduleData.is24Hour = true
        }

        return scheduleData
      })

    onSubmit(data)
  }

  const renderScheduleDays = () => {
    return (
      <View style={styles.schedules}>
        {Object.entries(daysData).map(([day, data]) => {
          return (
            <View style={styles.dayScheduleItem} key={day}>
              <ToggleSwitch
                containerStyle={styles.toggleSwitch}
                onPress={() => toggleDayEnabled(day)}
                value={data.enabled}>
                <Text style={[typography.body1, styles.dayLabel]}>{day}</Text>
              </ToggleSwitch>
              {data.enabled && (
                <View>
                  <Checkbox
                    containerStyle={styles.checkbox}
                    checked={data.is24Hour}
                    onPress={() => toggleIs24Hour(day)}>
                    <Text style={[typography.caption, styles.checkboxLabel]}>
                      24 Hours
                    </Text>
                  </Checkbox>
                  {!data.is24Hour && (
                    <View style={styles.selectTimeWrapper}>
                      <TouchableOpacity
                        style={[
                          styles.selectTime,
                          { marginRight: normalize(24) },
                        ]}
                        activeOpacity={0.7}
                        onPress={() =>
                          showSetTimeModal({
                            type: 'opening',
                            day,
                            time: data.opens,
                          })
                        }>
                        <Text style={typography.caption}>Opens</Text>
                        <Text
                          style={[
                            typography.caption,
                            typography.medium,
                            styles.scheduleTime,
                          ]}>
                          {data.opens}
                        </Text>
                        <Icons.ChevronDown
                          style={{ color: Colors.icon }}
                          height={normalize(16)}
                          width={normalize(16)}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.selectTime}
                        activeOpacity={0.7}
                        onPress={() =>
                          showSetTimeModal({
                            type: 'closing',
                            day,
                            time: data.closes,
                          })
                        }>
                        <Text style={typography.caption}>Closes</Text>
                        <Text
                          style={[
                            typography.caption,
                            typography.medium,
                            styles.scheduleTime,
                          ]}>
                          {data.closes}
                        </Text>
                        <Icons.ChevronDown
                          style={{ color: Colors.icon }}
                          height={normalize(16)}
                          width={normalize(16)}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          )
        })}
      </View>
    )
  }

  const renderSetTimeModal = () => {
    return (
      <Modal
        isVisible={setTimeModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        style={styles.modal}
        onSwipeComplete={() => setSetTimeModalVisible(false)}
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setSetTimeModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#000a' }} />
          </TouchableWithoutFeedback>
        }>
        <SetTimeModal
          close={() => setSetTimeModalVisible(false)}
          title={`Set ${capitalize(editingTimeType)} Time`}
          onSubmit={handleOnSetTimeSumbit}
          value={editingTime}
        />
      </Modal>
    )
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Store Schedule</Text>
          </View>
        </View>
        <ScrollView style={styles.content}>
          <View>
            <Text style={[typography.body1, styles.contentTitle]}>
              Set your {postType === 'service' ? 'business' : 'service'} hours
            </Text>
            <Text style={[typography.caption, styles.sub]}>
              Manage incoming orders/bookings by publishing your availability.
            </Text>
          </View>
          {renderScheduleDays()}
        </ScrollView>
        <View style={styles.buttonWrapper}>
          <Button label="Save" type="primary" onPress={handleSubmit} />
        </View>
        {renderSetTimeModal()}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
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
    paddingTop: normalize(16),
  },
  contentTitle: {
    color: Colors.primaryMidnightBlue,
  },
  sub: {
    marginTop: normalize(4),
  },
  schedules: {
    marginTop: normalize(24),
  },
  dayLabel: {
    flex: 1,
    paddingVertical: normalize(16),
  },
  checkbox: {
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  checkboxLabel: {
    marginLeft: normalize(8),
  },
  selectTime: {
    flexDirection: 'row',
  },
  scheduleTime: {
    marginLeft: normalize(8),
    marginRight: normalize(16),
  },
  dayScheduleItem: {
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors.Gainsboro,
  },
  selectTimeWrapper: {
    flexDirection: 'row',
    marginBottom: normalize(16),
  },
  toggleSwitch: {
    alignItems: 'center',
  },
  buttonWrapper: {
    padding: normalize(24),
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
})

export default StoreScheduleScreen
