import { Images } from '@/assets/images'
import { Icons } from '@/assets/images/icons'
import Button from '@/components/Button'
import { UserContext } from '@/context/UserContext'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import {
  generateDynamicLink,
  getPreviewLinkData,
  iconSize,
} from '@/globals/Utils'
import React, { useContext } from 'react'
import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Share,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

/**
 * @typedef {Object} InviteFriendsScreenProps
 */

/**
 * @typedef {Object} RootProps
 * @property {InviteFriendsScreenProps} InviteFriendsScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'InviteFriendsScreen'>} param0 */
const InviteFriendsScreen = ({ navigation }) => {
  const { userInfo } = useContext(UserContext)
  const handleOnSendInvitePress = async () => {
    try {
      const socialPreview = await getPreviewLinkData({
        type: 'invite',
        data: userInfo,
      })

      const url = await generateDynamicLink({
        type: 'download',
        social: socialPreview,
      })
      const message = `${socialPreview.socialTitle}\r\n\r\n${socialPreview.socialDescription}\r\n${url}`
      await Share.share({ url, message })
    } catch (error) {
      console.log(error)
      Toast.show({
        label: 'Oops! Something went wrong.',
        type: 'error',
        screenId: 'root',
        dismissible: true,
        timeout: 5000,
      })
    }
  }

  return (
    <>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor="#fff"
      />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>
              Invite Friends
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.imageWrapper}>
            <Images.InviteFriends
              width={normalize(375)}
              height={normalize(280)}
            />
          </View>
          <Text style={typography.body2}>
            Let's grow our fun hustle community! Share the Servbees experience
            with your friends, family, old and new contacts, and invite everyone
            you know to get buzzy.
          </Text>
          <Button
            onPress={handleOnSendInvitePress}
            style={styles.button}
            label="Send Invite"
            type="primary"
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
  header: {
    flexDirection: 'row',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
  },
  content: {
    flex: 1,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(12),
    alignItems: 'flex-start',
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: normalize(30),
    marginBottom: normalize(16),
  },
  button: {
    marginTop: normalize(24),
    width: normalize(150),
  },
})

export default InviteFriendsScreen
