import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

import {AppText, MarginView} from '@/components';
import {GlobalStyle, normalize, timePassed, Colors} from '@/globals';
import {Verified, StarRating} from '@/assets/images/icons';

const Review = ({data}) => {
  const {
    userImage,
    name,
    username,
    rating,
    postedAt,
    isVerified,
    postType,
    review,
    availed,
  } = data;

  const VerifiedBadge = () => {
    return isVerified ? (
      <Verified width={normalize(9)} height={normalize(10.12)} />
    ) : (
      <></>
    );
  };

  const timeAgo = (time) => {
    return timePassed(time);
  };

  return (
    <MarginView
      marginSize={2}
      style={{
        marginBottom: 0,
        padding: 12,
        backgroundColor: 'white',
        borderBottomColor: Colors.neutralGray,
        borderBottomWidth: 1,
      }}>
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.userInfoImageContainer}>
            <Image
              style={GlobalStyle.image}
              source={{
                uri: userImage,
              }}
            />
          </View>
          <View style={styles.userInfoCopy}>
            <View style={styles.user}>
              <AppText customStyle={{marginLeft: 8, marginRight: 4}}>
                {name}
              </AppText>
              <VerifiedBadge />
            </View>
            <AppText customStyle={{marginLeft: 8, marginRight: 4}}>
              {timeAgo(postedAt)} ago
            </AppText>
          </View>
        </View>
        <View style={styles.ratingWrapper}>
          <StarRating width={normalize(12)} height={normalize(12)} />
          <AppText
            textStyle="caption"
            color={Colors.profileLink}
            customStyle={{marginLeft: 4}}>
            {rating}/5 - {availed}
          </AppText>
        </View>
        <View style={styles.reviewWrapper}>
          <AppText textStyle="body2">{review}</AppText>
        </View>
      </View>
    </MarginView>
  );
};

const styles = StyleSheet.create({
  userInfoImageContainer: {
    height: normalize(32),
    width: normalize(32),
    borderRadius: normalize(32 / 2),
    overflow: 'hidden',
  },

  user: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  userInfoCopy: {
    flexDirection: 'column',
  },

  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'center',
    paddingTop: normalize(8),
    //backgroundColor: 'red',
  },
});

export default Review;
