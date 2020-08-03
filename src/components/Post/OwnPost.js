import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

import {AppText, MarginView} from '@/components';
import {GlobalStyle, normalize, timePassedShort} from '@/globals';
import {Verified} from '@/assets/images/icons';

const OwnPost = ({data}) => {
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
    return isVerified ? (
      <Verified width={normalize(9)} height={normalize(10.12)} />
    ) : (
      <></>
    );
  };

  let timeAgo = (time) => {
    return timePassedShort(time);
  };

  return (
    <MarginView
      marginSize={2}
      style={{backgroundColor: 'gray', marginBottom: 0, padding: 12}}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.postImageContainer}>
          <Image
            style={GlobalStyle.image}
            source={{
              uri: postImage,
            }}
          />
        </View>
        <View style={{paddingLeft: 12, flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.userInfoImageContainer}>
                <Image
                  style={GlobalStyle.image}
                  source={{
                    uri: userImage,
                  }}
                />
              </View>
              <AppText customStyle={{marginLeft: 8, marginRight: 4}}>
                {name}
              </AppText>
              <VerifiedBadge />
            </View>

            <AppText>{timeAgo(postedAt)}</AppText>
          </View>
          <View style={{marginTop: 8, flexDirection: 'row'}}>
            <View>
              <AppText>asdas</AppText>
            </View>
          </View>
        </View>
      </View>
    </MarginView>
  );
};

const styles = StyleSheet.create({
  postImageContainer: {
    width: normalize(64),
    height: normalize(72),
    borderRadius: 8,
    overflow: 'hidden',
  },
  userInfoImageContainer: {
    height: normalize(20),
    width: normalize(20),
    borderRadius: normalize(20 / 2),
    overflow: 'hidden',
  },
});

export default OwnPost;
