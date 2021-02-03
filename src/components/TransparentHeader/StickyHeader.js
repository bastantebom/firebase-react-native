import React, { useContext } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import Modal from 'react-native-modal'
import Share from 'react-native-share'
import { useNavigation } from '@react-navigation/native'

import { AppText, HexagonBorder } from '@/components'
import {
  EllipsisMenu,
  QRScreen,
  PostEllipsis,
  OtherPostEllipsis,
} from './components'
import {
  HeaderBack,
  HeaderFollowing,
  HeaderFollow,
  HeaderEllipsis,
  JarHeartWhite,
  HeaderShareGray,
  HeaderMenuGray,
  HeaderFollowingBlack,
  HeaderFollowBlack,
  HeaderEllipsisGray,
} from '@/assets/images/icons'
import { normalize, GlobalStyle } from '@/globals'
import Colors from '@/globals/Colors'
import { UserContext } from '@/context/UserContext'
import { generateDynamicLink, getPreviewLinkData } from '@/globals/Utils'

const StickyHeader = ({
  toggleEllipsisState,
  ellipsisState,
  toggleFollowing,
  type,
  toggleQR,
  QR,
  backFunction,
  editPostFunction,
  deletePostFunction,
  userInfo,
  userID,
  hidePost,
  postTitle,
  postId,
  isFollowing,
}) => {
  const navigation = useNavigation()
  const { user } = useContext(UserContext)
  const { display_name, full_name, profile_photo } = userInfo
  const name = display_name || full_name

  const handleShare = async () => {
    try {
      const url = await generateDynamicLink({
        type: 'profile',
        params: { uid: userInfo.uid },
        social: await getPreviewLinkData({ type: 'user', data: userInfo }),
      })
      await Share.open({ url })
    } catch (error) {
      console.log(error)
    }
  }

  if (type === 'post-other') {
    return (
      <>
        <SafeAreaView
          style={{
            flex: 1,
            position: 'absolute',
            zIndex: 1,
            backgroundColor: 'transparent',
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingHorizontal: 16,
              width: Dimensions.get('window').width,
              paddingTop: 4,
            }}>
            <View>
              <TouchableOpacity activeOpacity={0.7} onPress={backFunction}>
                <View style={styles.circle}>
                  <HeaderBack width={normalize(16)} height={normalize(16)} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {user ? (
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={toggleFollowing}>
                    <View
                      style={[styles.followButton, GlobalStyle.marginLeft1]}>
                      {isFollowing ? (
                        <HeaderFollowing
                          width={normalize(16)}
                          height={normalize(16)}
                        />
                      ) : (
                        <HeaderFollow
                          width={normalize(16)}
                          height={normalize(16)}
                        />
                      )}
                      <AppText
                        textStyle="button3"
                        color="white"
                        customStyle={{ marginLeft: 4 }}>
                        {isFollowing ? 'Following' : 'Follow'}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7}>
                    <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                      <JarHeartWhite
                        width={normalize(16)}
                        height={normalize(16)}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={toggleEllipsisState}>
                    <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                      <HeaderEllipsis
                        width={normalize(16)}
                        height={normalize(16)}
                      />
                    </View>
                  </TouchableOpacity>
                </>
              ) : null}
            </View>
          </View>
        </SafeAreaView>
        <Modal
          isVisible={ellipsisState}
          animationIn="slideInUp"
          animationInTiming={250}
          animationOut="slideOutDown"
          animationOutTiming={200}
          onSwipeComplete={toggleEllipsisState}
          swipeDirection="down"
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          customBackdrop={
            <TouchableWithoutFeedback
              onPress={() => {
                toggleEllipsisState()
              }}>
              <View style={{ flex: 1, backgroundColor: 'black' }} />
            </TouchableWithoutFeedback>
          }>
          <OtherPostEllipsis
            toggleEllipsisState={toggleEllipsisState}
            postId={postId}
            postTitle={postTitle}
            hidePost={hidePost}
          />
        </Modal>
      </>
    )
  }

  if (type === 'post-own') {
    return (
      <>
        <SafeAreaView
          style={{
            flex: 1,
            position: 'absolute',
            zIndex: 1,
            backgroundColor: 'transparent',
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingHorizontal: 16,
              width: Dimensions.get('window').width,
              paddingTop: 4,
            }}>
            <View>
              <TouchableOpacity activeOpacity={0.7} onPress={backFunction}>
                <View style={styles.circle}>
                  <HeaderBack width={normalize(16)} height={normalize(16)} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleEllipsisState}>
                <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                  <HeaderEllipsis
                    width={normalize(16)}
                    height={normalize(16)}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <Modal
          isVisible={ellipsisState}
          animationIn="slideInUp"
          animationInTiming={250}
          animationOut="slideOutDown"
          animationOutTiming={200}
          onSwipeComplete={toggleEllipsisState}
          swipeDirection="down"
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          customBackdrop={
            <TouchableWithoutFeedback
              onPress={() => {
                toggleEllipsisState()
              }}>
              <View style={{ flex: 1, backgroundColor: 'black' }} />
            </TouchableWithoutFeedback>
          }>
          <PostEllipsis
            toggleEllipsisState={toggleEllipsisState}
            editPostFunction={editPostFunction}
            deletePostFunction={deletePostFunction}
          />
        </Modal>
      </>
    )
  }

  if (type === 'own') {
    return (
      <>
        <SafeAreaView>
          <View style={styles.profileStickyHeader}>
            <View
              style={{
                flexDirection: 'row',
                width: '60%',
              }}>
              <View style={styles.profileImageWrapper}>
                <HexagonBorder
                  size={40}
                  path={profile_photo}
                  dimensions="64x64"
                />
              </View>
              <AppText
                textStyle="subtitle2"
                color={Colors.primaryMidnightBlue}
                numberOfLines={1}
                customStyle={{ paddingLeft: normalize(45) }}>
                {name}
              </AppText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '40%',
                paddingLeft: 25,
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity activeOpacity={0.7} onPress={handleShare}>
                <View style={GlobalStyle.marginLeft1}>
                  <HeaderShareGray
                    width={normalize(15)}
                    height={normalize(15)}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate('own-menu')
                }}>
                <View style={GlobalStyle.marginLeft2}>
                  <HeaderMenuGray
                    width={normalize(15)}
                    height={normalize(15)}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <Modal
          isVisible={QR}
          animationIn="slideInUp"
          animationInTiming={450}
          animationOut="slideOutLeft"
          animationOutTiming={450}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          <QRScreen toggleQR={toggleQR} />
        </Modal>
      </>
    )
  }

  if (type === 'other') {
    return (
      <>
        <SafeAreaView>
          <View style={styles.profileStickyHeader}>
            <View
              style={{
                flexDirection: 'row',
                width: '60%',
              }}>
              <View style={styles.profileImageWrapper}>
                <HexagonBorder
                  size={40}
                  path={profile_photo}
                  dimensions="64x64"
                />
              </View>
              <AppText
                textStyle="subtitle2"
                color={Colors.primaryMidnightBlue}
                numberOfLines={1}
                customStyle={{ paddingLeft: normalize(40) }}>
                {name}
              </AppText>
            </View>
            {user ? (
              <View
                style={{
                  flexDirection: 'row',
                  width: '40%',
                  paddingLeft: 25,
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity activeOpacity={0.7} onPress={toggleFollowing}>
                  <View style={GlobalStyle.marginLeft1}>
                    {isFollowing ? (
                      <HeaderFollowingBlack
                        width={normalize(16)}
                        height={normalize(16)}
                      />
                    ) : (
                      <HeaderFollowBlack
                        width={normalize(16)}
                        height={normalize(16)}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={handleShare}>
                  <View style={GlobalStyle.marginLeft1}>
                    <HeaderShareGray
                      width={normalize(15)}
                      height={normalize(15)}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={toggleEllipsisState}>
                  <View style={GlobalStyle.marginLeft1}>
                    <HeaderEllipsisGray
                      width={normalize(15)}
                      height={normalize(15)}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </SafeAreaView>

        <Modal
          isVisible={ellipsisState}
          animationIn="slideInUp"
          animationInTiming={250}
          animationOut="slideOutDown"
          animationOutTiming={200}
          onSwipeComplete={toggleEllipsisState}
          swipeDirection="down"
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          customBackdrop={
            <TouchableWithoutFeedback
              onPress={() => {
                toggleEllipsisState()
              }}>
              <View style={{ flex: 1, backgroundColor: 'black' }} />
            </TouchableWithoutFeedback>
          }>
          <EllipsisMenu
            toggleEllipsisState={toggleEllipsisState}
            userInfo={userInfo}
            userID={userID}
            toggleFollowing={toggleFollowing}
            isFollowing={isFollowing}
          />
        </Modal>
      </>
    )
  }
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(32 / 2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageWrapper: {
    width: normalize(40),
    height: normalize(40),
    top: normalize(37),
    position: 'absolute',
  },
  followButton: {
    borderRadius: 20,
    flexDirection: 'row',
    height: normalize(32),
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  profileStickyHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: normalize(17.5),
    backgroundColor: Colors.neutralsWhite,
    alignItems: 'center',
  },
})

export default StickyHeader
