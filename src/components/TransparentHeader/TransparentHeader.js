import React, { createRef, useState, useContext } from 'react'
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

import { AppText, BottomSheetHeader } from '@/components'
import {
  EllipsisMenu,
  OwnMenu,
  QRScreen,
  PostEllipsis,
  OtherPostEllipsis,
} from './components'
import {
  HeaderBack,
  HeaderShare,
  HeaderQR,
  HeaderMenu,
  HeaderFollowing,
  HeaderFollow,
  HeaderEllipsis,
  ProfileMute,
  ProfileReport,
  ProfileBlockRed,
  JarHeartWhite,
} from '@/assets/images/icons'
import { normalize, GlobalStyle } from '@/globals'
import { UserContext } from '@/context/UserContext'

const TransparentHeader = ({
  toggleEllipsisState,
  ellipsisState,
  toggleFollowing,
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
  isFollowing,
}) => {
  // console.log('Transparent Header');
  // console.log(isFollowing);
  // console.log('Transparent Header');

  const navigation = useNavigation()
  const shareHandler = async () => {
    const shareOptions = {
      title: 'Share profile',
      url:
        'https://github.com/react-native-community/react-native-share/blob/master/example/App.js',
      failOnCancel: false,
    }

    try {
      const ShareResponse = await Share.open(shareOptions)
        .then(result => {
          console.log(result)
        })
        .catch(error => {
          console.log(error)
        })
      // setResult(JSON.stringify(ShareResponse, null, 2));
    } catch (error) {
      console.log('Error =>', error)
      // setResult('error: '.concat(getErrorString(error)));
    }
  }
  const { user } = useContext(UserContext)

  if (type === 'post-other') {
    //console.log(postTitle);
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
            {/* Left aligned icons */}
            <View>
              <TouchableOpacity activeOpacity={0.7} onPress={backFunction}>
                <View style={styles.circle}>
                  <HeaderBack width={normalize(16)} height={normalize(16)} />
                </View>
              </TouchableOpacity>
            </View>
            {/* Right aligned icons */}
            {user ? (
              <>
                <View style={{ flexDirection: 'row' }}>
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
            <TouchableWithoutFeedback
              onPress={() => {
                toggleEllipsisState()
              }}>
              <View style={{ flex: 1, backgroundColor: 'black' }} />
            </TouchableWithoutFeedback>
          }>
          {/* <FilterSlider modalToggler={toggleModal} /> */}
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
            {/* Left aligned icons */}
            <View>
              <TouchableOpacity activeOpacity={0.7} onPress={backFunction}>
                <View style={styles.circle}>
                  <HeaderBack width={normalize(16)} height={normalize(16)} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Right aligned icons */}
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
            <TouchableWithoutFeedback
              onPress={() => {
                toggleEllipsisState()
              }}>
              <View style={{ flex: 1, backgroundColor: 'black' }} />
            </TouchableWithoutFeedback>
          }>
          {/* <FilterSlider modalToggler={toggleModal} /> */}
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
            {/* Left aligned icons */}
            <View></View>

            {/* Right aligned icons */}
            <View style={{ flexDirection: 'row' }}>
              {/* <TouchableOpacity activeOpacity={0.7} onPress={shareHandler}>
                <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                  <HeaderShare width={normalize(16)} height={normalize(16)} />
                </View>
              </TouchableOpacity> */}

              <TouchableOpacity activeOpacity={0.7} onPress={toggleQR}>
                <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                  <HeaderQR width={normalize(16)} height={normalize(16)} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={toggleMenu}>
                <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                  <HeaderMenu width={normalize(16)} height={normalize(16)} />
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
          {/* <FilterSlider modalToggler={toggleModal} /> */}
          <OwnMenu
            signOut={() => {
              signOut().then(() => {
                //console.log('helluu');
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
          {/* <FilterSlider modalToggler={toggleModal} /> */}
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
            {/* Left aligned icons */}
            <View>
              <TouchableOpacity activeOpacity={0.7} onPress={backFunction}>
                <View style={styles.circle}>
                  <HeaderBack width={normalize(16)} height={normalize(16)} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Right aligned icons */}
            {user ? (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity activeOpacity={0.7} onPress={toggleFollowing}>
                  <View style={[styles.followButton, GlobalStyle.marginLeft1]}>
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

                {/* <TouchableOpacity activeOpacity={0.7} onPress={shareHandler}>
                  <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                    <HeaderShare width={normalize(16)} height={normalize(16)} />
                  </View>
                </TouchableOpacity> */}

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
            <TouchableWithoutFeedback
              onPress={() => {
                toggleEllipsisState()
              }}>
              <View style={{ flex: 1, backgroundColor: 'black' }} />
            </TouchableWithoutFeedback>
          }>
          {/* <FilterSlider modalToggler={toggleModal} /> */}
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
