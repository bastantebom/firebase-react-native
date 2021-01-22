import React, { useState, useContext, useEffect } from 'react'
import { View, ScrollView, TextInput, SafeAreaView } from 'react-native'

import { ScreenHeaderTitle, UserPosts } from '@/components'

import { normalize, Colors } from '@/globals'

import { Search } from '@/assets/images/icons'

import OfferPost from '../../OfferPost'
import { Context } from '@/context/index'
import { UserContext } from '@/context/UserContext'

const SelectPostModal = ({ closeModal, selectNeedFunction }) => {
  const { userPosts } = useContext(Context)
  const { user } = useContext(UserContext)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle
        close={closeModal}
        title="Select Post"
        paddingSize={2}
      />

      <View style={{ flex: 1 }}>
        <View style={{ position: 'relative', paddingHorizontal: 16 }}>
          <View style={{ position: 'absolute', top: 15, left: 24 }}>
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
              paddingVertical: 15,
              marginBottom: normalize(16),
              fontFamily: 'RoundedMplus1c-Regular',
              fontSize: normalize(16),
            }}
            placeholder="Search posts"
          />
        </View>
        <UserPosts
          type="need"
          data={userPosts}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          userID={user.uid}
          selectNeedFunction={selectNeedFunction}
        />
      </View>
    </SafeAreaView>
  )
}

export default SelectPostModal
