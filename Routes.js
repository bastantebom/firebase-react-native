import React, { useEffect, useState, useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Animated } from 'react-native'
import SplashScreenComponent from './SplashScreen'

import Bell from '@/assets/images/icons/bell.svg'
import BellActive from '@/assets/images/icons/bell-active.svg'
import Hive from '@/assets/images/icons/hive.svg'
import HiveActive from '@/assets/images/icons/hive-active.svg'

//screens
import { Onboarding } from '@/screens/Onboarding'
import DashboardStack from '@/screens/Dashboard'
import LikedPostsScreen from '@/screens/Dashboard/liked-posts-screen'
import VerificationStack from '@/screens/Verification'
import ProfileScreen from '@/screens/Profile/profile'
import OwnMenuScreen from '@/components/TransparentHeader/components/OwnMenu'
import EditProfileScreen from '@/screens/Profile/edit-profile'
import PayoutMethodStack from '@/screens/Profile/payout-method'
import InviteFriendsScreen from '@/screens/Profile/invite-friends'
import UpdateTemperature from '@/screens/Profile/update-temperature'
import TemperatureHistory from '@/screens/Profile/temperature-history'
import TemperatureAbout from '@/screens/Profile/temperature-about'
import BlockUser from '@/screens/Profile/block-user'

import { GuestProfile } from '@/screens/Profile/components/GuestProfile'
import ChangePasswordScreen from '@/screens/Profile/change-password'
import ReportScreen from '@/screens/Profile/report'
import { Hives } from '@/screens/Hive'
import { Activity } from '@/screens/Activity'
import ChatScreen from '@/screens/Chat'
import PaymentsStack from '@/screens/payments'
import OrdersStack from '@/screens/orders'
import UnavailableNetwork from '@/screens/Dashboard/components/unavailable-network'
import url from 'url'
import Api from '@/services/Api'
import CreatePostPopup from '@/screens/Post/components/create-post-popup'

import PostStack from '@/screens/Post'

import ProfileInfoModal from '@/components/ProfileInfo/ProfileInfoModal'
import { Past } from '@/screens/Activity'
import { Notifications } from '@/screens/Activity'
import { Badge } from '@/screens/Activity'
import { Welcome } from '@/screens/Activity'
import { Verified } from '@/screens/Activity'
import { NotVerified } from '@/screens/Activity'
import { OngoingItem } from '@/screens/Activity'
import GuestActivity from '@/screens/Activity/components/guest-activity'
import ChatHouse from '@/screens/Chat/chat-house'
import PostChat from '@/screens/Chat/post-chat'

import {
  AlmostThere,
  AlmostThereMap,
  ResetPassword,
  SetNewPassword,
} from '@/screens/Authentication'

import VerifyCodeScreen from '@/screens/Verification/verify-code'

import { normalize, Colors } from '@/globals'
import { UserContext } from '@/context/UserContext'

import {
  ServbeesAlt,
  ServbeesAltActive,
  UserAlt,
  UserAltActive,
  NotificationDot,
} from '@/assets/images/icons'
import dynamicLinks from '@react-native-firebase/dynamic-links'

const defaultScreenOptions = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
}

export const navigationRef = React.createRef()

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params)
}

const HiveStack = createStackNavigator()
const ActivityStack = createStackNavigator()
const ProfileStack = createStackNavigator()
const Tab = createBottomTabNavigator()
const WelcomeStack = createStackNavigator()
const BadgeStack = createStackNavigator()
const VerifiedStack = createStackNavigator()
const NotVerifiedStack = createStackNavigator()

const Stack = createStackNavigator()
const NoBottomTabScreenStack = createStackNavigator()

function NoBottomTabScreens() {
  return (
    <NoBottomTabScreenStack.Navigator
      headerMode="none"
      screenOptions={defaultScreenOptions}>
      <NoBottomTabScreenStack.Screen
        name="OthersProfile"
        component={ProfileInfoModal}
      />
      <NoBottomTabScreenStack.Screen name="Chat" component={ChatScreen} />
      <NoBottomTabScreenStack.Screen name="posts" component={PostStack} />
      <NoBottomTabScreenStack.Screen
        name="Welcome"
        component={WelcomeStackScreen}
      />
      <NoBottomTabScreenStack.Screen
        name="Badge"
        component={BadgeStackScreen}
      />
      <NoBottomTabScreenStack.Screen
        name="Verified"
        component={VerifiedStackScreen}
      />
      <NoBottomTabScreenStack.Screen
        name="SetNewPassword"
        component={SetNewPassword}
      />
      <NoBottomTabScreenStack.Screen
        name="NotVerified"
        component={NotVerifiedStackScreen}
      />
      <NoBottomTabScreenStack.Screen
        name="Verification"
        component={VerificationStack}
      />
      <NoBottomTabScreenStack.Screen
        name="Notifications"
        component={Notifications}
      />
      <NoBottomTabScreenStack.Screen name="ChatHouse" component={ChatHouse} />
      <NoBottomTabScreenStack.Screen name="PostChat" component={PostChat} />
      <NoBottomTabScreenStack.Screen
        name="OngoingItem"
        component={OngoingItem}
      />
      <NoBottomTabScreenStack.Screen name="Past" component={Past} />
      <NoBottomTabScreenStack.Screen name="report" component={ReportScreen} />
      <NoBottomTabScreenStack.Screen
        name="change-password"
        component={ChangePasswordScreen}
      />
      <NoBottomTabScreenStack.Screen
        name="edit-profile"
        component={EditProfileScreen}
      />
      <NoBottomTabScreenStack.Screen
        name="invite-friends"
        component={InviteFriendsScreen}
      />
      <NoBottomTabScreenStack.Screen
        name="unavailable-network"
        component={UnavailableNetwork}
      />
      <NoBottomTabScreenStack.Screen
        name="liked-posts"
        component={LikedPostsScreen}
      />
      <NoBottomTabScreenStack.Screen
        name="own-menu"
        component={OwnMenuScreen}
      />
      <NoBottomTabScreenStack.Screen
        name="payout-methods"
        component={PayoutMethodStack}
      />
      <NoBottomTabScreenStack.Screen
        name="update-temperature"
        component={UpdateTemperature}
      />
      <NoBottomTabScreenStack.Screen
        name="temperature-about"
        component={TemperatureAbout}
      />
      <NoBottomTabScreenStack.Screen
        name="temperature-history"
        component={TemperatureHistory}
      />
      <NoBottomTabScreenStack.Screen name="block-user" component={BlockUser} />
    </NoBottomTabScreenStack.Navigator>
  )
}

function WelcomeStackScreen() {
  return (
    <WelcomeStack.Navigator
      headerMode="none"
      screenOptions={defaultScreenOptions}>
      <WelcomeStack.Screen name="WelcomeScreen" component={Welcome} />
    </WelcomeStack.Navigator>
  )
}

function BadgeStackScreen() {
  return (
    <BadgeStack.Navigator
      headerMode="none"
      screenOptions={defaultScreenOptions}>
      <BadgeStack.Screen name="BadgeScreen" component={Badge} />
    </BadgeStack.Navigator>
  )
}

function VerifiedStackScreen() {
  return (
    <VerifiedStack.Navigator
      headerMode="none"
      screenOptions={defaultScreenOptions}>
      <VerifiedStack.Screen name="VerifiedScreen" component={Verified} />
    </VerifiedStack.Navigator>
  )
}

function NotVerifiedStackScreen() {
  return (
    <NotVerifiedStack.Navigator
      headerMode="none"
      screenOptions={defaultScreenOptions}>
      <NotVerifiedStack.Screen
        name="NotVerifiedScreen"
        component={NotVerified}
      />
    </NotVerifiedStack.Navigator>
  )
}

function HiveStackScreen() {
  return (
    <HiveStack.Navigator headerMode="none" screenOptions={defaultScreenOptions}>
      <HiveStack.Screen name="Hive" component={Hives} />
    </HiveStack.Navigator>
  )
}

function ActivityStackScreen() {
  const { user } = useContext(UserContext)
  if (user) {
    return (
      <ActivityStack.Navigator
        headerMode="none"
        screenOptions={defaultScreenOptions}>
        <ActivityStack.Screen name="Activity" component={Activity} />
        <ActivityStack.Screen name="Past" component={Past} />
        <ActivityStack.Screen name="Notifications" component={Notifications} />
        <ActivityStack.Screen name="OngoingItem" component={OngoingItem} />
        <ActivityStack.Screen name="Chat" component={ChatScreen} />
        <ActivityStack.Screen name="PostChat" component={PostChat} />
      </ActivityStack.Navigator>
    )
  } else {
    return (
      <ActivityStack.Navigator
        headerMode="none"
        screenOptions={defaultScreenOptions}>
        <ActivityStack.Screen name="Activity" component={GuestActivity} />
      </ActivityStack.Navigator>
    )
  }
}

function ProfileStackScreen() {
  const { user } = useContext(UserContext)
  if (user) {
    return (
      <ProfileStack.Navigator
        headerMode="none"
        screenOptions={defaultScreenOptions}>
        <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      </ProfileStack.Navigator>
    )
  } else {
    return (
      <ProfileStack.Navigator
        headerMode="none"
        screenOptions={defaultScreenOptions}>
        <ProfileStack.Screen name="Profile" component={GuestProfile} />
      </ProfileStack.Navigator>
    )
  }
}

const TabStack = () => {
  const { counts } = useContext(UserContext)

  const tabBarOptions = {
    style: {
      position: 'relative',
      paddingTop: normalize(2),
    },
    tabStyle: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 4,
    },
    activeTintColor: Colors.primaryMidnightBlue,
    inactiveTintColor: Colors.contentPlaceholder,
    labelStyle: {
      fontFamily: 'RoundedMplus1c-Medium',
      fontSize: normalize(12),
    },
    labelPosition: 'below-icon',
  }

  return (
    <Tab.Navigator
      tabBarOptions={tabBarOptions}
      screenOptions={defaultScreenOptions}
      initialRouteName="Servbees">
      <Tab.Screen
        name="Servbees"
        component={DashboardStack}
        options={{
          tabBarIcon: ({ focused }) => {
            const icon = focused ? (
              <ServbeesAltActive width={normalize(25)} height={normalize(25)} />
            ) : (
              <ServbeesAlt width={normalize(25)} height={normalize(25)} />
            )
            return <>{icon}</>
          },
        }}
      />
      <Tab.Screen
        name="Hive"
        component={HiveStackScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            const icon = focused ? (
              <HiveActive width={normalize(25)} height={normalize(25)} />
            ) : (
              <Hive width={normalize(25)} height={normalize(25)} />
            )
            return <>{icon}</>
          },
        }}
      />
      <Tab.Screen
        name="posts"
        component={PostStack}
        options={{
          tabBarButton: () => <CreatePostPopup />,
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityStackScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            const icon = focused ? (
              <BellActive width={normalize(25)} height={normalize(25)} />
            ) : (
              <Bell width={normalize(25)} height={normalize(25)} />
            )
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {!!counts.chat || !!counts.notification ? (
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
                ) : (
                  <></>
                )}

                <View
                  style={{
                    position: 'relative',
                  }}>
                  {icon}
                </View>
              </View>
            )
          },
        }}
      />
      <Tab.Screen
        name="You"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            const icon = focused ? (
              <UserAltActive width={normalize(25)} height={normalize(25)} />
            ) : (
              <UserAlt width={normalize(25)} height={normalize(25)} />
            )
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    position: 'relative',
                  }}>
                  {icon}
                </View>
              </View>
            )
          },
        }}
      />
    </Tab.Navigator>
  )
}

export default Routes = () => {
  const {
    signOut,
    token,
    userInfo,
    userStatus,
    updateUserStatus,
    unavailableNetwork,
  } = useContext(UserContext)
  const { addresses } = userInfo

  const [containerOpacity] = useState(new Animated.Value(0))

  let fadingContainerStyle = {
    opacity: containerOpacity,
    flex: 1,
  }

  if (unavailableNetwork)
    navigate('NBTScreen', {
      screen: 'unavailable-network',
    })

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }).start()
    }, 2500)
  }, [])

  const handleDynamicLink = async link => {
    if (!link?.url) return
    const { pathname, query } = url.parse(link.url, true)

    switch (pathname) {
      case '/':
        break
      case '/reset-password': {
        const { login, token } = query
        navigate('NBTScreen', {
          screen: 'SetNewPassword',
          params: { token, login },
        })
        break
      }
      case '/profile': {
        const { uid } = query
        if (uid && uid === userInfo?.uid)
          navigate('TabStack', { screen: 'You' })
        else navigate('NBTScreen', { screen: 'OthersProfile', params: { uid } })
        break
      }
      case '/post': {
        const { id } = query
        const { data: post } = await Api.getPost({ pid: id })

        navigate('NBTScreen', {
          screen: 'posts',
          params: {
            screen: 'published-post',
            params: {
              id: post.id,
              uid: post.uid,
            },
          },
        })
      }
    }
  }

  useEffect(() => {
    dynamicLinks().getInitialLink().then(handleDynamicLink)
    const linkingListener = dynamicLinks().onLink(handleDynamicLink)
    return () => {
      linkingListener()
    }
  }, [])

  const renderAuthScreens = () => {
    if (
      userStatus.verified &&
      ![userStatus.verified?.email, userStatus.verified?.phone_number].includes(
        'completed'
      )
    ) {
      const provider = userInfo.email?.length
        ? 'email'
        : userInfo.phone_number?.length
        ? 'number'
        : undefined

      const login =
        provider === 'email'
          ? userInfo.email
          : provider === 'number'
          ? userInfo.phone_number
          : undefined

      return (
        <Stack.Screen
          name="verify-code"
          component={VerifyCodeScreen}
          initialParams={{
            login,
            provider,
            onSubmit: updateUserStatus,
            onBackPress: signOut,
          }}
        />
      )
    } else if (userInfo.uid && !addresses?.length)
      return (
        <>
          <Stack.Screen name="AlmostThere" component={AlmostThere} />
          <Stack.Screen name="AlmostThereMap" component={AlmostThereMap} />
        </>
      )

    return (
      <>
        <Stack.Screen name="TabStack" component={TabStack} />
        <Stack.Screen name="NBTScreen" component={NoBottomTabScreens} />
        <Stack.Screen name="payments" component={PaymentsStack} />
        <Stack.Screen name="orders" component={OrdersStack} />
      </>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={{ position: 'relative' }}>
        <SplashScreenComponent />
      </Animated.View>

      <Animated.View style={fadingContainerStyle}>
        <NavigationContainer ref={navigationRef}>
          {token && userInfo?.uid && userStatus?.verified ? (
            <Stack.Navigator
              headerMode="none"
              screenOptions={defaultScreenOptions}>
              {renderAuthScreens()}
            </Stack.Navigator>
          ) : (
            <Stack.Navigator
              headerMode="none"
              screenOptions={defaultScreenOptions}>
              <Stack.Screen name="Onboarding" component={Onboarding} />
              <Stack.Screen name="ResetPassword" component={ResetPassword} />
              <Stack.Screen name="TabStack" component={TabStack} />
              <Stack.Screen name="NBTScreen" component={NoBottomTabScreens} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </Animated.View>
    </View>
  )
}
