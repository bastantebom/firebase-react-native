//import liraries
import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Dimensions,
} from 'react-native';

import {ScreenHeaderTitle, PaddingView, AppText, AppButton} from '@/components';
import {TempHistory, TempAboutScreen} from '@/screens/Profile/components';

import {ContactUsImg} from '@/assets/images';
import {
  EmailContactUs,
  CallContactUs,
  LocationContactUs,
} from '@/assets/images/icons';
import {normalize, Colors} from '@/globals';
import Modal from 'react-native-modal';
import {TouchableOpacity} from 'react-native-gesture-handler';

// create a component
const UpdateTemp = ({toggleUpdateTemp}) => {
  const [history, setHistory] = useState(false);
  const toggleHistory = () => {
    setHistory(!history);
  };

  const [tempAbout, setTempAbout] = useState(false);
  const toggleTempAbout = () => {
    setTempAbout(!tempAbout);
  };

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <PaddingView paddingSize={3}>
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
              customStyle={{paddingBottom: 8}}>
              <AppText textStyle="captionConstant" color={Colors.contentOcean}>
                Why we’re asking this?
              </AppText>
            </TouchableOpacity>
          </View>
        </PaddingView>

        <AppButton
          text="Submit"
          type="primary"
          size="l"
          height="xl"
          onPress={() => {}}
          customStyle={{marginTop: normalize(20)}}
        />
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
        <TempHistory toggleHistory={toggleHistory} />
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

// define your styles
// define your styles
const styles = StyleSheet.create({
  imageWrapper: {
    marginBottom: normalize(16),
    alignItems: 'center',
  },
  contentWrapper: {
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 8,
    marginBottom: 6,
  },
  copyWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: normalize(24),
    backgroundColor: Colors.neutralsWhite,
  },
  centerCopy: {
    textAlign: 'left',
    marginBottom: normalize(8),
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
});

//make this component available to the app
export default UpdateTemp;
