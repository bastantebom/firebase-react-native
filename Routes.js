import React, {useEffect, useState, useContext} from 'react';
import {
  NavigationContainer,
  TouchableWithoutFeedback,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Animated, Linking} from 'react-native';
import SplashScreenComponent from './SplashScreen';

import {Notification} from '@/components';
import {useNavigation} from '@react-navigation/native';

//screens
import {Onboarding} from '@/screens/Onboarding';
import {Dashboard} from '@/screens/Dashboard';
import {Profile} from '@/screens/Profile';
import {Hives} from '@/screens/Hive';
import {Activity} from '@/screens/Activity';
import {Post, SinglePostView} from '@/screens/Post';
import {PostScreen} from '@/screens/Post';
import SampleScreen from '@/screens/SampleScreen';

import {ProfileInfoModal, SinglePostOthersView} from '@/components';

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
import {SafeAreaView} from 'react-navigation';

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
      <AuthStack.Screen name="NBTScreen" component={NoBottomTabScreens} />
    </AuthStack.Navigator>
  );
}

const DashboardStack = createStackNavigator();
const HiveStack = createStackNavigator();
const PostStack = createStackNavigator();
const ActivityStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();
const NoBottomTabScreenStack = createStackNavigator();

// function HomeTabs() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen
//         name="Sampley"
//         component={SampleScreen}
//         // options={{tabBarVisible: false}}
//       />
//       <Tab.Screen name="Samplez" component={SampleScreen2} />
//     </Tab.Navigator>
//   );
// }

// START: Put screens without bottom tab navigation here
function NoBottomTabScreens() {
  return (
    <NoBottomTabScreenStack.Navigator headerMode="none">
      <NoBottomTabScreenStack.Screen
        name="OthersProfile"
        component={ProfileInfoModal}
      />
      <NoBottomTabScreenStack.Screen
        name="OthersPost"
        component={SinglePostView}
      />
    </NoBottomTabScreenStack.Navigator>
  );
}
// END: Put screens without bottom tab navigation here

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

function PostStackScreen({navigation}) {
  const {user} = useContext(UserContext);

  return (
    <>
      {/* { !user ? null :  */}
      <PostStack.Navigator headerMode="none">
        <PostStack.Screen name="PostScreen" component={PostScreen} />
        <PostStack.Screen name="SinglePostView" component={SinglePostView} />
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
  const [profileNotification, setProfileNotification] = useState(false);
  const {closePostButtons} = useContext(Context);

  const navigation = useNavigation();

  console.log('ROUTES PROPS');
  console.log(navigation);

  useEffect(() => {
    console.log('dashboard');
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then((url) => {
        navigation.navigate(url);
      });
    } else {
      Linking.addEventListener('url', handleOpenURL);
    }
  });

  const handleOpenURL = (event) => {
    navigate(event.url);
  };

  const navigate = (url) => {
    const route = url.replace(/.*?:\/\//g, '');
    const routeName = route.split('/')[0];

    console.log(routeName);
    if (routeName === 'profile') {
      navigation.navigate('Profile', {
        screen: 'Profile',
      });
    }
    if (routeName === 'dashboard') {
      navigation.navigate('Servbees');
    }
  };

  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          // borderTopWidth: 0,
          // elevation: 25,
          position: 'relative',
          paddingHorizontal: normalize(60),
        },
        tabStyle: {
          flex: 1,
          alignItems: 'center',
        },
        labelStyle: {
          fontSize: normalize(13),
          fontFamily: 'RoundedMplus1c-Regular',
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
      {/* <Tab.Screen
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
      /> */}
      <Tab.Screen
        name="Post"
        component={PostStackScreen}
        options={{
          tabBarButton: () => <Post />,
        }}
      />
      {/* <Tab.Screen
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
      /> */}
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
  const {user} = useContext(UserContext);
  const {deleteNotif, setDeleteNotif} = useContext(Context);

  const [containerOpacity] = useState(new Animated.Value(0));

  let fadingContainerStyle = {
    opacity: containerOpacity,
    flex: 1,
  };

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);

      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 750,
        useNativeDriver: false,
      }).start();
    }, 2500);
  }, []);

  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) return <SplashScreenComponent />;

  // const DeleteNotification = () => {
  //   if (deleteNotif) {
  //     return (
  //       <SafeAreaView>
  //         <Notification type={'verified'} position="relative" />
  //       </SafeAreaView>
  //     );
  //   }

  //   return <></>;
  // };

  return (
    <Animated.View style={fadingContainerStyle}>
      <NavigationContainer>
        {!user ? (
          <AuthStackScreen />
        ) : (
          // <TabStack />
          <Stack.Navigator headerMode="none">
            {/* <Stack.Screen name="TabStack" component={SampleScreen} /> */}
            <Stack.Screen name="TabStack" component={TabStack} />
            <Stack.Screen name="NBTScreen" component={NoBottomTabScreens} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </Animated.View>
  );
}

// const MainScreens = () => {
//   const navigation = useNavigation();

//   console.log('ROUTES PROPS');
//   console.log(navigation);
//   return <Stack.Screen name="TabStack" component={TabStack} />;
// };

export default Routes;
