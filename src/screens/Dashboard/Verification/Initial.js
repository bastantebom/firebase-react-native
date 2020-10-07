import React, { useState } from 'react'
import {
  Dimensions,
  Button,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
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
  VerifyTick,
} from '@/assets/images/icons';
import { MobileVerification } from './MobileVerification';
import { UploadGovernmentId } from './UploadId';
import { AddAnAddress } from './Address';
import { MobileCode } from './components/MobileCode';

import { useNavigation } from '@react-navigation/native';
import { VerifyMap } from './components/Map';
import { VerifiedAccount } from './VerifiedAccount';
import { ScrollView } from 'react-native-gesture-handler';

export const InitialVerification = ({ toggleMenu, toggleProfile, toggleMobileVerification, toggleUploadId, toggleEmailVerification }) => {
  
  const navigation = useNavigation();
  const [screen, setScreen] = useState('initial');

  const verificationReqs = [
    {
      id: 0,
      title: 'Complete profile information',
      titleDone: 'Completed profile information',
      icon: <Card/>,
      completed: 'pending'
    },
    {
      id: 1,
      title: 'Add and verify mobile number',
      titleDone: 'Mobile number verified',
      icon: <Mobile/>,
      completed: 'pending'
    },
    {
      id: 2,
      title: 'Upload a government ID',
      titleDone: 'Government ID verified',
      icon: <Id/>,
      completed: 'pending'
    },
    {
      id: 3,
      title: 'Add and verify email address',
      titleDone: 'Email address verified',
      icon: <Id/>,
      completed: 'completed'
    },
  ];

  const pending = verificationReqs.filter(item => item.completed === 'pending')
  const pendingCount = pending.length;
  const review = verificationReqs.filter(item => item.completed === 'review')
  const reviewCount = review.length;
  const completed = verificationReqs.filter(item => item.completed === 'completed')
  const completedCount = completed.length;

  return (
    <ScrollView>
      <PaddingView paddingSize={3}>
        <View style={{ marginBottom: 45 }}>
          <TouchableOpacity onPress={toggleMenu}>
            <HeaderBackGray width={normalize(16)} height={normalize(16)}/>
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
        
        { pendingCount !== 0 && <AppText textStyle="subtitle1" customStyle={styles.listHeader}>Pending</AppText> }
        {verificationReqs.map((item) => {
          return ( 
            <View key={item.id}>
              {item.completed === 'pending' && 
                <TouchableOpacity 
                  style={[styles.list, {marginBottom: 28}]} 
                  onPress={
                    item.id === 0 ? 
                      toggleProfile :
                    item.id === 1 ?
                      toggleMobileVerification :
                    item.id === 2 ?
                      toggleUploadId :
                      toggleEmailVerification 
                    }
                  // onPress={onPress}
                >
                  <View style={styles.list}>
                    <View style={{ marginRight: 8 }}>
                      {item.icon}
                    </View>
                    <AppText textStyle="body1">{item.title}</AppText>
                  </View>
                  <ArrowRight/>
                </TouchableOpacity>
              }
            </View>
          )
        })}
          
        { reviewCount !== 0 && <AppText textStyle="subtitle1" customStyle={styles.listHeader}>For Review</AppText> }  
        {verificationReqs.map((item) => {
          return ( 
            <View key={item.id}>
              {item.completed === 'review' && (
                <View style={[styles.list, {marginBottom: 28}]} >
                  <View style={styles.list}>
                    <View style={{ marginRight: 8 }}>
                      {item.icon}
                    </View>
                    <AppText textStyle="body1">{item.title}</AppText>
                  </View>
                </View>
              )}
            </View>
          )
        })}

        { completedCount !== 0 && <AppText textStyle="subtitle1" customStyle={styles.listHeader}>Completed</AppText> }
        {verificationReqs.map((item) => {
          return ( 
            <View key={item.id}>
              {item.completed === 'completed' && (
                <View style={[styles.list, {marginBottom: 28}]} >
                  <View style={styles.list}>
                    <View style={{ marginRight: 8 }}>
                      {item.icon}
                    </View>
                    <AppText textStyle="body1">{item.title}</AppText>
                  </View>
                  <VerifyTick/>
                </View>
              )}
            </View> 
          )
        })}

      </PaddingView> 
    </ScrollView>
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
  listHeader: {
    marginBottom: 15
  },
  list: {
    flexDirection: 'row',
    // marginBottom: 28,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})
