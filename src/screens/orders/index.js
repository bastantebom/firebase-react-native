import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import React from 'react'
import OrderTrackerScreen from './order-tracker'
import CancelOrderScreen from './cancel-order-screen'
import CancelOrderTextareaScreen from './cancel-order-textarea-screen'

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
      <Stack.Screen
        name="cancel-order"
        component={CancelOrderScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="cancel-order-textarea"
        component={CancelOrderTextareaScreen}
        options={defaultScreenOptions}
      />
    </Stack.Navigator>
  )
}

export default OrdersStack
