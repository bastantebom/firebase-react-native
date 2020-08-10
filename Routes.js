import React, {useEffect, useState, useContext} from 'react';
import {
  NavigationContainer,
  TouchableWithoutFeedback,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View} from 'react-native';

//screens
import {Onboarding} from '@/screens/Onboarding';
import {Dashboard} from '@/screens/Dashboard';
import {Profile} from '@/screens/Profile';
import {Hives} from '@/screens/Hive';
import {Activity} from '@/screens/Activity';
import {Post, SinglePostView} from '@/screens/Post';
import {PostScreen} from '@/screens/Post';

import {
  AlmostThere,
  AlmostThereMap,
  VerifyAccount,
  ResetPassword,
} from '@/screens/Authentication';

import {normalize} from '@/globals';
import {Context} from '@/context';
import {UserContext} from '@/context/UserContext';

import {
  ServbeesAlt,
  ServbeesAltActive,
  Hive,
  HiveActive,
  Bell,
  BellActive,
  UserAlt,
  UserAltActive,
  NotificationDot,
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
      <AuthStack.Screen name="TabStack" component={TabStack} />
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
      <HiveStack.Screen name="Hive" component={Hives} />
    </HiveStack.Navigator>
  );
}

function PostStackScreen() {
  const { user } = useContext(UserContext);

  return (
    <>
      {/* { !user ? null :  */}
        <PostStack.Navigator headerMode="none">
          <PostStack.Screen name="PostScreen" component={PostScreen} />
          <PostStack.Screen
            name="SinglePostView"
            component={SinglePostView}
          />
        </PostStack.Navigator>
       {/* } */}
    </>
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
    <>
      <ProfileStack.Navigator headerMode="none">
        <ProfileStack.Screen name="Profile" component={Profile} />
      </ProfileStack.Navigator>
    </>
  );
}

function TabStack() {
  const [activityNotification, setActivityNotification] = useState(true);
  const [profileNotification, setProfileNotification] = useState(true);
  const {closePostButtons} = useContext(Context);

  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          borderTopWidth: 0,
          elevation: 0,
          position: 'relative',
        },
        tabStyle: {
          flex: 1,
          alignItems: 'center',
        },
        labelStyle: {
          fontSize: normalize(12),
          fontFamily: 'RoundedMplus1c-Medium',
        },
        inactiveTintColor: '#8C8B98',
        activeTintColor: '#1F1A54',
      }}>
      <Tab.Screen
        name="Servbees"
        component={DashboardStackScreen}
        options={{
          tabBarIcon: ({focused}) => {
            const icon = focused ? (
              <ServbeesAltActive width={normalize(25)} height={normalize(25)} />
            ) : (
              <ServbeesAlt width={normalize(25)} height={normalize(25)} />
            );
            return <>{icon}</>;
          },
          tabBarOnPress: () => {
            closePostButtons;
          },
        }}
      />
      <Tab.Screen
        name="Hive"
        component={HiveStackScreen}
        options={{
          tabBarIcon: ({focused}) => {
            const icon = focused ? (
              <HiveActive width={normalize(25)} height={normalize(25)} />
            ) : (
              <Hive width={normalize(25)} height={normalize(25)} />
            );
            return <>{icon}</>;
          },
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostStackScreen}
        options={{
          tabBarButton: () => <Post />,
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityStackScreen}
        options={{
          tabBarIcon: ({focused}) => {
            const icon = focused ? (
              <BellActive width={normalize(25)} height={normalize(25)} />
            ) : (
              <Bell width={normalize(25)} height={normalize(25)} />
            );
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {activityNotification && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 3,
                      right: 1,
                      zIndex: 2,
                    }}>
                    <NotificationDot
                      width={normalize(11)}
                      height={normalize(11)}
                    />
                  </View>
                )}
                <View
                  style={{
                    position: 'relative',
                  }}>
                  {icon}
                </View>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({focused}) => {
            const icon = focused ? (
              <UserAltActive width={normalize(25)} height={normalize(25)} />
            ) : (
              <UserAlt width={normalize(25)} height={normalize(25)} />
            );
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {profileNotification && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 3,
                      right: 1,
                      zIndex: 2,
                    }}>
                    <NotificationDot
                      width={normalize(11)}
                      height={normalize(11)}
                    />
                  </View>
                )}
                <View
                  style={{
                    position: 'relative',
                  }}>
                  {icon}
                </View>
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

function Routes() {
  const {isLoggedIn} = useContext(UserContext);

  return (
    <NavigationContainer>
      {!user ? <AuthStackScreen /> : <TabStack />}
    </NavigationContainer>
  );
}

export default Routes;
