import React, { useState, useContext, useEffect } from 'react'
import {
  Dimensions,
  Button,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
  SafeAreaView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import Modal from 'react-native-modal';
import { AppText, PaddingView, AppInput, Switch, AppButton, ScreenHeaderTitle, FloatingAppInput } from '@/components';
import { Colors, normalize } from '@/globals';
import {
  HeaderBackGray,
  Calendar,
  ArrowDown
} from '@/assets/images/icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AddAnAddress from './Address';
import { EditProfile } from '@/screens/Profile/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GenderList from '../../Profile/components/EditProfile/Gender';
import { UserContext } from '@/context/UserContext';
import moment from 'moment';

export const ProfileInformation = ({ back, toggleAddress }) => {

  const { userInfo, setUserInfo, user } = useContext(UserContext)

  const [error, setError] = useState([]);

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

  const {
    cover_photo,
    profile_photo,
    display_name,
    full_name,
    username,
    description,
    address,
    email,
    secondary_email,
    phone_number,
    birth_date,
    gender,
  } = userInfo;

  const {uid} = user;

  const [dName, setDName] = useState(display_name ? display_name : full_name);
  const [name, setName] = useState(full_name);
  const [uName, setUName] = useState(username);
  const [em, setEm] = useState(email);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [bDate, setBDate] = useState(birth_date);
  const [g, setG] = useState(gender);

  const [genderVisible, setGenderVisible] = useState(false);
  const [isDefault, setIsDefault] = useState(true);

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const toggleSwitch = () => {
    setIsDefault((previousState) => !previousState);
  };

  const showDatepicker = () => {
    if (show) {
      setShow(false);
    } else {
      Keyboard.dismiss();
      showMode('date');
    }
  };

  const setBirthday = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setBDate(moment.utc(currentDate).add(1, 'day').format('MM/DD/YYYY'));
  };

  const toggleGender = () => {
    setGenderVisible(!genderVisible);
    if (show) setShow(!show);
  };

  const setGenderFromModal = (data) => {
    const tempG =
      data === 'notsay'
        ? 'Rather not say'
        : data === 'female'
        ? 'Female'
        : 'Male';
    setG(tempG);
  };

  return (
    // <EditProfile/>
    <SafeAreaView style={{flex: 1}}>
      <PaddingView paddingSize={3}>
        <ScreenHeaderTitle
          iconSize={16}
          title="Profile Information"
          close={back}
        />
      </PaddingView>
      
      <KeyboardAwareScrollView 
        style={{ backgroundColor: Colors.neutralsZircon }}
        extraScrollHeight={40}
        keyboardOpeningTime={50}
        // enableOnAndroid={true}
      >
        <View 
          style={[
            styles.contentWrapper, 
            { 
              borderTopEndRadius: 0, 
              borderTopStartRadius: 0 
            }
          ]}
        >
          <PaddingView paddingSize={3}>
            <AppText textStyle="body1" customStyle={styles.customHeading}>Public Profile</AppText>
            <FloatingAppInput
              label="Display Name"
              value={dName}
              onChangeText={(dName) => {
                setDName(dName);
              }}
              customStyle={{ marginBottom: normalize(5) }}
            />
            <AppText 
              textStyle="caption" 
              color={Colors.contentPlaceholder}
              customStyle={{ marginBottom: 25 }}
            >
              Help people discover your account by using a name that describes you or your service. This could be the  name of your business, or your nickname. 
            </AppText>
            <AppText 
              textStyle="caption" 
              color={Colors.contentPlaceholder}
              customStyle={{ marginBottom: 16 }}
            >
              You can only change your Display Name twice every 14 days.
            </AppText>
            <FloatingAppInput
              label="Full name"
              value={name}
              onChangeText={(name) => {
                setName(name);
              }}
              customStyle={styles.customInput}
            />
            <FloatingAppInput
              value={uName}
              valueHandler={setUName}
              lowercase={true}
              label="Username"
              customStyle={{marginBottom: normalize(16)}}
              // invalidField={!invalidUser || invalidUserFormat}
              validation={['username']}
              setError={setError}
              error={error}
              setButtonState={setButtonState}
              // onChangeText={(uName) => onChangeUsername(uName)}
            />
            <View style={{ flexDirection: 'row' }}>
              <AppText textStyle="caption" color={Colors.contentPlaceholder}>servbees.com/</AppText>
              <AppText textStyle="caption2" color={Colors.contentPlaceholder}>{username ? username : 'username'}</AppText>
            </View>
            <AppText textStyle="caption" color={Colors.contentPlaceholder}>Only use characters, numbers, and a dot (.)</AppText>
          </PaddingView>
        </View>
        
        <View style={styles.contentWrapper}>
          <PaddingView paddingSize={3}>
            <AppText textStyle="body1" customStyle={styles.customHeading}>Address</AppText>
            <AppText 
              textStyle="body2" 
              color={Colors.contentPlaceholder}
              customStyle={{ marginBottom: 16 }}
            >
              You can save multiple addresses.
            </AppText>
            <TouchableOpacity onPress={toggleAddress}>
              <AppText textStyle="body1" color={Colors.contentOcean}>Add an Address</AppText>
            </TouchableOpacity>
            {/* <Switch onValueChange={toggleSwitch} value={isDefault}/> */}
          </PaddingView>
        </View>
        
        <View style={[styles.contentWrapper, { borderBottomEndRadius: 0, borderBottomStartRadius: 0, marginBottom: 0 }]}>
          <PaddingView paddingSize={3}>
            <AppText textStyle="body1" customStyle={styles.customHeading}>Personal Information</AppText>
            <AppText 
              textStyle="body2" 
              color={Colors.contentPlaceholder}
              customStyle={{ marginBottom: 16 }}
            >
              This won't be part of your public profile
            </AppText>
            <View pointerEvents="none">
              <FloatingAppInput
                // editable={false}
                selectTextOnFocus={false}
                value={em}
                label="Email"
                keyboardType="email-address"
                customStyle={{marginBottom: normalize(16)}}
                onChangeText={(em) => {
                  setEm(em);
                }}
                validation={['email']}
              />
            </View>
            <View style={{position: 'relative'}}>
              <View pointerEvents="none">
                <FloatingAppInput
                  value={bDate}
                  label="Birthday"
                  customStyle={{marginBottom: normalize(16)}}
                  onFocus={showDatepicker}
                  // editable={false}
                />
              </View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 12,
                  right: 12,
                }}
                onPress={showDatepicker}>
                <View>
                  <Calendar height={normalize(24)} width={normalize(24)} />
                </View>
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  value={date}
                  mode={mode}
                  display="default"
                  onChange={setBirthday}
                />
              )}
            </View>
            <View style={{position: 'relative'}}>
              <View pointerEvents="none">
                <FloatingAppInput
                  value={g}
                  label="Gender"
                  onFocus={toggleGender}
                  customStyle={{marginBottom: normalize(16)}}
                  // editable={false}
                />
              </View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 12,
                  right: 12,
                }}
                onPress={toggleGender}>
                <View>
                  <ArrowDown height={normalize(24)} width={normalize(24)} />
                </View>
              </TouchableOpacity>
            </View>
            <AppButton
              text="Verify"
              type="Save"
              height="xl"
              disabled={buttonDisabled}
              customStyle={{...styles.customButtonStyle, ...buttonStyle}}
              // onPress={() => {
              //   signUpEmail(signUpForm);
              // }}
              // loading={isLoading}
              onPress={() => null}
          />
          </PaddingView>
        </View>
      </KeyboardAwareScrollView>
      <Modal
        isVisible={genderVisible}
        animationIn="slideInUp"
        animationInTiming={500}
        animationOut="slideOutDown"
        animationOutTiming={500}
        onSwipeComplete={toggleGender}
        swipeDirection="down"
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={toggleGender}>
            <View style={{flex: 1, backgroundColor: 'black'}} />
          </TouchableWithoutFeedback>
        }>
        <View>
          <GenderList
            toggleGender={toggleGender}
            setGenderValue={(pGender) => setGenderFromModal(pGender)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalHeader: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 32,
  },
  customInput: {
    marginBottom: normalize(16),

  },
  customHeading: {
    marginBottom: normalize(18)
  },
  contentWrapper: {
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 15,
    marginBottom: 8
  }
})