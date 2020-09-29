import React from 'react';
import {View} from 'react-native';

import {AppText} from '@/components';

const Validator = (props) => {
  const {children, errorState, setErrorState, value} = props;
  console.log(value);

  let textStyle = {
    display: errorState.shown ? 'flex' : 'none',
  };

  return (
    <View>
      {children}
      <AppText color={"red"} customStyle={textStyle}>{errorState.message}</AppText>
    </View>
  );
};

export default Validator;
