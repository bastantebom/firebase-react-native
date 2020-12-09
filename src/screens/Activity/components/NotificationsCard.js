import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { AppText, CacheableImage } from '@/components'
import { GlobalStyle, normalize, timePassedShort, Colors } from '@/globals'
import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'
import Modal from 'react-native-modal'
import TrackerModal from '@/screens/Post/components/forms/modals/TrackerModal'

import {
  RedBadge,
  YellowBadge,
  ProfileImageDefault,
  PostClock,
  Bee,
  Verified,
  NotVerified,
} from '@/assets/images/icons'

const NotificationsCard = ({ info, openNotificationHandler }) => {
  const { user } = useContext(UserContext)
  const navigation = useNavigation()

  const {
    profilePhoto,
    name,
    type,
    isFollowing,
    read,
    date,
    follower_uid,
    id,
    approved,
    buyerId,
    orderId,
    postId,
    status,
  } = info[0]

  const [following, setFollowing] = useState(isFollowing)
  const [trackerModal, showTrackerModal] = useState(false)
  const [postData, setPostData] = useState({})
  const [isContentLoading, setIsContentLoading] = useState(false)

  const AvatarPhoto = ({ size, url }) => {
    return url ? (
      <CacheableImage
        style={GlobalStyle.image}
        source={{
          uri: url,
        }}
      />
    ) : (
      <ProfileImageDefault width={normalize(size)} height={normalize(size)} />
    )
  }

  const timeAgo = time => {
    if (time <= 60) {
      return 'Just now'
    }
    return timePassedShort(time)
  }

  const openProfileHandler = () => {
    if (!read) openNotificationHandler(id)
    if (user && user.uid === follower_uid) {
      navigation.navigate('Profile', {
        screen: 'Profile',
      })
    } else {
      navigation.navigate('NBTScreen', {
        screen: 'OthersProfile',
        params: { uid: follower_uid || buyerId },
      })
    }
  }

  const followBackHandler = async () => {
    if (!read) openNotificationHandler(id)
    const followBackResponse = await Api.followUser({ uid: follower_uid })
    try {
      if (followBackResponse.success) {
        setFollowing(followBackResponse.data.is_following)
      }
    } catch (error) {
      console.log(error.message || error)
    }
  }

  const viewNotVerifiedHandler = () => {
    if (!read) openNotificationHandler(id)
    navigation.navigate('NBTScreen', {
      screen: 'NotVerified',
      params: {
        screen: 'NotVerifiedScreen',
        params: { date },
      },
    })
  }

  const getPostDetails = async () => {
    try {
      setIsContentLoading(true)
      const getPostResponse = await Api.getPost({ pid: postId })
      if (getPostResponse.success) setPostData(getPostResponse.data)
      setIsContentLoading(false)
    } catch (error) {
      setIsContentLoading(false)
      console.log(error.message || error)
    }
  }

  const orderTrackerHandler = () => {
    if (!read) openNotificationHandler(id)
    showTrackerModal(true)
  }

  useEffect(() => {
    if (postId) getPostDetails()
  }, [postId])

  return (
    <>
      <View>
        <View
          style={[
            styles.notification,
            { backgroundColor: !read ? '#F2F7FF' : '#FBFBFB' },
          ]}>
          <View style={styles.holder}>
            <View>
              {info.length === 1 && (
                <View style={styles.avatarHolder}>
                  <AvatarPhoto size={35} url={profilePhoto} />
                </View>
              )}
              {info.length > 1 && (
                <View style={{ width: normalize(60), flexDirection: 'row' }}>
                  <View style={styles.multiAvatarHolder}>
                    <AvatarPhoto size={35} url={profilePhoto} />
                  </View>
                  <View
                    style={[
                      styles.multiAvatarHolder,
                      { marginTop: normalize(10) },
                    ]}>
                    <AvatarPhoto size={35} url={info[1].profilePhoto} />
                  </View>
                </View>
              )}
              {
                <View style={styles.badgeHolder}>
                  {type === 'verification' && !approved ? (
                    <NotVerified width={normalize(18)} height={normalize(18)} />
                  ) : type === 'verification' && approved ? (
                    <Verified width={normalize(18)} height={normalize(18)} />
                  ) : null}
                </View>
              }
            </View>
            {type == 'verification' && !approved ? (
              <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
                <Text>
                  <AppText textStyle="caption">
                    Your account verification has been unsuccessful. You may opt
                    to try again.
                  </AppText>
                </Text>
              </View>
            ) : null}
            {type == 'follow' && (
              <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
                <Text>
                  <AppText textStyle="caption2">{name} </AppText>
                  <AppText textStyle="caption">followed you</AppText>
                </Text>
              </View>
            )}
            {type == 'order' &&
              status === 'pending' &&
              info.length === 1 &&
              (!isContentLoading ? (
                <View
                  style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
                  <Text>
                    <AppText textStyle="caption2">{`${name} `}</AppText>
                    <AppText textStyle="caption">
                      has made an{' '}
                      {postData.type === 'need'
                        ? 'offer'
                        : postData.type === 'sell'
                        ? 'order'
                        : 'booking'}{' '}
                      on your{' '}
                      <AppText textStyle="caption2">({postData.title})</AppText>{' '}
                      post
                    </AppText>
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size="small" color="#3781FC" />
                </View>
              ))}
            {type == 'order' &&
              status !== 'pending' &&
              info.length === 1 &&
              (!isContentLoading ? (
                <View
                  style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
                  <Text>
                    <AppText textStyle="caption">
                      Your{' '}
                      {postData.type === 'need'
                        ? 'offer'
                        : postData.type === 'sell'
                        ? 'order'
                        : 'booking'}{' '}
                      from{' '}
                      <AppText textStyle="caption2">{postData.title}</AppText>{' '}
                      {status === 'delivering'
                        ? `is for delivery`
                        : status === 'pickup'
                        ? `is ready for pick up`
                        : `has been ${status}`}
                    </AppText>
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size="small" color="#3781FC" />
                </View>
              ))}

            {type == 'payment' &&
              status === 'paid' &&
              info.length === 1 &&
              (!isContentLoading ? (
                <View
                  style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
                  <Text>
                    <AppText textStyle="caption">
                      <AppText textStyle="caption2">{name} </AppText>
                      successfully paid the{' '}
                      {postData.type === 'need'
                        ? 'offer'
                        : postData.type === 'sell'
                        ? 'order'
                        : 'booking'}{' '}
                      on your post{' '}
                      <AppText textStyle="caption2">{postData.title}</AppText>
                    </AppText>
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size="small" color="#3781FC" />
                </View>
              ))}

            {type == 'order' &&
              info.length > 1 &&
              (!isContentLoading ? (
                <View
                  style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
                  <Text>
                    {info.length === 2 && (
                      <AppText textStyle="caption2">
                        {`${name}, ${info[1].name}`}{' '}
                      </AppText>
                    )}
                    {info.length > 2 && (
                      <AppText textStyle="caption2">
                        {`${name}, ${info[1].name} and ${
                          info.length - 2
                        } others`}{' '}
                      </AppText>
                    )}
                    <AppText textStyle="caption">
                      has made an {postData.type === 'need' ? 'offer' : 'order'}{' '}
                      on your{' '}
                      <AppText textStyle="caption2">({postData.title})</AppText>{' '}
                      post
                    </AppText>
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size="small" color="#3781FC" />
                </View>
              ))}
          </View>
          <View style={[styles.holder, styles.cta]}>
            <View style={styles.holder}>
              <PostClock width={normalize(16)} height={normalize(16)} />
              <AppText
                textStyle="caption"
                customStyle={{
                  marginLeft: 3,
                  color: '#8C8B98',
                  width: normalize(33),
                }}>
                {timeAgo(Date.now() / 1000 - date.seconds)}
              </AppText>
            </View>

            {type === 'follow' && (
              <>
                <TouchableOpacity
                  style={{
                    paddingVertical: 6,
                    marginRight: 10,
                    width: 130,
                    alignItems: 'center',
                    backgroundColor: '#FFD400',
                    borderRadius: 5,
                  }}
                  activeOpacity={0.7}
                  onPress={() => openProfileHandler()}>
                  <AppText textStyle="button3">View Profile</AppText>
                </TouchableOpacity>
                {!following && (
                  <TouchableOpacity
                    style={{
                      paddingVertical: 6,
                      width: 130,
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      borderRadius: 5,
                      borderColor: '#1F1A54',
                      borderWidth: 1.5,
                    }}
                    onPress={() => followBackHandler()}>
                    <AppText textStyle="button3">Follow Back</AppText>
                  </TouchableOpacity>
                )}
              </>
            )}
            {type === 'verification' && (
              <>
                <TouchableOpacity
                  style={{
                    paddingVertical: 6,
                    marginRight: 10,
                    width: 130,
                    alignItems: 'center',
                    backgroundColor: '#FFD400',
                    borderRadius: 5,
                  }}
                  onPress={() => viewNotVerifiedHandler()}>
                  <AppText textStyle="button3">View</AppText>
                </TouchableOpacity>
              </>
            )}
            {['order', 'payment'].includes(type) && info.length === 1 && (
              <>
                <TouchableOpacity
                  style={{
                    paddingVertical: 6,
                    marginRight: 10,
                    width: 130,
                    alignItems: 'center',
                    backgroundColor: '#FFD400',
                    borderRadius: 5,
                  }}
                  activeOpacity={0.7}
                  onPress={() => orderTrackerHandler()}>
                  <AppText textStyle="button3">
                    {['cancelled', 'completed', 'declined'].includes(status)
                      ? 'View Order'
                      : 'Track Order'}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingVertical: 6,
                    width: 130,
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    borderRadius: 5,
                    borderColor: '#1F1A54',
                    borderWidth: 1.5,
                  }}
                  onPress={() => openProfileHandler()}>
                  <AppText textStyle="button3">View Profile</AppText>
                </TouchableOpacity>
              </>
            )}

            {type === 'order' && info.length > 1 && <></>}
          </View>
        </View>
      </View>
      <Modal
        isVisible={trackerModal}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        style={{
          margin: 0,
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          height: Dimensions.get('window').height,
        }}>
        <TrackerModal
          closeModal={() => showTrackerModal(false)}
          postType={postData.type}
          orderID={orderId}
          postData={postData}
        />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  notification: {
    padding: 14,
    marginTop: normalize(10),
    borderRadius: 4,
  },
  notificationOld: {
    padding: normalize(14),
    marginTop: normalize(10),
    borderRadius: 4,
  },
  holder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarHolder: {
    marginRight: normalize(15),
    width: normalize(35),
    height: normalize(35),
    borderRadius: normalize(35 / 2),
    overflow: 'hidden',
  },

  multiAvatarHolder: {
    marginRight: normalize(-20),
    width: normalize(35),
    height: normalize(35),
    borderRadius: normalize(35 / 2),
    overflow: 'hidden',
  },

  badgeHolder: {
    position: 'absolute',
    bottom: -4,
    right: normalize(10),
  },
  cta: {
    paddingTop: 20,
  },
  btnHolder: {
    flexDirection: 'row',
  },
  userInfoImageContainer: {
    height: normalize(35),
    width: normalize(35),
    borderRadius: normalize(35 / 2),
    overflow: 'hidden',
  },
})

export default NotificationsCard
