import React, { useContext } from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { Context } from '@/context'
import { UserContext } from '@/context/UserContext'
import { Images } from '@/assets/images'
import { normalize, Colors } from '@/globals'
import { AppButton, AppText } from '@/components'
import { generateDynamicLink, getPreviewLinkData } from '@/globals/Utils'
import Share from 'react-native-share'

const EmptyState = () => {
  const navigation = useNavigation()

  const { setShowButtons } = useContext(Context)
  const { user, userInfo } = useContext(UserContext)

  const handleInvite = async () => {
    try {
      const url = await (async () => {
        return await generateDynamicLink({
          type: 'download',
          social: await getPreviewLinkData({
            type: 'invite',
            data: userInfo,
          }),
        })
      })()

      await Share.open({ url })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Images.DashboardEmptyState style={styles.image} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>No buzz in your area yet</Text>
        <Text style={styles.description}>
          Things will get busy soon! For now, start posting and keep sharing
          Servbees to friends.
        </Text>
      </View>
      <View style={styles.buttonParentWrapper}>
        <View style={styles.buttonWrapper}>
          <AppButton
            customStyle={styles.createButton}
            text={'Create Post'}
            type="primary"
            height="lg"
            onPress={() =>
              user ? setShowButtons(true) : navigation.navigate('Post')
            }
          />
        </View>
      </View>
      <View style={styles.inviteFriendsLink}>
        <AppText textStyle="body2">or </AppText>
        <TouchableOpacity onPress={handleInvite}>
          <AppText textStyle="body2medium" color={Colors.contentOcean}>
            Invite Friends
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: normalize(120),
    paddingBottom: normalize(80),
  },
  imageWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: normalize(40),
    marginBottom: normalize(20),
  },
  textWrapper: {
    paddingLeft: normalize(27.7),
    paddingRight: normalize(27.7),
    marginBottom: normalize(25),
  },
  title: {
    textAlign: 'center',
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(26),
    color: '#2E3034',
    lineHeight: normalize(60),
  },
  description: {
    textAlign: 'center',
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    color: '#2E3034',
    lineHeight: normalize(24),
    letterSpacing: normalize(0.25),
  },
  buttonParentWrapper: {
    alignItems: 'center',
  },
  buttonWrapper: {
    width: normalize(200),
  },
  createButton: {
    marginBottom: normalize(27),
  },
  inviteFriendsLink: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default EmptyState
