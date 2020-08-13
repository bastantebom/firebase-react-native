import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

import {AppText, MarginView} from '@/components';
import {GlobalStyle, normalize, timePassedShort, Colors} from '@/globals';
import {Verified} from '@/assets/images/icons';
import LoadingScreen from './loading';

const OwnPost = ({data, isLoading}) => {
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
    status,
  } = data;

  const VerifiedBadge = () => {
    return isVerified ? (
      <Verified width={normalize(9)} height={normalize(10.12)} />
    ) : (
      <></>
    );
  };

  const timeAgo = (time) => {
    return timePassedShort(time);
  };

  const statusBackground = () => {
    if (status === 'ongoing') return Colors.secondaryDarkTangerine;

    if (status === 'completed') return Colors.secondaryShamrock;

    return 'red';
  };

  return (
    <LoadingScreen.LoadingOwnPost isLoading={isLoading}>
      <MarginView
        marginSize={2}
        style={{
          marginBottom: 0,
          padding: 12,
          borderRadius: 8,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 4,
        }}>
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
            <View
              style={{
                marginTop: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: statusBackground(),
                  borderRadius: 20,
                  paddingHorizontal: 8,
                }}>
                <AppText
                  textStyle="metadata"
                  color={'white'}
                  customStyle={{textTransform: 'capitalize'}}>
                  {status}
                </AppText>
              </View>
              <AppText
                textStyle="metadata"
                customStyle={{textTransform: 'capitalize', marginLeft: 4}}>
                2 Offers
              </AppText>
            </View>
            <AppText customStyle={{marginTop: 4}} textStyle="caption2">
              {postName}
            </AppText>
          </View>
        </View>
      </MarginView>
    </LoadingScreen.LoadingOwnPost>
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
