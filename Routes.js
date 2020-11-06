import React, { useEffect, useState, useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Animated } from 'react-native'
import SplashScreenComponent from './SplashScreen'

import Bell from '@/assets/images/icons/bell.svg'
import BellActive from '@/assets/images/icons/bell-active.svg'
import Hive from '@/assets/images/icons/hive.svg'
import HiveActive from '@/assets/images/icons/hive-active.svg'

import { useNavigation } from '@react-navigation/native'
import { PostService } from '@/services'

//screens
import { Onboarding } from '@/screens/Onboarding'
import { Dashboard } from '@/screens/Dashboard'
import { Profile } from '@/screens/Profile'
import { Hives } from '@/screens/Hive'
import { Activity } from '@/screens/Activity'
import { Chat } from '@/screens/Chat'

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

import { ProfileInfoModal, SinglePostOthersView } from '@/components'
import { Past } from '@/screens/Activity'
import { Badge } from '@/screens/Activity'
import { Welcome } from '@/screens/Activity'
import { Verified } from '@/screens/Activity'
import { OngoingItem } from '@/screens/Activity'

import {
  AlmostThere,
  AlmostThereMap,
  VerifyAccount,
  ResetPassword,
} from '@/screens/Authentication'

import { normalize } from '@/globals'
import { Context } from '@/context'
import { UserContext } from '@/context/UserContext'

import {
  ServbeesAlt,
  ServbeesAltActive,
  UserAlt,
  UserAltActive,
  NotificationDot,
} from '@/assets/images/icons'

const DashboardStack = createStackNavigator()
const HiveStack = createStackNavigator()
const PostStack = createStackNavigator()
const ActivityStack = createStackNavigator()
const ProfileStack = createStackNavigator()
const Tab = createBottomTabNavigator()
const CreatePostStack = createStackNavigator()
const WelcomeStack = createStackNavigator()
const BadgeStack = createStackNavigator()
const VerifiedStack = createStackNavigator()

const Stack = createStackNavigator()
const NoBottomTabScreenStack = createStackNavigator()

function NoBottomTabScreens() {
  return (
    <NoBottomTabScreenStack.Navigator headerMode="none">
      <NoBottomTabScreenStack.Screen
        name="OthersProfile"
        component={ProfileInfoModal}
      />
      <NoBottomTabScreenStack.Screen name="Chat" component={Chat} />
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
    </NoBottomTabScreenStack.Navigator>
  )
}

function WelcomeStackScreen() {
  return (
    <WelcomeStack.Navigator headerMode="none">
      <DashboardStack.Screen name="WelcomeScreen" component={Welcome} />
    </WelcomeStack.Navigator>
  )
}

function BadgeStackScreen() {
  return (
    <BadgeStack.Navigator headerMode="none">
      <DashboardStack.Screen name="BadgeScreen" component={Badge} />
    </BadgeStack.Navigator>
  )
}

function VerifiedStackScreen() {
  return (
    <VerifiedStack.Navigator headerMode="none">
      <DashboardStack.Screen name="VerifiedScreen" component={Verified} />
    </VerifiedStack.Navigator>
  )
}

function DashboardStackScreen() {
  return (
    <DashboardStack.Navigator headerMode="none">
      <DashboardStack.Screen name="Servbees" component={Dashboard} />
    </DashboardStack.Navigator>
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
  return (
    <>
      <PostStack.Navigator headerMode="none">
        <PostStack.Screen name="PostScreen" component={PostScreen} />
        <PostStack.Screen name="SinglePostView" component={SinglePostView} />
      </PostStack.Navigator>
    </>
  )
}

function ActivityStackScreen() {
  return (
    <ActivityStack.Navigator headerMode="none">
      <ActivityStack.Screen name="Activity" component={Activity} />
      <ActivityStack.Screen name="Past" component={Past} />
      <ActivityStack.Screen name="OngoingItem" component={OngoingItem} />
      {/* <ActivityStack.Screen name="Badge" component={Badge} />
      <ActivityStack.Screen name="Welcome" component={Welcome} />
      <ActivityStack.Screen name="Verified" component={Verified} /> */}
    </ActivityStack.Navigator>
  )
}

function ProfileStackScreen() {
  const { user } = useContext(UserContext)
  if (user) {
    return (
      <>
        <ProfileStack.Navigator headerMode="none">
          <ProfileStack.Screen name="Profile" component={Profile} />
        </ProfileStack.Navigator>
      </>
    )
  } else {
    return null
  }
}

const TabStack = () => {
  const [activityNotification, setActivityNotification] = useState(true)
  const [profileNotification] = useState(false)
  const { closePostButtons } = useContext(Context)

  const navigation = useNavigation()
  const navigate = async url => {
    const route = url.replace(/.*?:\/\//g, '')
    const id = route.split('/')[1]
    const routeName = route.split('/')[0]

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

  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          position: 'relative',
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
            )
          },
        }}
      />
      <Tab.Screen
        name="Profile"
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
  const { token, userInfo } = useContext(UserContext)
  const { addresses } = userInfo

  const [containerOpacity] = useState(new Animated.Value(0))

  let fadingContainerStyle = {
    opacity: containerOpacity,
    flex: 1,
  }

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false)

      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 750,
        useNativeDriver: false,
      }).start()
    }, 2500)
  }, [])

  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) return <SplashScreenComponent />

  return (
    <Animated.View style={fadingContainerStyle}>
      <NavigationContainer>
        {token && userInfo?.uid ? (
          !addresses?.length ? (
            <Stack.Navigator headerMode="none">
              <Stack.Screen name="AlmostThere" component={AlmostThere} />
              <Stack.Screen name="AlmostThereMap" component={AlmostThereMap} />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator headerMode="none">
              <Stack.Screen name="TabStack" component={TabStack} />
              <Stack.Screen name="NBTScreen" component={NoBottomTabScreens} />
            </Stack.Navigator>
          )
        ) : (
          <Stack.Navigator headerMode="none">
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="VerifyAccount" component={VerifyAccount} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="TabStack" component={TabStack} />
            <Stack.Screen name="NBTScreen" component={NoBottomTabScreens} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </Animated.View>
  )
}
