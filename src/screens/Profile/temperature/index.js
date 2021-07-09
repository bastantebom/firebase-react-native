import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import React from 'react'
import TemperatureAboutScreen from './temperature-about-screen'
import TemperatureHistoryScreen from './temperature-history-screen'
import UpdateTemperatureSreen from './update-temperature-screen'

const TemperatureStack = () => {
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
        name="update-temperature"
        component={UpdateTemperatureSreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="temperature-history"
        component={TemperatureHistoryScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="temperature-about"
        component={TemperatureAboutScreen}
        options={defaultScreenOptions}
      />
    </Stack.Navigator>
  )
}

export default TemperatureStack
