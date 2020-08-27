import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  Linking,
  ScrollView,
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
import {ImageModal} from '@/screens/Post/components/ImageModal';

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
    delivery_method: {pickup, delivery},
    available,
    username,
    profile_photo,
    account_verified,
    display_name,
    date_posted,
    post_id,
    email,
    phone_number,
  } = data;

  const {user} = useContext(UserContext);

  const defaultImage = [
    {
      key: 0,
      image: require('@/assets/images/logo.png'),
    },
  ];

  const userInfo = {
    username: username,
    profile_photo: profile_photo,
    account_verified: account_verified,
    display_name: display_name,
    uid: uid,
  };

  let timeAgo = (time) => {
    return timePassed(time) + ' ago';
  };

  let makeCall = () => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phone_number}`;
    } else {
      phoneNumber = `telprompt:${phone_number}`;
    }
    Linking.openURL(phoneNumber);
  };

  const [postImageModal, setPostImageModal] = useState(false);

  const togglePostImageModal = () => {
    setPostImageModal(!postImageModal);
  };

  const SinglePostContent = ({children}) => {
    return (
      <View style={{flex: 1}}>
        <View style={styles.postImageContainer}>
          {/* <Image
            style={GlobalStyle.image}
            source={{
              uri:
                'https://i.insider.com/5bbd187101145529745a9895?width=750&format=jpeg&auto=webp',
            }}
          /> */}
          {images === undefined || images.length == 0 ? (
            post_type === 'Need' || post_type ==='need' ? (
              <Image
                style={GlobalStyle.image}
                source={require('@/assets/images/cover-need.png')}
              />
            ) : post_type === 'Sell' || post_type ==='sell' ? (
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
            images.map((item) => {
              return (
                <Swiper
                  activeDotColor={Colors.primaryYellow}
                  dotColor={Colors.neutralsIron}
                  dotStyle={{marginRight: 9}}
                  activeDotStyle={{marginRight: 9}}>
                  <TouchableWithoutFeedback onPress={togglePostImageModal}>
                    <Image
                      style={GlobalStyle.image}
                      source={{
                        uri: item,
                      }}
                    />
                  </TouchableWithoutFeedback>
                </Swiper>
              );
            })
          )}
        </View>
        <View style={styles.postInfoContainer}>
          <ProfileInfo
            userInfo={userInfo}
            type="own-post"
            closePostModal={backFunction}
          />

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
          {!pickup && !delivery ? (
            <></>
          ) : (
            <View style={styles.iconText}>
              <PostBox width={normalize(24)} height={normalize(24)} />
              <AppText textStyle="body2" customStyle={{marginLeft: 8}}>
                {pickup && delivery
                  ? 'Pickup & Delivery'
                  : delivery
                  ? 'Delivery'
                  : pickup
                  ? 'Pickup'
                  : ''}
              </AppText>
            </View>
          )}
        </View>
        {children}
      </View>
    );
  };

  return (
    <>
      <ScrollView>
        <View style={{flex: 1, position: 'relative', backgroundColor: 'green'}}>
          <TransparentHeader type={'post-other'} backFunction={backFunction} />
          <SinglePostContent></SinglePostContent>

          <Modal
            isVisible={postImageModal}
            animationIn="bounceIn"
            animationOut="bounceOut"
            style={{
              margin: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ImageModal close={togglePostImageModal} data={defaultImage} />
          </Modal>
        </View>
      </ScrollView>
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
          {phone_number ? (
            <TouchableOpacity
              style={{flex: 1, marginRight: email ? 8 : 0}}
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
          {email ? (
            <TouchableOpacity
              style={{flex: 1, marginLeft: phone_number ? 8 : 0}}
              activeOpacity={0.7}
              onPress={() => {
                Linking.openURL(
                  `mailto:${email}?subject=Servbees: Is this still available?`,
                );
              }}>
              <View style={styles.contactButtonContainer}>
                <ContactEmail width={normalize(24)} height={normalize(24)} />
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
    // backgroundColor: 'blue',
    // height: '100%',
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
