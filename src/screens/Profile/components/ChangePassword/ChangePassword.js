//import liraries
import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {UserContext} from '@/context/UserContext';

import {
  PaddingView,
  ScreenHeaderTitle,
  AppText,
  AppButton,
  TransitionIndicator,
  FloatingAppInput,
  Notification,
} from '@/components';
import {EyeDark, EyeLight, Verified, Close} from '@/assets/images/icons';
import {normalize, Colors} from '@/globals';
//import {TransitionIndicator} from '@/components';
import ProfileInfoService from '@/services/Profile/ProfileInfo';
import {Context} from '@/context';
// create a component
const ChangePassword = ({toggleChangePassword}) => {
  const {user} = useContext(UserContext);
  const {openNotification, closeNotification} = useContext(Context);
  const [cPass, setCPass] = useState(undefined);
  const [nPass, setNPass] = useState(undefined);
  const [fPass, setFPass] = useState(undefined);
  const [IS_UPDATING, setIS_UPDATING] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleg, setIsVisibleg] = useState(false);
  const [isVisiblei, setIsVisiblei] = useState(false);
  const {uid} = user;
  const [notificationMessage, setNotificationMessage] = useState();
  const [notificationType, setNotificationType] = useState();
  const [verified, setVerified] = useState();
  const [showVerified, setShowVerified] = useState(false);
  const [buttonStyle, setButtonStyle] = useState({});
  const [buttonDisable, setButtonDisable] = useState(false);

  const onSaveHandler = () => {
    setIS_UPDATING(true);
    if (cPass && nPass && fPass) {
      if (nPass === fPass) {
        ProfileInfoService.updatePassword(
          {
            current_password: cPass,
            new_password: nPass,
          },
          uid,
        )
          .then((response) => {
            if (response.success) {
              setIS_UPDATING(false);
              triggerNotification(
                'Password has been updated successfully!',
                'success',
              );
            } else {
              setIS_UPDATING(false);
              triggerNotification(response.message, 'error');
              console.log(response);
            }
          })
          .catch((error) => {
            setIS_UPDATING(false);
            //triggerNotification('Password update failed!', 'error');
            console.log(error);
          });
      } else {
        setIS_UPDATING(false);
        triggerNotification(
          "New Password and Confirm Password didn't match",
          'error',
        );
      }
    } else {
      setIS_UPDATING(false);
      triggerNotification(
        'Please complete the form before you can update the your Password',
        'error',
      );
      //console.log('Please complete form');
    }
  };

  const onCurrentPasswordValidate = () => {
    ProfileInfoService.validateCurrentPassword({
      uid: uid,
      current_password: cPass,
    })
      .then((response) => {
        if (response.verified) {
          setVerified(true);
          setShowVerified(true);
          hideIcon();
          setButtonState(false);
        } else {
          triggerNotification('Current Password does not correct', 'error');
          setButtonState(true);
        }
      })
      .catch((error) => {
        setIS_UPDATING(false);
        setVerified(false);
        setShowVerified(true);
        hideIcon();
        setButtonState(true);
      });
  };

  const setButtonState = (j) => {
    if (j) {
      setButtonStyle({
        backgroundColor: Colors.buttonDisable,
        borderColor: Colors.buttonDisable,
      });
    } else {
      setButtonStyle({});
    }
    setButtonDisable(j);
  };

  const triggerNotification = (message, type) => {
    setNotificationType(type);
    setNotificationMessage(
      <AppText
        textStyle="body2"
        customStyle={
          type === 'success' ? notificationText : notificationErrorTextStyle
        }>
        {message}
      </AppText>,
    );
    openNotification();
    //setIsScreenLoading(false);
    closeNotificationTimer();
  };

  const notificationErrorTextStyle = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    color: 'white',
    flexWrap: 'wrap',
  };

  const notificationText = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    flexWrap: 'wrap',
  };

  const closeNotificationTimer = () => {
    setTimeout(() => {
      setNotificationType();
      setNotificationMessage();
      closeNotification();
    }, 5000);
  };

  const hideIcon = () => {
    setTimeout(() => {
      setShowVerified(false);
    }, 5000);
  };

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <TransitionIndicator loading={IS_UPDATING} />

        <View
          style={{
            flex: 1,
            padding: 24,
          }}>
          <Notification message={notificationMessage} type={notificationType} />
          <ScreenHeaderTitle
            title="Current Password"
            close={toggleChangePassword}
          />

          <View style={{position: 'relative'}}>
            <FloatingAppInput
              value={cPass}
              label="Current Password"
              onChangeText={(cPass) => {
                setCPass(cPass);
              }}
              onEndEditing={onCurrentPasswordValidate}
              secureTextEntry={!isVisible ? true : false}
              customStyle={{
                marginTop: normalize(35),
                marginBottom: normalize(16),
              }}
            />
            <View style={styles.passwordToggle}>
              {!showVerified ? (
                <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                  {!isVisible ? <EyeDark /> : <EyeLight />}
                </TouchableOpacity>
              ) : (
                <View style={{paddingTop: normalize(4)}}>
                  {verified ? (
                    <Verified width={normalize(16)} height={normalize(16)} />
                  ) : null}
                </View>
              )}
            </View>
          </View>
          <View style={{position: 'relative'}}>
            <FloatingAppInput
              value={nPass}
              label="New Password"
              onChangeText={(nPass) => {
                setNPass(nPass);
              }}
              customStyle={{marginBottom: normalize(16)}}
              secureTextEntry={!isVisibleg ? true : false}
            />
            <View style={styles.passwordToggleO}>
              <TouchableOpacity onPress={() => setIsVisibleg(!isVisibleg)}>
                {!isVisibleg ? <EyeDark /> : <EyeLight />}
              </TouchableOpacity>
            </View>
          </View>
          <View style={{position: 'relative'}}>
            <FloatingAppInput
              value={fPass}
              label="Confirm New Password"
              onChangeText={(fPass) => {
                setFPass(fPass);
              }}
              secureTextEntry={!isVisiblei ? true : false}
            />
            <View style={styles.passwordToggleO}>
              <TouchableOpacity onPress={() => setIsVisiblei(!isVisiblei)}>
                {!isVisiblei ? <EyeDark /> : <EyeLight />}
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              bottom: 0,
            }}>
            <AppButton
              text="Change Password"
              type="primary"
              height="xl"
              disabled={buttonDisable}
              customStyle={buttonStyle}
              onPress={() => {
                onSaveHandler();
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  passwordToggle: {
    position: 'absolute',
    right: normalize(10),
    top: normalize(48),
  },

  passwordToggleO: {
    position: 'absolute',
    right: normalize(10),
    top: normalize(18),
  },
});

//make this component available to the app
export default ChangePassword;
