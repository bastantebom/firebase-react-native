//import liraries
import React, { useContext } from 'react'
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { Colors, normalize } from '@/globals'

import { NoPost } from '@/assets/images'
import { AppText } from '@/components'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Context } from '@/context/index'
import { UserContext } from '@/context/UserContext'
import { useNavigation } from '@react-navigation/native'

// create a component
const PostOwnEmpty = ({ isLoading, userInfo }) => {
  const { openPostButtons } = useContext(Context)
  const { user } = useContext(UserContext)
  const { display_name, full_name, uid } = userInfo
  const navigation = useNavigation()
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <NoPost width={normalize(140)} height={normalize(140)} />
        </View>
        <View style={styles.copyWrapper}>
          <AppText textStyle="subtitle1" customStyle={styles.centerCopy}>
            {user?.uid !== uid
              ? `${display_name ? display_name : full_name} has no post yet`
              : 'You have no post yet'}
          </AppText>
          {user?.uid === uid && (
            <AppText
              textStyle="body2"
              color={Colors.profileLink}
              customStyle={styles.centerCopy}>
              Browse through and discover nearby services and products. Or, you
              can post your own offers!
            </AppText>
          )}
        </View>

        {user?.uid === uid && (
          <View style={styles.linksWrapper}>
            <TouchableOpacity onPress={() => navigation.navigate('dashboard')}>
              <AppText textStyle="body1" color={Colors.contentOcean}>
                Discover
              </AppText>
            </TouchableOpacity>
            <AppText textStyle="body1" customStyle={styles.copySpacing}>
              or
            </AppText>
            <TouchableOpacity onPress={openPostButtons}>
              <AppText textStyle="body1" color={Colors.contentOcean}>
                Post
              </AppText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height - normalize(110),
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
export default PostOwnEmpty
