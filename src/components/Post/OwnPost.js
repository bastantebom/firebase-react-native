import React, {useContext, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';

import {AppText, MarginView, ProfileInfo, CacheableImage} from '@/components';
import {GlobalStyle, normalize, timePassedShort, Colors} from '@/globals';
import {DefaultSell, DefaultService, DefaultNeed} from '@/assets/images';
import {Verified, ProfileImageDefault} from '@/assets/images/icons';
import {UserContext} from '@/context/UserContext';
import LoadingScreen from './loading';
import SinglePostOthersView from './SinglePostOthersView';

const OwnPost = ({data, isLoading}) => {
  const {user} = useContext(UserContext);
  const [showPost, setShowPost] = useState(false);

  const navigation = useNavigation();

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
    full_name,
  } = data;

  const VerifiedBadge = () => {
    return account_verified ? (
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

  const ProfilePhoto = ({size}) => {
    return profile_photo ? (
      <CacheableImage
        style={GlobalStyle.image}
        source={{
          uri: profile_photo,
        }}
      />
    ) : (
      <ProfileImageDefault width={normalize(size)} height={normalize(size)} />
    );
  };

  const navToPost = () => {
    let computedData = {
      data: data,
      viewing: true,
      created: false,
      edited: false,
    };

    if (user && user.uid === uid)
      navigation.navigate('Post', {
        screen: 'SinglePostView',
        params: computedData,
      });
    // change navigation.push to navigate
    else
      navigation.navigate('NBTScreen', {
        screen: 'OthersPost',
        params: {...computedData, othersView: true},
      });
  };

  return (
    <LoadingScreen.LoadingOwnPost isLoading={isLoading}>
      <TouchableOpacity activeOpacity={0.7} onPress={navToPost}>
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
                    <ProfilePhoto size={20} />
                  </View>
                  <AppText
                    textStyle="caption"
                    customStyle={{
                      marginLeft: 8,
                      marginRight: 4,
                      flex: 1,
                    }}>
                    {display_name ? display_name : full_name}
                  </AppText>
                  <VerifiedBadge />
                </View>

                <AppText
                  textStyle="captionConstant"
                  color={Colors.contentPlaceholder}>
                  {timeAgo(date_posted)}
                </AppText>
              </View>
              <View
                style={{
                  marginTop: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {/* <View
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
              </View> */}
                {/* <AppText
                textStyle="metadata"
                customStyle={{textTransform: 'capitalize', marginLeft: 4}}>
                2 Offers
              </AppText> */}
              </View>
              <AppText customStyle={{marginTop: 4}} textStyle="caption2">
                {title}
              </AppText>
              {/* <AppText textStyle="metadata">{description}</AppText> */}
            </View>
          </View>
        </MarginView>
      </TouchableOpacity>
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
