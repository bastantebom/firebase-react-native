import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Button
} from 'react-native';

import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  AppText,
  AppRadio,
  BottomSheetHeader
} from '@/components';

import SetDateModal from './SetTimeModal';

import {normalize} from '@/globals';

import {
  Public
} from '@/assets/images/icons';

const SetTimeModal = () => { 
  const [timeModal, showTimeModal] = useState(false);
  const [dateModal, showDateModal] = useState(false);
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };


  return (
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
          onPress={() => [showDateModal(true), showTimeModal(false)]}>
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
            <View style={{flex: 1, backgroundColor: 'black'}} />
          </TouchableWithoutFeedback>
        }>
        <SetDateModal closeModal={() => showDateModal(false)} />
      </Modal>
    </View>
  );
}

export default SetTimeModal;