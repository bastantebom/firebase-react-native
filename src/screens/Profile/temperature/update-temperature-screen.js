import { Icons } from '@/assets/images/icons'
import Loader from '@/components/loader'
import TextInput from '@/components/textinput'
import { Colors } from '@/globals'
import typography from '@/globals/typography'
import { iconSize, normalize } from '@/globals/Utils'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  RefreshControl,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import TouchableOpacityGesture from 'react-native-gesture-handler/touchables/TouchableOpacity'
import utilStyles from '@/globals/util-styles'
import Button from '@/components/Button'
import Api from '@/services/Api'
import Toast from '@/components/toast'
import { PureComponent } from 'react'
import { UserContext } from '@/context/UserContext'
import moment from 'moment'
import ModalComponent from '@/screens/orders/modals'
import { Images } from '@/assets/images'
import { SafeAreaView } from 'react-native-safe-area-context'

export class TemperatureListItem extends PureComponent {
  render() {
    const date = moment(this.props.item.date._seconds * 1000).format(
      'MMM DD, YYYY [at] hh:mm:ssa'
    )

    const isHigh = parseFloat(this.props.item.value) > 37.5

    return (
      <View key={this.props.id} style={styles.temperatureListItem}>
        <View style={[utilStyles.row, utilStyles.alignCenter]}>
          <Text
            style={[
              typography.body2,
              typography.medium,
              isHigh ? { color: Colors.secondaryBrinkPink } : {},
            ]}>
            {parseFloat(this.props.item.value).toFixed(1)}
            °C
          </Text>
          {isHigh && (
            <TouchableOpacityGesture
              style={{ marginLeft: normalize(4) }}
              onPress={this.props.onNotePress}
              activeOpacity={0.7}>
              <Icons.InfoCircle
                style={{ color: Colors.icon }}
                {...iconSize(24)}
              />
            </TouchableOpacityGesture>
          )}
        </View>
        <Text>{date}</Text>
      </View>
    )
  }
}

/**
 * @typedef {object} UpdateTemperatureSreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {UpdateTemperatureSreenProps} UpdateTemperatureSreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'UpdateTemperatureSreen'>} param0 */
const UpdateTemperatureSreen = ({ navigation }) => {
  const { user } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)
  const [temperature, setTemperature] = useState('')
  const [errors, setErrors] = useState(null)
  const [isDirty, setIsDirty] = useState(false)
  const [recentRecords, setRecentRecords] = useState({})
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [highTemperatureNoteVisible, setHighTemperatureNoteVisible] = useState(
    false
  )

  const handleOnHistoryPress = () => {
    navigation.navigate('temperature-history')
  }

  const handleOnTemperatureAboutPress = () => {
    navigation.navigate('temperature-about')
  }

  const handleOnRefresh = () => {
    loadRecentRecords()
  }

  const checkErrors = () => {
    let errors
    if (!temperature) errors = 'This field is required'
    else if (!(temperature < 42 && temperature >= 36.4))
      errors = 'Body temperature should be within 36.4 °C - 41.0 °C'

    setErrors(errors)
  }

  const loadRecentRecords = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await Api.getTemperatureHistory({
        uid: user.uid,
        limit: 5,
      })
      if (!response.success) throw new Error(response.message)
      const data = response.data.reduce(
        (_records, record) => ({
          ..._records,
          [record.id]: record,
        }),
        {}
      )
      setRecentRecords(data)
    } catch (error) {
      console.log(error)
      Toast.show({
        type: 'error',
        dismissible: true,
        timeout: 5000,
        label: 'Uh-oh, An error occurred. Please try again',
        screenId: '',
      })
    }
    setIsLoading(false)
  }, [setRecentRecords])

  const handleOnSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await Api.updateTemperature({
        uid: user.uid,
        body: {
          temperature,
        },
      })
      if (!response.success) throw new Error(response.message)
      if (parseFloat(temperature) > 37.5) setHighTemperatureNoteVisible(true)
      setIsDirty(false)
      setTemperature('')
      loadRecentRecords()
      Toast.show({
        type: 'success',
        dismissible: true,
        timeout: 5000,
        label: 'Success. Temperature has been saved',
        screenId: '',
      })
    } catch (error) {
      console.log(error)
      Toast.show({
        type: 'error',
        dismissible: true,
        timeout: 5000,
        label: 'Uh-oh, An error occurred. Please try again',
        screenId: '',
      })
    }
    setIsLoading(false)
  }

  const canSubmit = () => {
    return !errors
  }

  useEffect(() => {
    checkErrors()
  }, [temperature])

  useEffect(() => {
    loadRecentRecords()
  }, [loadRecentRecords])

  const handleOnNotePress = () => {
    setHighTemperatureNoteVisible(true)
  }

  const renderItem = item => {
    return (
      <TemperatureListItem
        key={item.id}
        item={item}
        onNotePress={handleOnNotePress}
      />
    )
  }

  return (
    <SafeAreaView style={utilStyles.flex1} edges={['bottom']}>
      <Toast
        containerStyle={{ marginTop: getStatusBarHeight() + normalize(8) }}
        ref={ref => Toast.setRef(ref, 'update-temperature')}
      />
      <Loader visible={isLoading} />
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor="#fff"
      />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>
              Track your temperature
            </Text>
          </View>
          <TouchableOpacityGesture
            onPress={handleOnHistoryPress}
            style={styles.historyButton}
            activeOpacity={0.7}>
            <Text style={[typography.button2, typography.link]}>History</Text>
          </TouchableOpacityGesture>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={utilStyles.flex1}
          keyboardVerticalOffset={normalize(32)}>
          <ScrollView
            contentContainerStyle={utilStyles.flex1}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                titleColor={Colors.primaryMidnightBlue}
                tintColor={Colors.primaryYellow}
                onRefresh={handleOnRefresh}
              />
            }>
            <View style={styles.content}>
              <View
                style={[
                  styles.section,
                  styles.topSection,
                  !Object.values(recentRecords).length
                    ? { ...styles.bottomSection, ...utilStyles.flex1 }
                    : {},
                ]}>
                <Text style={typography.body1}>
                  What’s your body temperature today?
                </Text>
                <Text style={[typography.caption, { marginTop: normalize(8) }]}>
                  We prioritize health and safety. Please take your temperature
                  using a scanner or thermometer and log it down below.
                </Text>
                <TouchableOpacityGesture
                  activeOpacity={0.7}
                  onPress={handleOnTemperatureAboutPress}>
                  <Text
                    style={[
                      typography.caption,
                      typography.link,
                      { marginTop: normalize(8) },
                    ]}>
                    Why we’re asking this?
                  </Text>
                </TouchableOpacityGesture>
                <TextInput
                  containerStyle={[
                    { marginVertical: normalize(16) },
                    errors && isDirty
                      ? { borderColor: Colors.secondaryBrinkPink }
                      : {},
                  ]}
                  onBlur={() => setIsDirty(true)}
                  value={temperature}
                  keyboardType="decimal-pad"
                  label="Body Temperature in °Celsius"
                  onChangeText={_ => {
                    setIsDirty(true)
                  }}
                  maxValue={41.0}
                  onChangeValue={value => setTemperature(value)}
                  isCurrency={true}
                  placeholder="00.0"
                  precision={1}
                  message={isDirty ? errors : ''}
                  messageStyle={{ color: Colors.secondaryBrinkPink }}
                />
              </View>
              {!!Object.values(recentRecords).length && (
                <View
                  style={[
                    styles.section,
                    styles.bottomSection,
                    // utilStyles.flex1,
                  ]}>
                  <Text
                    style={[
                      typography.body2,
                      { color: Colors.contentPlaceholder },
                    ]}>
                    Last 5 Entries
                  </Text>
                  {Object.values(recentRecords).map(renderItem)}
                </View>
              )}
            </View>
          </ScrollView>
          <View style={styles.buttonsWrapper}>
            <Button
              label="Save"
              type={canSubmit() ? 'primary' : 'disabled'}
              disabled={!canSubmit()}
              onPress={handleOnSubmit}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
      <HighTemperatureNote
        isVisible={highTemperatureNoteVisible}
        setIsVisible={setHighTemperatureNoteVisible}
      />
    </SafeAreaView>
  )
}

export const HighTemperatureNote = ({ isVisible, setIsVisible }) => {
  return (
    <ModalComponent isVisible={isVisible} setIsVisible={setIsVisible}>
      <View style={styles.highTemperatureNote}>
        <Images.Doctor {...iconSize(80)} />
        <Text
          style={[
            typography.display6,
            typography.textCenter,
            { color: Colors.primaryMidnightBlue, marginTop: normalize(8) },
          ]}>
          Uh-oh. You need to rest.{' '}
        </Text>
        <Text
          style={[
            typography.body2,
            typography.textCenter,
            { marginTop: normalize(8) },
          ]}>
          Please prioritize getting proper care and resume Servbees transactions
          once you're feeling better and fever-free.
        </Text>
        <View style={styles.dialogButtonWrapper}>
          <Button
            style={{ width: '100%' }}
            onPress={() => setIsVisible(false)}
            label="Okay"
            type="primary"
          />
        </View>
      </View>
    </ModalComponent>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutralsZirconLight,
    marginTop: getStatusBarHeight(),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
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
  content: {
    flex: 1,
  },
  historyButton: {
    zIndex: 2,
    padding: normalize(16),
  },
  buttonsWrapper: {
    paddingHorizontal: normalize(24),
    paddingBottom: normalize(16),
    backgroundColor: '#fff',
  },
  temperatureListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: normalize(16),
    borderBottomColor: Colors.secondarySolitude,
    borderBottomWidth: normalize(1),
    height: normalize(53),
  },
  section: {
    padding: normalize(24),
    backgroundColor: '#fff',
    borderRadius: normalize(10),
    marginBottom: normalize(8),
  },
  topSection: {
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    padding: normalize(16),
    paddingBottom: normalize(24),
  },
  bottomSection: {
    marginBottom: 0,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    paddingBottom: normalize(72),
  },
  highTemperatureNote: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: normalize(24),
  },
  dialogButtonWrapper: {
    width: '100%',
    paddingVertical: normalize(24),
  },
})

export default UpdateTemperatureSreen
