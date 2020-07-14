import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

//screens
import Onboarding from '@/screens/onboarding';
import VerifyAccount from '@/screens/SignUp/VerifyAccount';
import Dashboard from '@/screens/dashboard';
import ResetPassword from '@/screens/resetPassword';

const AuthStack = createStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator headerMode="none">
      <AuthStack.Screen name="Onboarding" component={Onboarding} />
      <AuthStack.Screen name="VerifyAccount" component={VerifyAccount} />
      <AuthStack.Screen name="Dashboard" component={Dashboard} />
      <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
    </AuthStack.Navigator>
  );
}

function Routes() {
  return (
    <NavigationContainer>
      <AuthStackScreen />
    </NavigationContainer>
  );
}

export default Routes;
