import { Icons } from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import WebView from 'react-native-webview'
import LottieView from 'lottie-react-native'
import assetLoader from '@/assets/animations/asset-loader.json'
import utilStyles from '@/globals/util-styles'
import { noop } from 'lodash'
import StatusBar from '@/components/StatusBar'

/**
 * @typedef {object} WebviewScreenProps
 * @property {string} url
 * @property {string} title
 * @property {string} injectedJavaScript
 */

/**
 * @typedef {object} RootProps
 * @property {WebviewScreenProps} WebviewScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'WebviewScreen'>} param0 */
const WebviewScreen = ({ navigation, route }) => {
  const { url: uri, title, injectedJavaScript } = route.params
  const [webviewLoaded, setWebviewLoaded] = useState(false)

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
            <Text style={[typography.body2, typography.medium]}>{title}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {!webviewLoaded && (
            <View
              style={[
                utilStyles.flex1,
                utilStyles.alignCenter,
                utilStyles.justifyCenter,
              ]}>
              <LottieView source={assetLoader} autoPlay style={styles.loader} />
            </View>
          )}

          <View
            style={{
              display: webviewLoaded ? 'flex' : 'none',
              flex: webviewLoaded ? 1 : 0,
            }}>
            <WebView
              source={{ uri }}
              injectedJavaScript={injectedJavaScript}
              onMessage={noop}
              javaScriptEnabled={true}
              onLoadEnd={() => {
                setTimeout(() => {
                  setWebviewLoaded(true)
                }, 250)
              }}
            />
          </View>
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
  loader: {
    width: normalize(32),
    height: normalize(32),
  },
})

export default WebviewScreen
