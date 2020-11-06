//import liraries
import React, { useState, useContext } from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'

import {
  ScreenHeaderTitle,
  AppText,
  PaddingView,
  ArchivedPosts,
} from '@/components'
import { Context } from '@/context'
import { normalize, Colors } from '@/globals'
import { NoPost } from '@/assets/images'

// create a component
const ArchivedPost = ({ toggleArchivedPost }) => {
  const { archivedPosts } = useContext(Context)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaddingView paddingSize={3}>
        <ScreenHeaderTitle
          iconSize={16}
          title="Archived Post"
          close={toggleArchivedPost}
        />
      </PaddingView>

      <ArchivedPosts
        type="archived"
        data={archivedPosts}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      {/* About Servbees Modal */}
    </SafeAreaView>
  )
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.emptyStateBackground,
    padding: normalize(16),
  },
  imageWrapper: {
    marginBottom: normalize(16),
  },
  copyWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCopy: {
    textAlign: 'center',
    marginBottom: normalize(8),
  },
})

//make this component available to the app
export default ArchivedPost
