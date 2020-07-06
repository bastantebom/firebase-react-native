import React from 'react';
import { 
  Text, 
  View,
  ScrollView
} from 'react-native';
import SlidePanel from '../components/SlidingPanel';

function Onboarding() {

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={{flex: 1, flexGrow: 1}}>
        <SlidePanel
        >
          <Text>HI THIS IS A SAMPLE TEXT</Text>
        </SlidePanel>
      </View>
    </ScrollView>
  );
}


export default Onboarding;