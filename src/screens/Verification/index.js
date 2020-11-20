import React, { useContext, useEffect, useState } from 'react'
import { Icons } from '@/assets/images/icons'
import { AppText, TransitionIndicator } from '@/components'
import { Colors, normalize } from '@/globals'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import ProfileInformationScreen from './profile-information'
import AddAddressScreen from './add-address'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'
import EmailVerificationScreen from './email-verification'
import PhoneVerificationScreen from './phone-verification'
import VerifyCodeScreen from './verify-code'
import IdVerificationScreen from './id-verification'

/** @param {import('@react-navigation/stack').StackScreenProps<{}, 'Verification'>} param0 */
const VerificationScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useContext(UserContext)

  const [verifications, setVerifications] = useState([
    {
      key: 'profile',
      label: 'Complete profile information',
      doneLabel: 'Completed profile information',
      icon: <Icons.Card />,
      status: 'pending',
      screen: 'ProfileInformation',
      action: () => {
        navigation.navigate('profile-information')
      },
    },
    {
      key: 'phone_number',
      label: 'Add and verify mobile number',
      doneLabel: 'Mobile number verified',
      icon: <Icons.Mobile />,
      status: 'pending',
      action: () => {
        navigation.navigate('phone-verification')
      },
    },
    {
      key: 'account',
      label: 'Upload a government ID',
      doneLabel: 'Government ID verified',
      icon: <Icons.Id />,
      status: 'pending',
      action: () => {
        navigation.navigate('id-verification', { screen: 'id-verification' })
      },
    },
    {
      key: 'email',
      label: 'Add and verify email address',
      doneLabel: 'Email address verified',
      icon: <Icons.Id />,
      status: 'pending',
      action: () => {
        navigation.navigate('email-verification')
      },
    },
  ])

  const getStatus = async () => {
    setIsLoading(true)
    const response = await Api.getUserStatus({ uid: user.uid })
    setVerifications(
      verifications.map(verification => ({
        ...verification,
        status: response.status.verified[verification.key] || 'pending',
      }))
    )
    setIsLoading(false)
  }

  useEffect(() => {
    navigation.addListener('focus', getStatus)
    return () => {
      navigation.removeListener('focus', getStatus)
    }
  }, [])

  return (
    <SafeAreaView style={styles.containerStyle}>
      <TransitionIndicator
        loading={isLoading}
        backdropStyle={{ backgroundColor: '#fff' }}
      />
      <ScrollView>
        <View style={{ padding: 24 }}>
          <View style={{ marginBottom: 45 }}>
            <TouchableOpacity onPress={navigation.goBack}>
              <Icons.Back
                style={styles.backButton}
                height={normalize(16)}
                width={normalize(16)}
              />
            </TouchableOpacity>
          </View>
          <Icons.Verified height={normalize(32)} width={normalize(32)} />
          <View style={styles.headingWrapper}>
            <AppText textStyle="display6">Get the verified badge</AppText>
            <AppText
              textStyle="price"
              color={Colors.neutralsWhitesmoke}
              customStyle={styles.badgeContainer}>
              {verifications.filter(item => item.status === 'completed').length}{' '}
              of {verifications.length}
            </AppText>
          </View>
          <AppText
            textStyle="body2"
            color={Colors.contentPlaceholder}
            customStyle={{ marginBottom: 24 }}>
            Complete your profile and verify youridentity for a better Servbees
            experience!
          </AppText>

          {verifications.some(item => item.status === 'pending') && (
            <AppText textStyle="subtitle1" customStyle={styles.listHeader}>
              Pending
            </AppText>
          )}
          {verifications
            .filter(item => item.status === 'pending')
            .map((item, i) => {
              return (
                <View key={item.key}>
                  <TouchableOpacity
                    style={[styles.listItem, { marginBottom: 28 }]}
                    onPress={item.action}>
                    <View style={styles.listItem}>
                      <View style={{ marginRight: 8 }}>{item.icon}</View>
                      <AppText textStyle="body1">{item.label}</AppText>
                    </View>
                    <Icons.ArrowRight />
                  </TouchableOpacity>
                </View>
              )
            })}

          {verifications.some(item =>
            ['review', 'submitted'].includes(item.status)
          ) && (
            <AppText textStyle="subtitle1" customStyle={styles.listHeader}>
              For Review
            </AppText>
          )}

          {verifications
            .filter(item => ['review', 'submitted'].includes(item.status))
            .map((item, i) => {
              return (
                <View key={item.key}>
                  <View style={[styles.listItem, { marginBottom: 28 }]}>
                    <View style={styles.listItem}>
                      <View style={{ marginRight: 8 }}>{item.icon}</View>
                      <AppText textStyle="body1">{item.label}</AppText>
                    </View>
                  </View>
                </View>
              )
            })}

          {verifications.some(item => item.status === 'completed') && (
            <AppText textStyle="subtitle1" customStyle={styles.listHeader}>
              Completed
            </AppText>
          )}

          {verifications
            .filter(item => item.status === 'completed')
            .map(item => {
              return (
                <View key={item.key}>
                  <View style={[styles.listItem, { marginBottom: 28 }]}>
                    <View style={styles.listItem}>
                      <View style={{ marginRight: 8 }}>{item.icon}</View>
                      <AppText textStyle="body1">{item.doneLabel}</AppText>
                    </View>
                    <Icons.VerifyTick />
                  </View>
                </View>
              )
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  backButton: { color: '#91919C', width: normalize(16), height: normalize(16) },
  badgeContainer: {
    backgroundColor: Colors.checkboxBorderDefault,
    borderRadius: 8,
    paddingTop: 7,
    paddingBottom: 6,
    paddingHorizontal: 8,
  },
  headingWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listHeader: {
    marginBottom: 15,
  },
})

const VerificationStack = () => {
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
        name="verification"
        component={VerificationScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="profile-information"
        component={ProfileInformationScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="add-address"
        component={AddAddressScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="email-verification"
        component={EmailVerificationScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="phone-verification"
        component={PhoneVerificationScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="verify-code"
        component={VerifyCodeScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="id-verification"
        component={IdVerificationScreen}
        options={defaultScreenOptions}
      />
    </Stack.Navigator>
  )
}

export default VerificationStack
