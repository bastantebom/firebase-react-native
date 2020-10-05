import React, { useEffect } from 'react';
import { View } from 'react-native';
import { AppText } from '@/components';

export default Highlight = ({ hit }) => {

  useEffect(() => {
    console.log(hit._highlightResult)
  }, [hit])

  return (
    <View style={{ flexWrap: 'wrap', flex: 0, flexDirection: 'row' }}>
      <AppText 
        textStyle={'body2'} 
      >
        {hit._highlightResult.title.value}
      </AppText>
    </View>
  );
};

