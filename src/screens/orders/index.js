import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import React from 'react'
import OrderTrackerScreen from './order-tracker'

const OrdersStack = () => {
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
        name="order-tracker"
        component={OrderTrackerScreen}
        options={defaultScreenOptions}
      />
    </Stack.Navigator>
  )
}

export default OrdersStack
