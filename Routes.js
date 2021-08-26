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

import { Onboarding } from '@/screens/Onboarding'
import DashboardStack from '@/screens/Dashboard'
import VerificationStack from '@/screens/Verification'

import { Activity } from '@/screens/Activity'
import ChatScreen from '@/screens/Chat'
import ChatGuestScreen from '@/screens/Chat/guest-screen'
import PaymentsStack from '@/screens/payments'
import OrdersStack from '@/screens/orders'
import UnavailableNetwork from '@/screens/Dashboard/components/unavailable-network'
import url from 'url'
import Api from '@/services/Api'
import CreatePostPopup from '@/screens/Post/components/create-post-popup'

import PostStack from '@/screens/Post'

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
import UnavailablePostScreen from '@/screens/Post/components/archived-post-unavailable'

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
  UserAltActive,
  NotificationDot,
  Icons,
} from '@/assets/images/icons'
import dynamicLinks from '@react-native-firebase/dynamic-links'
import ProfileStack from '@/screens/Profile'
import {
  createPushNotificationChannels,
  getDeviceToken,
  initPushNotifications,
  registerDeviceToken,
  saveDeviceToken,
} from '@/globals/push-notification-util'
import { includes } from 'lodash'

const defaultScreenOptions = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
}

export const navigationRef = React.createRef()

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params)
}

export function dispatch(...args) {
  navigationRef.current?.dispatch(...args)
}

const Tab = createBottomTabNavigator()
const WelcomeStack = createStackNavigator()
const BadgeStack = createStackNavigator()
const VerifiedStack = createStackNavigator()
const NotVerifiedStack = createStackNavigator()

const Stack = createStackNavigator()

function NoBottomTabScreens() {
  const Stack = createStackNavigator()
  return (
    <Stack.Navigator headerMode="none" screenOptions={defaultScreenOptions}>
      <Stack.Screen name="posts" component={PostStack} />
      <Stack.Screen name="profile" component={ProfileStack} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Welcome" component={WelcomeStackScreen} />
      <Stack.Screen name="Badge" component={BadgeStackScreen} />
      <Stack.Screen name="Verified" component={VerifiedStackScreen} />
      <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
      <Stack.Screen name="NotVerified" component={NotVerifiedStackScreen} />
      <Stack.Screen name="Verification" component={VerificationStack} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="ChatHouse" component={ChatHouse} />
      <Stack.Screen name="PostChat" component={PostChat} />
      <Stack.Screen name="OngoingItem" component={OngoingItem} />
      <Stack.Screen name="Past" component={Past} />
      <Stack.Screen name="unavailable-network" component={UnavailableNetwork} />
      <Stack.Screen
        name="unavailable-archive"
        component={UnavailablePostScreen}
      />
    </Stack.Navigator>
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

function ChatStackScreen() {
  const { user } = useContext(UserContext)

  return (
    <Stack.Navigator headerMode="none" screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="Chat"
        component={user ? ChatHouse : ChatGuestScreen}
      />
    </Stack.Navigator>
  )
}

function ActivityStackScreen() {
  const { user } = useContext(UserContext)
  if (user) {
    return (
      <Stack.Navigator headerMode="none" screenOptions={defaultScreenOptions}>
        <Stack.Screen name="Activity" component={Activity} />
        <Stack.Screen name="Past" component={Past} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="OngoingItem" component={OngoingItem} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="PostChat" component={PostChat} />
      </Stack.Navigator>
    )
  } else {
    return (
      <Stack.Navigator headerMode="none" screenOptions={defaultScreenOptions}>
        <Stack.Screen name="Activity" component={GuestActivity} />
      </Stack.Navigator>
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
        name="posts"
        component={PostStack}
        options={{
          tabBarButton: () => <CreatePostPopup />,
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatStackScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            const icon = focused ? (
              <Icons.ActiveChatIcon
                width={normalize(25)}
                height={normalize(25)}
              />
            ) : (
              <Icons.ChatIcon width={normalize(25)} height={normalize(25)} />
            )
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {!!counts.chat && (
                  <View
                    style={{
                      position: 'absolute',
                      top: normalize(-3),
                      right: normalize(-3),
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
            )
          },
        }}
      />
      <Tab.Screen
        name="You"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => {
            const icon = focused ? (
              <UserAltActive width={normalize(25)} height={normalize(25)} />
            ) : (
              <Icons.User
                style={{ color: Colors.icon }}
                width={normalize(25)}
                height={normalize(25)}
              />
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
    verificationStatus,
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
        if (uid && uid === userInfo?.uid) {
          navigation.navigate('TabStack', { screen: 'You' })
        } else {
          navigation.push('NBTScreen', {
            screen: 'profile',
            params: {
              screen: 'profile',
              params: { uid },
            },
          })
        }
        break
      }
      case '/post': {
        const { id } = query
        const { data: post } = await Api.getPost({ pid: id })

        if (post?.archived) {
          navigate('NBTScreen', {
            screen: 'unavailable-archive',
          })
        } else {
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
        break
      }
      case '/order-tracker': {
        const { id } = query

        navigate('orders', {
          screen: 'order-tracker',
          params: {
            orderID: id,
          },
        })
        break
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

  useEffect(() => {
    if (userInfo?.uid) {
      preparePushNotification()
    }
  }, [userInfo.uid])

  const preparePushNotification = async () => {
    const token = await registerDeviceToken()
    const userDeviceTokens = await getDeviceToken(userInfo)

    if (!userDeviceTokens.some(({ id }) => id === token)) {
      saveDeviceToken(token, userInfo)
    }

    initPushNotifications()
    createPushNotificationChannels()
  }

  const renderAuthScreens = () => {
    if (
      ![
        verificationStatus?.email?.status,
        verificationStatus?.phone?.status,
      ].includes('completed')
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
          {token && userInfo?.uid && verificationStatus ? (
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
