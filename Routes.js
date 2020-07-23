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
import { Dashboard } from '@/screens/Dashboard';
import Profile from '@/screens/profile';
import Hives from '@/screens/hive';
import Post from '@/screens/post';
import Activity from '@/screens/activity';

import { ServbeesAlt, Hive, Bell, UserAlt, PostBG, PostPlus } from '@/assets/images/icons';

const AuthStack = createStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator headerMode="none">
      <AuthStack.Screen name="Onboarding" component={Onboarding} />
      <AuthStack.Screen name="VerifyAccount" component={VerifyAccount} />
      <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
      <AuthStack.Screen name="Dashboard" component={Dashboard} />
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
      <PostStack.Screen name="Hive" component={Hives} />
    </HiveStack.Navigator >
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

function TabStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Servbees"
        component={DashboardStackScreen}
        options={{
          tabBarIcon: () => (
            <ServbeesAlt />
          ),
        }}
      />
      <Tab.Screen
        name="Hives"
        component={HiveStackScreen}
        options={{
          tabBarIcon: () => (
            <Hive />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostStackScreen}
        options={{
          tabBarIcon: () => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
              <View style={{ position: 'relative' }}>
                <PostBG />
              </View>
              <View style={{ position: 'absolute' }}>
                <PostPlus />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityStackScreen}
        options={{
          tabBarIcon: () => (
            <Bell />
          ),
        }}
      />
      <Tab.Screen
        name="You"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: () => (
            <UserAlt />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

function Routes() {

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
    <NavigationContainer>
      {!user ? (
        <AuthStackScreen />
      ) : (
          <TabStack />
        )}
    </NavigationContainer>
  );
}

export default Routes;