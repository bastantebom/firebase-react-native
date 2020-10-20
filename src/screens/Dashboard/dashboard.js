import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
  Keyboard
} from 'react-native';

import {
  Posts,
  AppInput,
  AppText,
  WhiteOpacity,
  Notification,
  FloatingAppInput
} from '@/components';
import FilterSlider from './components/FilterSlider';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import {
  Filter,
  JarHeart,
  FilterDark,
  JarHeartDark,
  NavigationArrow,
  NavigationPin,
  NavigationPinRed,
  CloseDark, 
  FilterServices,
  JarHeartColored,
  NavigationPinAlt
} from '@/assets/images/icons';
import {GlobalStyle, Colors, normalize} from '@/globals';

import Modal from 'react-native-modal';
import { Context } from '@/context';
import { UserContext } from '@/context/UserContext';
import LocationMap from '@/screens/Dashboard/components/Location';
import {VerificationScreen} from '@/screens/Dashboard/Verification';

import SearchBox from './components/Search/Searchbox';
import SearchResults from './components/Search/SearchResults';
import { ease } from 'react-native/Libraries/Animated/src/Easing';

const { height, width } = Dimensions.get('window');

function Dashboard() {

  const { user } = useContext(UserContext);

  const [modalState, setModalState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [animateLocationBar, setAnimateLocationBar] = useState(0);

  const { posts } = useContext(Context);

  const toggleModal = () => {
    setModalState(!modalState);
  };

  const [menu, setMenu] = useState(false);

  const toggleMenu = () => {
    setMenu(!menu);
  };

  const handleScroll = (event) => {
    setAnimateLocationBar(event.nativeEvent.contentOffset.y)
  }

  const [scrollY] = useState(new Animated.Value(0))

  return (
    <>
      <SafeAreaView style={styles.safeAreaContainer}>
        {/* ---- Verification Notification ---- */}
        { user && 
          <Notification
            message={
              <VerificationScreen
                onPress={() => toggleMenu()}
                menu={menu}
                toggleMenu={() => toggleMenu()}
                modalBack={() => setMenu(false)}
              />
            }
            type={'verified'}
            position="relative"
            verification
          />
        }
        {/* ---- Verification Notification ---- */}
      
        <View style={styles.container}>
          <SearchBarWithFilter 
            toggleFilter={toggleModal} 
            animateLocationBar={animateLocationBar}
            scrollY={scrollY}
          />
          <Animated.ScrollView
            // onScroll={handleScroll}
            // contentContainerStyle={{
            //   paddingTop: normalize(100),
            // }}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: { contentOffset: { y: scrollY } }
                }
              ],
              {
                useNativeDriver: true  // <- Native Driver used for animated events
              }
            )}
            scrollEventThrottle={16}
          >
            <Posts
              type="dashboard"
              data={posts}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              // headerComponent={<LocationSearch/>}
            />
          </Animated.ScrollView>
        </View>
        <WhiteOpacity />
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
        <FilterSlider modalToggler={toggleModal} />
      </Modal>
    </>
  );
}


const SearchBarWithFilter = ({ toggleFilter, animateLocationBar, scrollY }) => {
  
  const SHOW_HEIGHT = normalize(20);
  const HIDE_HEIGHT = 0;

  const { searchType, setPage } = useContext(Context)

  const [opacity] = useState(new Animated.Value(0));
  const [locationBarHeight] = useState(new Animated.Value(SHOW_HEIGHT));
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const [likedPosts, setLikedPosts] = useState(false);

  const [searchValue, setSearchValue] = useState()

  const onValueChange = (value) => {
    setSearchValue(value)
  }

  const toggleLike = () => {
    setLikedPosts(!likedPosts)
  }

  const onFocus = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 10,
        useNativeDriver: true
      })
    ]).start();
    setSearchBarFocused(true);
  }

  const onBackPress = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 10,
        useNativeDriver: true
      })
    ]).start();
    setSearchBarFocused(false);
    Keyboard.dismiss();
    setPage(0);
  }

  var headMov = scrollY.interpolate({
    inputRange: [0, 180, 181],
    outputRange: [0, -180, -180]
  });

  var barOpacity = scrollY.interpolate({
    inputRange: [0, 30, 50],
    outputRange: [1, 0, 0]
  });

  var barHeight = scrollY.interpolate({
    inputRange: [0, 180, 181],
    outputRange: [0, -180, -180],
  });

  return (
    <View>
      <LinearGradient colors={['#ECEFF8', '#F8F9FC']} style={{ position: 'relative' }}>
        <Animated.View style={{ 
          margin: 16, 
          height: searchType === 'posts' ? normalize(47.5) : normalize(107),
          // transform: [{ translateY: barHeight }]
        }}>
          <View style={{ flexDirection: 'row', width: '100%', marginBottom: 12 }}>
            <View 
              style={{ 
                flex: 1, 
                height: searchType !== 'posts' ? normalize(100) : '100%', 
                // backgroundColor: 'red'
                // paddingBottom: 16
              }}
            >
              <SearchBox
                onSearchFocus={onFocus} 
                onBackPress={onBackPress}
                valueHandler={onValueChange}
              />
              <Animated.View 
                style={{ 
                  opacity: opacity, 
                  display: searchBarFocused ? 'flex' : 'none',
                  zIndex: searchBarFocused ? 1 : 0,
                  flex: 1,
                  position: 'absolute',
                }}
              >
                <SearchResults 
                  onValueChange={searchValue}
                />
              </Animated.View>
            </View>
            { searchBarFocused ? 
              <View style={{ marginTop: normalize(47.5)}}/> 
              : <View style={{ flexDirection: 'row', opacity: searchBarFocused ? 0 : 1 }}>
                <TouchableOpacity activeOpacity={.7} onPress={toggleFilter}>
                  <View style={styles.circleButton}>
                    <FilterDark />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.7} onPress={toggleLike}>
                  <View style={styles.circleButton}>
                    { likedPosts ? <JarHeartColored/> : <JarHeartDark /> }
                    {/* <JarHeart />  */}
                  </View>
                </TouchableOpacity>
              </View>
            }
          </View>
        </Animated.View>
        <Animated.View 
          style={{ 
            display: searchBarFocused ? 'none' : 'flex',
            // position: "absolute",
            // height: {
            //   transform: [{
            //     translateY: barHeight
            //   }]
            // },
            width: width,
            // top: normalize(90),
            // backgroundColor: headColor,
            transform: [{ translateY: headMov }],
            opacity: barOpacity
          }}
        >
          <LocationSearch />
        </Animated.View>
      </LinearGradient>
      <View
        style={{
          borderBottomColor: 'rgba(0,0,0,.5)',
          borderBottomWidth: StyleSheet.hairlineWidth,
          opacity: .1,
          // height: 1,
          elevation: 3,
        }}
      />
    </View>
  );
};

const LocationSearch = () => {
  const scrollRef = useRef();
  const {setLocationFilter, locationFilter} = useContext(Context);
  const [showLocation, setShowLocation] = useState(false);

  const { userInfo } = useContext(UserContext);
  // const {address} = userInfo;

  changeFromMapHandler = async (fullAddress) => {
    setLocationFilter(fullAddress.city);
  };

  return (
    <>
      <View style={{ marginLeft: 16, marginBottom: 16 }}>
        <View style={GlobalStyle.rowCenter}>
          <View 
            style={{ 
              paddingLeft: normalize(40), 
              paddingRight: normalize(15), 
              // marginRight: normalize(10), 
              maxWidth: '60%',
              minWidth: '60%' 
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowLocation(true);
              }}>
              <View>
                <AppText textStyle="caption" color={Colors.contentPlaceholder}>Your location</AppText>
              </View>
            </TouchableOpacity>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.primaryAliceBlue,
                flexDirection: 'row',
                // flex: 1,
                justifyContent: 'space-between',
                width: '100%'
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowLocation(true);
                }}
                style={{ marginRight: normalize(25) }}
              >
                <View style={{paddingVertical: normalize(1)}}>
                  <AppText
                    textStyle="body3"
                    color={Colors.primaryMidnightBlue}
                    // customStyle={{ marginRight: normalize(22) }}
                    numberOfLines={1}
                  >
                    {locationFilter}
                  </AppText>
                </View>
              </TouchableOpacity>
              {locationFilter ? (
                <TouchableOpacity
                  onPress={() => {
                    setLocationFilter(null);
                  }}
                  // style={{width: '10%'}}
                  style={{ 
                    paddingVertical: normalize(4), 
                    right: normalize(0), 
                    position: 'absolute', 
                    zIndex: 999
                  }}
                >
                  <CloseDark height={normalize(16)} />
                </TouchableOpacity>
              ) : null}
            </View>
            <View
              style={{
                position: 'absolute',
                top: '50%',
                marginTop: normalize(-12),
                left: 4,
              }}>
              <NavigationPinAlt width={normalize(24)} height={normalize(24)} />
            </View>
          </View>
          <ScrollView
            // ref={scrollRef}
            horizontal={true}
            style={{}}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.locationOption}>
              <NavigationArrow width={normalize(16)} height={normalize(16)} />
              <AppText 
                textStyle="eyebrow2"
                customStyle={{
                  marginLeft: 5,
                  fontFamily: 'RoundedMplus1c-Medium'
                }}
              >
                Nearest
              </AppText>
            </View>
            <View style={styles.locationOption}>
              <FilterServices width={16} height={16} />
              <AppText 
                textStyle="eyebrow2"
                customStyle={{
                  marginLeft: 5,
                  fontFamily: 'RoundedMplus1c-Medium'
                }}
              >
                Services
              </AppText>
            </View>
            <View style={styles.locationOption}>
              <NavigationArrow width={16} height={16} />
              <AppText 
                textStyle="eyebrow2"
                customStyle={{
                  marginLeft: 5,
                  fontFamily: 'RoundedMplus1c-Medium'
                }}
              >
                Sellers
              </AppText>
            </View>
            {/* <View style={styles.locationOption}>
              <NavigationArrow width={16} height={16} />
              <AppText>Needs</AppText>
            </View>
            <View style={styles.locationOption}>
              <NavigationArrow width={16} height={16} />
              <AppText>Popular</AppText>
            </View> */}
          </ScrollView>
        </View>

        <Modal
          isVisible={showLocation}
          animationIn="slideInRight"
          animationInTiming={750}
          animationOut="slideOutRight"
          animationOutTiming={750}
          onBackButtonPress={() => setShowLocation(false)}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          <LocationMap
            address={
              userInfo.address
                ? {
                    latitude: userInfo.address.latitude,
                    longitude: userInfo.address.longitude,
                  }
                : {latitude: 14.5831, longitude: 120.9794}
            }
            back={() => setShowLocation(false)}
            changeFromMapHandler={(fullAddress) =>
              changeFromMapHandler(fullAddress)
            }
          />
        </Modal>
      </View>
      {/* <View
        style={{
          // borderBottomColor: '#E5E5E5',
          // borderBottomWidth: StyleSheet.hairlineWidth,
          height: StyleSheet.hairlineWidth,
          elevation: 2
        }}
      /> */}
    </>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    // flex: 1,
    // flexGrow: 1,
    // height: '100%',
    backgroundColor: 'white',
    // backgroundColor: 'red',
  },
  circleButton: {
    width: 52,
    height: 52,
    borderRadius: 52 / 2,
    // backgroundColor: "green",
    // borderWidth: 1,
    // borderColor: Colors.neutralGray,
    backgroundColor: Colors.neutralsWhite,
    flexBasis: 52,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationOption: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: Colors.primarySalomie,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexDirection: 'row',
  },
});

export default Dashboard;
