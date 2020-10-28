import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  Linking,
  ScrollView,
  Dimensions,
} from 'react-native'
import { Divider } from 'react-native-paper'
import Modal from 'react-native-modal'
import Swiper from 'react-native-swiper'

import {
  AppText,
  TransparentHeader,
  ProfileInfo,
  CacheableImage,
} from '@/components'
import { normalize, GlobalStyle, Colors, timePassed } from '@/globals'
import {
  PostClock,
  PostNavigation,
  PostInfo,
  PostCash,
  PostBox,
  ContactEmail,
  ContactTelephone,
} from '@/assets/images/icons'
import { PostService } from '@/services'
import { UserContext } from '@/context/UserContext'
import { ImageModal } from '@/screens/Post/components/ImageModal'
import { useNavigation } from '@react-navigation/native'
import EditPostScreen from '@/screens/Post/components/EditPostScreen'

const SinglePostOthersView = ({ data, closePostModal }) => {
  // console.log("SINGLEW POST VIEW POST PROPS")
  // console.log(props)

  // const {navigation} = props;

  // const {data} = props.route.params;

  // console.log('****************************data****************************')
  // console.log(data)

  const navigation = useNavigation()
  const [showNotification, setShowNotification] = useState(false)
  const [ellipsisState, setEllipsisState] = useState(false)
  const [otherPostModal, setOtherPostModal] = useState(false)
  const [postImageModal, setPostImageModal] = useState(false)

  const [editPost, showEditPost] = useState(false)

  const { user, setUserInfo, userInfo } = useContext(UserContext)

  const {
    user: { display_name, profile_photo },
    date_posted,
    available,
    payment_method,
    store_details: {
      schedule,
      location: { city, province, country },
    },
    title,
    username,
    delivery_method: { pickup, delivery },
    description,
    uid,
    price,
    post_id,
    cover_photos,
    account_verified,
    email,
    phone_number,
    post_type,
    full_name,
  } = data

  const defaultImage = [
    {
      key: 0,
      image: require('@/assets/images/logo.png'),
    },
  ]

  const userPostInfo = {
    username: username,
    profile_photo: profile_photo,
    account_verified: account_verified,
    display_name: display_name ? display_name : full_name,
    uid: uid,
  }

  let timeAgo = time => {
    return timePassed(time) + ' ago'
  }

  let makeCall = () => {
    let phoneNumber = ''
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phone_number}`
    } else {
      phoneNumber = `telprompt:${phone_number}`
    }
    Linking.openURL(phoneNumber)
  }

  const togglePostImageModal = () => {
    setPostImageModal(!postImageModal)
  }

  const toggleEditPost = () => {
    toggleEllipsisState()
    setTimeout(() => {
      showEditPost(!editPost)
    }, 500)
  }

  const toggleEllipsisState = () => {
    setEllipsisState(!ellipsisState)
  }

  const closeNotification = () => {
    setShowNotification(false)
  }

  const deletePost = async () => {
    console.log('delete this post with id: ')
    console.log(post_id)
    return await PostService.deletePost(post_id).then(() => {
      toggleEllipsisState()
      console.log('deletePost ' + userInfo.post_count)
      setUserInfo({ ...userInfo, post_count: userInfo.post_count - 1 })
      // navigation.goBack();
      closePostModal()
    })
  }

  const hidePost = async () => {
    //body: { uid, pid }
    return await PostService.hidePost({ uid: user?.uid, pid: post_id }).then(
      res => {
        toggleEllipsisState()
        //console.log('deletePost ' + userInfo.post_count);
        setUserInfo({ ...userInfo, hidden_posts: res.hidden_posts })
        console.log(userInfo.hidden_posts)
        // navigation.goBack();
        closePostModal()
      }
    )
    //navigation.goBack();
    //alert('hide Post View Post');
  }

  const SinglePostContent = ({ children }) => {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.postImageContainer}>
          {/* <Image
            style={GlobalStyle.image}
            source={{
              uri:
                'https://i.insider.com/5bbd187101145529745a9895?width=750&format=jpeg&auto=webp',
            }}
          /> */}
          {cover_photos === undefined || cover_photos.length == 0 ? (
            post_type === 'Need' || post_type === 'need' ? (
              <Image
                style={GlobalStyle.image}
                source={require('@/assets/images/cover-need.png')}
              />
            ) : post_type === 'Sell' || post_type === 'sell' ? (
              <Image
                style={GlobalStyle.image}
                source={require('@/assets/images/cover-sell.png')}
              />
            ) : (
              <Image
                style={GlobalStyle.image}
                source={require('@/assets/images/cover-service.png')}
              />
            )
          ) : (
            <Swiper
              activeDotColor={Colors.primaryYellow}
              dotColor={Colors.neutralsIron}
              dotStyle={{ marginRight: 9 }}
              activeDotStyle={{ marginRight: 9 }}>
              {cover_photos.map((item, index) => {
                // console.log(item);
                return (
                  <TouchableWithoutFeedback
                    key={index}
                    onPress={togglePostImageModal}>
                    <CacheableImage
                      style={GlobalStyle.image}
                      source={{
                        uri: item,
                      }}
                    />
                  </TouchableWithoutFeedback>
                )
              })}
            </Swiper>
          )}
        </View>
        <ScrollView style={styles.postInfoContainer}>
          <ProfileInfo
            userInfo={userPostInfo}
            type="own-post"
            cancelModalToggle={closePostModal}
            isModal
          />

          <AppText
            textStyle="subtitle1"
            customStyle={{ marginTop: 24, marginBottom: 16 }}>
            {title}
          </AppText>

          <AppText textStyle="subtitle1" customStyle={{ marginBottom: 12 }}>
            ₱ {price}
          </AppText>

          <View style={styles.iconText}>
            <PostClock width={normalize(24)} height={normalize(24)} />
            <AppText textStyle="body2" customStyle={{ marginLeft: 8 }}>
              {timeAgo(Date.now() / 1000 - date_posted._seconds)}
            </AppText>
          </View>
          <View style={styles.iconText}>
            <PostNavigation width={normalize(24)} height={normalize(24)} />
            <AppText
              textStyle="body2"
              customStyle={{ marginLeft: 8, marginRight: 20 }}>
              {city}, {province}
            </AppText>
          </View>
          <View style={styles.iconText}>
            <PostInfo width={normalize(24)} height={normalize(24)} />
            <AppText
              textStyle="body2"
              customStyle={{ marginLeft: 8, marginRight: 20 }}>
              {description}
            </AppText>
          </View>
          <Divider style={[GlobalStyle.dividerStyle, { marginBottom: 16 }]} />
          <View style={styles.iconText}>
            <PostCash width={normalize(24)} height={normalize(24)} />
            <AppText textStyle="body2" customStyle={{ marginLeft: 8 }}>
              {payment_method}
            </AppText>
          </View>
          {!pickup && !delivery ? (
            <></>
          ) : (
            <View style={styles.iconText}>
              <PostBox width={normalize(24)} height={normalize(24)} />
              <AppText textStyle="body2" customStyle={{ marginLeft: 8 }}>
                {pickup && delivery
                  ? 'Pickup & Delivery'
                  : delivery
                  ? 'Delivery'
                  : pickup
                  ? 'Pickup'
                  : ''}
              </AppText>
            </View>
          )}
        </ScrollView>
        {children}
      </View>
    )
  }

  return (
    <>
      <ScrollView>
        <View
          style={{
            flex: 1,
            position: 'relative',
            backgroundColor: Colors.primaryYellow,
          }}>
          {/* <TransparentHeader
            type={'post-other'}
            backFunction={closePostModal}
            postId={post_id}
            postTitle={title}
          /> */}
          <TransparentHeader
            type={uid === user?.uid ? 'post-own' : 'post-other'}
            ellipsisState={ellipsisState}
            toggleEllipsisState={toggleEllipsisState}
            backFunction={closePostModal}
            editPostFunction={toggleEditPost}
            deletePostFunction={deletePost}
            hidePost={hidePost}
            postId={post_id}
            postTitle={title}
          />
          <SinglePostContent></SinglePostContent>

          <Modal
            isVisible={editPost}
            animationIn="slideInUp"
            animationInTiming={450}
            animationOut="slideOutDown"
            animationOutTiming={450}
            style={{
              margin: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            customBackdrop={
              <TouchableWithoutFeedback onPress={() => showEditPost(false)}>
                <View style={{ flex: 1, backgroundColor: 'black' }} />
              </TouchableWithoutFeedback>
            }>
            <EditPostScreen
              data={data}
              card={cardMap(post_type)}
              togglePostModal={() => showEditPost(false)}
            />
          </Modal>
          <Modal
            isVisible={postImageModal}
            animationIn="zoomIn"
            animationOut="zoomOut"
            style={{
              margin: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ImageModal close={togglePostImageModal} data={cover_photos} />
          </Modal>
        </View>
      </ScrollView>
      <SafeAreaView
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-end',
          position: 'absolute',
          bottom: 0,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}>
          {phone_number ? (
            <TouchableOpacity
              style={{ flex: 1, marginRight: email ? 8 : 0 }}
              activeOpacity={0.7}
              // onPress={() => Linking.openURL(`tel:${phone_number}`)}
              onPress={makeCall}>
              <View style={styles.contactButtonContainer}>
                <ContactTelephone
                  width={normalize(24)}
                  height={normalize(24)}
                />
                <AppText textStyle="button2" customStyle={{ marginLeft: 8 }}>
                  Call Seller
                </AppText>
              </View>
            </TouchableOpacity>
          ) : (
            <></>
          )}
          {email ? (
            <TouchableOpacity
              style={{ flex: 1, marginLeft: phone_number ? 8 : 0 }}
              activeOpacity={0.7}
              onPress={() => {
                Linking.openURL(
                  `mailto:${email}?subject=Servbees: Is this still available?`
                )
              }}>
              <View style={styles.contactButtonContainer}>
                <ContactEmail width={normalize(24)} height={normalize(24)} />
                <AppText textStyle="button2" customStyle={{ marginLeft: 8 }}>
                  Send Email
                </AppText>
              </View>
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </SafeAreaView>
    </>
  )
}

const cardMap = card => {
  return card === 'service'
    ? 'need'
    : card === 'Need' || card === 'need'
    ? 'post'
    : 'sell'
}

const styles = StyleSheet.create({
  postImageContainer: {
    height: normalize(248),
    width: normalize(375),
    overflow: 'hidden',
    marginBottom: -8,
  },
  postInfoContainer: {
    backgroundColor: 'white',
    flex: 1,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    paddingHorizontal: normalize(16),
    paddingTop: normalize(16),
    paddingBottom: normalize(120),
    // height: '100%',
  },
  userInfoImageContainer: {
    height: normalize(42),
    width: normalize(42),
    borderRadius: normalize(42 / 2),
    overflow: 'hidden',
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactButtonContainer: {
    flexDirection: 'row',
    borderWidth: 1.2,
    borderColor: Colors.primaryYellow,
    justifyContent: 'center',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.neutralsWhite,
  },
})

export default SinglePostOthersView
