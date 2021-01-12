import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { AppButton, AppText } from '@/components'

import { normalize, Colors } from '@/globals'
import { EyeDark } from '@/assets/images/icons'

const MultiChatOptions = ({ close, options }) => {
  const onSelectOption = option => {
    options(option)
    close()
  }

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', paddingBottom: normalize(35) }}>
        <View style={styles.bottomSheetHeader} />
      </View>

      <TouchableOpacity
        style={styles.optionWrapper}
        onPress={() => onSelectOption(true)}>
        <AppText textStyle="body2" customStyle={{ marginLeft: normalize(10) }}>
          Select multiple
        </AppText>
      </TouchableOpacity>
      <AppButton
        text="Cancel"
        type="primary"
        customStyle={{ height: normalize(40), marginTop: normalize(8) }}
        onPress={close}
      />
    </View>
  )
}

export default MultiChatOptions

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: normalize(20),
  },
  bottomSheetHeader: {
    backgroundColor: '#EAEAEA',
    height: normalize(5),
    width: normalize(40),
  },
  optionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(15),
  },
})
