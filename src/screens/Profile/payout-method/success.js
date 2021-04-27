import React, { useEffect } from 'react'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Icons } from '@/assets/images/icons'
import { iconSize } from '@/globals/Utils'
import { SuccessPayout } from '@/assets/images'
import Button from '@/components/Button'
import { CommonActions } from '@react-navigation/routers'

/**
 * @typedef {object} PayoutMethodSuccessProps
 */

/**
 * @typedef {object} RootProps
 * @property {PayoutMethodSuccessProps} PayoutMethodSuccess
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'PayoutMethodSuccess'>} param0 */
const PayoutMethodSuccess = ({ navigation }) => {
  const backPressHandler = event => {
    event.preventDefault()
    const state = navigation.dangerouslyGetState()
    const index = state.routes.findIndex(
      route => route.name === 'payout-method'
    )

    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: state.routes.slice(0, index + 1),
      })
    )
  }

  useEffect(() => {
    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.addListener('beforeRemove', backPressHandler)

    return () => navigation.removeListener('beforeRemove', backPressHandler)
  }, [navigation])

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
        </View>
        <View style={styles.content}>
          <View style={styles.imageWrapper}>
            <SuccessPayout />
          </View>
          <Text
            style={[
              typography.body2,
              typography.medium,
              typography.textCenter,
            ]}>
            Payout Method Successfully Saved
          </Text>
          <Text
            style={[
              typography.body2,
              typography.textCenter,
              { color: Colors.contentPlaceholder, marginTop: normalize(8) },
            ]}>
            Your future payouts will be deposited to your preferred payout
            method.
          </Text>
        </View>
        <View style={styles.buttonsWrapper}>
          <Button label="Okay" type="primary" onPress={navigation.goBack} />
        </View>
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
  content: {
    flex: 1,
    padding: normalize(24),
  },
  imageWrapper: {
    alignItems: 'center',
    marginTop: normalize(64),
    marginBottom: normalize(8),
  },
  buttonsWrapper: {
    padding: normalize(24),
  },
})

export default PayoutMethodSuccess
