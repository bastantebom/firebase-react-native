import React, { useContext } from 'react'
import { View, StyleSheet, SafeAreaView } from 'react-native'
import { ScreenHeaderTitle, AppText, AppButton } from '@/components'
import { InviteFriend } from '@/assets/images'
import { normalize, Colors } from '@/globals'
import { generateDynamicLink, getPreviewLinkData } from '@/globals/Utils'
import Share from 'react-native-share'
import { UserContext } from '@/context/UserContext'

const InviteFriends = ({ navigation }) => {
  const { userInfo } = useContext(UserContext)
  const handleSendInvite = async () => {
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
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ padding: normalize(16) }}>
          <ScreenHeaderTitle
            title="Invite Friends"
            close={() => navigation.goBack()}
          />
        </View>
        <View
          style={{
            padding: normalize(24),
          }}>
          <View style={styles.imageWrapper}>
            <InviteFriend width={normalize(375)} height={normalize(280)} />
          </View>
          <View style={styles.copyWrapper}>
            <AppText
              textStyle="button2"
              color={Colors.profileLink}
              customStyle={styles.centerCopy}>
              Let's grow our fun hustle community! Share the Servbees experience
              with your friends, family, old and new contacts, and invite
              everyone you know to get buzzy.
            </AppText>
          </View>
          <AppButton
            text="Send Invite"
            type="primary"
            size="s"
            height="xl"
            onPress={handleSendInvite}
            customStyle={{ width: '50%' }}
          />
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  imageWrapper: {
    marginBottom: normalize(16),
    alignItems: 'center',
  },
  copyWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: normalize(24),
  },
  centerCopy: {
    textAlign: 'left',
    marginBottom: normalize(8),
  },
})

export default InviteFriends
