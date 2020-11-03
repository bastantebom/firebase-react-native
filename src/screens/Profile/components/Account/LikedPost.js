//import liraries
import React, { useState, useContext } from 'react'
import { View, StyleSheet, SafeAreaView } from 'react-native'

import {
  ScreenHeaderTitle,
  AppText,
  PaddingView,
  LikedPosts,
} from '@/components'

import { normalize, Colors } from '@/globals'
import { NoPost } from '@/assets/images'
import { Context } from '@/context'

// create a component
const LikedPost = ({ toggleMenu, toggleLikePost }) => {
  const [hasLikePost, setHasLikePost] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const { likedPosts } = useContext(Context)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaddingView paddingSize={3}>
        <ScreenHeaderTitle
          iconSize={16}
          title="Liked Posts"
          close={toggleLikePost}
        />
      </PaddingView>

      <LikedPosts
        type="liked"
        data={likedPosts}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        toggleMenu={toggleMenu}
        toggleLikePost={toggleLikePost}
      />
    </SafeAreaView>
  )
}

//make this component available to the app
export default LikedPost
