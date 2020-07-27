import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';

import {AppText, AppViewContainer} from '@/components';
import {normalize} from '@/globals';

import {AppRadio, AppCheckbox} from '@/components';

const FilterSlider = () => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
      }}>
      <AppViewContainer paddingSize={3}>
        <View style={{flexDirection: 'row'}}>
          <AppText customStyle={{flex: 1}}>Hello</AppText>

          <TouchableOpacity
            onPress={() => setModalState(false)}
            style={{justifyContent: 'flex-end', backgroundColor: 'red'}}>
            <Text>I am the modal content!</Text>
          </TouchableOpacity>
        </View>

        <AppRadio></AppRadio>

        <AppCheckbox />
      </AppViewContainer>
    </View>
  );
};

export default FilterSlider;
