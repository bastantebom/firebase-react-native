import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text
} from 'react-native';

import Modal from 'react-native-modal';

import {
  AppText,
  ScreenHeaderTitle,
  BottomSheetHeader
} from '@/components';
import {normalize} from '@/globals';
import { ArrowRight } from '@/assets/images/icons';

const PostExpiryModal = ({closeModal}) => { 
  const [timeModal, showTimeModal] = useState(false);
  const [dateModal, showDateModal] = useState(false);

  return (
    <View>
      <ScreenHeaderTitle
        close={closeModal}
        title="Post Expiry"
        paddingSize={2}
      />
      <View style={{padding: normalize(16)}}>
        <AppText textStyle="body2">Something, something</AppText>
        <AppText textStyle="captionDashboard">Something, something</AppText>
          <TouchableOpacity 
           style={styles.btn}
           onPress={() => showTimeModal(true)}>
          <View style={{ flex: .75 }}>
            <View style={{ flexDirection: 'row' }}>
              <AppText textStyle="body3">Publish/Depublish on a Specific Date</AppText>
            </View>
            <Text style={{ fontFamily: 'RoundedMplus1c-Regular', fontSize: 15 }} numberOfLines={1} ellipsizeMode='tail'>Something, something</Text>
          </View>
          <View style={{ flex: .25, justifyContent: 'center', alignItems: 'flex-end' }}>
            <ArrowRight />
          </View>
        </TouchableOpacity>
        <Modal
          isVisible={timeModal}
          animationIn="slideInUp"
          animationInTiming={450}
          animationOut="slideOutDown"
          animationOutTiming={450}
          style={{margin: 0, justifyContent: 'flex-end'}}
          customBackdrop={
            <TouchableWithoutFeedback
              onPress={() => showTimeModal(false)}>
              <View style={{flex: 1, backgroundColor: 'black'}} />
            </TouchableWithoutFeedback>
          }>
            <View 
              style={{
              backgroundColor: 'white',
              height: '28%',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              paddingHorizontal: 20
            }}>
              
            <BottomSheetHeader />
            <View style={{paddingTop: 30}}>
              <AppText textStyle="body3">Set Time</AppText>
              <TouchableOpacity
                style={{ marginTop: 40, paddingVertical: 12, width: '100%', alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 3 }}
                onPress={() => showDateModal(true)}>
                <AppText textStyle="button2">
                  Next: Set Date
                </AppText>
              </TouchableOpacity>
            </View>
            <Modal
              isVisible={dateModal}
              animationIn="slideInUp"
              animationInTiming={450}
              animationOut="slideOutDown"
              animationOutTiming={450}
              style={{margin: 0, justifyContent: 'flex-end'}}
              customBackdrop={
                <TouchableWithoutFeedback
                  onPress={() => showDateModal(false)}>
                  <View style={{flex: 1, backgroundColor: 'transparent'}} />
                </TouchableWithoutFeedback>
              }>
              <View 
                style={{
                backgroundColor: 'white',
                height: '28%',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                paddingHorizontal: 20
              }}>
                
              <BottomSheetHeader />
              <View style={{paddingTop: 30}}>
                <AppText textStyle="body3">Set Date</AppText>
                <TouchableOpacity
                  style={{ marginTop: 40, paddingVertical: 12, width: '100%', alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 3 }}
                  onPress={() => [showDateModal(false), showTimeModal(false)]}>
                  <AppText textStyle="button2">
                    Save
                  </AppText>
                </TouchableOpacity>
              </View>

              <Modal
                isVisible={dateModal}
                animationIn="slideInUp"
                animationInTiming={450}
                animationOut="slideOutDown"
                animationOutTiming={450}
                style={{margin: 0, justifyContent: 'flex-end'}}
                customBackdrop={
                  <TouchableWithoutFeedback
                    onPress={() => [showDateModal(false), showTimeModal(false)]}>
                    <View style={{flex: 1, backgroundColor: 'transparent'}} />
                  </TouchableWithoutFeedback>
                }>
              </Modal>
            </View>
            </Modal>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: normalize(14),
    marginTop: normalize(20),
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
})


export default PostExpiryModal;