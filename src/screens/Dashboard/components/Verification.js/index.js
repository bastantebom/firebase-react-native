import React, { useState } from 'react'
import {
  Dimensions,
  Button,
  View
} from 'react-native'
import Modal from 'react-native-modal';
import { AppText } from '@/components';
import InitialVerification from './InitialScreen';
import { ProfileInformation } from './ProfileInformation';

export const VerificationScreen = ({ onPress, menu, toggleMenu, modalBack }) => {

  // const [menu, setMenu] = useState(true);
  
  // const toggleMenu = () => {
  //   setMenu(!menu);
  // };

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
        {/* <InitialVerification/> */}
        <ProfileInformation/>
      </Modal>
    </View>
  )
}