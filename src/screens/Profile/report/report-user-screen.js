import { Icons } from '@/assets/images/icons'
import Loader from '@/components/loader'
import { Colors } from '@/globals'
import typography from '@/globals/typography'
import { iconSize, normalize } from '@/globals/Utils'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Button from '@/components/Button'
import TextInput from '@/components/textinput'
import { Images } from '@/assets/images'
import TouchableOpacityGesture from 'react-native-gesture-handler/touchables/TouchableOpacity'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'
import Toast from '@/components/toast'

/**
 * @typedef {object} User
 * @property {string} uid
 * @property {string} username
 */
/**
 * @typedef {object} ReportUserScreenProps
 * @property {User} user
 */

/**
 * @typedef {object} RootProps
 * @property {ReportUserScreenProps} ReportUserScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'ReportUserScreen'>} param0 */
const ReportUserScreen = ({ navigation, route }) => {
  const { user } = route.params
  const { userInfo } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedReason, setSelectedReason] = useState()
  const [isOnMessage, setIsOnMessage] = useState(false)
  const [message, setMessage] = useState('')
  const reasons = [
    'It’s suspicious or spam.',
    'This account seems to be hacked.',
    'They’re pretending to be me or someone else.',
    'Their profile info and/or images includes abusive and/or hateful content.',
    'The posts includes inappropriate content.',
    'This account is suspicious.',
    'This person is being abusive towards other users.',
    'Others',
  ]

  const backPressHandler = useCallback(
    event => {
      if (isOnMessage && navigation.isFocused()) {
        event.preventDefault()
        setIsOnMessage(false)
      }
    },
    [isOnMessage, navigation]
  )

  useEffect(() => {
    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.addListener('beforeRemove', backPressHandler)

    return () => navigation.removeListener('beforeRemove', backPressHandler)
  }, [navigation, isOnMessage])

  const canSubmit = () => !!selectedReason && message.length
  const handleOnSubmit = async () => {
    if (!isOnMessage) {
      setIsOnMessage(true)
      return
    }

    setIsLoading(true)
    try {
      const response = await Api.reportUser({
        uid: userInfo.uid,
        body: {
          reported_uid: user.uid,
          reason: selectedReason,
          message,
        },
      })

      if (!response.success) throw new Error(response.message)
      navigation.navigate('report-user-success')
    } catch (error) {
      console.log(error)
      Toast.show({
        label: 'Oops! Something went wrong',
        type: 'error',
        dismissible: true,
        timeout: 5000,
        screenId: 'root',
      })
    }
    setIsLoading(false)
  }

  const handleOnReasonPress = reason => {
    setSelectedReason(reason)
  }

  const renderItem = reason => {
    return (
      <TouchableOpacityGesture
        style={[
          styles.reason,
          selectedReason === reason ? { borderColor: Colors.contentEbony } : {},
        ]}
        onPress={() => handleOnReasonPress(reason)}
        activeOpacity={0.7}
        key={reason}>
        <Text style={typography.body2}>{reason}</Text>
      </TouchableOpacityGesture>
    )
  }
  return (
    <>
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
              Report User
            </Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.content}>
            <Images.ReportProfile {...iconSize(80)} />
            <Text style={[typography.body1, { marginTop: normalize(8) }]}>
              Help us understand why you are reporting{' '}
              <Text style={typography.medium}>@{user.username}</Text>.
            </Text>
            {!isOnMessage ? (
              <View style={styles.reasons}>{reasons.map(renderItem)}</View>
            ) : (
              <>
                <Text
                  style={[
                    typography.body2,
                    typography.medium,
                    { marginTop: normalize(24), marginBottom: normalize(8) },
                  ]}>
                  {selectedReason}
                </Text>
                <TextInput
                  placeholder="Be more specific about why you’re reporting this account."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  autoHeight
                  numberOfLines={6}
                  maxLines={6}
                  minLines={4}
                />
              </>
            )}
          </View>
        </ScrollView>
        <View style={styles.buttonsWrapper}>
          <Button
            label={!isOnMessage ? 'Next' : 'Report'}
            type={canSubmit() || !isOnMessage ? 'primary' : 'disabled'}
            disabled={!canSubmit() && isOnMessage}
            onPress={handleOnSubmit}
          />
        </View>
      </View>
    </>
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
    backgroundColor: '#fff',
    padding: normalize(24),
    paddingTop: 0,
  },
  buttonsWrapper: {
    paddingHorizontal: normalize(24),
    paddingBottom: normalize(16),
    backgroundColor: '#fff',
  },
  reason: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    borderRadius: normalize(4),
    borderColor: Colors.neutralsZircon,
    borderWidth: normalize(1),
    marginBottom: normalize(12),
  },
  reasons: {
    marginTop: normalize(16),
  },
})

export default ReportUserScreen
