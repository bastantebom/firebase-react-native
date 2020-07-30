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
  ScrollView
} from 'react-native'
import Modal from 'react-native-modal';
import { AppText, PaddingView, AppInput, Switch, AppButton } from '@/components';
import { Colors, normalize } from '@/globals';
import {
  HeaderBackGray,
} from '@/assets/images/icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AddAnAddress from './Address';

export const ProfileInformation = ({ back, toggleAddress }) => {

  const [username, setUsername] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(selectedDate);
    console.log(date);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const [isDefault, setIsDefault] = useState(true);

  const toggleSwitch = () => {
    setIsDefault((previousState) => !previousState);
  };

  // const [address, setAddress] = useState(false);

  // const toggleAddress = () => {
  //   setAddress(!address);
  // };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{ backgroundColor: Colors.neutralsZircon }}>
        <View style={[styles.contentWrapper, { borderTopEndRadius: 0, borderTopStartRadius: 0 }]}>
          <PaddingView paddingSize={3}>
            <View
              style={styles.modalHeader}>
              <TouchableOpacity
                onPress={back}
                activeOpacity={0.7}
                style={{position: 'absolute', left: 0}}
              >
                <HeaderBackGray width={normalize(16)} height={normalize(16)} />
              </TouchableOpacity>
              <AppText textStyle="body3">Profile Information</AppText>
            </View>
            <AppText textStyle="body1" customStyle={styles.customHeading}>Public Profile</AppText>
            <AppInput
              label="Display Name"
              customStyle={{ marginBottom: 8, fontFamily: 'RoundedMplus1c-Regular', fontSize: 25, color: Colors.primaryAliceBlue }}
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
            <AppInput
              label="Full name"
              customStyle={styles.customInput}
            />
            <AppInput
              label="Username"
              customStyle={{ marginBottom: 5 }}
              onChangeText={username => setUsername(username)}
            />
            <View style={{ flexDirection: 'row' }}>
              <AppText textStyle="caption" color={Colors.contentPlaceholder}>servbees.com/</AppText>
              <AppText textStyle="caption" color={Colors.contentPlaceholder} customStyle={{ fontWeight: 'bold' }}>{username ? username : 'username'}</AppText>
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
            <AppInput
              label="Email"
              customStyle={styles.customInput}
            />
            <AppInput
              label="Secondary Email"
              customStyle={styles.customInput}
            />
            <AppInput
              label="Birthday"
              customStyle={styles.customInput}
            />
            <AppInput
              label="Select Gender"
              customStyle={styles.customInput}
            />
            {/* <AppText>{date}</AppText> */}
            {/* <Button onPress={showDatepicker} title="Show date picker!" />
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={false}
                display="default"
                onChange={onChange}
              />
            )} */}
            <AppButton
              text="Save"
              type="primary"
            />
          </PaddingView>
        </View>
      </ScrollView>
      {/* <Modal
        isVisible={address}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        onSwipeComplete={toggleAddress}
        swipeDirection="right"
        onBackButtonPress={() => setAddress(false)}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}
      >
        <AddAnAddress addressBack={() => setAddress(false)}/>
      </Modal> */}
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
    marginBottom: 16,

  },
  customHeading: {
    marginBottom: 19
  },
  contentWrapper: {
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 15,
    marginBottom: 8
  }
})