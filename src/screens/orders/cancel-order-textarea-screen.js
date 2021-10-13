import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import Button from '@/components/Button'
import TextField from '@/components/textinput'

import { Colors, normalize } from '@/globals'
import { iconSize } from '@/globals/Utils'
import typography from '@/globals/typography'
import { Icons } from '@/assets/images/icons'
import StatusBar from '@/components/StatusBar'

const CancelOrderTextareaScreen = ({ navigation, route }) => {
  const { handleCancel } = route.params
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    handleCancel()
    navigation.navigate('orders', {
      screen: 'order-tracker',
    })
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View style={styles.content}>
            <Text style={[typography.subtitle1, styles.title]}>
              Why did you cancel?
            </Text>

            <Text
              style={[typography.body2, typography.medium, styles.subtitle]}>
              Others
            </Text>
            <TextField
              value={reason}
              style={[typography.body1narrow, styles.input]}
              multiline={true}
              numberOfLines={Platform.OS === 'ios' ? null : 5}
              minHeight={Platform.OS === 'ios' && 8 ? 20 * 5 : null}
              onChangeText={setReason}
              underlineColorAndroid={'transparent'}
              textAlignVertical="top"
              placeholder="Be more specific about why you're cancelling your order."
              placeholderTextColor="#A8AAB7"
            />
          </View>
        </ScrollView>

        <View style={styles.buttonWrapper}>
          <Button
            label="Cancel Order"
            type={!!reason.length ? 'primary' : 'disabled'}
            onPress={handleConfirm}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: getStatusBarHeight(),
  },
  content: {
    paddingHorizontal: normalize(25),
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
  title: {
    marginBottom: normalize(25),
  },
  subtitle: {
    marginBottom: normalize(10),
  },
  input: {
    color: Colors.contentEbony,
    borderColor: Colors.neutralsZircon,
    borderWidth: normalize(1),
    borderRadius: normalize(4),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
  },
  buttonWrapper: {
    padding: normalize(25),
  },
})

export default CancelOrderTextareaScreen
