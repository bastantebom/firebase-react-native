import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {AppText} from '@/components';
import {useNavigation} from '@react-navigation/native';

const SampleScreen = () => {
  console.log('SAMPLE SCREEN');

  const navigation = useNavigation();

  console.log(navigation);

  const goTo = () => {
      navigation.navigate("Profile")
  }

  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <TouchableOpacity onPress={goTo}>
        <AppText>SAMPLE SCREEN 1</AppText>
      </TouchableOpacity>
    </View>
  );
};

export default SampleScreen;
