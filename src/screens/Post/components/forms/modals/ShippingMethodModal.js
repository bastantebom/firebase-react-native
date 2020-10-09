import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  PaddingView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native';

import Slider from '@react-native-community/slider';

import {
  AppText,
  AppCheckbox,
  Switch,
  ScreenHeaderTitle,
} from '@/components';

import { ArrowRight } from '@/assets/images/icons';

import { Colors, normalize } from '@/globals';

const ShippingMethodModal = ({ closeModal }) => {
  const [pickUp, setPickUp] = useState(false)
  const [delivery, setDelivery] = useState(false)
  const [nationwide, setNationwide] = useState(false)
  const [within, setWithin] = useState(false)
  const [activeSwitch, setActiveSwitch] = useState(null)

  const toggleSwitch = (switchNumber) => {
    setActiveSwitch({
      activeSwitch: switchNumber === activeSwitch ? null : switchNumber
    })
  };

  const switchOne = (value) => { setActiveSwitch(1) };
  const switchTwo = (value) => { setActiveSwitch(2) };

  console.log(activeSwitch)
  return (
    <SafeAreaView style={{ flex: 1 }} >
      <ScreenHeaderTitle
        close={closeModal}
        title="Shipping Methods"
        paddingSize={2}
      />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.withBorder}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <AppText textStyle="body3">Pick up</AppText>
            <Switch
              // value={pickUp}
              // onValueChange={() => setPickUp(!pickUp)}
              onValueChange={() => setActiveSwitch(1)}
              value={activeSwitch === 1}
            />
          </View>
          <AppText textStyle="captionDashboard" color={Colors.contentPlaceholder}>
            Orders can be picked up at your specified address.
          </AppText>
          {activeSwitch === 1 && (
            <TouchableOpacity style={styles.btn}>
              <View style={{ flex: .75 }}>
                <View style={{ flexDirection: 'row' }}>
                  <AppText textStyle="body2">Reynan Barbero</AppText>
                  <AppText textStyle="body3" customStyle={{ marginLeft: normalize(5) }}>(Default)</AppText>
                </View>
                <Text style={{ fontFamily: 'RoundedMplus1c-Regular', fontSize: 15 }} numberOfLines={1} ellipsizeMode='tail'>Reynan Barbero Capitol Branch, Hon. B. Soli</Text>
              </View>
              <View style={{ flex: .25, justifyContent: 'center', alignItems: 'flex-end' }}>
                <ArrowRight />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ paddingVertical: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
            <AppText textStyle="body3">Delivery</AppText>
            <Switch
              // value={delivery}
              // onValueChange={() => setDelivery(!delivery)}
              // onValueChange={switchTwo}
              onValueChange={() => setActiveSwitch(2)}
              value={activeSwitch === 2}
            />
          </View>
          <AppText textStyle="captionDashboard" color={Colors.contentPlaceholder}>
            Orders can be shipped nationwide or within your specifid area.
          </AppText>
          {activeSwitch === 2 && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: normalize(20),
                }}>
                <AppCheckbox
                  style={{ paddingLeft: 0 }}
                  value={nationwide}
                  valueChangeHandler={() => setNationwide(!nationwide)}
                />
                <AppText>Nationwide</AppText>
              </View>
              {nationwide && (
                <TextInput
                  // value={description}
                  multiline={true}
                  placeholder="Are there additional delivery fees and options? (Optional)"
                  placeholderTextColor={Colors.neutralGray}
                  numberOfLines={Platform.OS === 'ios' ? null : 6}
                  minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
                  style={{
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
                    textAlign: 'left',
                  }}
                  // onChangeText={(text) => setDescription(text)}
                  underlineColorAndroid={'transparent'}
                  textAlignVertical="top"
                  scrollEnabled={false}
                />
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <AppCheckbox
                  style={{ paddingLeft: 0 }}
                  value={within}
                  valueChangeHandler={() => setWithin(!within)}
                />
                <AppText>Within your specified area</AppText>
              </View>
              {within && (
                <TextInput
                  // value={description}
                  multiline={true}
                  placeholder="Are there additional delivery fees and options? (Optional)"
                  placeholderTextColor={Colors.neutralGray}
                  numberOfLines={Platform.OS === 'ios' ? null : 6}
                  minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
                  style={{
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
                    textAlign: 'left',
                  }}
                  // onChangeText={(text) => setDescription(text)}
                  underlineColorAndroid={'transparent'}
                  textAlignVertical="top"
                  scrollEnabled={false}
                />
              )}
              <PaddingView paddingSize={2}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: normalize(45), marginBottom: 20 }}>
                  <AppText textStyle="promo">Browse Offers Within</AppText>
                  <AppText textStyle="caption" color="#999">{rangeValue} KM</AppText>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <AppText textStyle="caption" color="#999">0</AppText>
                  <Slider
                    style={{width: '90%'}}
                    minimumValue={0}
                    maximumValue={200}
                    step={5}
                    value={rangeValue}
                    onValueChange={rangeValue => setRangeValue(rangeValue)}
                    minimumTrackTintColor={Colors.primaryYellow}
                    maximumTrackTintColor={Colors.neutralGray}
                    thumbTintColor={Colors.primaryYellow}
                  />
                  <AppText textStyle="caption" color="#999">200</AppText>
                </View>
              </PaddingView>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    paddingVertical: 20
  },
  btn: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(14),
    marginTop: normalize(20),
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 4,
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
})

export default ShippingMethodModal;