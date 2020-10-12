//import liraries
import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
import ProfileInfoService from '@/services/Profile/ProfileInfo';

// create a component
const AddAddress = ({toggleAddAddress, address, additional}) => {
  const {userInfo, user, setUserInfo} = useContext(UserContext);
  const [currentAddress, setCurrentAddress] = useState(address);
  const {addresses} = userInfo;
  const [IS_LOADING, setIS_LOADING] = useState(false);
  const [addName, setAddName] = useState(
    additional === true ? '' : currentAddress.name ? currentAddress.name : '',
  );
  const [stringAddress, setStringAddress] = useState(
    currentAddress.full_address,
  );
  const [addDet, setAddDet] = useState(
    additional === true
      ? ''
      : currentAddress.details
      ? currentAddress.details
      : '',
  );
  const [addNote, setAddNote] = useState(
    additional === true ? '' : currentAddress.note ? currentAddress.note : '',
  );
  const [map, setMap] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const cancelModalToggle = () => {
    //console.log(title);
    //setSelectedPost(post);
    setShowCancelModal(!showCancelModal);
  };

  const closeHandler = (value) => {
    setShowCancelModal(!showCancelModal);
  };

  const toggleMap = () => {
    setMap(!map);
  };

  const changeFromMapHandler = (newAddress) => {
    setStringAddress(newAddress.full_address);
    setCurrentAddress(newAddress);
  };

  const onSaveHandler = () => {
    const nAdd = [...addresses];
    const addressToUpdate = {
      ...currentAddress,
      details: addDet,
      note: addNote,
      name: addName,
    };
    if (additional === true) {
      nAdd[addresses.length] = {...addressToUpdate, ...{default: false}};
    } else {
      nAdd[additional] = {
        ...addressToUpdate,
        ...{default: address.default},
      };
    }

    const fAdd = {
      addresses: [...nAdd],
    };

    // ProfileInfoService.updateUser({...fAdd, ...userInfo}, user.uid)
    //   .then((response) => {
    //     if (response.success) {
    //       setIS_LOADING(false);
    //       setUserInfo({...userInfo, ...response.data});
    //       console.log(response);
    //     } else {
    //       setIS_LOADING(false);
    //       console.log(response);
    //     }
    //   })
    //   .catch((error) => {
    //     setIS_LOADING(false);
    //     console.log(error);
    //   });

    setUserInfo({...userInfo.addresses, ...fAdd});
    //console.log(fAdd);
    toggleAddAddress();
  };

  const deleteAddress = async () => {
    //body: { uid, pid }
    console.log('Find the default');
    console.log('set new default');
    //console.log('update the address');
    closeHandler();
    toggleAddAddress();
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
            title={additional===true?"Add an Address":'Edit an Address'}
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
            placeholder="ex. Work, School, Other"
          />
          <View style={{position: 'relative'}}>
            <TouchableOpacity onPress={() => toggleMap()}>
              <FloatingAppInput
                value={
                  stringAddress.length > 32
                    ? `${stringAddress.substring(0, 32)}...`
                    : stringAddress
                }
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
          { additional===true?null:
          (<TouchableOpacity onPress={cancelModalToggle}>
            <AppText textStyle="body2" color={Colors.errColor}>Remove</AppText>
          </TouchableOpacity>)
          }
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
        <MapAddress
          toggleMap={toggleMap}
          address={currentAddress}
          changeFromMapHandler={(newAddress) =>
            changeFromMapHandler(newAddress)
          }
        />
      </Modal>

      <Modal
        isVisible={showCancelModal}
        animationIn="bounceIn"
        animationInTiming={450}
        animationOut="bounceOut"
        animationOutTiming={450}
        style={{
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={cancelModalToggle}>
            <View style={{flex: 1, backgroundColor: 'black'}} />
          </TouchableWithoutFeedback>
        }>
        <View
          style={{
            backgroundColor: 'white',
            height: normalize(300),
            width: normalize(300),
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}>
          <AppText textStyle="display6" customStyle={{marginBottom: 16}}>
            Remove this Address?
          </AppText>

          <AppText
            textStyle="caption"
            customStyle={{textAlign: 'center'}}
            customStyle={{marginBottom: 16}}>
            Are you sure you want to remove this address?
          </AppText>

          <TouchableOpacity
            onPress={() => {
              deleteAddress();
            }}
            style={{
              backgroundColor: Colors.yellow2,
              paddingVertical: 14,
              width: '100%',
              alignItems: 'center',
              marginBottom: 16,
              borderRadius: 4,
            }}>
            <AppText textStyle="button2">Continue</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => closeHandler('cancel')}
            style={{paddingVertical: 14, width: '100%', alignItems: 'center'}}>
            <AppText textStyle="button2" color={Colors.contentOcean}>
              Cancel
            </AppText>
          </TouchableOpacity>
        </View>
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
