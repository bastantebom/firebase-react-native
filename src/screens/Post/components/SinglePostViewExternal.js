import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  Linking,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import Swiper from 'react-native-swiper';

import {
  AppText,
  TransparentHeader,
  ProfileInfo,
  CacheableImage,
} from '@/components';
import {normalize, GlobalStyle, Colors, timePassed} from '@/globals';
import {
  PostClock,
  PostNavigation,
  PostInfo,
  PostCash,
  PostBox,
  CircleTick,
  CloseDark,
  CircleTickWhite,
  CloseLight,
  ContactEmail,
  ContactTelephone,
} from '@/assets/images/icons';
import {CoverNeed, CoverSell, CoverService} from '@/assets/images';

import {PostService} from '@/services';
import {UserContext} from '@/context/UserContext';
import EditPostScreen from './EditPostScreen';
import {ImageModal} from './ImageModal';

const SinglePostViewExternal = (props) => {
  const {othersView = false} = props.route?.params;

  const {pid} = props.route?.params;

  const [postInfo, setPostInfo] = useState();
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    PostService.getPost(postInfo?.post_id)
      .then((res) => {
        if (mounted) setPostInfo(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        if (mounted) {
          console.log('FINALLY');
          setIsDataLoading(false);
        }
      });
  }, []);

  //   const {
  //     uid,
  //     post_type,
  //     images,
  //     title,
  //     description,
  //     payment_method,
  //     price,
  //     store_location: {longitude, city, province, latitude, country},
  //     delivery_method: {pickup, delivery},
  //     available,
  //     username,
  //     profile_photo,
  //     account_verified,
  //     display_name,
  //     date_posted,
  //     post_id,
  //     full_name,
  //     email,
  //     phone_number,
  //   } = props.route?.params?.data;

  // console.log("Images in single post view")

  // console.log(images);

  const navigation = useNavigation();
  const [showNotification, setShowNotification] = useState(false);
  const [ellipsisState, setEllipsisState] = useState(false);
  const [otherPostModal, setOtherPostModal] = useState(false);

  const [editPost, showEditPost] = useState(false);
  const [postImageModal, setPostImageModal] = useState(false);

  const {user, setUserInfo, userInfo} = useContext(UserContext);

  const toggleEditPost = () => {
    toggleEllipsisState();
    setTimeout(() => {
      showEditPost(!editPost);
    }, 500);
  };

  const toggleEllipsisState = () => {
    setEllipsisState(!ellipsisState);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  const togglePostImageModal = () => {
    setPostImageModal(!postImageModal);
  };

  useEffect(() => {
    // console.log('LOGGING ROUTE PROPS');
    // if (!(uid === user?.uid)) setOtherPostModal(true);

    setShowNotification(setNotification());

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  }, [props]);

  const setNotification = () => {
    return props.route.params?.created
      ? props.route.params?.created
      : props.route.params?.edited
      ? props.route.params?.edited
      : false;
  };

  const profileInfo = {
    username: postInfo?.username,
    profile_photo: postInfo?.profile_photo,
    account_verified: postInfo?.account_verified,
    display_name: postInfo?.display_name
      ? postInfo?.display_name
      : postInfo?.full_name,
    uid: postInfo?.uid,
  };

  const defaultImage = [
    {
      key: 0,
      image: require('@/assets/images/logo.png'),
    },
  ];
  const deletePost = async () => {
    // console.log('delete this post with id: ');
    // console.log(postInfo?.post_id);
    return await PostService.deletePost(postInfo?.post_id).then(() => {
      toggleEllipsisState();
      console.log('deletePost ' + postInfo?.userInfo.post_count);
      setUserInfo({
        ...postInfo?.userInfo,
        post_count: postInfo?.userInfo.post_count - 1,
      });
      navigation.goBack();
    });
  };

  const hidePost = async () => {
    //body: { uid, pid }
    return await PostService.hidePost({
      uid: user?.uid,
      pid: postInfo?.post_id,
    }).then((res) => {
      toggleEllipsisState();
      //console.log('deletePost ' + userInfo.post_count);
      setUserInfo({...postInfo?.userInfo, hidden_posts: res.hidden_posts});
      console.log(postInfo?.userInfo.hidden_posts);
      navigation.goBack();
    });
    //navigation.goBack();
    //alert('hide Post View Post');
  };

  let timeAgo = (time) => {
    if (time <= 60) {
      return 'Just now';
    }

    return timePassed(time) + ' ago';
  };

  let makeCall = () => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${postInfo?.phone_number}`;
    } else {
      phoneNumber = `telprompt:${postInfo?.phone_number}`;
    }
    Linking.openURL(phoneNumber);
  };

  const CustomNotification = () => {
    const backgroundColor = props.route.params?.created
      ? Colors.primaryYellow
      : Colors.secondaryRoyalBlue;

    const notificationMessage = props.route.params?.created
      ? 'Post Successful!'
      : 'Post edited successfully';

    const notificationColor = props.route.params?.created
      ? Colors.contentEbony
      : 'white';

    const NotificationCheckbox = () => {
      return props.route.params?.created ? (
        <CircleTick width={normalize(24)} height={normalize(24)} />
      ) : (
        <CircleTickWhite width={normalize(24)} height={normalize(24)} />
      );
    };

    const NotificationClose = () => {
      return props.route.params?.created ? (
        <CloseDark width={normalize(24)} height={normalize(24)} />
      ) : (
        <CloseLight width={normalize(24)} height={normalize(24)} />
      );
    };

    if (showNotification)
      return (
        <View
          style={{
            backgroundColor: backgroundColor,
            position: 'absolute',
            bottom: 0,
            width: normalize(375),
            paddingHorizontal: 16,
            alignItems: 'center',
            height: normalize(58),
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            paddingBottom: 8,
            flexDirection: 'row',
            zIndex: 5,
          }}>
          <NotificationCheckbox />
          <AppText
            customStyle={{flex: 1, marginLeft: 8}}
            color={notificationColor}
            textStyle="body2">
            {notificationMessage}
          </AppText>
          <TouchableOpacity onPress={closeNotification} activeOpacity={0.7}>
            <NotificationClose />
          </TouchableOpacity>
        </View>
      );
    return null;
  };

  // const stickySegmentControlX = this.state.scrollY.interpolate({
  //   inputRange: [0, STICKY_SCROLL_DISTANCE],
  //   outputRange: [INIT_STICKY_HEADER, HEADER_MIN_HEIGHT],
  //   extrapolate: 'clamp'
  // })

  const SinglePostContent = () => {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{backgroundColor: 'white'}}>
          <View style={styles.postImageContainer}>
            {/* <Image
            style={GlobalStyle.image}
            source={{
              uri:
                'https://i.insider.com/5bbd187101145529745a9895?width=750&format=jpeg&auto=webp',
            }}
          /> */}
            {postInfo?.images === undefined || postInfo?.images.length == 0 ? (
              postInfo?.post_type === 'Need' ||
              postInfo?.post_type === 'need' ? (
                <Image
                  style={GlobalStyle.image}
                  source={require('@/assets/images/cover-need.png')}
                />
              ) : postInfo?.post_type === 'Sell' ||
                postInfo?.post_type === 'sell' ? (
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
                dotStyle={{
                  marginRight: 7,
                  width: normalize(6),
                  height: normalize(6),
                }}
                activeDotStyle={{
                  marginRight: 7,
                  width: normalize(6),
                  height: normalize(6),
                }}>
                {postInfo?.images.map((item, index) => {
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
                  );
                })}
              </Swiper>
            )}
            <CustomNotification />
          </View>

          <View style={styles.postInfoContainer}>
            <ProfileInfo userInfo={profileInfo} type="own-post" />

            {/* <Animated.View ref="stickyHeader" style={[styles.stickyStuff, {top: stickySegmentControlX}]}>
              <AppText
                textStyle="subtitle1"
                customStyle={{ marginTop: 24, marginBottom: 16 }}>
                {title}
              </AppText>
            </Animated.View> */}

            <AppText
              textStyle="subtitle1"
              customStyle={{marginTop: 24, marginBottom: 16}}>
              {postInfo?.title}
              {/* {postInfo.post_type} */}
            </AppText>

            <AppText
              textStyle="subtitle1"
              color={Colors.secondaryMountainMeadow}
              customStyle={{marginBottom: 12}}>
              ₱ {postInfo?.price}
            </AppText>

            <View style={styles.iconText}>
              <PostClock width={normalize(24)} height={normalize(24)} />
              <AppText textStyle="body2" customStyle={{marginLeft: 8}}>
                {timeAgo(Date.now() / 1000 - postInfo?.date_posted?._seconds)}
              </AppText>
            </View>
            <View style={styles.iconText}>
              <PostNavigation width={normalize(24)} height={normalize(24)} />
              <AppText
                textStyle="body2"
                customStyle={{marginLeft: 8, marginRight: 20}}>
                {postInfo?.store_location?.city},{' '}
                {postInfo?.store_location?.province}
              </AppText>
            </View>
            <View style={styles.iconText}>
              <PostInfo width={normalize(24)} height={normalize(24)} />
              <AppText
                textStyle="body2"
                customStyle={{marginLeft: 8, marginRight: 20}}>
                {postInfo?.description}
              </AppText>
            </View>
            <Divider style={[GlobalStyle.dividerStyle, {marginBottom: 16}]} />
            <View style={styles.iconText}>
              <PostCash width={normalize(24)} height={normalize(24)} />
              <AppText textStyle="body2" customStyle={{marginLeft: 8}}>
                {postInfo?.payment_method}
              </AppText>
            </View>
            {!postInfo?.delivery_method?.pickup &&
            !postInfo?.delivery_method?.delivery ? (
              <></>
            ) : (
              <View style={styles.iconText}>
                <PostBox width={normalize(24)} height={normalize(24)} />
                <AppText textStyle="body2" customStyle={{marginLeft: 8}}>
                  {postInfo?.delivery_method?.pickup &&
                  postInfo?.delivery_method?.delivery
                    ? 'Pickup & Delivery'
                    : postInfo?.delivery_method?.delivery
                    ? 'Delivery'
                    : postInfo?.delivery_method?.pickup
                    ? 'Pickup'
                    : ''}
                </AppText>
              </View>
            )}
          </View>
        </ScrollView>
        {othersView && (
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
              {postInfo?.phone_number ? (
                <TouchableOpacity
                  style={{flex: 1, marginRight: postInfo?.email ? 8 : 0}}
                  activeOpacity={0.7}
                  // onPress={() => Linking.openURL(`tel:${phone_number}`)}
                  onPress={makeCall}>
                  <View style={styles.contactButtonContainer}>
                    <ContactTelephone
                      width={normalize(24)}
                      height={normalize(24)}
                    />
                    <AppText textStyle="button2" customStyle={{marginLeft: 8}}>
                      Call Seller
                    </AppText>
                  </View>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              {postInfo?.email ? (
                <TouchableOpacity
                  style={{flex: 1, marginLeft: postInfo?.phone_number ? 8 : 0}}
                  activeOpacity={0.7}
                  onPress={() => {
                    Linking.openURL(
                      `mailto:${postInfo?.email}?subject=Servbees: Is this still available?`,
                    );
                  }}>
                  <View style={styles.contactButtonContainer}>
                    <ContactEmail
                      width={normalize(24)}
                      height={normalize(24)}
                    />
                    <AppText textStyle="button2" customStyle={{marginLeft: 8}}>
                      Send Email
                    </AppText>
                  </View>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </View>
          </SafeAreaView>
        )}
      </View>
    );
  };

  return (
    <>
      <SinglePostContent />
      <TransparentHeader
        type={postInfo?.uid === user?.uid ? 'post-own' : 'post-other'}
        ellipsisState={ellipsisState}
        toggleEllipsisState={toggleEllipsisState}
        backFunction={() => navigation.goBack()}
        editPostFunction={toggleEditPost}
        deletePostFunction={deletePost}
        hidePost={hidePost}
        postId={postInfo?.post_id}
        postTitle={postInfo?.title}
      />

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
            <View style={{flex: 1, backgroundColor: 'black'}} />
          </TouchableWithoutFeedback>
        }>
        <EditPostScreen
          data={props.route.params.data}
          card={cardMap(postInfo?.post_type)}
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
        <ImageModal
          close={togglePostImageModal}
          data={
            postInfo?.images === undefined || postInfo?.images.length == 0
              ? defaultImage
              : postInfo?.images
          }
        />
      </Modal>
    </>
  );
};

const cardMap = (card) => {
  return card === 'service'
    ? 'need'
    : card === 'Need' || card === 'need'
    ? 'post'
    : 'sell';
};

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
    overflow: 'visible',
    zIndex: 10,
    position: 'relative',
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
});

export default SinglePostViewExternal;
