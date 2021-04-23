import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { Colors, normalize } from '@/globals'

import { Users, Icons } from '@/assets/images/icons'
import { NoInfo } from '@/assets/images'
import { AppText, PaddingView } from '@/components'
import { UserContext } from '@/context/UserContext'
import { ScrollView } from 'react-native-gesture-handler'
import Api from '@/services/Api'
import { useNavigation } from '@react-navigation/native'

const MoreInfo = ({ profileInfo }) => {
  const [hasInfo, setHasInfo] = useState(false)
  const { description, uid, display_name, full_name } = profileInfo
  const { userInfo } = useContext(UserContext)
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [verifications, setVerifications] = useState([
    {
      key: 'profile',
      label: 'Profile',
    },
    {
      key: 'phone_number',
      label: 'Mobile Number',
    },
    {
      key: 'account',
      label: 'Government I.D.',
    },
    {
      key: 'email',
      label: 'Email Address',
    },
  ])
  const [statusPercentage, setStatusPercentage] = useState(0)
  const navigation = useNavigation()

  const initConnections = async () => {
    if (description && description?.trim().length) {
      setHasInfo(true)
      const followersResponse = await Api.getFollowers({ uid })
      const followingResponse = await Api.getFollowing({ uid })
      setFollowers(followersResponse.data.length)
      setFollowing(followingResponse.data.length)
    }
  }

  const initStatus = async () => {
    const response = await Api.getUserStatus({ uid })
    setVerifications(
      verifications.map(verification => ({
        ...verification,
        status: response?.status?.verified[verification.key] || 'pending',
      }))
    )
    setStatusPercentage(
      Object.values(response?.status?.verified || {}).reduce(
        (a, status) => a + (status === 'completed' ? 1 : 0),
        0
      ) * 0.25
    )
  }

  useEffect(() => {
    let mounted = true
    if (uid && mounted) {
      initStatus()
      initConnections()
    }
    return () => {
      mounted = false
    }
  }, [profileInfo])

  const WithInfo = () => {
    return (
      <>
        <View
          style={{
            borderBottomColor: Colors.neutralGray,
            borderBottomWidth: 1,
          }}>
          <PaddingView paddingSize={4}>
            <View style={styles.titleWrapper}>
              <AppText textStyle="subtitle2">About</AppText>
            </View>
            <View style={styles.infoContentWrapper}>
              <AppText textStyle="body2">{description}</AppText>
            </View>
            <View style={styles.connectionWrapper}>
              <View style={styles.followers}>
                <Users width={normalize(14)} height={normalize(14)} />
                <AppText
                  textStyle="caption"
                  color={Colors.profileLink}
                  customStyle={{ marginLeft: 4 }}>
                  {followers > 1
                    ? `${followers} Followers`
                    : `${followers} Follower`}
                </AppText>
              </View>
              <View style={styles.following}>
                <AppText textStyle="caption" color={Colors.profileLink}>
                  {following > 1
                    ? `${following} Followings`
                    : `${following} Following`}
                </AppText>
              </View>
            </View>
          </PaddingView>
        </View>
        {userInfo?.uid === uid && (
          <View>
            <PaddingView paddingSize={4}>
              <View style={styles.titleWrapper}>
                <AppText textStyle="subtitle2">
                  {statusPercentage < 1
                    ? `${
                        full_name.split(' ')[0]
                      } we're still verifying your profile`
                    : `${full_name.split(' ')[0]} is verified by Servbees`}
                </AppText>
                {statusPercentage < 1 && (
                  <AppText textStyle="caption">
                    Thank you for providing the following documents and
                    information{' '}
                  </AppText>
                )}
              </View>
              <View style={styles.statusWrapper}>
                {verifications.map((verification, index) => {
                  return (
                    <View style={styles.statusItem} key={index}>
                      {verification.status === 'completed' ? (
                        <Icons.CheckActive />
                      ) : (
                        <Icons.CheckInactive />
                      )}
                      <AppText
                        customStyle={{ marginLeft: normalize(8) }}
                        textStyle="body2">
                        {verification.label}
                      </AppText>
                    </View>
                  )
                })}
              </View>
            </PaddingView>
          </View>
        )}
      </>
    )
  }

  return (
    <>
      {hasInfo ? (
        <WithInfo />
      ) : (
        <View style={styles.container}>
          <View style={styles.imageWrapper}>
            <NoInfo width={normalize(140)} height={normalize(140)} />
          </View>
          <View style={styles.copyWrapper}>
            <AppText textStyle="subtitle1" customStyle={styles.centerCopy}>
              {userInfo?.uid === uid
                ? 'Complete your profile'
                : `No additional information about ${
                    display_name ? display_name : full_name
                  }`}
            </AppText>
            {userInfo?.uid === uid && (
              <AppText
                textStyle="body2"
                color={Colors.profileLink}
                customStyle={styles.centerCopy}>
                Additional information about you will be posted here.
              </AppText>
            )}
          </View>
          {userInfo?.uid === uid && (
            <View style={styles.linksWrapper}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('NBTScreen', {
                    screen: 'Verification',
                  })
                }}>
                <AppText textStyle="body1" color={Colors.contentOcean}>
                  Complete your profile
                </AppText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutralsWhite,
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
    paddingHorizontal: normalize(15),
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

  infoContentWrapper: {
    marginTop: normalize(12),
    marginBottom: normalize(21),
  },

  connectionWrapper: {
    flexDirection: 'row',
  },

  followers: {
    marginRight: normalize(16),
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusWrapper: {
    marginTop: normalize(12),
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  statusItem: {
    flexDirection: 'row',
    width: '50%',
    marginBottom: normalize(12),
  },
})

export default MoreInfo
