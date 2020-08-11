import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Divider} from 'react-native-paper';

import {AppText, TransparentHeader} from '@/components';

import {normalize, GlobalStyle, Colors} from '@/globals';
import {
  Verified,
  PostClock,
  PostNavigation,
  PostInfo,
  PostCash,
  PostBox,
  CircleTick,
  CloseDark,
} from '@/assets/images/icons';

const SinglePostView = (props) => {
  console.log(props.route.params);

  const [showNotification, setShowNotification] = useState(true);
  const [ellipsisState, setEllipsisState] = useState(false);

  const toggleEllipsisState = () => {
    setEllipsisState(!ellipsisState);
  };

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  }, []);

  // data = {
  //   uid: user.uid,
  //   post_type: type,
  //   images: [],
  //   title: title,
  //   price: price,
  //   description: description,
  //   payment_method: paymentMethod,
  //   store_location: storeLocation,
  //   delivery_method: [],
  // };

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
  } = props.route.params;

  const CustomNotification = () => {
    if (showNotification)
      return (
        <View
          style={{
            backgroundColor: Colors.primaryYellow,
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
          <CircleTick width={normalize(24)} height={normalize(24)} />
          <AppText customStyle={{flex: 1, marginLeft: 8}} textStyle="body2">
            Post successful!
          </AppText>
          <TouchableOpacity onPress={toggleNotification} activeOpacity={0.7}>
            <CloseDark width={normalize(24)} height={normalize(24)} />
          </TouchableOpacity>
        </View>
      );
    return null;
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
          <View style={{flexDirection: 'row'}}>
            <View style={styles.userInfoImageContainer}>
              <Image
                style={GlobalStyle.image}
                source={{
                  uri:
                    'https://upload.wikimedia.org/wikipedia/commons/0/08/Charlize_Theron_WonderCon_2012_%28Straighten_Crop%29.jpg',
                }}
              />
            </View>
            <View style={{marginLeft: 8, justifyContent: 'center'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <AppText textStyle="body1medium" customStyle={{marginRight: 4}}>
                  Charlize Theron
                </AppText>
                <Verified />
              </View>
              <View style={{}}>
                <AppText textStyle="body2" color={Colors.contentPlaceholder}>
                  @{'oldguard'.toLowerCase()}
                </AppText>
              </View>
            </View>
          </View>

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
              Over 1 min ago
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
      />
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
    alignItems: 'center',
    // backgroundColor: 'red'
    marginBottom: 16,
  },
});

export default SinglePostView;
