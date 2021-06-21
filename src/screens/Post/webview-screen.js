import { Icons } from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import { View } from 'native-base'
import React from 'react'
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { getStatusBarHeight } from 'react-native-status-bar-height'

/**
 * @typedef {object} WebviewScreenProps
 * @property {string} uri
 */

/**
 * @typedef {object} RootProps
 * @property {WebviewScreenProps} WebviewScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'WebviewScreen'>} param0 */
const WebviewScreen = ({ navigation, route }) => {
  const { uri, title } = route.params

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
            <Text style={styles.title}>{title || ''}</Text>
          </View>
        </View>
        <View style={styles.content}>
          <WebView
            style={{ flex: 1 }}
            source={{ uri }}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator color={Colors.primaryYellow} />
              </View>
            )}
          />
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
  title: {
    ...typography.body2,
    ...typography.medium,
  },
  content: {
    flex: 1,
  },
  loadingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: '#fff',
  },
})

export default WebviewScreen
