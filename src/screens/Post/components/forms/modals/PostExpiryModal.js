import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Keyboard
} from 'react-native';

import Modal from 'react-native-modal';
import CalendarPicker from 'react-native-calendar-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import TimePicker from 'react-native-simple-time-picker';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

import {
  AppText,
  ScreenHeaderTitle,
  BottomSheetHeader,
  FloatingAppInput
} from '@/components';
import { normalize } from '@/globals';
import { CalendarArrowLeft, CalendarArrowRight, ArrowRight, Calendar } from '@/assets/images/icons';


const PostExpiryModal = ({ closeModal }) => {
  const navigation = useNavigation();
  const [timeModal, showTimeModal] = useState(false);
  const [dateModal, showDateModal] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const minDate = new Date(); // Today
  const maxDate = new Date(3000, 12, 31);
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setShowTime(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const setDateFromString = () => {
    if (date) {
      setDate(moment(new Date(date)).toDate());
    }
  };

  // useEffect(() => {
  //   setDateFromString();
  // })

  return (
    <View>
      <ScreenHeaderTitle
        title="Post Expiry"
        paddingSize={2}
        close={() => navigation.goBack()}
      />
      <View style={{ padding: normalize(16), height: '100%' }}>
        <View style={{ flex: .8 }}>
          <AppText textStyle="body2">Something, something</AppText>
          <AppText textStyle="captionDashboard">Something, something</AppText>
          <TouchableOpacity
            style={styles.btnTransparent}
            onPress={showDatepicker}>
            <AppText textStyle="button2">
              Set Date
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnTransparent}
            onPress={showTimepicker}>
            <AppText textStyle="button2">
              Set Time
            </AppText>
          </TouchableOpacity>
          <View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                display={mode == 'time' ? 'spinner' : ''}
                onChange={onChange}
              />
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.btnYellow}
        // onPress={() => [showDateModal(false), showTimeModal(false)]}
        >
          <AppText textStyle="button2">
            Set Post Expiry
          </AppText>
        </TouchableOpacity>
        {/* <TouchableOpacity 
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
        </TouchableOpacity> */}
        {/* <Modal
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
              // height: '28%',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              paddingHorizontal: 20,
              paddingBottom: 30
            }}>
              
            <BottomSheetHeader />
            <View style={{paddingTop: 30}}>
              <AppText textStyle="body3">Set Time</AppText>
              <View style={{position: 'relative'}}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={false}
                  display="spinner"
                  // onChange={onChange}
                />
                 <Text>
                  Selected Time: {selectedHours}:{selectedMinutes}
                </Text>
                <TimePicker
                  selectedHours={selectedHours}
                  //initial Hourse value
                  selectedMinutes={selectedMinutes}
                  //initial Minutes value
                  onChange={(hours, minutes) => {
                    setSelectedHours(hours);
                    setSelectedMinutes(minutes);
                  }}
                />
                <TouchableOpacity
                  style={{ marginTop: 40, paddingVertical: 12, width: '100%', alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 3 }}
                  onPress={() => showDateModal(true)}>
                  <AppText textStyle="button2">
                    Next: Set Date
                  </AppText>
                </TouchableOpacity>
              </View>
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
              <View 
                style={{
                backgroundColor: 'white',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                paddingHorizontal: 20,
                paddingBottom: 30
              }}>
                
              <BottomSheetHeader />
              <View style={{paddingTop: 30}}>
                <AppText textStyle="body3">Set Date</AppText>
                <View style={{zIndex: 999999, paddingTop: 20}}>
                  <CalendarPicker
                    startFromMonday={true}
                    allowRangeSelection={true}
                    minDate={minDate}
                    maxDate={maxDate}
                    todayBackgroundColor="#1F1A54"
                    selectedDayColor="#1F1A54"
                    selectedDayTextColor="#FFFFFF"
                    // onDateChange={onDateChange}
                    previousTitle={<><CalendarArrowLeft /></>}
                    nextTitle={<><CalendarArrowRight /></>}
                    dayShape="square"
                  />
                  <TouchableOpacity
                    style={{ marginTop: 40, paddingVertical: 12, width: '100%', alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 3 }}
                    onPress={() => [showDateModal(false), showTimeModal(false)]}>
                    <AppText textStyle="button2">
                      Save
                    </AppText>
                  </TouchableOpacity>
                </View>
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
        </Modal> */}
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
  },
  btnTransparent: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 3,
    marginTop: normalize(20)
  },
  btnYellow: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFD400',
    borderRadius: 3
  }
})


export default PostExpiryModal;