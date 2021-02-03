import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Divider } from 'react-native-paper'

import { AppText, BottomSheetHeader, PaddingView } from '@/components'
import { normalize, Colors } from '@/globals'
import { ProfileListUnfollow } from '@/assets/images/icons'
import Avatar from '@/components/Avatar/avatar'

const ReportContent = ({ data }) => {
  const { profile_photo, username, display_name } = data

  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingBottom: 24,
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
      }}>
      <BottomSheetHeader />
      <PaddingView paddingSize={2}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.userInfoImageContainer}>
            <Avatar path={profile_photo} size="64x64" />
          </View>
          <AppText textStyle="display6" customStyle={{ marginTop: 16 }}>
            Report {display_name}?
          </AppText>
          <AppText textStyle="body2">
            Servbees won’t tell {display_name} that you reported her/him.
          </AppText>
          <Divider style={styles.dividerStyle} />

          <TouchableOpacity
            onPress={() => {}}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <ProfileListUnfollow width={normalize(24)} height={normalize(24)} />
            <AppText
              textStyle="body1"
              customStyle={{ marginLeft: 8 }}
              color={Colors.secondaryBrinkPink}>
              Report @{username}{' '}
            </AppText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
          <View
            style={{
              backgroundColor: Colors.neutralsZircon,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
            }}>
            <AppText textStyle="button2">Cancel</AppText>
          </View>
        </TouchableOpacity>
      </PaddingView>
    </View>
  )
}

const styles = StyleSheet.create({
  userInfoImageContainer: {
    height: normalize(42),
    width: normalize(42),
    borderRadius: normalize(42 / 2),
    overflow: 'hidden',
  },
  dividerStyle: {
    backgroundColor: Colors.neutralsZircon,
    width: '100%',
    marginTop: 16,
    marginBottom: 32,
  },
})

export default ReportContent
