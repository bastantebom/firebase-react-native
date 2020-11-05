import React, { useContext, useEffect, useState } from 'react'
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  View,
  Animated,
} from 'react-native'

import PaddingView from '@/components/AppViewContainer/PaddingView'

// import CloseDark from '@/assets/images/icons/close-dark.svg';
// import CircleTick from '@/assets/images/icons/circle-tick.svg';

import {
  CloseDark,
  CloseLight,
  CircleTick,
  Warning,
  VerifiedWhite,
} from '@/assets/images/icons'
import Colors from '@/globals/Colors'

import { Context } from '@/context'
import { normalize } from '@/globals'

/**
 *
 * @param {
 *     message: <Text> string </Text>
 *     type: "error" | "success"
 * }
 */

const Notification = ({
  message,
  type,
  position = 'absolute',
  top,
  verification,
}) => {
  const { notificationState, closeNotification } = useContext(Context)

  const [isDashboardVisible, setIsDashboardVisible] = useState('open')

  const width = Dimensions.get('window').width

  const styles = StyleSheet.create({
    container: {
      width: width,
      position: position,
      top: 0 + (top ? top : 0),
      left: 0,
      flexDirection: 'row',
      zIndex: 5,
      backgroundColor:
        type === 'success'
          ? Colors.yellow2
          : type === 'verified'
          ? Colors.contentOcean
          : Colors.secondaryBrinkPink,
    },
  })

  const closeDashboardVerification = () => {
    closeAnimation()
    setTimeout(() => {
      setIsDashboardVisible('close')
    }, 500)
  }

  const [notificationHeight] = useState(new Animated.Value(0))

  let notificationStyle = {
    height: notificationHeight,
  }

  useEffect(() => {
    if (isDashboardVisible === 'open')
      setTimeout(() => {
        Animated.timing(notificationHeight, {
          useNativeDriver: false,
          toValue: 70,
          duration: 500,
        }).start()
      }, 4000)
    else {
      Animated.timing(notificationHeight, {
        useNativeDriver: false,
        toValue: 70,
        duration: 500,
      }).start()
    }
  }, [])

  const closeAnimation = () => {
    Animated.timing(notificationHeight, {
      useNativeDriver: false,
      toValue: 0,
      duration: 500,
    }).start()
  }

  const closeHandler = () => {
    closeAnimation()
    setTimeout(() => {
      closeNotification()
    }, 500)
  }

  if (
    verification ? isDashboardVisible === 'open' : notificationState === 'open'
  ) {
    return (
      // <SafeAreaView style={{zIndex: 1}}>
      <Animated.View style={notificationStyle}>
        <PaddingView paddingSize={2} style={styles.container}>
          {type === 'success' ? (
            <CircleTick width={normalize(24)} height={normalize(24)} />
          ) : type === 'verified' ? (
            <VerifiedWhite width={normalize(24)} height={normalize(24)} />
          ) : (
            <Warning width={normalize(24)} height={normalize(24)} />
          )}
          <View style={{ flex: 1 }}>{message}</View>
          <TouchableOpacity
            onPress={() => {
              verification ? closeDashboardVerification() : closeHandler()
            }}
            style={{ height: normalize(24) }}>
            {type === 'success' ? (
              <CloseDark width={normalize(24)} height={normalize(24)} />
            ) : type === 'verified' ? (
              <CloseLight width={normalize(24)} height={normalize(24)} />
            ) : (
              <CloseLight width={normalize(24)} height={normalize(24)} />
            )}
          </TouchableOpacity>
        </PaddingView>
      </Animated.View>
      // </SafeAreaView>
    )
  }

  return <></>
}

export default Notification
