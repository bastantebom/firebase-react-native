import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

//screens
import Onboarding from '@/screens/onboarding';
import VerifyAccount from '@/screens/VerifyAccount';
import ResetPassword from '@/screens/resetPassword';
import Dashboard from '@/screens/dashboard';
import Profile from '@/screens/profile';

const AuthStack = createStackNavigator();

function AuthStackScreen() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <AuthStack.Navigator headerMode="none">
      { !user ? (
        <>
          <AuthStack.Screen name="Onboarding" component={Onboarding} />
          <AuthStack.Screen name="VerifyAccount" component={VerifyAccount} />
          <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
          <AuthStack.Screen name="Dashboard" component={Dashboard} />
        </>
      ) : (
        <>
          <AuthStack.Screen name="Dashboard" component={Dashboard} />
          <AuthStack.Screen name="Profile" component={Profile} />
          <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
        </>
      )}
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
