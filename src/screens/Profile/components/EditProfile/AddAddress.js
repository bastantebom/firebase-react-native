//import liraries
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Context} from '@/context';
import {UserContext} from '@/context/UserContext';
import Modal from 'react-native-modal';
import {normalize, Colors} from '@/globals';
import {
  ScreenHeaderTitle,
  Notification,
  TransitionIndicator,
  FloatingAppInput,
  AppButton,
  PaddingView,
  AppText,
} from '@/components';

import {ArrowRight} from '@/assets/images/icons';
import MapAddress from './MapAddress';

// create a component
const AddAddress = ({toggleAddAddress, address}) => {
  // useEffect(() => {
  //   let isSubscribed = true;
  //   if (userInfo) {
  //     if (isSubscribed) {
  //       getStringAddress(address.latitude, address.longitude);
  //       setDateFromString();
  //     }
  //   }
  //   return () => (isSubscribed = false);
  // }, []);

  const [IS_LOADING, setIS_LOADING] = useState(false);
  const [addName, setAddName] = useState('');
  const [stringAddress, setStringAddress] = useState('');
  const [addDet, setAddDet] = useState('');
  const [addNote, setAddNote] = useState('');
  const [map, setMap] = useState(false);

  const toggleMap = () => {
    setMap(!map);
  };

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        {/* <Notification message={notificationMessage} type={notificationType} /> */}
        <TransitionIndicator loading={IS_LOADING} />

        <View
          style={{
            flex: 1,
            padding: 24,
          }}>
          <ScreenHeaderTitle
            iconSize={16}
            title="Add an Address"
            close={toggleAddAddress}
          />

          <FloatingAppInput
            value={addName}
            onChangeText={(addName) => {
              setAddName(addName);
            }}
            label="Name"
            customStyle={{
              marginBottom: normalize(16),
              marginTop: normalize(16),
            }}
            placeholder="ex. Home"
          />
          <View style={{position: 'relative'}}>
            <TouchableOpacity onPress={() => toggleMap()}>
              <FloatingAppInput
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
          <FloatingAppInput
            value={addDet}
            label="Address Details"
            customStyle={{marginBottom: normalize(16)}}
            onChangeText={(addDet) => {
              setAddDet(addDet);
            }}
          />
          <FloatingAppInput
            value={addNote}
            label="Notes"
            placeholder="ex. Yellow Gate"
            customStyle={{marginBottom: normalize(16)}}
            onChangeText={(addNote) => {
              setAddNote(addNote);
            }}
          />

          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              bottom: 0,
            }}>
            <AppButton
              text="Save Address"
              type="primary"
              height="xl"
              onPress={() => {
                onSaveHandler();
              }}
            />
          </View>
        </View>
      </SafeAreaView>
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
        <MapAddress toggleMap={toggleMap} address={address} />
      </Modal>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default AddAddress;
