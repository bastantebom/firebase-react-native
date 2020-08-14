import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

import {Divider} from 'react-native-paper';
import {Colors, GlobalStyle, timePassed, normalize} from '@/globals';

import OwnPost from './OwnPost';
import {PaddingView, AppText} from '@/components';
import {
  Verified,
  JarHeart,
  StarRating,
  NavigationPinRed,
  NavigationArrow,
  TransportationBox,
} from '@/assets/images/icons';
import LoadingScreen from './loading';

const Post = ({data, type, isLoading}) => {
  const {
    userImage,
    name,
    username,
    rating,
    postedAt,
    isVerified,
    postType,
    postImage,
    postName,
    postPrice,
    postServiceAddress,
    postServiceRadius,
    postDeliveryMethod,
  } = data;

  const VerifiedBadge = () => {
    return isVerified ? <Verified /> : <></>;
  };

  let timeAgo = (time) => {
    return '• ' + timePassed(time) + ' ago';
  };

  if (type === 'dashboard')
    return (
      <LoadingScreen.LoadingPublicPost isLoading={isLoading}>
        <PaddingView paddingSize={2} style={styles.container}>
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfoImageContainer}>
              <Image
                style={GlobalStyle.image}
                source={{
                  uri: userImage,
                }}
              />
            </View>
            <View style={styles.userInfoDetailsContainer}>
              <View style={styles.userInfoDetailsNameContainer}>
                <AppText
                  textStyle="caption"
                  customStyle={styles.userInfoDetailsName}>
                  {name}
                </AppText>
                <VerifiedBadge />
              </View>
              <View style={styles.userInfoDetailsUsernameContainer}>
                <AppText textStyle="eyebrow2" color={Colors.contentPlaceholder}>
                  @{username.toLowerCase()}
                </AppText>

                <View style={styles.starRatingContainer}>
                  <StarRating width={12} height={12} />
                  <AppText
                    textStyle="eyebrow2"
                    color={Colors.contentPlaceholder}>
                    {rating}
                  </AppText>
                </View>

                <AppText textStyle="eyebrow2" color={Colors.contentPlaceholder}>
                  {timeAgo(postedAt)}
                </AppText>
              </View>
            </View>
            <TouchableOpacity>
              <JarHeart width={20} height={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.postContainer}>
            <View style={styles.postImageContainer}>
              <Image
                style={GlobalStyle.image}
                source={{
                  uri: postImage,
                }}
              />
            </View>
            <View style={styles.postDetailContainer}>
              <AppText
                textStyle="body2"
                customStyle={GlobalStyle.marginBottom1}>
                {postName}
              </AppText>
              <AppText
                textStyle="price"
                customStyle={styles.priceText}
                color={Colors.secondaryMountainMeadow}>
                ₱{postPrice}
              </AppText>

              <Divider style={styles.dividerStyle} />

              <View style={[GlobalStyle.rowCenter, GlobalStyle.marginBottom1]}>
                <View style={GlobalStyle.rowCenter}>
                  <NavigationPinRed width={16} height={16} />
                  <AppText
                    textStyle="eyebrow2"
                    color={Colors.contentPlaceholder}
                    customStyle={{marginLeft: 4}}>
                    {postServiceAddress}
                  </AppText>
                </View>
                <View style={[GlobalStyle.rowCenter, GlobalStyle.marginLeft2]}>
                  <NavigationArrow width={12} height={12} />
                  <AppText
                    textStyle="eyebrow2"
                    color={Colors.contentPlaceholder}
                    customStyle={{marginLeft: 4}}>
                    {postServiceRadius}
                  </AppText>
                </View>
              </View>

              <View style={GlobalStyle.rowCenter}>
                <TransportationBox width={16} height={16} />
                <AppText
                  textStyle="eyebrow2"
                  customStyle={{color: Colors.contentEbony, marginLeft: 4}}>
                  {postDeliveryMethod}
                </AppText>
              </View>
            </View>
          </View>
        </PaddingView>
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
