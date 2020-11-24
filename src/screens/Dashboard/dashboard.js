import React, { useState, useContext, useEffect } from 'react'
import Modal from 'react-native-modal'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'

import { Posts, AppText, WhiteOpacity } from '@/components'
import { Notification } from '@/components/Notification'
import FilterSlider from './components/FilterSlider'

import { Icons } from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'
import { Context } from '@/context'
import { UserContext } from '@/context/UserContext'

import SearchBarWithFilter from './components/SearchBarWithFilter'
import AsyncStorage from '@react-native-community/async-storage'

/**
 * @param {object} param0
 * @param {() => void} param0.onPress
 * @param {() => void} param0.onClose
 */
const VerifyNotifictaion = ({ onPress, onClose }) => {
  return (
    <Notification
      icon={<Icons.VerifiedWhite />}
      onClose={onClose}
      type="primary"
      animationOptions={{ height: 110, delay: 2000 }}>
      <View
        style={{
          zIndex: 999,
          position: 'relative',
        }}>
        <View
          style={{
            width: '100%',
            justifyContent: 'space-evenly',
            marginLeft: 15,
          }}>
          <TouchableOpacity onPress={onPress}>
            <AppText
              textStyle="body2"
              color={Colors.neutralsWhite}
              customStyle={{ marginBottom: 10 }}>
              Safeguard your account and boost your credibility within the
              community.
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText textStyle="body2" color={Colors.neutralsWhite}>
                Get bee-rified
              </AppText>
              <Icons.ChevronRight
                style={{ color: '#fff', marginLeft: normalize(4) }}
                width={normalize(24)}
                height={normalize(24)}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Notification>
  )
}

/** @param {import('@react-navigation/stack').StackScreenProps<{}, 'Dashboard'>} param0 */
const DashboardScreen = ({ navigation }) => {
  const { user, userStatus } = useContext(UserContext)
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [
    shouldShowVerifyNotification,
    setShouldShowVerifyNotification,
  ] = useState(false)

  const [
    isVerifyNotificationVisible,
    setIsVerifyNotificationVisible,
  ] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const { posts } = useContext(Context)

  useEffect(() => {
    if (!userStatus?.verified) return
    const isVerified = Object.values(userStatus?.verified).every(
      status => status === 'completed'
    )
    setIsVerifyNotificationVisible(
      !!user && !isVerified && shouldShowVerifyNotification
    )
  }, [userStatus, shouldShowVerifyNotification])

  useEffect(() => {
    AsyncStorage.getItem('hide-verify-notification').then(hidden => {
      setShouldShowVerifyNotification(hidden !== 'true')
    })
  }, [])

  return (
    <>
      <SafeAreaView style={styles.safeAreaContainer}>
        {isVerifyNotificationVisible && (
          <VerifyNotifictaion
            onPress={() => {
              navigation.navigate('NBTScreen', {
                screen: 'Verification',
              })
            }}
            onClose={() => {
              AsyncStorage.setItem('hide-verify-notification', 'true')
              setIsVerifyNotificationVisible(false)
            }}
          />
        )}

        <View style={styles.container}>
          <SearchBarWithFilter show={() => setIsFiltersVisible(true)} />
          <Posts
            type="dashboard"
            data={posts}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </View>
        <WhiteOpacity />
      </SafeAreaView>
      <Modal
        isVisible={isFiltersVisible}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutRight"
        onSwipeComplete={() => setIsFiltersVisible(false)}
        animationOutTiming={450}
        onSwipeComplete={() => setIsFiltersVisible(false)}
        swipeDirection="right"
        style={{
          justifyContent: 'flex-end',
          margin: 0,
          marginLeft: normalize(32),
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setIsFiltersVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <FilterSlider close={() => setIsFiltersVisible(false)} />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: 'white',
  },
})

export default DashboardScreen
