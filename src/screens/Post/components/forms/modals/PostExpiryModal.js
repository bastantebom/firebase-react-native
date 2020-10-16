import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Keyboard,
  DatePickerIOS
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


const PostExpiryModal = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  // const onChange = (selectedDate, selectedTime) => {
  //   const currentDate = selectedDate || date;
  //   setShow(Platform.OS === 'ios');
  //   setDate(currentDate);
  //   setTime(selectedTime);
  //   const currentDate = selectedDate || date;
  //   setShow(Platform.OS === 'ios');
  //   setDate(date);
  //   const dateSelected = moment(currentDate).format('LL');
  //   setSelectedDate(moment.utc(date).format('MMMM D, YYYY'));
  // };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    // const currentTime = selectedTime || time;
    setShow(Platform.OS === 'ios');
    setDate(currentDate)
    // setTime(currentTime)
    const dateSelected = moment(currentDate).format('LL');
    setSelectedDate(dateSelected);
    // const timeSelected = moment(currentDate).format('h:mm A');
    // setSelectedTime(timeSelected);
  };

  const onChangeTime = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    // const currentTime = selectedTime || time;
    setShow(Platform.OS === 'ios');
    // setDate(currentDate)
    // setTime(currentTime)
    // const dateSelected = moment(currentDate).format('LL');
    // setSelectedDate(dateSelected);
    const timeSelected = moment(currentDate).format('h:mm A');
    setSelectedTime(timeSelected);
  };

  // const showModeDate = (currentMode) => {
  //   setShow(true);
  // setShowTime(true);
  //   setMode(currentMode);
  // };

  // const showModeTime = (currentMode) => {
  // setShow(true);
  //   setShowTime(true);
  //   setMode(currentMode);
  // };

  const showDatepicker = () => {
    // showMode('date');
    setShow(true);
  };

  const showTimepicker = () => {
    // showMode('time');
    setShowTime(true);
  };

  // useEffect(() => {
  //   if (date) {
  //     setSelectedDate(moment.utc(date).format('MMMM D, YYYY'));
  //     setSelectedTime(moment(date).format('h:mm A'));
  //   }
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText textStyle="button2">
                Set Date
              </AppText>
              <Text>
                {selectedDate ?
                  <AppText textStyle="button2">: {selectedDate}</AppText> : ' '
                }
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnTransparent}
            onPress={showTimepicker}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText textStyle="button2">
                Set Time
                </AppText>
              <Text>
                {selectedTime ?
                  <AppText textStyle="button2">: {selectedTime}</AppText> : ' '
                }
              </Text>
            </View>
          </TouchableOpacity>
          <View>
            {show && (
              <DateTimePicker
                value={date}
                mode='date'
                // display={mode == 'time' ? 'spinner' : ''}
                onChange={onChangeDate}
              />
            )}
            {showTime && (
              <DateTimePicker
                value={date}
                mode='time'
                display='spinner'
                onChange={onChangeTime}
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