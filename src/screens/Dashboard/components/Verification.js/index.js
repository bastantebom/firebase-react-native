import React, { useState } from 'react'
import {
  Dimensions,
  Button,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  ScrollView,
  SectionList
} from 'react-native'
import { ProfileInformation } from './ProfileInformation';
import Modal from 'react-native-modal';
import { AppText, PaddingView } from '@/components';
import { Colors, normalize } from '@/globals';
import {
  Verified,
  HeaderBackGray,
  Card,
  Mobile,
  Id,
  ArrowRight,
  VerifyTick
} from '@/assets/images/icons';

export const VerificationScreen = ({ onPress, menu, toggleMenu, modalBack }) => {

  const verificationReqs = [
    {
      id: 0,
      title: 'Complete profile information',
      titleDone: 'Completed profile information',
      icon: <Card/>,
      route: 'profile',
      // completed: false
    },
    {
      id: 1,
      title: 'Add and verify mobile number',
      titleDone: 'Mobile number verified',
      icon: <Mobile/>,
      route: 'profile',
      // completed: false
    },
    {
      id: 2,
      title: 'Upload a government ID',
      titleDone: 'Government ID verified',
      icon: <Id/>,
      route: 'profile',
      // completed: false
    },
    {
      id: 3,
      title: 'Add and verify email address',
      titleDone: 'Email address verified',
      icon: <Id/>,
      route: 'profile',
      // completed: true
    },
  ];

  const [profile, setProfile] = useState(false);

  const toggleProfile = () => {
    setProfile(!profile);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.list, {marginBottom: 28}]} 
      // onPress={() => setScreen(item.route)}
      onPress={toggleProfile}
    >
      <View style={styles.list}>
        <View style={{ marginRight: 8 }}>
          {item.icon}
        </View>
        <AppText textStyle="body1">{item.title}</AppText>
      </View>
      <ArrowRight/>
    </TouchableOpacity>
  );

  return (
    <View style={{ zIndex: 999, position: 'relative' }}>
      <Button
        title="toggle verification"
        onPress={onPress}
      />
      <Modal
        isVisible={menu}
        animationIn="slideInUp"
        animationInTiming={750}
        animationOut="slideOutDown"
        animationOutTiming={750}
        onSwipeComplete={toggleMenu}
        swipeDirection="down"
        onBackButtonPress={modalBack}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* <ScrollView> */}
          <PaddingView paddingSize={3}>
            <View style={{ marginBottom: 45 }}>
              <TouchableOpacity onPress={toggleMenu}>
                <HeaderBackGray width={normalize(16)} height={normalize(16)} on/>
              </TouchableOpacity>
            </View>
            <Verified width={normalize(28)} height={normalize(32)} />
            <View style={styles.headingWrapper}>
              <AppText textStyle="display6">Get the verified badge</AppText>
              <View style={styles.badgeContainer}>
                <AppText textStyle="price" color={Colors.neutralsWhitesmoke}>1 of 4</AppText>
              </View>
            </View>
            <AppText 
              textStyle="body2" 
              color={Colors.contentPlaceholder}
              customStyle={{ marginBottom: 24 }}
            >
              Complete your profile and verify youridentity for a better Servbees experience!
            </AppText>
            <FlatList
              data={verificationReqs}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              ListHeaderComponent={<AppText textStyle="subtitle1" customStyle={{ marginBottom: 20 }}>Pending</AppText>}
            />
          </PaddingView>
          {/* </ScrollView> */}
        </SafeAreaView> 
      </Modal>
      <Modal
        isVisible={profile}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        onSwipeComplete={toggleProfile}
        swipeDirection="right"
        onBackButtonPress={() => setProfile(false)}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}
      >
        <ProfileInformation profileBack={() => setProfile(false)} />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  headingWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 15
  },
  badgeContainer: {
    backgroundColor: Colors.checkboxBorderDefault,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  list: {
    flexDirection: 'row',
    // marginBottom: 28,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})