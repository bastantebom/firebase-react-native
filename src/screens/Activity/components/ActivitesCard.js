import React, {useContext, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {Colors, GlobalStyle, timePassed, normalize} from '@/globals';
import {PaddingView, AppText, ProfileInfo, CacheableImage, MarginView} from '@/components';
import {UserContext} from '@/context/UserContext';
import {
  Verified,
  JarHeart,
  StarRating,
  NavigationPinRed,
  NavigationArrow,
  TransportationBox,
} from '@/assets/images/icons';
import {DefaultSell, DefaultService, DefaultNeed} from '@/assets/images';

const ActivitiesCard = ({data, type}) => {
  const [status, setStatus] = useState('Waiting for confirmation');

  const statusBackground = () => {
    if (status === 'Waiting for confirmation') return Colors.neutralsMischka;

    if (status === 'Confirmed') return Colors.secondaryLavenderBlue;

    if (status === 'Ongoing') return Colors.secondaryDarkTangerine;

    if (status === 'Completed') return Colors.secondaryShamrock;

    if (status === 'Order Cancelled') return Colors.red;

    if (status === 'Declined') return Colors.red;

    if (status === 'Completed') return Colors.secondaryShamrock;

    if (status === 'Processing') return Colors.secondaryDarkTangerine;

    if (status === 'Ready for Pickup') return Colors.secondaryDarkTangerine;

    if (status === 'Ready for Delivery') return Colors.secondaryDarkTangerine;

    return 'red';
  };

  // const {user} = useContext(UserContext);

  // const {
  //   display_name,
  //   date_posted,
  //   available,
  //   profile_photo,
  //   payment_method,
  //   store_location: {city, province, country},
  //   title,
  //   username,
  //   delivery_method: {pickup, delivery},
  //   description,
  //   uid,
  //   price,
  //   post_id,
  //   images,
  //   account_verified,
  //   email,
  //   phone_number,
  //   post_type,
  //   full_name,
  // } = data;

  // const VerifiedBadge = () => {
  //   return account_verified ? <Verified /> : <></>;
  // };

  // let timeAgo = (time) => {
  //   return '• ' + timePassed(time) + ' ago';
  // };

  // const userInfo = {
  //   username: username,
  //   profile_photo: profile_photo,
  //   account_verified: account_verified,
  //   display_name: display_name ? display_name : full_name,
  //   date_posted: date_posted,
  //   uid: uid,
  // };

  // const navToPost = () => {
  //   let computedData = {
  //     data: data,
  //     viewing: true,
  //     created: false,
  //     edited: false,
  //   };

  //   if (user && user.uid === uid)
  //     navigation.navigate('Post', {
  //       screen: 'SinglePostView',
  //       params: computedData,
  //     });
  //   else
  //     navigation.navigate('NBTScreen', {
  //       screen: 'OthersPost',
  //       params: {...computedData, othersView: true},
  //     });
  // };

  return (
    <ScrollView>
        <TouchableOpacity activeOpacity={0.7} 
          // onPress={navToPost}
        >
        <MarginView
          marginSize={2}
          style={{
            // marginBottom: 0,
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
            {/* <View style={styles.postImageContainer}>
              {images.length > 0 ? (
                <CacheableImage
                  style={GlobalStyle.image}
                  source={{uri: images[0]}}
                />
              ) : // <Image style={GlobalStyle.image} source={require('@/assets/images/logo.png')} />
              post_type === 'service' ? (
                <DefaultService width={normalize(64)} height={normalize(72)} />
              ) : post_type === 'Need' ? (
                <DefaultNeed width={normalize(64)} height={normalize(72)} />
              ) : (
                <DefaultSell width={normalize(64)} height={normalize(72)} />
              )}
            </View> */}

            <View style={{paddingLeft: 12, flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                {/* <View style={styles.userInfoImageContainer}>
                  <ProfilePhoto size={20} />
                </View> */}
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                  }}>
                  <AppText
                    textStyle="caption"
                    customStyle={{
                      flex: 1,
                      paddingLeft: 8,
                      paddingRight: 4,
                    }}>
                      Name
                    {/* {display_name ? display_name : full_name} */}
                  </AppText>
                  {/* <VerifiedBadge /> */}
                  <AppText
                    textStyle="captionConstant"
                    color={Colors.contentPlaceholder}>
                      Time
                    {/* {timeAgo(date_posted)} */}
                  </AppText>
                </View>
              </View>
               <View
                style={{
                  backgroundColor: statusBackground(),
                  borderRadius: 20,
                  paddingHorizontal: 8,
                  flexDirection: 'column',
                }}>
                <AppText
                  textStyle="metadata"
                  color={'white'}>
                  {status}
                </AppText>
              </View>
              <AppText customStyle={{marginTop: 4}} textStyle="caption2">
                {/* {title} */}
                Title
              </AppText>
              {/* <AppText textStyle="metadata">{description}</AppText> */}
            </View>
          </View>
        </MarginView>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default ActivitiesCard;