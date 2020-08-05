//import liraries
import React, {useRef, useState, useContext} from 'react';
import {View, TextInput, StyleSheet, Keyboard} from 'react-native';
import AppColor from '@/globals/Colors';
import {useNavigation} from '@react-navigation/native';
import VerifyIcon from '@/assets/images/verify.svg';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {Context} from '@/context';

import {AppText, TransitionIndicator, Notification} from '@/components';
import VerifyService from '@/services/VerifyService';

// create a component
const VerifyAccount = (route) => {
  const {openNotification, closeNotification} = useContext(Context);
  const navigation = useNavigation();
  //const verify = route.params;
  const firstTextInput = useRef(null);
  const secondTextInput = useRef(null);
  const thirdTextInput = useRef(null);
  const fourthTextInput = useRef(null);

  const [notificationMessage, setNotificationMessage] = useState();
  const [notificationType, setNotificationType] = useState();

  const [inputStyle, setInputStyle] = useState([]);
  const [verifyArray, setVerifyArray] = useState(['', '', '', '']);

  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const onVerifyChange = (index) => {
    return (value) => {
      if (isNaN(Number(value))) {
        // do nothing when a non digit is pressed
        return;
      }
      const verifyArrayCopy = verifyArray.concat();
      verifyArrayCopy[index] = value;
      setVerifyArray(verifyArrayCopy);

      const inputStyleCopy = inputStyle.concat();
      inputStyleCopy[index] = {borderColor: AppColor.contentOcean};
      setInputStyle(inputStyleCopy);
      //setInputState[index] = true;

      // auto focus to next InputText if value is not blank
      if (value !== '') {
        sendVerification(verifyArrayCopy);
        if (index === 0) {
          secondTextInput.current.focus();
        } else if (index === 1) {
          //secondTextInput.current.style.borderColor = AppColor.contentOcean;
          thirdTextInput.current.focus();
        } else if (index === 2) {
          //thirdTextInput.current.style.borderColor = AppColor.contentOcean;
          fourthTextInput.current.focus();
        } else if (index === 3) {
          //fourthTextInput.current.style.borderColor = AppColor.contentOcean;
          Keyboard.dismiss();
          //navigation.navigate('Dashboard');
          //console.log();
        }
      }
    };
  };

  const onVerifyKeyPress = (index) => {
    return ({nativeEvent: {key: value}}) => {
      // auto focus to previous InputText if value is blank and existing value is also blank
      if (value === 'Backspace' && verifyArray[index] === '') {
        const inputStyleCopy = inputStyle.concat();
        inputStyleCopy[index] = {borderColor: AppColor.contentEbony};
        setInputStyle(inputStyleCopy);

        if (index === 1) {
          firstTextInput.current.focus();
        } else if (index === 2) {
          secondTextInput.current.focus();
        } else if (index === 3) {
          thirdTextInput.current.focus();
        } else {
          Keyboard.dismiss();
          //alert('Backspace');
        }

        /**
         * clear the focused text box as well only on Android because on mweb onOtpChange will be also called
         * doing this thing for us
         * todo check this behaviour on ios
         */
        if (index > 0) {
          const verifyArrayCopy = verifyArray.concat();
          verifyArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
          setVerifyArray(verifyArrayCopy);
        }
      }
    };
  };

  const sendVerification = (code) => {
    if (code.join('').length === 4) {
      const nCode = parseInt(code.join(''));
      setIsScreenLoading(true);
      //console.log('SEND VERIFICATION');
      //console.log(route?.route?.params?.uid);
      //console.log(nCode);

      VerifyService.verifyCode({
        uid: route?.route?.params?.uid,
        verification_code: nCode,
      })
        .then((response) => {
          if (response.success) {
            setIsScreenLoading(false);
            //auth()
            //  .signInWithCustomToken(response.custom_token)
            //  .then(() => {
            navigation.push('AlmostThere', {
              ...{
                uid: route?.route?.params?.uid,
                custom_token: response.custom_token,
              },
            });
            //  })
            // .catch((err) => {
            //   console.log(err);
            // });
          }
        })
        .catch((error) => {
          setIsScreenLoading(false);
          console.log('With Error in the API SignUp ' + error);
        });
    } else {
      return;
    }
  };

  const closeNotificationTimer = () => {
    setTimeout(() => {
      closeNotification();
    }, 5000);
  };

  const resendCodeHandler = () => {
    setIsScreenLoading(true);
    if (route?.route?.params?.login) {
      var newProvider = route?.route?.params?.login;
      var providerText = 'mobile';
      if (isNaN(parseInt(newProvider.substr(newProvider.length - 5)))) {
        providerText = 'email';
      }
    }
    VerifyService.resendCode({
      uid: route?.route?.params?.uid,
      provider: providerText,
    })
      .then((response) => {
        if (response.success) {
          setNotificationType('success');
          setNotificationMessage(
            <AppText textStyle="body2" customStyle={notificationText}>
              Verification code has been sent to your {providerText}{' '}
              {route?.route?.params?.login}
            </AppText>,
          );
          openNotification();
          setIsScreenLoading(false);
          closeNotificationTimer();
          //alert('Code has been sent');
        } else {
          setNotificationType('error');
          setNotificationMessage(
            <AppText textStyle="body2" customStyle={notificationErrorTextStyle}>
              Failed resend verification code {providerText}{' '}
              {route?.route?.params?.login}
            </AppText>,
          );
          openNotification();
          setIsScreenLoading(false);
          closeNotificationTimer();
        }
      })
      .catch((error) => {
        setNotificationType('error');
        setNotificationMessage(
          'Failed verification ' +
            providerText +
            ' ' +
            route?.route?.params?.login,
        );
        openNotification();
        setIsScreenLoading(false);
        closeNotificationTimer();
        //console.log('With Error in the API SignUp ' + error);
      });
  };

  const notificationErrorTextStyle = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    color: 'white',
  };

  const notificationText = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  };

  return (
    <View style={styles.container}>
      <Notification message={notificationMessage} type={notificationType} />
      <TransitionIndicator loading={isScreenLoading} />
      <View style={styles.defaultStyle}>
        <VerifyIcon />
      </View>
      <View style={{...styles.defaultStyle, ...styles.spacingBottom}}>
        <AppText textStyle="display5">Enter Your Verification</AppText>
      </View>
      <View style={{...styles.defaultStyle, ...styles.spacingBottomx2}}>
        <AppText textStyle="body2" customStyle={styles.bodyContent}>
          An email with the 4-digit code has been sent to{' '}
          <AppText textStyle="body3" customStyle={styles.bodyContent}>
            {route?.route?.params?.login.toLowerCase()}
          </AppText>
        </AppText>
      </View>

      <View style={{...styles.verificationWrapper, ...styles.spacingBottomx4}}>
        {[firstTextInput, secondTextInput, thirdTextInput, fourthTextInput].map(
          (textInputRef, index) => (
            <TextInput
              style={{
                ...styles.inputVerification,
                ...(index === 0
                  ? styles.resetMarginLeft
                  : index === 3
                  ? styles.resetMarginRight
                  : null),
                ...inputStyle[index],
              }}
              keyboardType={'number-pad'}
              maxLength={1}
              onChangeText={onVerifyChange(index)}
              onKeyPress={onVerifyKeyPress(index)}
              autoFocus={index === 0 ? true : undefined}
              ref={textInputRef}
              value={verifyArray[index]}
              key={index}
            />
          ),
        )}
      </View>

      <View style={{...styles.defaultStyle, ...styles.spacingBottom}}>
        <AppText textStyle="body2" customStyle={styles.bodyContent}>
          Didn’t receive a code?
        </AppText>
      </View>
      <TouchableOpacity
        customStyle={styles.defaultStyle}
        onPress={() => {
          resendCodeHandler();
          //navigation.navigate('Dashboard', 'Jayson Ilagan');
        }}>
        <AppText
          textStyle="body2"
          customStyle={{...styles.bodyContent, ...styles.contentColorOverride}}>
          Resend code
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.neutralsWhite,
    padding: 24,
    paddingTop: 96,
  },

  bodyContent: {
    textAlign: 'center',
  },

  spacingBottom: {
    marginBottom: 8,
  },

  spacingBottomx2: {
    marginBottom: 16,
  },

  spacingBottomx4: {
    marginBottom: 32,
  },

  timerWrapper: {
    //flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  timerText: {
    textAlign: 'right',
  },

  verificationWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  inputVerification: {
    flex: 1,
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 4,
    fontSize: 40,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    marginRight: 8,
    marginLeft: 8,
    borderColor: AppColor.contentEbony,
  },

  resetMarginLeft: {
    marginLeft: 0,
  },

  resetMarginRight: {
    marginRight: 0,
  },

  defaultStyle: {
    alignItems: 'center',
  },

  contentColorOverride: {
    color: AppColor.contentOcean,
  },
});

//make this component available to the app
export default VerifyAccount;
