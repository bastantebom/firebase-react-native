import React, { useEffect, useState, useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Animated, Linking, Platform } from 'react-native'
import SplashScreenComponent from './SplashScreen'

import Bell from '@/assets/images/icons/bell.svg'
import BellActive from '@/assets/images/icons/bell-active.svg'
import Hive from '@/assets/images/icons/hive.svg'
import HiveActive from '@/assets/images/icons/hive-active.svg'

import { useNavigation } from '@react-navigation/native'
import { PostService } from '@/services'

//screens
import { Onboarding } from '@/screens/Onboarding'
import DashboardStack from '@/screens/Dashboard'
import VerificationStack from '@/screens/Verification'
import ProfileScreen from '@/screens/Profile/profile'
import { GuestProfile } from '@/screens/Profile/components/GuestProfile'
import { Hives } from '@/screens/Hive'
import { Activity } from '@/screens/Activity'
import ChatScreen from '@/screens/Chat'

import {
  Post,
  SinglePostView,
  SinglePostViewExternal,
  AddItemScreen,
  AddedItemPreviewScreen,
  EditItemScreen,
  PostExpiryScreen,
  ShippingMethodScreen,
  PaymentMethodScreen,
} from '@/screens/Post'
import { PostScreen } from '@/screens/Post'
import { GuestPost } from '@/screens/Post/components/GuestPost'

import { ProfileInfoModal, SinglePostOthersView, AppText } from '@/components'
import { Past } from '@/screens/Activity'
import { Badge } from '@/screens/Activity'
import { Welcome } from '@/screens/Activity'
import { Verified } from '@/screens/Activity'
import { NotVerified } from '@/screens/Activity'
import { OngoingItem } from '@/screens/Activity'
import GuestActivity from '@/screens/Activity/components/GuestActivity'

import {
  AlmostThere,
  AlmostThereMap,
  ResetPassword,
  SetNewPassword,
} from '@/screens/Authentication'

import VerifyCodeScreen from '@/screens/Verification/verify-code'

import { normalize, Colors } from '@/globals'
import { Context } from '@/context'
import { UserContext } from '@/context/UserContext'

import {
  ServbeesAlt,
  ServbeesAltActive,
  UserAlt,
  UserAltActive,
  NotificationDot,
} from '@/assets/images/icons'

const HiveStack = createStackNavigator()
const PostStack = createStackNavigator()
const ActivityStack = createStackNavigator()
const ProfileStack = createStackNavigator()
const Tab = createBottomTabNavigator()
const CreatePostStack = createStackNavigator()
const WelcomeStack = createStackNavigator()
const BadgeStack = createStackNavigator()
const VerifiedStack = createStackNavigator()
const NotVerifiedStack = createStackNavigator()

const Stack = createStackNavigator()
const NoBottomTabScreenStack = createStackNavigator()

function NoBottomTabScreens() {
  return (
    <NoBottomTabScreenStack.Navigator headerMode="none">
      <NoBottomTabScreenStack.Screen
        name="OthersProfile"
        component={ProfileInfoModal}
      />
      <NoBottomTabScreenStack.Screen name="Chat" component={ChatScreen} />
      <NoBottomTabScreenStack.Screen
        name="OthersPost"
        component={SinglePostView}
      />
      <NoBottomTabScreenStack.Screen
        name="ExternalPostLink"
        component={SinglePostViewExternal}
      />
      <NoBottomTabScreenStack.Screen
        name="CreatePost"
        component={CreatePostStackScreen}
      />
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
    </NoBottomTabScreenStack.Navigator>
  )
}

function WelcomeStackScreen() {
  return (
    <WelcomeStack.Navigator headerMode="none">
      <WelcomeStack.Screen name="WelcomeScreen" component={Welcome} />
    </WelcomeStack.Navigator>
  )
}

function BadgeStackScreen() {
  return (
    <BadgeStack.Navigator headerMode="none">
      <BadgeStack.Screen name="BadgeScreen" component={Badge} />
    </BadgeStack.Navigator>
  )
}

function VerifiedStackScreen() {
  return (
    <VerifiedStack.Navigator headerMode="none">
      <VerifiedStack.Screen name="VerifiedScreen" component={Verified} />
    </VerifiedStack.Navigator>
  )
}

function NotVerifiedStackScreen() {
  return (
    <NotVerifiedStack.Navigator headerMode="none">
      <NotVerifiedStack.Screen
        name="NotVerifiedScreen"
        component={NotVerified}
      />
    </NotVerifiedStack.Navigator>
  )
}

function CreatePostStackScreen() {
  return (
    <CreatePostStack.Navigator headerMode="none">
      <CreatePostStack.Screen name="CreatePostScreen" component={PostScreen} />
      <CreatePostStack.Screen name="AddItemScreen" component={AddItemScreen} />
      <CreatePostStack.Screen
        name="EditItemScreen"
        component={EditItemScreen}
      />
      <CreatePostStack.Screen
        name="AddedItemPreviewScreen"
        component={AddedItemPreviewScreen}
      />
      <CreatePostStack.Screen
        name="PostExpiryScreen"
        component={PostExpiryScreen}
      />
      <CreatePostStack.Screen
        name="ShippingMethodScreen"
        component={ShippingMethodScreen}
      />
      <CreatePostStack.Screen
        name="PaymentMethodScreen"
        component={PaymentMethodScreen}
      />
      <CreatePostStack.Screen name="Chat" component={ChatScreen} />
    </CreatePostStack.Navigator>
  )
}

function HiveStackScreen() {
  return (
    <HiveStack.Navigator headerMode="none">
      <HiveStack.Screen name="Hive" component={Hives} />
    </HiveStack.Navigator>
  )
}

function PostStackScreen({ navigation }) {
  const { user } = useContext(UserContext)
  if (user) {
    return (
      <PostStack.Navigator headerMode="none">
        <PostStack.Screen name="PostScreen" component={PostScreen} />
        <PostStack.Screen name="SinglePostView" component={SinglePostView} />
        <PostStack.Screen name="Chat" component={ChatScreen} />
      </PostStack.Navigator>
    )
  } else {
    return (
      <PostStack.Navigator headerMode="none">
        <PostStack.Screen name="PostScreen" component={GuestPost} />
      </PostStack.Navigator>
    )
  }
}

function ActivityStackScreen() {
  const { user } = useContext(UserContext)
  if (user) {
    return (
      <ActivityStack.Navigator headerMode="none">
        <ActivityStack.Screen name="Activity" component={Activity} />
        <ActivityStack.Screen name="Past" component={Past} />
        <ActivityStack.Screen name="OngoingItem" component={OngoingItem} />
        <ActivityStack.Screen name="Chat" component={ChatScreen} />
      </ActivityStack.Navigator>
    )
  } else {
    return (
      <ActivityStack.Navigator headerMode="none">
        <ActivityStack.Screen name="Activity" component={GuestActivity} />
      </ActivityStack.Navigator>
    )
  }
}

function ProfileStackScreen() {
  const { user } = useContext(UserContext)
  if (user) {
    return (
      <ProfileStack.Navigator headerMode="none">
        <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      </ProfileStack.Navigator>
    )
  } else {
    return (
      <ProfileStack.Navigator headerMode="none">
        <ProfileStack.Screen name="Profile" component={GuestProfile} />
      </ProfileStack.Navigator>
    )
  }
}

const TabStack = props => {
  const [activityNotification, setActivityNotification] = useState(true)
  const [profileNotification] = useState(false)
  const { closePostButtons, notificationsList, initNotifications } = useContext(
    Context
  )
  const { user } = useContext(UserContext)
  const newNotificationIndicator =
    notificationsList?.filter(notif => !notif.read).length > 0

  const navigation = useNavigation()

  useEffect(() => {
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        if (url) navigate(url)
        else return
      })
    } else {
      Linking.getInitialURL().then(url => {
        if (url) navigate(url)
        else return
      })
    }

    const handleOpenURL = event => {
      navigate(event.url)
    }

    const navigate = async url => {
      const route = url.replace(/.*?:\/\//g, '')
      const id = route.split('/')[1]
      const token = route.split('/')[2]
      const routeName = route.split('/')[0]

      if (routeName === 'reset-password') {
        navigation.navigate('NBTScreen', {
          screen: 'SetNewPassword',
          params: { token: token, id: id },
        })
      }

      if (routeName === 'profile') {
        navigation.navigate('NBTScreen', {
          screen: 'OthersProfile',
          params: { uid: id },
        })
      }
      if (routeName === 'post') {
        try {
          const response = await PostService.getPost(id)
          navigation.navigate('NBTScreen', {
            screen: 'OthersPost',
            params: { ...response, othersView: true },
          })
        } catch (error) {
          console.log(error.message || error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (user) initNotifications(user?.uid)
  }, [])

  const tabBarOptions = {
    style: {
      position: 'relative',
      height: Platform.OS === 'android' ? normalize(55) : normalize(75),
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
    <Tab.Navigator tabBarOptions={tabBarOptions}>
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
          tabBarOnPress: closePostButtons,
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
                {newNotificationIndicator && (
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
            )
          },
        }}
      />
    </Tab.Navigator>
  )
}

export default Routes = () => {
  const { signOut, token, userInfo, userStatus, updateUserStatus } = useContext(
    UserContext
  )
  const { addresses } = userInfo

  const [containerOpacity] = useState(new Animated.Value(0))

  let fadingContainerStyle = {
    opacity: containerOpacity,
    flex: 1,
  }

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 750,
        useNativeDriver: false,
      }).start()
    }, 2500)
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
      </>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={{ position: 'relative' }}>
        <SplashScreenComponent />
      </Animated.View>

      <Animated.View style={fadingContainerStyle}>
        <NavigationContainer>
          {token && userInfo?.uid && userStatus?.verified ? (
            <Stack.Navigator headerMode="none">
              {renderAuthScreens()}
            </Stack.Navigator>
          ) : (
            <Stack.Navigator headerMode="none">
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
