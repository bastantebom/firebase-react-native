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
import { useNavigation } from '@react-navigation/native'

import { AppText } from '@/components'
import {
  EllipsisMenu,
  OwnMenu,
  QRScreen,
  PostEllipsis,
  OtherPostEllipsis,
} from './components'
import { HeaderShare, Icons } from '@/assets/images/icons'
import { normalize, GlobalStyle } from '@/globals'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import { generateDynamicLink, getPreviewLinkData } from '@/globals/Utils'
import Share from 'react-native-share'
import Api from '@/services/Api'

const TransparentHeader = ({
  toggleEllipsisState,
  ellipsisState,
  type,
  toggleMenu,
  menu,
  toggleQR,
  QR,
  signOut,
  backFunction,
  editPostFunction,
  deletePostFunction,
  userInfo,
  triggerNotify,
  userID,
  hidePost,
  postTitle,
  postId,
  following,
  handleLikedPost,
  toggleFollowing,
  liked,
}) => {
  const navigation = useNavigation()
  const { user, userInfo: ownUserInfo } = useContext(UserContext)
  const { unsubcribeNotification } = useContext(Context)

  const handleShare = async () => {
    try {
      const url = await (async () => {
        switch (type) {
          case 'own':
          case 'other':
            return await generateDynamicLink({
              type: 'profile',
              params: { uid: type === 'own' ? ownUserInfo.uid : userInfo.uid },
              social: await getPreviewLinkData({
                type: 'user',
                data: type === 'own' ? ownUserInfo : userInfo,
              }),
            })

          case 'post-other':
          case 'post-own':
            return await generateDynamicLink({
              type: 'post',
              params: { id: postId },
              social: await getPreviewLinkData({
                type: 'post',
                data: (await Api.getPost({ pid: postId })).data,
              }),
            })
        }
      })()

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
                <View style={styles.headerBtn}>
                  <Icons.HeaderBack
                    width={normalize(16)}
                    height={normalize(16)}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity activeOpacity={0.7} onPress={handleShare}>
                <View style={[styles.headerBtn, GlobalStyle.marginLeft1]}>
                  <HeaderShare width={normalize(18)} height={normalize(17)} />
                </View>
              </TouchableOpacity>
              {user ? (
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleLikedPost}>
                    <View style={[styles.headerBtn, GlobalStyle.marginLeft1]}>
                      {liked ? (
                        <Icons.LikeColored
                          width={normalize(18)}
                          height={normalize(18)}
                        />
                      ) : (
                        <Icons.LikeHeader
                          width={normalize(18)}
                          height={normalize(18)}
                          style={{ color: 'white' }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={toggleEllipsisState}>
                    <View style={[styles.headerBtn, GlobalStyle.marginLeft1]}>
                      <Icons.HeaderEllipsis
                        width={normalize(18)}
                        height={normalize(18)}
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
            <TouchableWithoutFeedback onPress={() => toggleEllipsisState()}>
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

  if (type === 'post-own')
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
                <View style={styles.headerBtn}>
                  <Icons.HeaderBack
                    width={normalize(16)}
                    height={normalize(16)}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity activeOpacity={0.7} onPress={handleShare}>
                <View style={[styles.headerBtn, GlobalStyle.marginLeft1]}>
                  <HeaderShare width={normalize(18)} height={normalize(17)} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleEllipsisState}>
                <View style={[styles.headerBtn, GlobalStyle.marginLeft1]}>
                  <Icons.HeaderEllipsis
                    width={normalize(18)}
                    height={normalize(18)}
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
            <TouchableWithoutFeedback onPress={() => toggleEllipsisState()}>
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

  if (type === 'own')
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
            <View></View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity activeOpacity={0.7} onPress={handleShare}>
                <View style={styles.headerBtn}>
                  <HeaderShare width={normalize(18)} height={normalize(17)} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate('own-menu')
                }}>
                <View style={[styles.headerBtn, GlobalStyle.marginLeft1]}>
                  <Icons.HeaderMenu
                    width={normalize(18)}
                    height={normalize(18)}
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

  if (type === 'other')
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
                <View style={styles.headerBtn}>
                  <Icons.HeaderBack
                    width={normalize(16)}
                    height={normalize(16)}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {user ? (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity activeOpacity={0.7} onPress={toggleFollowing}>
                  <View
                    style={[
                      styles.button,
                      styles.followButton,
                      GlobalStyle.marginLeft1,
                    ]}>
                    {following ? (
                      <Icons.HeaderFollowing
                        width={normalize(16)}
                        height={normalize(16)}
                      />
                    ) : (
                      <Icons.HeaderFollow
                        width={normalize(16)}
                        height={normalize(16)}
                      />
                    )}
                    <AppText
                      textStyle="button3"
                      color="white"
                      customStyle={{ marginLeft: 4 }}>
                      {following ? 'Following' : 'Follow'}
                    </AppText>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleShare}
                  style={[styles.headerBtn, GlobalStyle.marginLeft1]}>
                  <HeaderShare width={normalize(18)} height={normalize(17)} />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={toggleEllipsisState}>
                  <View style={[styles.headerBtn, GlobalStyle.marginLeft1]}>
                    <Icons.HeaderEllipsis
                      width={normalize(18)}
                      height={normalize(18)}
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
            <TouchableWithoutFeedback onPress={() => toggleEllipsisState()}>
              <View style={{ flex: 1, backgroundColor: 'black' }} />
            </TouchableWithoutFeedback>
          }>
          <EllipsisMenu
            toggleEllipsisState={toggleEllipsisState}
            userInfo={userInfo}
            userID={userID}
            isFollowing={following}
            toggleFollowing={toggleFollowing}
          />
        </Modal>
      </>
    )
}

const styles = StyleSheet.create({
  followButton: {
    borderRadius: 20,
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    height: normalize(32),
    marginLeft: normalize(8),
  },
  headerBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    height: normalize(32),
    width: normalize(32),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default TransparentHeader
