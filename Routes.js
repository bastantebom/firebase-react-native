import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Text, View } from 'react-native';

//screens
import Onboarding from '@/screens/onboarding';
import VerifyAccount from '@/screens/VerifyAccount';
import ResetPassword from '@/screens/resetPassword';
import Dashboard from '@/screens/dashboard';
import Profile from '@/screens/profile';
import Hive from '@/screens/hive';
import Post from '@/screens/post';
import Activity from '@/screens/activity';

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
      {!user ?
        (
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
        )
      }
    </AuthStack.Navigator>
  );
}

const DashboardStack = createStackNavigator();
const HiveStack = createStackNavigator();
const PostStack = createStackNavigator();
const ActivityStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardStackScreen() {
  return (
    <DashboardStack.Navigator headerMode="none">
      <DashboardStack.Screen name="Servbees" component={Dashboard} />
    </DashboardStack.Navigator>
  );
}

function HiveStackScreen() {
  return (
    <HiveStack.Navigator headerMode="none">
      <PostStack.Screen name="Hive" component={Hive} />
    </HiveStack.Navigator>
  );
}

function PostStackScreen() {
  return (
    <PostStack.Navigator headerMode="none">
      <PostStack.Screen name="Post" component={Post} />
    </PostStack.Navigator>
  );
}

function ActivityStackScreen() {
  return (
    <ActivityStack.Navigator headerMode="none">
      <ActivityStack.Screen name="Activity" component={Activity} />
    </ActivityStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator headerMode="none">
      <ProfileStack.Screen name="You" component={Profile} />
    </ProfileStack.Navigator>
  );
}

function Routes() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Servbees" component={DashboardStackScreen} />
        <Tab.Screen name="Hive" component={HiveStackScreen} />
        <Tab.Screen name="Post" component={PostStackScreen} />
        <Tab.Screen name="Activity" component={ActivityStackScreen} />
        <Tab.Screen name="You" component={ProfileStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default Routes;