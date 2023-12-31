import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import React, { useContext } from 'react'
import AboutStack from './about'
import BlockedUsersScreen from './blocked-users'
import ChangePasswordScreen from './change-password-screen'
import ContactUsSreen from './contact-us-screen'
import EditProfileScreen from './edit-profile'
import FollowersScreen from './followers-screen'
import InviteFriendsScreen from './invite-friends'
import LikedPostsScreen from './liked-posts-screen'
import PayoutMethodStack from './payout-method'
import ProfileMenuScreen from './profile-menu-screen'
import ProfileScreen from './profile-screen'
import ReportStack from './report'
import TemperatureStack from './temperature'
import GuestProfileScreen from './guest-profile'
import OtpScreen from './otp'
import { UserContext } from '@/context/UserContext'

const ProfileStack = ({ route }) => {
  const { user } = useContext(UserContext)
  const Stack = createStackNavigator()
  const defaultScreenOptions = {
    cardStyle: { backgroundColor: '#fff' },
  }

  if (user) {
    return (
      <Stack.Navigator
        headerMode="none"
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen
          name="profile"
          component={ProfileScreen}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name="profile-menu"
          component={ProfileMenuScreen}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name="edit-profile"
          component={EditProfileScreen}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name="invite-friends"
          component={InviteFriendsScreen}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name="liked-posts"
          component={LikedPostsScreen}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name="change-password"
          component={ChangePasswordScreen}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name="contact-us"
          component={ContactUsSreen}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name="blocked-users"
          component={BlockedUsersScreen}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name="payout-methods"
          component={PayoutMethodStack}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name="temperature"
          component={TemperatureStack}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name="report"
          component={ReportStack}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name="about"
          component={AboutStack}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name="followers"
          component={FollowersScreen}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          name="otp"
          component={OtpScreen}
          options={defaultScreenOptions}
        />
      </Stack.Navigator>
    )
  } else {
    return (
      <Stack.Navigator
        headerMode="none"
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen
          name="profile"
          component={GuestProfileScreen}
          options={defaultScreenOptions}
          initialParams={route?.params?.params || {}}
        />
      </Stack.Navigator>
    )
  }
}

export default ProfileStack
