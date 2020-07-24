//import liraries
import React, {useState} from 'react';
import {Switch, StyleSheet} from 'react-native';
import AppColor from '@/globals/Colors';

// create a component
const SwitchComponent = (props) => {
  return (
    <Switch
      trackColor={{
        false: AppColor.neutralsIron,
        true: AppColor.primaryYellow,
      }}
      {...props}
    />
  );
};

// define your styles

//make this component available to the app
export default SwitchComponent;
