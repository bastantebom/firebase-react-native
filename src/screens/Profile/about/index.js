import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import React from 'react'
import AboutScreen from './about-screen'
import WebviewScreen from './webview-screen'

const AboutStack = () => {
  const Stack = createStackNavigator()
  const defaultScreenOptions = {
    cardStyle: { backgroundColor: '#fff' },
  }

  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name="about"
        component={AboutScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="webview"
        component={WebviewScreen}
        options={defaultScreenOptions}
      />
    </Stack.Navigator>
  )
}

export default AboutStack
