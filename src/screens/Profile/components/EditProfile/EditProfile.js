//import liraries
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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

// create a component
const EditProfile = ({toggleEditProfile}) => {
  const [fullHeight, setFullHeight] = useState();
  const [map, setMap] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [genderVisible, setGenderVisible] = useState(false);

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
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <PaddingView paddingSize={3}>
          <ScreenHeaderTitle title="Edit Profile" close={toggleEditProfile} />
        </PaddingView>
        <View style={styles.container}>
          <ScrollView>
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
                <AppInput label="Display Name" />
                <AppText
                  textStyle="caption"
                  color={Colors.profileLink}
                  customStyle={{marginTop: normalize(5)}}>
                  Help people discover your account by using a name that
                  describes you or your service. This could be the name of your
                  business, or your nickname.
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
                <AppInput label="Full Name" customStyle={{marginBottom: 16}} />
                <AppInput label="Username" customStyle={{marginBottom: 4}} />
                <View style={{flexDirection: 'row'}}>
                  <AppText textStyle="caption">servbees.com/</AppText>
                  <AppText textStyle="caption2">username</AppText>
                </View>
                <AppText textStyle="caption">
                  Only use characters, numbers, and a dot (.)
                </AppText>

                <TextInput
                  multiline={true}
                  placeholder="Description"
                  placeholderTextColor={Colors.profileLink}
                  numberOfLines={Platform.OS === 'ios' ? null : 6}
                  minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
                  style={[styles.input]}
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
                  label="Name"
                  customStyle={{marginBottom: normalize(16)}}
                />
                <View style={{position: 'relative'}}>
                  <TouchableOpacity onPress={() => toggleMap()}>
                    <AppInput
                      label="Address"
                      customStyle={{marginBottom: normalize(16)}}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 12,
                        right: 12,
                      }}>
                      <ArrowRight
                        height={normalize(24)}
                        width={normalize(24)}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <AppInput
                  label="Address Details"
                  customStyle={{marginBottom: normalize(16)}}
                />
                <AppInput
                  label="Notes"
                  customStyle={{marginBottom: normalize(16)}}
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
                  label="Email"
                  customStyle={{marginBottom: normalize(16)}}
                />
                <AppInput
                  label="Secondary Email"
                  customStyle={{marginBottom: normalize(16)}}
                />
                <AppInput
                  label="Mobile Number"
                  customStyle={{marginBottom: normalize(16)}}
                />
                <View style={{position: 'relative'}}>
                  <TouchableOpacity onPress={showDatepicker}>
                    <AppInput
                      label="Birthday"
                      customStyle={{marginBottom: normalize(16)}}
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
                      testID="dateTimePicker"
                      value={date}
                      mode={mode}
                      is24Hour={true}
                      display="default"
                      onChange={console.log('Nagpalit ng Date')}
                    />
                  )}
                </View>
                <View style={{position: 'relative'}}>
                  <TouchableOpacity onPress={toggleGender}>
                    <AppInput
                      label="Gender"
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
                customStyle={{
                  backgroundColor: Colors.buttonDisable,
                  borderColor: Colors.buttonDisable,
                }}
              />
            </View>
          </ScrollView>
        </View>
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
          <EditAddress back={() => setMap(false)} />
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
            <GenderList />
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
    textAlignVertical: 'top',
  },
});

//make this component available to the app
export default EditProfile;
