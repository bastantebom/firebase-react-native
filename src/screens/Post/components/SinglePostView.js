import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';

import {AppText, TransparentHeader, ProfileInfo} from '@/components';

import {normalize, GlobalStyle, Colors} from '@/globals';
import {
  PostClock,
  PostNavigation,
  PostInfo,
  PostCash,
  PostBox,
  CircleTick,
  CloseDark,
  CircleTickWhite,
  CloseLight
} from '@/assets/images/icons';
import {PostService} from '@/services';
import EditPostScreen from './EditPostScreen';

const SinglePostView = (props) => {
  // console.log("SINGLEW POST VIEW POST PROPS")
  // console.log(props)
  const navigation = useNavigation();
  const [showNotification, setShowNotification] = useState(false);
  const [ellipsisState, setEllipsisState] = useState(false);

  const [editPost, showEditPost] = useState(false);

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

  useEffect(() => {
    console.log('LOGGING ROUTE PROPS');
    console.log(props.route.params);

    setShowNotification(
      props.route.params?.created ? props.route.params?.created : false,
    );

    setShowNotification(
      props.route.params?.edited ? props.route.params?.edited : false,
    );

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  }, [props]);

  const {
    uid,
    post_type,
    images,
    title,
    description,
    payment_method,
    price,
    store_location,
    delivery_method,
    available,
    username,
    profile_photo,
    account_verified,
    display_name,
    date_posted,
    post_id,
  } = props.route?.params?.data;

  const userInfo = {
    username: username,
    profile_photo: profile_photo,
    account_verified: account_verified,
    display_name: display_name,
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
    }

    if (showNotification)
      return (
        <View
          style={{
            backgroundColor: backgroundColor,
            position: 'absolute',
            top: -58,
            width: normalize(375),
            paddingHorizontal: 16,
            alignItems: 'center',
            height: normalize(58),
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            flexDirection: 'row',
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

  const deletePost = async () => {
    console.log('delete this post with id: ');
    console.log(post_id);
    return await PostService.deletePost(post_id).then(() => {
      toggleEllipsisState();
      navigation.goBack();
    });
  };

  return (
    <>
      <View style={{flex: 1}}>
        <View style={styles.postImageContainer}>
          <Image
            style={GlobalStyle.image}
            source={{
              uri:
                'https://i.insider.com/5bbd187101145529745a9895?width=750&format=jpeg&auto=webp',
            }}
          />
        </View>
        <View style={styles.postInfoContainer}>
          <CustomNotification />

          <ProfileInfo userInfo={userInfo} type="own-post" />

          <AppText
            textStyle="subtitle1"
            customStyle={{marginTop: 24, marginBottom: 16}}>
            {title}
          </AppText>

          <AppText textStyle="subtitle1" customStyle={{marginBottom: 12}}>
            ₱ {price}
          </AppText>

          <View style={styles.iconText}>
            <PostClock width={normalize(24)} height={normalize(24)} />
            <AppText textStyle="body2" customStyle={{marginLeft: 8}}>
              Just Now
            </AppText>
          </View>
          <View style={styles.iconText}>
            <PostNavigation width={normalize(24)} height={normalize(24)} />
            <AppText textStyle="body2" customStyle={{marginLeft: 8}}>
              {store_location}
            </AppText>
          </View>
          <View style={styles.iconText}>
            <PostInfo width={normalize(24)} height={normalize(24)} />
            <AppText textStyle="body2" customStyle={{marginLeft: 8}}>
              {description}
            </AppText>
          </View>
          <Divider style={[GlobalStyle.dividerStyle, {marginBottom: 16}]} />
          <View style={styles.iconText}>
            <PostCash width={normalize(24)} height={normalize(24)} />
            <AppText textStyle="body2" customStyle={{marginLeft: 8}}>
              {payment_method}
            </AppText>
          </View>
          {delivery_method ? (
            <View style={styles.iconText}>
              <PostBox width={normalize(24)} height={normalize(24)} />
              <AppText textStyle="body2" customStyle={{marginLeft: 8}}>
                {delivery_method[0] && delivery_method[1]
                  ? 'Pickup & Delivery'
                  : delivery_method[0]
                  ? 'Pickup'
                  : delivery_method[1]
                  ? 'Delivery'
                  : 'None'}
              </AppText>
            </View>
          ) : null}
        </View>
      </View>
      <TransparentHeader
        type="post-own"
        ellipsisState={ellipsisState}
        toggleEllipsisState={toggleEllipsisState}
        backFunction={() => navigation.goBack()}
        editPostFunction={toggleEditPost}
        deletePostFunction={deletePost}
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
          card={cardMap(post_type)}
          togglePostModal={() => showEditPost(false)}
        />
      </Modal>
    </>
  );
};

const cardMap = (card) => {
  return card === 'service' ? 'need' : card === 'Need' ? 'post' : 'sell';
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
    padding: 16,
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
    // backgroundColor: 'red'
    marginBottom: 16,
  },
});

export default SinglePostView;
