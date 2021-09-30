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
 * @property {string} postType
 */

/**
 * @typedef {object} RootProps
 * @property {AdditionalNotesScreenProps} AdditionalNotesScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'AdditionalNotesScreen'>} param0 */
const AdditionalNotesScreen = ({ navigation, route }) => {
  const { onSubmit, postType } = route.params
  const [notes, setNotes] = useState(route.params.notes || '')
  const handleOnSubmitPress = () => {
    onSubmit(notes)
    navigation.goBack()
  }

  const [maxLines, setMaxLines] = useState(5)
  const handleOnLayout = event => {
    setMaxLines(~~(event.nativeEvent.layout.height / 24 - 3))
  }

  const title = postType ? 'Add Notes for your Customer' : 'Additional Notes'

  const label = postType
    ? postType === 'need'
      ? 'Share more details'
      : 'Got other details to highlight?'
    : null

  const description = postType
    ? postType === 'need'
      ? "The more info you post about what you're looking for, the better your chances of finding it."
      : 'Include your promos, discounts, and other information you want to highlight.'
    : 'Any instructions or notes you would like to add?'

  const placeholder = postType
    ? postType === 'need'
      ? 'Add more specific information about what you’re looking for. You can be as detailed as possible.'
      : 'Add your returns and exchange policy, warranty notes, and other terms here.'
    : 'Additional notes'

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
            <Text style={[typography.body2, typography.medium]}>{title}</Text>
          </View>
        </View>
        <DismissKeyboardView style={styles.content} onLayout={handleOnLayout}>
          {label && (
            <Text
              style={[
                typography.body1,
                {
                  marginBottom: normalize(8),
                  color: Colors.primaryMidnightBlue,
                },
              ]}>
              {label}
            </Text>
          )}
          <Text
            style={[
              typography.body2,
              { color: Colors.contentPlaceholder, marginBottom: normalize(16) },
            ]}>
            {description}
          </Text>
          <TextInput
            value={notes}
            placeholder={placeholder}
            onChangeText={setNotes}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
            autoHeight
            minLines={4}
            maxLines={maxLines}
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
    paddingTop: normalize(8),
  },
  header: {
    flexDirection: 'row',
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
