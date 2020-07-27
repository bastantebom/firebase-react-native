import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';

import {Posts, PaddingView, AppInput, AppText} from '@/components';
import FilterSlider from './components/FilterSlider';

import {
  Filter,
  JarHeart,
  NavigationPinRed,
  NavigationArrow,
} from '@/assets/images/icons';
import {GlobalStyle, Colors, normalize} from '@/globals';

import Modal from 'react-native-modal';

function Dashboard({navigation}) {
  const [modalState, setModalState] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  const [scrollState, setScrollState] = useState(0);
  const [margin, setMargin] = useState(16);

  const toggleModal = () => {
    setModalState(!modalState);
  };

  const DummyData = [
    {
      id: 1,
      userImage:
        'https://qph.fs.quoracdn.net/main-qimg-a1e8f69ca6140981338015c818fec130',
      name: 'Pia Samson',
      username: 'Piasamson',
      rating: 3.5,
      postedAt: 8088,
      isVerified: true,
      isLiked: false,

      postType: 'need',
      postImage:
        'https://i.pinimg.com/236x/b3/9d/da/b39dda5fe5fa56de7ca2bdead6d3807c--redneck-airconditioner-homemade-air-conditioner.jpg',
      postName: 'Pasabuy Service - SM Light, Mandaluyong',
      postPrice: 500,
      postServiceAddress: '#8 Atis Street',
      postServiceRadius: '500m',
      postDeliveryMethod: 'Delivery and Pickup',
    },
    {
      id: 2,
      userImage: 'https://reactnative.dev/img/tiny_logo.png',
      name: 'Mark Santiago',
      username: 'Markee',
      rating: 4.5,
      postedAt: 5575482,
      isVerified: true,
      isLiked: false,

      postType: 'Service',
      postImage:
        'https://i.pinimg.com/originals/45/7c/16/457c165d41e342f1765e95ac46fb1d9b.jpg',
      postName: 'Haircut Service every Sat & Sun Haircut Service every',
      postPrice: 20,
      postServiceAddress: '#8 Kaimito Street',
      postServiceRadius: '1000m',
      postDeliveryMethod: 'Home Service',
    },
    {
      id: 3,
      userImage: 'https://reactnative.dev/img/tiny_logo.png',
      name: 'Mark Santiago',
      username: 'Markee',
      rating: 4.5,
      postedAt: 53482,
      isVerified: true,
      isLiked: false,

      postType: 'Service',
      postImage:
        'https://i.pinimg.com/originals/45/7c/16/457c165d41e342f1765e95ac46fb1d9b.jpg',
      postName: '🍔 Wayne’s Burgers and Smoothies!',
      postPrice: 20,
      postServiceAddress: '#8 Kaimito Street',
      postServiceRadius: '1000m',
      postDeliveryMethod: 'Home Service',
    },
    {
      id: 4,
      userImage: 'https://reactnative.dev/img/tiny_logo.png',
      name: 'Mark Santiago',
      username: 'Markee',
      rating: 4.5,
      postedAt: 777482,
      isVerified: true,
      isLiked: false,

      postType: 'Service',
      postImage:
        'https://i.pinimg.com/originals/45/7c/16/457c165d41e342f1765e95ac46fb1d9b.jpg',
      postName: 'Haircut Service every Sat & Sun Haircut Service every Sat',
      postPrice: 20,
      postServiceAddress: '#8 Kaimito Street',
      postServiceRadius: '1000m',
      postDeliveryMethod: 'Home Service',
    },
    {
      id: 5,
      userImage: 'https://reactnative.dev/img/tiny_logo.png',
      name: 'Mark Santiago',
      username: 'Markee',
      rating: 4.5,
      postedAt: 53482,
      isVerified: true,
      isLiked: false,

      postType: 'Service',
      postImage:
        'https://i.pinimg.com/originals/45/7c/16/457c165d41e342f1765e95ac46fb1d9b.jpg',
      postName: '🍔 Wayne’s Burgers and Smoothies!',
      postPrice: 20,
      postServiceAddress: '#8 Kaimito Street',
      postServiceRadius: '1000m',
      postDeliveryMethod: 'Home Service',
    },
    {
      id: 6,
      userImage: 'https://reactnative.dev/img/tiny_logo.png',
      name: 'Mark Santiago',
      username: 'Markee',
      rating: 4.5,
      postedAt: 53482,
      isVerified: true,
      isLiked: false,

      postType: 'Service',
      postImage:
        'https://i.pinimg.com/originals/45/7c/16/457c165d41e342f1765e95ac46fb1d9b.jpg',
      postName: '🍔 Wayne’s Burgers and Smoothies!',
      postPrice: 20,
      postServiceAddress: '#8 Kaimito Street',
      postServiceRadius: '1000m',
      postDeliveryMethod: 'Home Service',
    },
  ];

  const SearchBarWithFilter = () => {
    return (
      <View
        style={[GlobalStyle.rowCenter, {marginHorizontal: 16, marginTop: 16}]}>
        <View style={{flex: 1}}>
          <AppInput label="Start your search" />
        </View>
        <TouchableOpacity onPress={toggleModal}>
          <View style={styles.circleButton}>
            <Filter />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.circleButton}>
            <JarHeart />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const Location = () => {
    return (
      <Animated.View
        style={[
          GlobalStyle.rowCenter,
          {
            marginHorizontal: 16,
            marginVertical: margin,
            height: 34,
            overflow: 'hidden',
          },
          {height: fadeAnim},
        ]}>
        <View style={{flexDirection: 'row'}}>
          <NavigationPinRed width={24} height={24} />
          <View style={{marginLeft: 8}}>
            <AppText>Your location</AppText>
            <AppText>Pioneer Woodlands</AppText>
          </View>
        </View>

        <ScrollView
          horizontal={true}
          style={{marginLeft: 40}}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.locationOption}>
            <NavigationArrow width={16} height={16} />
            <AppText>Nearest</AppText>
          </View>
          <View style={styles.locationOption}>
            <NavigationArrow width={16} height={16} />
            <AppText>Popular</AppText>
          </View>
          <View style={styles.locationOption}>
            <NavigationArrow width={16} height={16} />
            <AppText>NearNear</AppText>
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  const hideLocationComponent = () => {
    console.log('hide location');
    setShowLocation(false);
    setMargin(4);
    fadeOut();
  };

  const showLocationComponent = (event) => {
    setShowLocation(true);
    setMargin(16);
    fadeIn();
  };

  const fadeAnim = useRef(new Animated.Value(34)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 34,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.container}>
          <SearchBarWithFilter />
          <Location />

          <Posts
            data={DummyData}
            hideLocationComponent={hideLocationComponent}
            showLocationComponent={showLocationComponent}
            scrollState={scrollState}
            setScrollState={setScrollState}
          />
        </View>
      </SafeAreaView>
      <Modal
        isVisible={modalState}
        animationIn="slideInRight"
        animationInTiming={1000}
        animationOut="slideOutRight"
        animationOutTiming={1000}
        onSwipeComplete={toggleModal}
        swipeDirection="right"
        style={{
          justifyContent: 'flex-end',
          margin: 0,
          marginLeft: normalize(32),
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={{flex: 1, backgroundColor: 'black'}} />
          </TouchableWithoutFeedback>
        }>
        <FilterSlider />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    // backgroundColor: 'red',
  },
  circleButton: {
    width: 52,
    height: 52,
    borderRadius: 52 / 2,
    // backgroundColor: "green",
    borderWidth: 1,
    borderColor: Colors.neutralGray,
    flexBasis: 52,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primarySalomie,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexDirection: 'row',
  },
});

export default Dashboard;
