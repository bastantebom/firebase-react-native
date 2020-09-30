import React, {useState, useContext, useEffect} from 'react';
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

import {
  Filter,
  JarHeart,
  NavigationArrow,
  NavigationPin,
  NavigationPinRed,
  CloseDark, 
  FilterServices
} from '@/assets/images/icons';
import {GlobalStyle, Colors, normalize} from '@/globals';

import Modal from 'react-native-modal';
import {Context} from '@/context';
import {UserContext} from '@/context/UserContext';
import LocationMap from '@/screens/Dashboard/components/Location';
import {VerificationScreen} from '@/screens/Dashboard/Verification';
// import {PostService} from '@/services';
// import Geocoder from 'react-native-geocoding';
// import Config from '@/services/Config';

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, connectSearchBox } from 'react-instantsearch-native';
// import { InstantSearch } from 'react-instantsearch-native';
import SearchBox from './components/Search/Searchbox';
import InfiniteHits from './components/Search/InfiniteHits';
import RefinementList from './components/Search/RefinementList';
import SearchResults from './components/Search/SearchResults';

function Dashboard() {
  const [modalState, setModalState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // const {openNotification} = useContext(Context);

  const {posts} = useContext(Context);

  const toggleModal = () => {
    setModalState(!modalState);
  };

  const [menu, setMenu] = useState(false);

  const toggleMenu = () => {
    setMenu(!menu);
  };

  // useEffect(() => {
  //   openNotification();
  // })

  return (
    <>
      <SafeAreaView style={styles.safeAreaContainer}>
        {/* ---- Verification Notification ---- */}
          {/* <Notification
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
          /> */}
        {/* ---- Verification Notification ---- */}
      
        <View style={styles.container}>
          <SearchBarWithFilter toggleFilter={toggleModal} />
          <Posts
            type="dashboard"
            data={posts}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
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

const SearchBarWithFilter = ({ toggleFilter }) => {

  const [opacity] = useState(new Animated.Value(0))
  const [searchBarFocused, setSearchBarFocused] = useState(false)

  const [searchValue, setSearchValue] = useState()

  const onValueChange = (value) => {
    setSearchValue(value)
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
    // setSearchType('posts')
    Keyboard.dismiss();
  }
  
  const searchClient = algoliasearch(
    "B3KXWHT843",
    "93f6a8ef9601c3c4da65687477a81833"
  );

  return (
    <View style={{ marginHorizontal: 16, marginVertical: 16 }}>
      <View style={{ flexDirection: 'row', width: '100%', marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <InstantSearch searchClient={searchClient} indexName="posts">
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
          </InstantSearch>
        </View>
        { searchBarFocused ? 
          <View style={{ marginTop: normalize(47.5)}}/> 
          : <View style={{ flexDirection: 'row', opacity: searchBarFocused ? 0 : 1 }}>
            <TouchableOpacity onPress={toggleFilter}>
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
        }
      </View>
      <LocationSearch />
    </View>
  );
};

const LocationSearch = () => {
  const {setLocationFilter, locationFilter} = useContext(Context);
  const [showLocation, setShowLocation] = useState(false);

  const {userInfo} = useContext(UserContext);
  // const {address} = userInfo;

  changeFromMapHandler = async (fullAddress) => {
    setLocationFilter(fullAddress.city);
  };

  return (
    <>
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
              <AppText textStyle="caption">Your location</AppText>
            </View>
          </TouchableOpacity>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.primaryMidnightBlue,
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
            <NavigationPinRed width={normalize(24)} height={normalize(24)} />
          </View>
        </View>
        <ScrollView
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
    borderWidth: 1,
    borderColor: Colors.neutralGray,
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
