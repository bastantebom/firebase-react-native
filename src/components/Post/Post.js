import React, {useContext, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';

import {Colors, GlobalStyle, timePassed, normalize} from '@/globals';
import OwnPost from './OwnPost';
import {PaddingView, AppText, ProfileInfo} from '@/components';
import {UserContext} from '@/context/UserContext';
import {
  Verified,
  JarHeart,
  StarRating,
  NavigationPinRed,
  NavigationArrow,
  TransportationBox,
} from '@/assets/images/icons';
import LoadingScreen from './loading';
import SinglePostOthersView from './SinglePostOthersView';

const Post = ({data, type, isLoading}) => {
  const {user} = useContext(UserContext);
  const [showPost, setShowPost] = useState(false);

  const {
    display_name,
    date_posted,
    available,
    profile_photo,
    payment_method,
    store_location: {city, province, country},
    title,
    username,
    delivery_method: {pickup, delivery},
    description,
    uid,
    price,
    post_id,
    images,
    account_verified,
    email,
    phone_number,
    post_type,
  } = data;

  const VerifiedBadge = () => {
    return account_verified ? <Verified /> : <></>;
  };

  let timeAgo = (time) => {
    return '• ' + timePassed(time) + ' ago';
  };

  const userInfo = {
    username: username,
    profile_photo: profile_photo,
    account_verified: account_verified,
    display_name: display_name,
    date_posted: date_posted,
    uid: uid,
  };

  const navigation = useNavigation();

  const navToPost = () => {
    let computedData = {
      data: data,
      viewing: true,
      created: false,
      edited: false,
    };

    if (user.uid === uid)
      navigation.navigate('Post', {
        screen: 'SinglePostView',
        params: computedData,
      });
    else setShowPost(true);
  };

  if (type === 'dashboard')
    return (
      <LoadingScreen.LoadingPublicPost isLoading={isLoading}>
        <PaddingView paddingSize={2} style={styles.container}>
          <ProfileInfo userInfo={userInfo} type="dashboard" />

          <View style={styles.postContainer}>
            <TouchableOpacity activeOpacity={0.7} onPress={navToPost}>
              <View style={styles.postImageContainer}>
                <Image
                  style={GlobalStyle.image}
                  source={{
                    uri:
                      images.length > 0
                        ? images[0]
                        : 'https://s3.amazonaws.com/vulture-food-photos/defaultvulture.png',
                  }}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.postDetailContainer}>
              <TouchableOpacity activeOpacity={0.7} onPress={navToPost}>
                <AppText
                  textStyle="body2"
                  customStyle={GlobalStyle.marginBottom1}>
                  {title}
                </AppText>

                <AppText
                  textStyle="price"
                  customStyle={styles.priceText}
                  color={Colors.secondaryMountainMeadow}>
                  ₱{price}
                </AppText>
              </TouchableOpacity>

              <Divider style={styles.dividerStyle} />

              <View style={[GlobalStyle.rowCenter, GlobalStyle.marginBottom1]}>
                <View style={GlobalStyle.rowCenter}>
                  <NavigationPinRed width={16} height={16} />
                  <AppText
                    textStyle="eyebrow2"
                    color={Colors.contentPlaceholder}
                    customStyle={{marginLeft: 4}}>
                    {city}, {province}
                  </AppText>
                </View>
                {/* <View style={[GlobalStyle.rowCenter, GlobalStyle.marginLeft2]}>
                  <NavigationArrow width={12} height={12} />
                  <AppText
                    textStyle="eyebrow2"
                    color={Colors.contentPlaceholder}
                    customStyle={{marginLeft: 4}}>
                    {postServiceRadius}
                  </AppText>
                </View> */}
              </View>
              {pickup || delivery ? (
                <View style={GlobalStyle.rowCenter}>
                  <TransportationBox width={16} height={16} />

                  <AppText
                    textStyle="eyebrow2"
                    customStyle={{color: Colors.contentEbony, marginLeft: 4}}>
                    {pickup && delivery
                      ? 'Pickup & Delivery'
                      : delivery
                      ? 'Delivery'
                      : pickup
                      ? 'Pickup'
                      : 'Not set'}
                  </AppText>
                </View>
              ) : null}
            </View>
          </View>
        </PaddingView>
        <Modal
          isVisible={showPost}
          animationIn="slideInUp"
          animationInTiming={500}
          animationOut="slideOutLeft"
          animationOutTiming={500}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
            justifyContent: 'flex-start',
          }}>
          <SinglePostOthersView
            data={data}
            backFunction={() => setShowPost(false)}
          />
        </Modal>
      </LoadingScreen.LoadingPublicPost>
    );

  if (type === 'own') return <OwnPost data={data} isLoading={isLoading} />;

  return (
    <AppText color={'red'}>
      type of list is required. Type: 'own' | 'dashboard'
    </AppText>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red"
    // backgroundColor: 'red',
    borderStyle: 'solid',
    borderColor: Colors.neutralsZircon,
    borderBottomWidth: 1,
    paddingBottom: 0,
  },
  userInfoContainer: {
    // backgroundColor: "blue",
    flexDirection: 'row',
  },
  userInfoImageContainer: {
    height: normalize(32),
    width: normalize(32),
    borderRadius: normalize(32 / 2),
    overflow: 'hidden',
  },
  userInfoImage: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  userInfoDetailsContainer: {
    flex: 1,
    // backgroundColor: "red",
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
  starRatingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },

  postContainer: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: 'row',
  },

  postImageContainer: {
    width: normalize(122),
    height: normalize(126),
    borderRadius: 8,
    overflow: 'hidden',
  },
  postDetailContainer: {
    flex: 1,
    marginLeft: 8,
  },
  dividerStyle: {
    backgroundColor: Colors.neutralsZirconLight,
    width: '100%',
    marginBottom: 8,
  },
  priceText: {
    color: Colors.secondaryMountainMeadow,
    marginBottom: 8,
  },
});

export default Post;
