import React from 'react'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import DashboardScreen from './dashboard-screen'
import LikedPostsScreen from './liked-posts-screen'

const DashboardStack = () => {
  const Stack = createStackNavigator()
  const defaultScreenOptions = {
    cardStyle: {
      backgroundColor: '#fff',
    },
  }

  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name="dashboard"
        component={DashboardScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="liked-posts"
        component={LikedPostsScreen}
        options={defaultScreenOptions}
      />
    </Stack.Navigator>
  )
}
export default DashboardStack
