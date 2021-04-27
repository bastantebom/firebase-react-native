import React from 'react'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import PayoutMethodScreen from './payout-method'
import SetPayoutMethodScreen from './set-payout-method'
import SelectPayoutMethodScreen from './select-payout-method'
import BanksScreen from './banks'
import PayoutMethodSuccess from './success'

const PayoutMethodStack = () => {
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
        name="payout-method"
        component={PayoutMethodScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="select-payout-method"
        component={SelectPayoutMethodScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="set-payout-method"
        component={SetPayoutMethodScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="banks"
        component={BanksScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="success"
        component={PayoutMethodSuccess}
        options={defaultScreenOptions}
      />
    </Stack.Navigator>
  )
}

export default PayoutMethodStack
