import React, {useContext} from 'react';
import {Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Context} from '@/context';

const WhiteOpacity = () => {
  const {showButtons} = useContext(Context);
  
  if (showButtons)
    return (
      <LinearGradient
        style={{
          position: 'absolute',
          bottom: 0,
          height: Dimensions.get('window').height,
          width: '100%',
        }}
        colors={['rgba(255,255,255, 0)', 'rgba(255,255,255, 1)']}
        locations={[0.1, 1]}
      />
    );

  return null;
};

export default WhiteOpacity;
