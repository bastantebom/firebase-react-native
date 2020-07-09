import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//screens
import Onboarding from './src/screens/onboarding';
import Dashboard from './src/screens/dashboard';

const AuthStack = createStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator
      headerMode="none"
    >
      <AuthStack.Screen
        name="Onboarding"
        component={Onboarding}
      />
      <AuthStack.Screen
        name="Dashboard"
        component={Dashboard}
      />
    </AuthStack.Navigator>
  )
}

function Routes() {
  return (
    <NavigationContainer>
      <AuthStackScreen/>
    </NavigationContainer>
  );
}

export default Routes;