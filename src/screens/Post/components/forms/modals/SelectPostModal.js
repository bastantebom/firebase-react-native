import React from 'react'
import { View, ScrollView, TextInput } from 'react-native'

import { ScreenHeaderTitle } from '@/components'

import { normalize, Colors } from '@/globals'

import { Search } from '@/assets/images/icons'

import OfferPost from '../../OfferPost'

const SelectPostModal = ({ closeModal }) => {
  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <ScreenHeaderTitle
        close={closeModal}
        title="Select Post"
        iconSize={normalize(16)}
        paddingSize={2}
      />
      <View style={{ paddingHorizontal: normalize(16) }}>
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', top: 12, left: 15 }}>
            <Search width={normalize(25)} height={normalize(25)} />
          </View>
          <TextInput
            style={{
              position: 'relative',
              borderColor: Colors.neutralGray,
              borderWidth: 1,
              borderRadius: 4,
              paddingHorizontal: normalize(20),
              paddingRight: normalize(10),
              paddingLeft: normalize(45),
              marginBottom: normalize(16),
              fontFamily: 'RoundedMplus1c-Regular',
              fontSize: normalize(16),
            }}
            placeholder="Search posts"
          />
        </View>
        <OfferPost />
      </View>
    </ScrollView>
  )
}

export default SelectPostModal
