import React, { useState } from 'react'
import { View, TouchableOpacity, Dimensions } from 'react-native'
import { AppText } from '@/components'
import { Colors } from '@/globals'
import { useNavigation } from '@react-navigation/native'
const ProfileButtons = () => {
  const navigation = useNavigation()

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('NBTScreen', {
            screen: 'edit-profile',
          })
        }
        style={{ paddingRight: 8 }}>
        <View
          style={{
            width: Dimensions.get('window').width / 2.35,
            alignItems: 'center',
            paddingVertical: 8,
            borderRadius: 4,
            backgroundColor: Colors.neutralsWhite,
            borderWidth: 1,
            borderColor: Colors.contentEbony,
          }}>
          <AppText textStyle="captionConstant">Edit Profile</AppText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          navigation.navigate('NBTScreen', {
            screen: 'update-temperature',
          })
        }}
        style={{ paddingLeft: 8 }}>
        <View
          style={{
            width: Dimensions.get('window').width / 2.35,
            alignItems: 'center',
            paddingVertical: 8,
            borderRadius: 4,
            backgroundColor: Colors.neutralsWhite,
            borderWidth: 1,
            borderColor: Colors.contentEbony,
          }}>
          <AppText textStyle="captionConstant">Update Temperature</AppText>
        </View>
      </TouchableOpacity>
    </>
  )
}

export default ProfileButtons
