import React, { useState, useContext, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions
} from 'react-native'
import { AppInput, PaddingView, AppText, AppButton, FloatingAppInput } from '@/components';
import { Colors, normalize } from '@/globals';
import {
  HeaderBackGray,
  ArrowRight
} from '@/assets/images/icons';
import { VerifyMap } from './components/Map';
import Modal from 'react-native-modal';
import { UserContext } from '@/context/UserContext';

export const EmailVerification = ({back, toggleEmailCode}) => {

  const { userInfo } = useContext(UserContext)

  const { email } = userInfo

  const [error, setError] = useState([]);
  const [emailAddress, setEmailAddress] = useState(email);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: Colors.buttonDisable,
    borderColor: Colors.buttonDisable,
  });
  
  const setButtonState = (j) => {
    if (j) {
      setButtonStyle({
        backgroundColor: Colors.buttonDisable,
        borderColor: Colors.buttonDisable,
      });
    } else {
      setButtonStyle({});
    }
    setButtonDisabled(j);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}  >
      <PaddingView paddingSize={3}>
        <View style={{ justifyContent: 'space-between', height: '100%' }}>
          <View>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={back}
                activeOpacity={0.7}
                style={{position: 'absolute', left: 0 }}
              >
                <HeaderBackGray width={normalize(16)} height={normalize(16)} />
              </TouchableOpacity>
              <AppText textStyle="body3">&nbsp;</AppText>
            </View>
            <AppText 
              textStyle="body1"
              customStyle={{ marginBottom: 8 }}
            >Add and verify email address</AppText>
            <AppText textStyle="body2" color={Colors.contentPlaceholder}>We'll use this email address for notifications, transaction updates, and login help</AppText>
            <FloatingAppInput
              value={emailAddress}
              selectTextOnFocus={false}
              valueHandler={setEmailAddress}
              setError={setError}
              error={error}
              setButtonState={setButtonState}
              label="Email address"
              customStyle={{ marginTop: normalize(35) }}
              keyboardType="email"
              validation={['email']}
            />
          </View>
          <AppButton
            text="Verify"
            type="primary"
            height="xl"
            disabled={buttonDisabled}
            customStyle={{...styles.customButtonStyle, ...buttonStyle}}
            // onPress={() => {
            //   signUpEmail(signUpForm);
            // }}
            // loading={isLoading}
            onPress={toggleEmailCode}
          />
        </View>
      </PaddingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalHeader: {
    // position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 32,
  },
  customInput: {
    marginTop: 40
  }
})