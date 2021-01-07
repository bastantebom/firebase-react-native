import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { Colors, normalize } from '@/globals'

import { NoPost } from '@/assets/images'
import { AppText } from '@/components'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { UserContext } from '@/context/UserContext'
import { useNavigation } from '@react-navigation/native'

const EmptyLikedPosts = ({ toggleLikePost, toggleMenu }) => {
  const { user } = useContext(UserContext)
  const navigation = useNavigation()

  const handleDiscoverPress = () => {
    toggleLikePost?.()
    toggleMenu?.()
    navigation.navigate('dashboard')
  }
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <NoPost width={normalize(140)} height={normalize(140)} />
      </View>
      <View style={styles.copyWrapper}>
        <AppText textStyle="display6" customStyle={styles.centerCopy}>
          You have no liked posts yet
        </AppText>
        <AppText
          textStyle="body2"
          color={Colors.profileLink}
          customStyle={styles.centerCopy}>
          Browse through and discover nearby services and products.
        </AppText>
        {user?.uid && (
          <TouchableOpacity onPress={handleDiscoverPress}>
            <AppText textStyle="body1" color={Colors.contentOcean}>
              Discover
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default EmptyLikedPosts
