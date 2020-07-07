import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

//screens
import Onboarding from './src/screens/onboarding';

function Routes() {
  return (
    <NavigationContainer>
      <Onboarding/>
    </NavigationContainer>
  );
}

export default Routes;