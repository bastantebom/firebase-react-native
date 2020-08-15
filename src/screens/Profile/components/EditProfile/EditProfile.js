//import liraries
import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  ScreenHeaderTitle,
  PaddingView,
  AppButton,
  AppInput,
  AppText,
  ProfileImageUpload,
} from '@/components';

import {CoverPhoto} from '@/assets/images';
import {ArrowRight, ArrowDown, Calendar} from '@/assets/images/icons';

import {Colors, normalize} from '@/globals';
import EditAddress from './EditAddress';
import GenderList from './Gender';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {UserContext} from '@/context/UserContext';
import Geocoder from 'react-native-geocoding';
import Config from '@/services/Config';
import moment from 'moment';
import FloatingAppInput from '@/components/AppInput/FloatingAppInput';

// create a component
const EditProfile = ({toggleEditProfile, toggleMenu}) => {
  const [map, setMap] = useState(false);
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [genderVisible, setGenderVisible] = useState(false);
  const {userInfo, userDataAvailable, setUserInfo} = useContext(UserContext);
  const [buttonStyle, setButtonStyle] = useState({});
  const [buttonDisable, setButtonDisable] = useState(false);
  //const [upatedInfo, setUpdate]

  const {
    display_name,
    full_name,
    username,
    description,
    address_name,
    address_details,
    address_note,
    address,
    email,
    secondary_email,
    mobile_number,
    birth_date,
    gender,
  } = userInfo;

  const isEmailRequired = email ? true : false;
  const isMobileRequired = mobile_number ? true : false;

  const [dName, setDName] = useState(display_name ? display_name : full_name);
  const [name, setName] = useState(full_name);
  const [uName, setUName] = useState(username);
  const [desc, setDesc] = useState(description);
  const [addName, setAddName] = useState(address_name);
  const [stringAddress, setStringAddress] = useState();
  const [addDet, setAddDet] = useState(address_details);
  const [addNote, setAddNote] = useState(address_note);
  const [em, setEm] = useState(email);
  const [sEm, setSEm] = useState(secondary_email);
  const [mobile, setMobile] = useState(mobile_number);
  const [bDate, setBDate] = useState(birth_date);
  const [g, setG] = useState(gender);

  const toggleMap = () => {
    setMap(!map);
  };

  const toggleGender = () => {
    setGenderVisible(!genderVisible);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    if (show) {
      setShow(false);
    } else {
      showMode('date');
    }
  };

  const getStringAddress = () => {
    Geocoder.init(Config.apiKey);
    Geocoder.from(
      JSON.stringify(address.latitude),
      JSON.stringify(address.longitude),
    )
      .then((json) => {
        setStringAddress(json.results[1].formatted_address);
      })
      .catch((error) => console.warn(error));
  };

  const setDateFromString = () => {
    if (bDate) {
      setDate(moment(bDate).toDate());
    }
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

  const setBirthday = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setBDate(moment.utc(currentDate).add(1, 'day').format('MM/DD/YYYY'));
  };

  const emailChangeHandler = (em) => {
    setEm(em);
    if (em.trim().length === 0 && isEmailRequired) {
      setButtonState(true);
    } else {
      setButtonState(false);
    }
  };

  const mobileChangeHandler = (mobile) => {
    setMobile(mobile);
    if (
      (mobile.trim().length !== 11 || mobile.trim().length !== 13) &&
      isMobileRequired
    ) {
      setButtonState(true);
    } else {
      setButtonState(false);
    }
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

  const updateProfile = () => {
    //alert(dName + ' ' + name);

    const dataToUpdate = {
      display_name: dName,
      description: desc,
      full_name: name,
      username: uName,
    };
    setUserInfo({...userInfo, ...dataToUpdate});
    // console.log('cccccccccccccccccccccccc');
    // console.log(userInfo);
    // console.log('cccccccccccccccccccccccc');
    alert('Profile is updated');

    toggleEditProfile();
    toggleMenu();
  };

  useEffect(() => {
    // exit early when we reach 0
    if (userInfo) {
      getStringAddress();
      setDateFromString();
    }
  }, [userInfo]);

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <PaddingView paddingSize={3}>
          <ScreenHeaderTitle title="Edit Profile" close={toggleEditProfile} />
        </PaddingView>

        <KeyboardAwareScrollView
          style={styles.container}
          extraScrollHeight={40}
          keyboardOpeningTime={50}
          enableOnAndroid={true}>
          <View
            style={[
              styles.contentWrapper,
              {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                marginBottom: 0,
              },
            ]}>
            <PaddingView paddingSize={3}>
              <View style={styles.coverPhoto}>
                <CoverPhoto width={normalize(48)} height={normalize(42)} />
                <AppText
                  textStyle="body2"
                  color={Colors.contentOcean}
                  customStyle={{marginTop: normalize(8)}}>
                  Upload a Cover Photo
                </AppText>
              </View>
            </PaddingView>
          </View>
          <View
            style={[
              styles.contentWrapper,
              {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                marginBottom: 0,
              },
            ]}>
            <PaddingView paddingSize={3}>
              <View style={styles.profilePhoto}>
                <View>
                  <ProfileImageUpload size={80} />
                </View>
                <AppText
                  textStyle="caption"
                  color={Colors.contentOcean}
                  customStyle={{marginLeft: normalize(8)}}>
                  Tap Image to change Profile Picture
                </AppText>
              </View>
            </PaddingView>
          </View>
          <View style={styles.contentWrapper}>
            <PaddingView paddingSize={3}>
              {/* <AppInput
                value={dName}
                label="Display Name"
                onChangeText={(dName) => {
                  setDName(dName);
                }}
              /> */}
              <FloatingAppInput
                value={dName}
                label="Display Name"
                onChangeText={(dName) => {
                  setDName(dName);
                }}
              />
              <AppText
                textStyle="caption"
                color={Colors.profileLink}
                customStyle={{marginTop: normalize(5)}}>
                Help people discover your account by using a name that describes
                you or your service. This could be the name of your business, or
                your nickname.
              </AppText>
              <AppText
                textStyle="caption"
                color={Colors.profileLink}
                customStyle={{
                  marginTop: normalize(24),
                  marginBottom: normalize(5),
                }}>
                You can only change your Display Name twice every 14 days.
              </AppText>
              <FloatingAppInput
                value={name}
                label="Full Name"
                customStyle={{marginBottom: 16}}
                onChangeText={(name) => {
                  setName(name);
                }}
              />
              <FloatingAppInput
                value={uName}
                label="Username"
                customStyle={{marginBottom: 4}}
                onChangeText={(uName) => {
                  setUName(uName);
                }}
              />
              <View style={{flexDirection: 'row'}}>
                <AppText textStyle="caption">servbees.com/</AppText>
                <AppText textStyle="caption2">{uName}</AppText>
              </View>
              <AppText textStyle="caption">
                Only use characters, numbers, and a dot (.){' '}
              </AppText>

              <TextInput
                value={desc}
                multiline={true}
                placeholder="Description"
                placeholderTextColor={Colors.profileLink}
                numberOfLines={Platform.OS === 'ios' ? null : 6}
                minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
                style={[styles.input]}
                onChangeText={(desc) => {
                  setDesc(desc);
                }}
              />
            </PaddingView>
          </View>
          <View style={styles.contentWrapper}>
            <PaddingView paddingSize={3}>
              <AppText
                textStyle="body1"
                customStyle={{marginBottom: normalize(8)}}>
                Address
              </AppText>
              <AppInput
                value={addName}
                label="Address Name"
                customStyle={{marginBottom: normalize(16)}}
                onChangeText={(addName) => {
                  setAddName(addName);
                }}
              />
              <View style={{position: 'relative'}}>
                <TouchableOpacity onPress={() => toggleMap()}>
                  <AppInput
                    value={stringAddress}
                    label="Address"
                    customStyle={{marginBottom: normalize(16)}}
                    onFocus={() => toggleMap()}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 12,
                      right: 12,
                    }}>
                    <ArrowRight height={normalize(24)} width={normalize(24)} />
                  </View>
                </TouchableOpacity>
              </View>
              <AppInput
                value={addDet}
                label="Address Details"
                customStyle={{marginBottom: normalize(16)}}
                onChangeText={(addDet) => {
                  setAddDet(addDet);
                }}
              />
              <AppInput
                value={addNote}
                label="Notes"
                customStyle={{marginBottom: normalize(16)}}
                onChangeText={(addNote) => {
                  setAddNote(addNote);
                }}
              />
            </PaddingView>
          </View>
          <View
            style={[
              styles.contentWrapper,
              {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                marginBottom: 0,
              },
            ]}>
            <PaddingView paddingSize={3}>
              <AppText
                textStyle="body1"
                customStyle={{marginBottom: normalize(8)}}>
                Personal Information
              </AppText>
              <AppInput
                value={em}
                label="Email"
                customStyle={{marginBottom: normalize(16)}}
                onChangeText={(em) => {
                  emailChangeHandler(em);
                  //setEm(em);
                }}
              />
              <AppInput
                value={sEm}
                label="Secondary Email"
                customStyle={{marginBottom: normalize(16)}}
                onChangeText={(sEm) => {
                  setSEm(sEm);
                }}
              />
              <AppInput
                value={mobile}
                label="Mobile Number"
                customStyle={{marginBottom: normalize(16)}}
                onChangeText={(mobile) => {
                  mobileChangeHandler(mobile);
                }}
              />
              <View style={{position: 'relative'}}>
                <TouchableOpacity onPress={showDatepicker}>
                  <AppInput
                    value={bDate}
                    label="Birthday"
                    customStyle={{marginBottom: normalize(16)}}
                    onFocus={showDatepicker}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 12,
                      right: 12,
                    }}>
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
                <TouchableOpacity onPress={toggleGender}>
                  <AppInput
                    value={g}
                    label="Gender"
                    onFocus={toggleGender}
                    customStyle={{marginBottom: normalize(16)}}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 12,
                      right: 12,
                    }}>
                    <ArrowDown height={normalize(24)} width={normalize(24)} />
                  </View>
                </TouchableOpacity>
              </View>
            </PaddingView>
          </View>
          <View
            style={[
              styles.contentWrapper,
              {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                marginBottom: 0,
                paddingLeft: normalize(24),
                paddingRight: normalize(24),
                paddingBottom: normalize(24),
              },
            ]}>
            <AppButton
              text="Save"
              type="primary"
              height="xl"
              disabled={buttonDisable}
              customStyle={{...buttonStyle}}
              onPress={() => updateProfile()}
            />
          </View>
        </KeyboardAwareScrollView>

        <Modal
          isVisible={map}
          animationIn="slideInRight"
          animationInTiming={750}
          animationOut="slideOutRight"
          animationOutTiming={750}
          onSwipeComplete={toggleMap}
          swipeDirection="right"
          onBackButtonPress={() => setMap(false)}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          <EditAddress address={userInfo.address} back={() => setMap(false)} />
        </Modal>

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
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutralsZircon,
    //padding: normalize(16),
    width: Dimensions.width,
  },
  contentWrapper: {
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 8,
    marginBottom: 6,
  },

  coverPhoto: {
    height: normalize(114),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.neutralGray,
    borderRadius: normalize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },

  profilePhoto: {
    flexDirection: 'row',
    height: normalize(25),
    alignItems: 'center',
  },

  input: {
    borderColor: Colors.neutralGray,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: normalize(16),
    padding: normalize(8),
    fontSize: normalize(14),
  },
});

//make this component available to the app
export default EditProfile;
