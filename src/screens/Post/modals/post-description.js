import { BottomSheetHeader } from '@/components'
import Button from '@/components/Button'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import React from 'react'
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

const { height } = Dimensions.get('screen')

/**
 * @param {object} props
 * @param {string} props.description
 **/
const PostDescriptionModal = ({ title, description, close }) => {
  return (
    <View style={styles.container}>
      <BottomSheetHeader />
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <ScrollView style={styles.content}>
        <TouchableWithoutFeedback style={{ flex: 1 }}>
          <Text style={typography.body1}>{description}</Text>
        </TouchableWithoutFeedback>
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <Button
          label="Got it!"
          type="primary-outline"
          style={{ borderColor: Colors.primaryMidnightBlue }}
          onPress={close}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    maxHeight: height * 0.85,
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
  },
  titleWrapper: {
    marginHorizontal: normalize(24),
    alignItems: 'center',
    borderBottomColor: Colors.secondarySolitude,
    borderBottomWidth: normalize(1),
    paddingBottom: normalize(16),
  },
  title: {
    ...typography.medium,
    color: Colors.primaryMidnightBlue,
    fontSize: normalize(20),
    lineHeight: normalize(30),
    letterSpacing: normalize(0.15),
  },
  buttonWrapper: {
    padding: normalize(24),
  },
  content: {
    paddingHorizontal: normalize(36),
    paddingVertical: normalize(16),
  },
})

export default PostDescriptionModal
