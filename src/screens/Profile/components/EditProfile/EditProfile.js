//import liraries
import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {
  ScreenHeaderTitle,
  PaddingView,
  AppButton,
  FloatingAppInput,
  AppText,
  ProfileImageUpload,
  TransitionIndicator,
} from '@/components';
import {AppInput, Validator, valueHandler} from '@/components/AppInput';

import storage from '@react-native-firebase/storage';

import {
  ArrowRight,
  ArrowDown,
  Calendar,
  VerifiedGreen,
} from '@/assets/images/icons';

import {Colors, normalize} from '@/globals';
import EditAddress from './EditAddress';
import GenderList from './Gender';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context';
import Geocoder from 'react-native-geocoding';
import Config from '@/services/Config';
import moment from 'moment';
import ProfileInfoService from '@/services/Profile/ProfileInfo';
import {debounce} from 'lodash';
import CoverPhotoUpload from '@/components/ImageUpload/CoverPhotoUpload';
import DebounceInput from 'react-native-debounce-input';

// create a component
const EditProfile = ({toggleEditProfile, toggleMenu, triggerNotify}) => {
  const [map, setMap] = useState(false);
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [genderVisible, setGenderVisible] = useState(false);
  const {userInfo, user, setUserInfo} = useContext(UserContext);
  const {setNeedsRefresh} = useContext(Context);
  const [buttonStyle, setButtonStyle] = useState({});
  const [buttonDisable, setButtonDisable] = useState(false);
  const [addressComponents, setAddressComponents] = useState({
    city: '',
    province: '',
    country: '',
    longitude: 0,
    latitude: 0,
  });

  const [imageSource, setImageSource] = useState(null);
  const [imageCoverSource, setImageCoverSource] = useState(null);
  const [imgUploading, setImgUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [IS_UPDATING, setIS_UPDATING] = useState(false);

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

  const isEmailRequired = email ? true : false;
  const isMobileRequired = phone_number ? true : false;

  const [cPhoto, setCPhoto] = useState(cover_photo);
  const [pPhoto, setPPhoto] = useState(profile_photo);
  const [profilePhotoClick, setProfilePhotoClick] = useState(false);
  const [dName, setDName] = useState(display_name ? display_name : full_name);
  const [name, setName] = useState(full_name);
  /*Username Validations */
  const [uName, setUName] = useState(username);
  const [invalidUser, setInvalidUser] = useState(true);
  const [invalidUserFormat, setInvalidUserFormat] = useState(false);

  const [enabled, setEnabled] = useState(false);
  const [errors, setErrors] = useState({
    dName: {
      passed: true,
      shown: false,
      message: '',
    },
    name: {
      passed: true,
      shown: false,
      message: '',
    },
    uName: {
      passed: true,
      shown: false,
      message: '',
    },
  });

  const checkErrorState = () => {
    let temp = true;

    console.log(errors);

    for (const [key, value] of Object.entries(errors)) {
      if (!value.passed) {
        temp = false;
        break;
      }
    }

    if (temp) {
      // ENABLE BUTTON
      console.log('Button is Enabled');
      setEnabled(true);
      setButtonStyle(false);
    } else {
      // DISABLE BUTTON
      console.log('Button is Disabled');
      setEnabled(false);
      setButtonStyle(true);
    }
  };

  useEffect(() => {
    checkErrorState();
  }, [errors]);


  // const
  // const [error, setError] = useState([]);
  const [verified, setVerified] = useState(false);

  /*Username Validations */
  const [desc, setDesc] = useState(description);
  const [addName, setAddName] = useState(address.name);
  const [stringAddress, setStringAddress] = useState();
  const [addDet, setAddDet] = useState(address.details);
  const [addNote, setAddNote] = useState(address.note);
  const [em, setEm] = useState(email);
  const [sEm, setSEm] = useState(secondary_email);
  const [mobile, setMobile] = useState(phone_number);
  const [bDate, setBDate] = useState(birth_date);
  const [g, setG] = useState(gender);

  const toggleMap = () => {
    setMap(!map);
  };

  const toggleGender = () => {
    setGenderVisible(!genderVisible);
    if (show) setShow(!show);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    if (show) {
      setShow(false);
    } else {
      Keyboard.dismiss();
      showMode('date');
    }
  };

  const getStringAddress = (lat, lng, addStr) => {
    Geocoder.init(Config.apiKey);
    Geocoder.from(lat, lng)
      .then((json) => {
        setStringAddress(addStr ? addStr : json.results[1].formatted_address);
        const arrayToExtract =
          json.results.length == 14
            ? 9
            : json.results.length == 13
            ? 8
            : json.results.length == 12
            ? 7
            : json.results.length == 11
            ? 6
            : json.results.length == 10
            ? 5
            : json.results.length == 9
            ? 4
            : json.results.length == 8
            ? 3
            : json.results.length < 8
            ? 2
            : 2;
        const splitAddress = json.results[
          arrayToExtract
        ].formatted_address.split(',');
        setAddressComponents({
          ...addressComponents,
          ...{
            latitude: lat,
            longitude: lng,
            city: splitAddress[0],
            province: splitAddress[1],
            country: splitAddress[2],
          },
          //setChangeMapAddress(addressComponent);
        });
      })
      .catch((error) => console.warn(error));
  };

  const setDateFromString = () => {
    if (bDate) {
      setDate(moment(new Date(bDate)).toDate());
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

  const prepareAddressUpdate = (fullAddress, addStr) => {
    getStringAddress(fullAddress.latitude, fullAddress.longitude, addStr);
  };

  const uploadImageHandler = async (image) => {
    if (image) {
      const {uri} = image;
      //console.log('Sa If');
      let filename = uri;
      if (!Platform.OS === 'ios')
        filename = uri.substring(uri.lastIndexOf('/') + 1);
      const uploadUri =
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

      setTransferred(0);
      const task = storage().ref();
      const fileRef = task.child(`${user.uid}/display-photos/${filename}`);
      await fileRef.putFile(uploadUri);
      return Promise.resolve(await fileRef.getDownloadURL());
    } else {
      return Promise.reject('empty');
    }
  };

  const updateProfile = async () => {
    const addressToUpdate = {
      details: addDet,
      note: addNote,
      name: addName,
      ...addressComponents,
    };

    Object.keys(addressToUpdate).forEach(
      (key) =>
        addressToUpdate[key] === undefined && delete addressToUpdate[key],
    );

    const dataToUpdate = {
      //cover_photo: cPhoto,
      //profile_photo: pPhoto,
      display_name: dName,
      description: desc,
      full_name: name,
      username: uName,
      address: {...userInfo.address, ...addressToUpdate},
      birth_date: bDate,
      email: em,
      secondary_email: sEm,
      phone_number: mobile,
      gender: g,
    };

    Object.keys(dataToUpdate).forEach(
      (key) => dataToUpdate[key] === undefined && delete dataToUpdate[key],
    );

    setIS_UPDATING(true);
    const images = [imageCoverSource, imageSource];

    const uploadProfileImagesHandler = () =>
      Promise.all(
        images.map(async (image) => {
          try {
            const res = await uploadImageHandler(image);
            return res;
          } catch (error) {
            return error;
          }
        }),
      );

    await uploadProfileImagesHandler().then((response) => {
      //console.log(response);
      //response[0] !== 'empty' ?
      dataToUpdate.cover_photo = response[0] === 'empty' ? cPhoto : response[0];
      dataToUpdate.profile_photo =
        response[1] === 'empty' ? pPhoto : response[1];
      //console.log('-----------------');
      //console.log(dataToUpdate);

      ProfileInfoService.updateUser(dataToUpdate, uid)
        .then((response) => {
          if (response.success) {
            setIS_UPDATING(false);
            setUserInfo({...userInfo, ...response.data});
            setNeedsRefresh(true);
            toggleEditProfile();
            toggleMenu();
            triggerNotify(true);
          } else {
            setIS_UPDATING(false);
          }
        })
        .catch((error) => {
          setIS_UPDATING(false);
          console.log(error);
        });
    });
  };

  useEffect(() => {
    //let isMounted = true;
    //if (isMounted) {
    let isSubscribed = true;
    if (userInfo) {
      if (isSubscribed) {
        getStringAddress(address.latitude, address.longitude);
        setDateFromString();
      }
    }
    return () => (isSubscribed = false);
  }, []);

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <TransitionIndicator loading={IS_UPDATING} />
        <PaddingView paddingSize={3}>
          <ScreenHeaderTitle
            iconSize={16}
            title="Edit Profile"
            close={toggleEditProfile}
          />
        </PaddingView>

        <KeyboardAwareScrollView
          style={styles.container}
          extraScrollHeight={40}
          keyboardOpeningTime={50}
          // enableOnAndroid={true}
        >
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
              <CoverPhotoUpload
                imgSourceHandler={(imgSrc) => {
                  setImageCoverSource(imgSrc);
                }}
                imgSrc={cPhoto}
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
              <View style={styles.profilePhoto}>
                <View>
                  <ProfileImageUpload
                    imgSourceHandler={(imgSrc) => {
                      setImageSource(imgSrc);
                      setProfilePhotoClick(false);
                    }}
                    size={80}
                    imgSrc={pPhoto}
                    profilePhotoClick={profilePhotoClick}
                    setProfilePhotoClick={setProfilePhotoClick}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setProfilePhotoClick(true);
                  }}>
                  <AppText
                    textStyle="caption"
                    color={Colors.contentOcean}
                    customStyle={{marginLeft: normalize(8)}}>
                    Tap Image to change Profile Picture
                  </AppText>
                </TouchableOpacity>
              </View>
            </PaddingView>
          </View>
          <View style={styles.contentWrapper}>
            <PaddingView paddingSize={3}>
              {/* <FloatingAppInput
                value={dName}
                label="Display Name"
                onChangeText={(dName) => {
                  setDName(dName);
                }}
              /> */}
              <Validator errorState={errors.dName}>
                <AppInput
                  label="Display Name"
                  onChangeText={(dName) => {
                    setDName();
                    valueHandler(
                      dName,
                      'display_name',
                      'dName',
                      errors,
                      setErrors,
                      setDName,
                    );
                  }}
                  value={dName}
                  onKeyPress={() => {
                    setErrors({
                      ...errors,
                      dName: {
                        ...errors.dName,
                        shown: false,
                      },
                    });
                  }}
                />
              </Validator>
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
              {/* <FloatingAppInput
                value={name}
                label="Full Name"
                customStyle={{marginBottom: 16}}
                onChangeText={(name) => {
                  setName(name);
                }}
              /> */}
              <Validator errorState={errors.name} style={{marginBottom: 16}}>
                <AppInput
                  label="Full Name"
                  onChangeText={(name) =>
                    valueHandler(name, '', 'name', errors, setErrors, setName)
                  }
                  value={name}
                  onKeyPress={() => {
                    setErrors({
                      ...errors,
                      name: {
                        ...errors.name,
                        shown: false,
                      },
                    });
                  }}
                />
              </Validator>
              <View style={{position: 'relative'}}>
                {/* <FloatingAppInput
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
                /> */}

                <Validator errorState={errors.uName} style={{marginBottom: 16}}>
                  <AppInput
                    label="Username"
                    onChangeText={(uName) =>
                      valueHandler(
                        uName,
                        'username',
                        'uName',
                        errors,
                        setErrors,
                        setUName,
                        user.uid,
                      )
                    }
                    value={uName}
                    onKeyPress={() => {
                      setErrors({
                        ...errors,
                        uName: {
                          ...errors.uName,
                          shown: false,
                        },
                      });
                    }}
                  />
                </Validator>
                <View style={styles.passwordToggle}>
                  {errors.uName.passed ? (
                    <VerifiedGreen
                      width={normalize(16)}
                      height={normalize(16)}
                    />
                  ) : null}
                </View>
              </View>
              {!invalidUser ? (
                <AppText textStyle="caption" customStyle={styles.errorCopy}>
                  Username has already been used
                </AppText>
              ) : null}
              <View style={{flexDirection: 'row'}}>
                <AppText textStyle="caption">servbees.com/</AppText>
                <AppText textStyle="caption2">{uName}</AppText>
              </View>

              <AppText
                textStyle="caption"
                color={invalidUserFormat ? Colors.errorInput : ''}>
                Only use characters, numbers, dash and a dot (.){' '}
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
                underlineColorAndroid={'transparent'}
                textAlignVertical="top"
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
              {/* <FloatingAppInput
                value={addName}
                onChangeText={(addName) => {
                  setAddName(addName);
                }}
                label="Name"
                customStyle={{marginBottom: normalize(16)}}
                placeholder="ex. Home"
              /> */}
              <AppInput
                label="Address Name"
                style={{marginBottom: normalize(16)}}
                onChangeText={(addName) => {
                  setAddName(addName);
                }}
                value={addName}
              />
              <View style={{position: 'relative'}}>
                <TouchableOpacity onPress={() => toggleMap()}>
                  <FloatingAppInput
                    value={stringAddress}
                    label="Address"
                    customStyle={{marginBottom: normalize(16)}}
                    onFocus={() => toggleMap()}
                  />
                  {/* <AppInput
                    label="Address"
                    editable={false}
                    style={{marginBottom: normalize(16)}}
                    // onChangeText={() => {
                    //   return;
                    // }}
                    value={stringAddress}
                    onFocus={() => toggleMap()}
                  /> */}
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
              <FloatingAppInput
                value={addDet}
                label="Address Details"
                customStyle={{marginBottom: normalize(16)}}
                onChangeText={(addDet) => {
                  setAddDet(addDet);
                }}
              />
              {/* <AppInput
                label="Address Details"
                style={{marginBottom: normalize(16)}}
                onChangeText={(addDet) => {
                  setAddDet(addDet);
                }}
                value={addDet}
              /> */}
              {/* <FloatingAppInput
                value={addNote}
                label="Notes"
                placeholder="ex. Yellow Gate"
                customStyle={{marginBottom: normalize(16)}}
                onChangeText={(addNote) => {
                  setAddNote(addNote);
                }}
              /> */}

              <AppInput
                label="Notes"
                style={{marginBottom: normalize(16)}}
                onChangeText={(addNote) => {
                  setAddNote(addNote);
                }}
                value={addNote}
                placeholder="ex. Yellow Gate"
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
              <FloatingAppInput
                editable={false}
                selectTextOnFocus={false}
                value={em}
                label="Email"
                keyboardType="email-address"
                customStyle={{marginBottom: normalize(16)}}
                onChangeText={(em) => {
                  emailChangeHandler(em);
                }}
                validation={['email']}
              />
              <FloatingAppInput
                editable={false}
                selectTextOnFocus={false}
                value={sEm}
                label="Secondary Email"
                keyboardType="email-address"
                customStyle={{marginBottom: normalize(16)}}
                onChangeText={(sEm) => {
                  setSEm(sEm);
                }}
              />
              {/* <FloatingAppInput
                // editable={false}
                selectTextOnFocus={false}
                value={mobile}
                label="Mobile Number"
                keyboardType="phone-pad"
                customStyle={{marginBottom: normalize(16)}}
                onChangeText={(mobile) => {
                  mobileChangeHandler(mobile);
                }}
              /> */}
              <FloatingAppInput
                editable={false}
                value={mobile}
                selectTextOnFocus={false}
                valueHandler={setMobile}
                label="Mobile Number"
                customStyle={{marginBottom: normalize(16)}}
                keyboardType="phone-pad"
                validation={['number']}
                // setError={setError}
                // error={error}
                setButtonState={setButtonState}
              />
              <View style={{position: 'relative'}}>
                <FloatingAppInput
                  value={bDate}
                  label="Birthday"
                  customStyle={{marginBottom: normalize(16)}}
                  onFocus={showDatepicker}
                  editable={false}
                />
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
                <FloatingAppInput
                  value={g}
                  label="Gender"
                  onFocus={toggleGender}
                  customStyle={{marginBottom: normalize(16)}}
                  editable={false}
                />
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
              disabled={!enabled}
              // disabled
              customStyle={{
                backgroundColor: !enabled
                  ? Colors.buttonDisable
                  : Colors.primaryYellow,
                borderColor: !enabled
                  ? Colors.buttonDisable
                  : Colors.primaryYellow,
              }}
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
          onBackButtonPress={() => setMap(false)}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          <EditAddress
            address={userInfo.address}
            back={() => setMap(false)}
            changeFromMapHandler={(fullAddress, addStr) =>
              prepareAddressUpdate(fullAddress, addStr)
            }
          />
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

  profilePhoto: {
    flexDirection: 'row',
    height: normalize(30),
    alignItems: 'center',
  },

  input: {
    color: Colors.contentEbony,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    letterSpacing: 0.5,
    borderColor: Colors.neutralGray,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },

  errorCopy: {
    color: Colors.errorInput,
    marginBottom: 12,
  },

  passwordToggle: {
    position: 'absolute',
    right: normalize(10),
    top: normalize(18),
  },
});

//make this component available to the app
export default EditProfile;
