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
import { InitialVerification } from './Initial';

export const VerificationScreen = ({ onPress, menu, toggleMenu, modalBack }) => {
  
  const navigation = useNavigation();
  const [screen, setScreen] = useState('initial');
  // const [status, setStatus] = useState('')
  const [profile, setProfile] = useState(false);
  const [mobileVerification, setMobileVerification] = useState(false);
  const [uploadId, setUploadId] = useState(false);

  const toggleProfile = () => {
    setScreen('profile')
  };

  const toggleMobileVerification = () => {
    setScreen('mobile')
  };

  const toggleUploadId = () => {
    setScreen('governmentId')
  };

  const switchVerificationScreens = ( screen ) => {
    switch (screen) {
      case 'initial':
        return (
          <InitialVerification
            toggleProfile={() => toggleProfile()}
            toggleMobileVerification={() => toggleMobileVerification()}
            toggleUploadId={() => toggleUploadId()}
          />
        );
      case 'profile':
        return (
          <ProfileInformation 
            back={() => setScreen('initial')} 
            toggleAddress={() => setScreen('address')}
          />
        );
      case 'address':
        return <AddAnAddress back={() => setScreen('profile')} />;
      case 'mobile':
        return (
          <MobileVerification 
            back={() => setScreen('initial')} 
            toggleMobileCode={() => setScreen('mobileCode')}
          />
        );
      case 'mobileCode':
        return <MobileCode/>;
      case 'governmentId':
        return (
          <UploadGovernmentId 
            back={() => setScreen('initial')} 
            backToIndex={() => setScreen('initial')}
          />
        )
      default:
        return null;
    }
  }

  return (
    <View style={{ zIndex: 999, position: 'relative' }}>
      <View style={{ width: '100%', justifyContent: 'space-evenly', marginLeft: 15 }}>
        <TouchableOpacity onPress={onPress}>
          <AppText textStyle="body2">Get the verified badge</AppText>
          <AppText textStyle="caption">Short blurb here explaining why</AppText>
        </TouchableOpacity>
      </View>
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
          {switchVerificationScreens(screen)}
        </SafeAreaView> 
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
