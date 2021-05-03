import { Icons } from '@/assets/images/icons'
import Button from '@/components/Button'
import TextInput from '@/components/textinput'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import React, { useState } from 'react'
import {
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

const DismissKeyboardView = ({ children, ...props }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View {...props}>{children}</View>
    </TouchableWithoutFeedback>
  )
}

/**
 * @typedef {object} AdditionalNotesScreenProps
 * @property {function} onSubmit
 * @property {string} notes
 * @property {string} description
 */

/**
 * @typedef {object} RootProps
 * @property {AdditionalNotesScreenProps} AdditionalNotesScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'AdditionalNotesScreen'>} param0 */
const AdditionalNotesScreen = ({ navigation, route }) => {
  const { onSubmit, description } = route.params
  const [notes, setNotes] = useState(route.params.notes || '')
  const handleOnSubmitPress = () => {
    onSubmit(notes)
    navigation.goBack()
  }

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
            <Text style={styles.title}>Additional Notes</Text>
          </View>
        </View>
        <DismissKeyboardView style={styles.content}>
          {!!description?.length && (
            <Text style={[typography.body2, { marginBottom: normalize(16) }]}>
              {description}
            </Text>
          )}
          <TextInput
            value={notes}
            label="Additional Notes"
            onChangeText={setNotes}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
            placeholder="e.g. Disclaimer, Terms and Conditions, Returns Policy"
            placeholderTextColor="#A8AAB7"
          />
        </DismissKeyboardView>
        <View style={styles.buttonWrapper}>
          <Button label="Save" type="primary" onPress={handleOnSubmitPress} />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  buttonWrapper: {
    padding: normalize(24),
  },
  content: {
    flex: 1,
    padding: normalize(24),
  },
  header: {
    flexDirection: 'row',
  },
  title: {
    ...typography.body2,
    ...typography.medium,
  },
  titleWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: normalize(16),
    position: 'absolute',
    width: '100%',
  },
  wrapper: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: getStatusBarHeight(),
  },
})

export default AdditionalNotesScreen
