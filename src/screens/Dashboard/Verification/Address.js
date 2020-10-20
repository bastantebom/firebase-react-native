import React, { useState, useContext, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions
} from 'react-native'
import { AppInput, PaddingView, AppText, ScreenHeaderTitle, FloatingAppInput } from '@/components';
import { Colors, normalize } from '@/globals';
import { HeaderBackGray, ArrowRight } from '@/assets/images/icons';
import { VerifyMap } from './components/Map';
import EditAddress from '../../Profile/components/EditProfile/EditAddress';
import Modal from 'react-native-modal';
import { UserContext } from '@/context/UserContext';

export const AddAnAddress = ({back}) => {

  const { userInfo, setUserInfo, user } = useContext(UserContext)

  const [map, setMap] = useState(false);

  const toggleMap = () => {
    setMap(!map);
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
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <PaddingView paddingSize={3}>
        <ScreenHeaderTitle
          iconSize={16}
          title="Add an Address"
          close={back}
        />
      </PaddingView>

      <PaddingView paddingSize={3}>
        <FloatingAppInput
          label="Name"
          placeholder="ex. Home, Office"
          customStyle={styles.customInput}
        />
        <View style={{ position: 'relative' }}>
          <TouchableOpacity onPress={() => toggleMap()}>
            <AppInput
              placeholder="Address"
              customStyle={styles.customInput}
              // render={() => <View style={{position: 'absolute', right: 0}}><ArrowRight/></View>}
            />
            <View style={{position: 'absolute', right: 0, top: 12, right: 22}}>
              <ArrowRight height={normalize(24)} width={normalize(24)} />
            </View>
          </TouchableOpacity>
        </View>
        <FloatingAppInput
          label="Address Details"
          placeholder="ex. House, Floor, Unit Number"
          customStyle={styles.customInput}
        />
        <FloatingAppInput
          label="Notes"
          placeholder="ex. Yellow gate"
          customStyle={styles.customInput}
        />
        <AppText textStyle="body1" color={Colors.errColor}>Remove</AppText>
      </PaddingView>
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
        }}
      >
        {/* <VerifyMap back={() => setMap(false)} /> */}
        {/* <EditAddress/> */}
        <EditAddress
          address={userInfo.address}
          back={() => setMap(false)}
          // changeFromMapHandler={(fullAddress, addStr) =>
          //   prepareAddressUpdate(fullAddress, addStr)
          // }
        />
        {/* <AppText>jasyauysuays</AppText> */}
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
    marginBottom: 16
  }
})
