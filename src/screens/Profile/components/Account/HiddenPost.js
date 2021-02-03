import React, { useState, useContext } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'

import { ScreenHeaderTitle, AppText, CacheableImage } from '@/components'
import { DefaultSell } from '@/assets/images'
import { normalize, Colors, GlobalStyle } from '@/globals'
import Modal from 'react-native-modal'
import { UserContext } from '@/context/UserContext'
import PostService from '@/services/Post/PostService'

const HiddenPost = ({ toggleHiddenPost }) => {
  const { userInfo, user, setUserInfo } = useContext(UserContext)
  const { hidden_posts } = userInfo
  const [hiddenPosts, setHiddenPosts] = useState(hidden_posts)
  const [selectedPost, setSelectedPost] = useState({})
  const [showCancelModal, setShowCancelModal] = useState(false)
  const cancelModalToggle = post => {
    setSelectedPost(post)
    setShowCancelModal(!showCancelModal)
  }

  const closeHandler = value => {
    setShowCancelModal(!showCancelModal)
  }

  const unHidePost = async () => {
    return await PostService.unHidePost({
      pid: selectedPost.pid,
      uid: user?.uid,
    }).then(res => {
      if (res.success) {
        setHiddenPosts(res.hidden_posts)
        setUserInfo({ ...userInfo, hidden_posts: res.hidden_posts })
      }
      closeHandler()
    })
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ padding: normalize(16) }}>
          <ScreenHeaderTitle title="Hidden Posts" close={toggleHiddenPost} />
        </View>
        <View
          style={{
            marginTop: normalize(10),
            borderTopColor: Colors.neutralGray,
            borderTopWidth: 1,
          }}>
          {hiddenPosts && hiddenPosts.length > 0 ? (
            hiddenPosts.map((post, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: Colors.neutralsZircon,
                    borderBottomWidth: 1,
                    paddingHorizontal: normalize(16),
                    paddingVertical: normalize(16),
                  }}>
                  <View style={styles.userInfoImageContainer}>
                    {post.image ? (
                      <CacheableImage
                        style={GlobalStyle.image}
                        source={{ uri: post.image }}
                      />
                    ) : (
                      <DefaultSell
                        width={normalize(42)}
                        height={normalize(42)}
                      />
                    )}
                  </View>
                  <View style={{ marginLeft: 8, justifyContent: 'center' }}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <AppText
                        textStyle="body2"
                        customStyle={{ marginRight: 4 }}>
                        {post.title.length > 20
                          ? `${post.title.substring(0, 20)}...`
                          : post.title}{' '}
                      </AppText>
                    </View>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TouchableOpacity
                      onPress={() => {
                        cancelModalToggle(post)
                      }}
                      style={{
                        paddingHorizontal: normalize(8),
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: Colors.contentEbony,
                        borderWidth: 1,
                        borderRadius: 6,
                        height: normalize(30),
                        width: normalize(90),
                        marginVertical: normalize(8),
                        marginHorizontal: normalize(4),
                      }}>
                      <AppText textStyle="caption" color={Colors.contentEbony}>
                        Unhide
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })
          ) : (
            <View style={{ padding: 16 }}>
              <AppText textStyle="caption">
                You don't have any hidden post.
              </AppText>
            </View>
          )}
        </View>
      </SafeAreaView>
      <Modal
        isVisible={showCancelModal}
        animationIn="bounceIn"
        animationInTiming={450}
        animationOut="bounceOut"
        animationOutTiming={450}
        style={{
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={cancelModalToggle}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <View
          style={{
            backgroundColor: 'white',
            height: normalize(300),
            width: normalize(300),
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}>
          <AppText textStyle="display6" customStyle={{ marginBottom: 16 }}>
            Unhide {selectedPost.title} ?
          </AppText>

          <AppText
            textStyle="caption"
            customStyle={{ textAlign: 'center' }}
            customStyle={{ marginBottom: 16 }}>
            Are you sure you want to unhide {selectedPost.title}?
          </AppText>

          <TouchableOpacity
            onPress={() => {
              unHidePost()
            }}
            style={{
              backgroundColor: Colors.yellow2,
              paddingVertical: 14,
              width: '100%',
              alignItems: 'center',
              marginBottom: 16,
              borderRadius: 4,
            }}>
            <AppText textStyle="button2">Continue</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => closeHandler('cancel')}
            style={{
              paddingVertical: 14,
              width: '100%',
              alignItems: 'center',
            }}>
            <AppText textStyle="button2" color={Colors.contentOcean}>
              Cancel
            </AppText>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  userInfoImageContainer: {
    height: normalize(42),
    width: normalize(42),
    overflow: 'hidden',
    borderRadius: 8,
  },
  userInfoDetailsContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  userInfoDetailsNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoDetailsName: {
    fontFamily: 'RoundedMplus1c-Medium',
    paddingRight: 4,
  },
  userInfoDetailsUsernameContainer: {
    flexDirection: 'row',
  },
})

export default HiddenPost
