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
import { Icons } from '@/assets/images/icons'
import { normalize, GlobalStyle } from '@/globals'
import { UserContext } from '@/context/UserContext'

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
  const { user } = useContext(UserContext)

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
                  <Icons.HeaderBack
                    width={normalize(16)}
                    height={normalize(16)}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {user ? (
              <>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={toggleFollowing}>
                    <View
                      style={[styles.followButton, GlobalStyle.marginLeft1]}>
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
                    onPress={handleLikedPost}>
                    <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                      {liked ? (
                        <Icons.LikeColored
                          width={normalize(16)}
                          height={normalize(16)}
                        />
                      ) : (
                        <Icons.JarHeartWhite
                          width={normalize(16)}
                          height={normalize(16)}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={toggleEllipsisState}>
                    <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                      <Icons.HeaderEllipsis
                        width={normalize(16)}
                        height={normalize(16)}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </View>
        </SafeAreaView>
        <Modal
          isVisible={ellipsisState}
          animationIn="slideInUp"
          animationInTiming={200}
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
                <View style={styles.circle}>
                  <Icons.HeaderBack
                    width={normalize(16)}
                    height={normalize(16)}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleEllipsisState}>
                <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                  <Icons.HeaderEllipsis
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
          animationInTiming={200}
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
              <TouchableOpacity activeOpacity={0.7} onPress={toggleMenu}>
                <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                  <Icons.HeaderMenu
                    width={normalize(16)}
                    height={normalize(16)}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <Modal
          isVisible={menu}
          animationIn="slideInUp"
          animationInTiming={450}
          animationOut="slideOutLeft"
          animationOutTiming={450}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          <OwnMenu
            signOut={() => {
              signOut().then(() => {
                navigation.navigate('Onboarding')
              })
            }}
            toggleMenu={toggleMenu}
            triggerNotify={triggerNotify}
          />
        </Modal>

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
                <View style={styles.circle}>
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
                  <View style={[styles.followButton, GlobalStyle.marginLeft1]}>
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
                  onPress={toggleEllipsisState}>
                  <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                    <Icons.HeaderEllipsis
                      width={normalize(16)}
                      height={normalize(16)}
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
          animationInTiming={500}
          animationOut="slideOutDown"
          animationOutTiming={500}
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
  circle: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(32 / 2),
    justifyContent: 'center',
    alignItems: 'center',
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
})

export default TransparentHeader
