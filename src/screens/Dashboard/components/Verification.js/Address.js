import React, { useState, useContext, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions
} from 'react-native'
import { AppInput, PaddingView, AppText } from '@/components';
import { Colors, normalize } from '@/globals';
import {
  HeaderBackGray,
  ArrowRight
} from '@/assets/images/icons';
import { VerifyMap } from './Map';
import Modal from 'react-native-modal';

const AddAnAddress = ({addressBack}) => {

  const [map, setMap] = useState(false);

  const toggleMap = () => {
    setMap(!map);
  };
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <PaddingView paddingSize={3}>
        <View
          style={styles.modalHeader}>
          <TouchableOpacity
            onPress={addressBack}
            activeOpacity={0.7}
            style={{position: 'absolute', left: 0}}
          >
            <HeaderBackGray width={normalize(16)} height={normalize(16)} />
          </TouchableOpacity>
          <AppText textStyle="body3">Add an Address</AppText>
        </View>
        <AppInput
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
        <AppInput
          label="Address Details"
          placeholder="ex. House, Floor, Unit Number"
          customStyle={styles.customInput}
        />
        <AppInput
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
        <VerifyMap/>

      </Modal>
    </SafeAreaView>
  )
}

export default AddAnAddress;

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