import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import React from 'react'
import ReportUserScreen from './report-user-screen'
import ReportUserSuccessScreen from './report-user-success-screen'

const ReportStack = () => {
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
        name="report-user"
        component={ReportUserScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="report-user-success"
        component={ReportUserSuccessScreen}
        options={defaultScreenOptions}
      />
    </Stack.Navigator>
  )
}

export default ReportStack
