import React from 'react';
import {View} from 'react-native';

import {AppText} from '@/components';

const Validator = (props) => {
  const {children, errorState, message} = props;

  let textStyle = {
    display: errorState ? 'none' : 'flex',
  };

  return (
    <View>
      {children}
      <AppText customStyle={textStyle}>Validator Error</AppText>
    </View>
  );
};

export default Validator;
