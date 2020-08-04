import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View} from 'react-native';

//screens
import {Onboarding} from '@/screens/Onboarding';
import {Dashboard} from '@/screens/Dashboard';
import {Profile} from '@/screens/Profile';
import {Hives} from '@/screens/Hive';
import {Post} from '@/screens/Post';
import {Activity} from '@/screens/Activity';
import {
  AlmostThere,
  AlmostThereMap,
  VerifyAccount,
  ResetPassword,
} from '@/screens/Authentication';

import {normalize} from '@/globals';

import {
  ServbeesAlt,
  ServbeesAltActive,
  Hive,
  HiveActive,
  Bell,
  BellActive,
  UserAlt,
  UserAltActive,
  PostBG,
  PostPlus,
} from '@/assets/images/icons';

const AuthStack = createStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator headerMode="none">
      <AuthStack.Screen name="Onboarding" component={Onboarding} />
      <AuthStack.Screen name="VerifyAccount" component={VerifyAccount} />
      <AuthStack.Screen name="AlmostThere" component={AlmostThere} />
      <AuthStack.Screen name="AlmostThereMap" component={AlmostThereMap} />
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
      <DashboardStack.Screen name="VerifyAccount" component={VerifyAccount} />
    </DashboardStack.Navigator>
  );
}

function HiveStackScreen() {
  return (
    <HiveStack.Navigator headerMode="none">
      <HiveStack.Screen name="Hives" component={Hives} />
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
    <ProfileStack.Navigator headerMode="screen">
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
    </ProfileStack.Navigator>
  );
}

function TabStack() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        tabStyle: {
          flex: 1,
          alignItems: 'center',
        },
        labelStyle: {
          fontSize: normalize(12),
          fontWeight: '700',
        },
        inactiveTintColor: '#8C8B98',
        activeTintColor: '#1F1A54',
      }}>
      <Tab.Screen
        name="Servbees"
        component={DashboardStackScreen}
        options={{
          tabBarIcon: ({focused}) => {
            const icon = focused ? <ServbeesAltActive /> : <ServbeesAlt />;
            return <>{icon}</>;
          },
        }}
      />
      <Tab.Screen
        name="Hives"
        component={HiveStackScreen}
        options={{
          tabBarIcon: ({focused}) => {
            const icon = focused ? <HiveActive /> : <Hive />;
            return <>{icon}</>;
          },
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostStackScreen}
        options={{
          tabBarIcon: () => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 15,
              }}>
              <View style={{position: 'relative'}}>
                <PostBG />
              </View>
              <View style={{position: 'absolute'}}>
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
          tabBarIcon: ({focused}) => {
            const icon = focused ? <BellActive /> : <Bell />;
            return <>{icon}</>;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({focused}) => {
            const icon = focused ? <UserAltActive /> : <UserAlt />;
            return <>{icon}</>;
          },
        }}
      />
    </Tab.Navigator>
  );
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
      {!user ? <AuthStackScreen /> : <TabStack />}
    </NavigationContainer>
  );
}

export default Routes;
