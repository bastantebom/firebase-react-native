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
import { VerifyCode } from './components/VerifyCode';
import { EmailVerification } from './EmailVerification';

import { useNavigation } from '@react-navigation/native';
import { VerifyMap } from './components/Map';
import { VerifiedAccount } from './VerifiedAccount';
import { ScrollView } from 'react-native-gesture-handler';
import { InitialVerification } from './Initial';
import { PendingVerification } from './PendingVerification';

export const VerificationScreen = ({ onPress, menu, toggleMenu, modalBack }) => {
  
  const navigation = useNavigation();
  const [screen, setScreen] = useState('initial');
  // const [status, setStatus] = useState('')
  const [profile, setProfile] = useState(false);
  const [mobileVerification, setMobileVerification] = useState(false);
  const [uploadId, setUploadId] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [provider, setProvider] = useState('')
  const [providerText, setProviderText] = useState('')

  const toggleProfile = () => {
    setScreen('profile')
  };

  const toggleMobileVerification = () => {
    setScreen('mobile')
  };

  const toggleUploadId = () => {
    setScreen('governmentId')
  };

  const toggleEmailVerification = () => {
    setScreen('email')
  };

  const toggleMobile = (mobile) => {
    setScreen('verifyCode')
    setProvider(mobile)
    setProviderText('mobile')
  }

  const toggleEmail = (emailAddress) => {
    setScreen('verifyCode')
    setProvider(emailAddress)
    setProviderText('email')
  }

  const switchVerificationScreens = ( screen ) => {
    switch (screen) {
      case 'initial':
        return (
          <InitialVerification
            toggleProfile={() => toggleProfile()}
            toggleMobileVerification={() => toggleMobileVerification()}
            toggleUploadId={() => toggleUploadId()}
            toggleEmailVerification={() => toggleEmailVerification()}
            toggleMenu={modalBack}
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
            toggleMobileCode={toggleMobile}
          />
        );
      case 'email':
        return (
          <EmailVerification 
            back={() => setScreen('initial')} 
            toggleEmailCode={toggleEmail}
          />
        );
      case 'verifyCode':
        return <VerifyCode provider={provider} providerText={providerText} />;
      case 'governmentId':
        return (
          <UploadGovernmentId 
            back={() => setScreen('initial')} 
            // backToIndex={() => setScreen('initial')}
            confirmPhotoId={() => setScreen('pendingVerification')}
          />
        );
      case 'pendingVerification':
        return (
          <PendingVerification 
            goToDashboard={toggleMenu}
            reviewVerification={() => setScreen('initial')}
          />
        );
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
        animationIn="slideInRight"
        animationInTiming={500}
        animationOut="slideOutRight"
        animationOutTiming={500}
        onSwipeComplete={toggleMenu}
        // swipeDirection="down"
        onBackButtonPress={modalBack}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {switchVerificationScreens(screen)}
          {/* <VerifiedAccount/> */}
          {/* <PendingVerification/> */}
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
