import React from 'react'
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import { WebView } from 'react-native-webview'

import { AppText, ScreenHeaderTitle } from '@/components'
import { Colors, normalize } from '@/globals'

const PrivacyPolicy = ({ onClose }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle
        close={onClose}
        title="Privacy Policy"
        paddingSize={3}
      />
      <WebView
        source={{ uri: 'https://servbees.com/privacy/' }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{ flex: 1 }}>
            <ActivityIndicator color={Colors.primaryYellow} />
          </View>
        )}
      />
      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={onClose}>
          <View style={styles.button}>
            <AppText textStyle="body2medium">Agree</AppText>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  buttonWrapper: {
    padding: normalize(24),
    height: normalize(60),
  },

  button: {
    height: normalize(49),
    borderColor: Colors.primaryMidnightBlue,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default PrivacyPolicy
