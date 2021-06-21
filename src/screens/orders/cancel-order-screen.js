import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

import Button from '@/components/Button'

import { Colors, normalize } from '@/globals'
import { iconSize } from '@/globals/Utils'
import typography from '@/globals/typography'
import { Icons } from '@/assets/images/icons'

const CancelOrderScreen = ({ navigation, route }) => {
  const { handleCancel } = route.params

  const options = [
    'Need to change delivery address',
    'Need to modify order',
    'Found cheaper elsewhere',
    'Others',
  ]
  const [selectedOption, setSelectedOption] = useState('')

  const handleConfirm = () => {
    if (selectedOption === 'Others') {
      navigation.navigate('orders', {
        screen: 'cancel-order-textarea',
        params: { handleCancel },
      })

      return
    }

    handleCancel()
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
            onPress={() => navigation.goBack()}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.content}>
            <Text style={[typography.subtitle1, styles.title]}>
              Why did you cancel?
            </Text>

            {options.map((option, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => setSelectedOption(option)}>
                  <Text
                    style={[
                      typography.body2,
                      styles.options,
                      {
                        borderColor:
                          selectedOption === option
                            ? Colors.contentEbony
                            : Colors.neutralsZircon,
                      },
                    ]}>
                    {option}
                  </Text>
                </TouchableWithoutFeedback>
              )
            })}
          </View>
        </ScrollView>

        <View style={styles.buttonWrapper}>
          <Button
            label={selectedOption === 'Others' ? 'Next' : 'Confirm'}
            type={!!selectedOption.length ? 'primary' : 'disabled'}
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
  options: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(16),
    marginBottom: normalize(15),
    borderWidth: normalize(1),
    borderRadius: normalize(4),
  },
  buttonWrapper: {
    padding: normalize(25),
  },
})

export default CancelOrderScreen
