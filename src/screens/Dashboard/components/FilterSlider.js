import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';

import {AppText} from '@/components';
import {normalize} from '@/globals';

const FilterSlider = () => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
      }}>
      <SafeAreaView style={{flex: 1}}>
        <View style={{flexDirection: 'row'}}>
          <AppText customStyle={{flex: 1}}>Hello</AppText>

          <TouchableOpacity
            onPress={() => setModalState(false)}
            style={{justifyContent: 'flex-end', backgroundColor: 'red'}}>
            <Text>I am the modal content!</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default FilterSlider;
