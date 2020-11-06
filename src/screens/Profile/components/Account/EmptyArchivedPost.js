//import liraries
import React, { useContext } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Colors, normalize } from '@/globals'

import { NoPost } from '@/assets/images'
import { AppText } from '@/components'

import { Context } from '@/context/index'
import { useNavigation } from '@react-navigation/native'

// create a component
const EmptyArchivedPost = ({ isLoading }) => {
  const { openPostButtons } = useContext(Context)
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <NoPost width={normalize(140)} height={normalize(140)} />
      </View>
      <View style={styles.copyWrapper}>
        <AppText textStyle="display6" customStyle={styles.centerCopy}>
          Posts you’ve archived appears here
        </AppText>
        <AppText
          textStyle="body3"
          color={Colors.profileLink}
          customStyle={styles.centerCopy}>
          Some text here saying not to worry when posts are archived because
          they can re-publish archived posts.
        </AppText>
      </View>
    </View>
  )
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  linksWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(16),
  },

  copySpacing: {
    marginLeft: normalize(8),
    marginRight: normalize(8),
  },
})

//make this component available to the app
export default EmptyArchivedPost
