import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';

import {AppText, TransparentHeader, ProfileInfo} from '@/components';
import {normalize, GlobalStyle, Colors, timePassed} from '@/globals';
import {
  PostClock,
  PostNavigation,
  PostInfo,
  PostCash,
  PostBox,
  ContactEmail,
  ContactTelephone,
} from '@/assets/images/icons';
import {PostService} from '@/services';
import {UserContext} from '@/context/UserContext';

const SinglePostOthersView = ({data, backFunction}) => {
  // console.log("SINGLEW POST VIEW POST PROPS")
  // console.log(props)

  const {
    uid,
    post_type,
    images,
    title,
    description,
    payment_method,
    price,
    store_location: {longitude, city, province, latitude, country},
    delivery_method,
    available,
    username,
    profile_photo,
    account_verified,
    display_name,
    date_posted,
    post_id,
  } = data;

  const {user} = useContext(UserContext);

  const userInfo = {
    username: username,
    profile_photo: profile_photo,
    account_verified: account_verified,
    display_name: display_name,
  };

  let timeAgo = (time) => {
    return timePassed(time) + ' ago';
  };

  const SinglePostContent = () => {
    return (
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
              {timeAgo(date_posted)}
            </AppText>
          </View>
          <View style={styles.iconText}>
            <PostNavigation width={normalize(24)} height={normalize(24)} />
            <AppText textStyle="body2" customStyle={{marginLeft: 8}}>
              {city}, {province}, {country}
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
    );
  };

  return (
    <>
      <TransparentHeader type={'post-other'} backFunction={backFunction} />
      <SinglePostContent />

      <SafeAreaView
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundColor: 'transparent',
        }}>
        <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
          <TouchableOpacity
            style={{flex: 1, marginRight: 8}}
            activeOpacity={0.7}>
            <View style={styles.contactButtonContainer}>
              <ContactTelephone width={normalize(24)} height={normalize(24)} />
              <AppText textStyle="button2" customStyle={{marginLeft: 8}}>
                Call Seller
              </AppText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, marginLeft: 8}}
            activeOpacity={0.7}>
            <View style={styles.contactButtonContainer}>
              <ContactEmail width={normalize(24)} height={normalize(24)} />
              <AppText textStyle="button2" customStyle={{marginLeft: 8}}>
                Send Email
              </AppText>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
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
    marginBottom: 16,
  },
  contactButtonContainer: {
    flexDirection: 'row',
    borderWidth: 1.2,
    borderColor: Colors.primaryYellow,
    justifyContent: 'center',
    paddingVertical: 12,
    alignItems: 'center',
  },
});

export default SinglePostOthersView;
