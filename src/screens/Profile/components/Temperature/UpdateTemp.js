//import liraries
import React, {useState, useContext} from 'react';
import {
  View,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';

import {
  ScreenHeaderTitle,
  AppText,
  AppButton,
  FloatingAppInput,
  Notification,
} from '@/components';
import {TempHistory, TempAboutScreen} from '@/screens/Profile/components';
import {UserContext} from '@/context/UserContext';

import {Colors, normalize} from '@/globals';
import Modal from 'react-native-modal';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ProfileInfoService from '@/services/Profile/ProfileInfo';
import {Context} from '@/context';

// create a component
const UpdateTemp = ({toggleUpdateTemp}) => {
  const {userInfo, user, setUserInfo} = useContext(UserContext);
  const {temperature_history} = userInfo;
  const [history, setHistory] = useState(false);
  const [tempAbout, setTempAbout] = useState(false);
  const [temp, setTemp] = useState('');
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: Colors.buttonDisable,
    borderColor: Colors.buttonDisable,
  });
  const [buttonDisable, setButtonDisable] = useState(true);
  const [IS_UPDATING, setIS_UPDATING] = useState(false);
  const [copyGuide, setCopyGuide] = useState(false);
  const {openNotification, closeNotification} = useContext(Context);
  const [notificationMessage, setNotificationMessage] = useState();
  const [notificationType, setNotificationType] = useState();

  const toggleHistory = () => {
    setHistory(!history);
  };

  const toggleTempAbout = () => {
    setTempAbout(!tempAbout);
  };

  const onTempChangeHandler = (temp) => {
    if (temp > 0) {
      setButtonState(false);
    } else {
      setButtonState(true);
    }
    setTemp(temp);
  };

  const setButtonState = (j) => {
    //console.log(j);
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

  const updateTempHandler = () => {
    setIS_UPDATING(true);
    ProfileInfoService.updateTemp({
      uid: user.uid,
      temperature: temp,
    })
      .then((response) => {
        if (response.success) {
          setIS_UPDATING(false);
          const nTemp = [...temperature_history];
          nTemp[temperature_history.length] = response.data;
          setUserInfo({
            ...userInfo,
            temperature_history: [...nTemp],
            temperature: response.data,
          });
          setTemp('');
          setButtonState(true);
          triggerNotification(
            'Temperature has been updated successfully!',
            'success',
          );
        } else {
          setIS_UPDATING(false);
          triggerNotification('Temperature update failed!', 'error');
        }
      })
      .catch((error) => {
        setIS_UPDATING(false);
        triggerNotification('Temperature update failed!', 'error');
        console.log(error);
      });
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
    closeNotificationTimer();
  };

  const closeNotificationTimer = () => {
    setTimeout(() => {
      setNotificationType();
      setNotificationMessage();
      closeNotification();
    }, 5000);
  };

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <Notification
          message={notificationMessage}
          type={notificationType}
          top={normalize(30)}
          position="absolute"
        />
        <KeyboardAvoidingView style={{flex: 1, padding: 24}}>
          <ScreenHeaderTitle
            iconSize={16}
            title="Update Body Temperature"
            close={toggleUpdateTemp}
            rightLink="History"
            rightLinkEvent={toggleHistory}
          />
          <View style={{paddingVertical: 24}}>
            <AppText textStyle="body1" customStyle={{paddingBottom: 8}}>
              What’s your body temperature today?
            </AppText>
            <AppText
              textStyle="captionConstant"
              customStyle={{paddingBottom: 8}}>
              We’ll need your help to safeguard the health of both you and your
              customers. Use a temperature scanner or a thermometer to take your
              temperature.
            </AppText>
            <TouchableOpacity
              onPress={toggleTempAbout}
              customStyle={{paddingBottom: 8, marginBottom: 12}}>
              <AppText textStyle="captionConstant" color={Colors.contentOcean}>
                Why we’re asking this?
              </AppText>
            </TouchableOpacity>
            <FloatingAppInput
              value={temp}
              label="Body Temperature"
              keyboardType="number-pad"
              customStyle={{marginTop: 16}}
              onChangeText={(temp) => {
                onTempChangeHandler(temp);
              }}
              onInputFocus={() => {
                setCopyGuide(true);
                //console.log('Focus');
              }}
            />
            {copyGuide ? (
              <AppText textStyle="captionConstant" customStyle={{marginTop: 8}}>
                Body temperature should be in °Celsius
              </AppText>
            ) : null}
          </View>

          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <AppButton
              text="Save"
              type="primary"
              height="xl"
              disabled={buttonDisable}
              customStyle={{...buttonStyle}}
              onPress={() => updateTempHandler()}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal
        isVisible={history}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <TempHistory profileData={userInfo} toggleHistory={toggleHistory} />
      </Modal>

      <Modal
        isVisible={tempAbout}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <TempAboutScreen toggleTempAbout={toggleTempAbout} />
      </Modal>
    </>
  );
};

//make this component available to the app
export default UpdateTemp;
