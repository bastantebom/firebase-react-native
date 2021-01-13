import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import React from 'react'
import GCashScreen from './gcash'
import GrabPayScreen from './grabpay'
import PaypalScreen from './paypal'
import PaymentWebView from './payment-webview'
import PaymentStatusScreen from './status'
import CreditCardScreen from './credit-card'

const PaymentsStack = () => {
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
        name="payment-status"
        component={PaymentStatusScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="payment-webview"
        component={PaymentWebView}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="grabpay"
        component={GrabPayScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="gcash"
        component={GCashScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="paypal"
        component={PaypalScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="card"
        component={CreditCardScreen}
        options={defaultScreenOptions}
      />
    </Stack.Navigator>
  )
}

export default PaymentsStack
