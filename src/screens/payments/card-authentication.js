import { Icons } from '@/assets/images/icons'
import StatusBar from '@/components/StatusBar'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { WebView } from 'react-native-webview'

/**
 * @typedef {object} CardAuthenticationScreenProps
 * @property {string} uri
 * @property {string} title
 * @property {() => void} onComplete
 */

/**
 * @typedef {object} RootProps
 * @property {CardAuthenticationScreenProps} CardAuthenticationScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'CardAuthenticationScreen'>} param0 */
const CardAuthenticationScreen = ({ navigation, route }) => {
  const { uri, title, onComplete } = route.params
  const handleOnMessage = event => {
    if (event.nativeEvent.data === '3DS-authentication-complete') onComplete()
  }

  const injectedJavascript = `(function() {
    window.postMessage = (msg) => {
      window.ReactNativeWebView.postMessage(msg)
    }
  })()`

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
              {title || ''}
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <WebView
            style={{ flex: 1 }}
            source={{ uri }}
            startInLoadingState={true}
            onMessage={handleOnMessage}
            injectedJavaScript={injectedJavascript}
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

export default CardAuthenticationScreen
