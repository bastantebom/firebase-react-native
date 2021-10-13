import { Icons } from '@/assets/images/icons'
import { Colors } from '@/globals'
import typography from '@/globals/typography'
import { iconSize, normalize } from '@/globals/Utils'
import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Button from '@/components/Button'
import { Images } from '@/assets/images'
import { CommonActions } from '@react-navigation/native'
import StatusBar from '@/components/StatusBar'

/**
 * @typedef {object} ReportUserSuccessScreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {ReportUserSuccessScreenProps} ReportUserSuccessScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'ReportUserSuccessScreen'>} param0 */
const ReportUserSuccessScreen = ({ navigation }) => {
  const backPressHandler = event => {
    if (navigation.isFocused()) {
      event.preventDefault()
      navigation.removeListener('beforeRemove', backPressHandler)
      const state = navigation.dangerouslyGetParent().dangerouslyGetState()
      const index = state.routes.findIndex(route => route.name === 'report')
      const newRoutes = [...state.routes]
      newRoutes.splice(index, 1)
      navigation.dispatch(
        CommonActions.reset({
          index: newRoutes.length - 1,
          routes: newRoutes,
        })
      )
    }
  }

  useEffect(() => {
    navigation.removeListener('beforeRemove', backPressHandler)
    navigation.addListener('beforeRemove', backPressHandler)

    return () => navigation.removeListener('beforeRemove', backPressHandler)
  }, [navigation])

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
            <Text style={[typography.body2, typography.medium]}>
              Report User
            </Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.content}>
            <Images.ReportSuccess {...iconSize(80)} />
            <Text
              style={[
                typography.body1narrow,
                typography.medium,
                { marginTop: normalize(20) },
              ]}>
              Thanks for letting us know!
            </Text>
            <Text style={[typography.body1, { marginTop: normalize(8) }]}>
              If we find that this account is violating the Servbees Rules, we
              will take action on it.
              {'\n\n'}
              We will always ensure that our community is safe and helpful for
              everyone.
            </Text>
          </View>
        </ScrollView>
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
})

export default ReportUserSuccessScreen
