import React, { useContext, useEffect, useState } from 'react'
import { Icons } from '@/assets/images/icons'
import { AppText, TransitionIndicator } from '@/components'
import { Colors, normalize } from '@/globals'
import Modal from 'react-native-modal'
import Privacy from '@/screens/Authentication/SignUp/components/PrivacyPolicy'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import {
  StatusBar,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from 'react-native'
import typography from '@/globals/typography'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import ProfileInformationScreen from './profile-information'
import AddAddressScreen from './add-address'
import Api from '@/services/Api'
import { UserContext } from '@/context/UserContext'
import EmailVerificationScreen from './email-verification'
import PhoneVerificationScreen from './phone-verification'
import VerifyCodeScreen from './verify-code'
import IdVerificationScreen from './id-verification'
import MapLocationScreen from './map-location'

/** @param {import('@react-navigation/stack').StackScreenProps<{}, 'Verification'>} param0 */
const VerificationScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [privacyVisible, setPrivacyVisible] = useState(false)
  const { user } = useContext(UserContext)

  const [verifications, setVerifications] = useState([
    {
      key: 'profile',
      label: 'Complete profile information',
      completedLabel: 'Profile information',
      icon: <Icons.FillUp />,
      status: 'pending',
      screen: 'ProfileInformation',
      action: () => {
        navigation.navigate('profile-information')
      },
    },
    {
      key: 'phone_number',
      label: 'Add and verify mobile number',
      completedLabel: 'Mobile number verified',
      icon: <Icons.VerifyNumber />,
      status: 'pending',
      action: () => {
        navigation.navigate('phone-verification')
      },
    },
    {
      key: 'account',
      label: 'Upload a government ID',
      completedLabel: 'Government ID verified',
      icon: <Icons.UploadId />,
      status: 'pending',
      action: () => {
        navigation.navigate('id-verification', { screen: 'id-verification' })
      },
    },
    {
      key: 'email',
      label: 'Add and verify email address',
      completedLabel: 'Email address verified',
      icon: <Icons.VerifyEmail />,
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

  const renderItem = item => {
    return (
      <TouchableOpacity
        key={item.key}
        style={[styles.listItem]}
        onPress={item.action}
        disabled={item.status !== 'pending'}>
        <View style={{ marginRight: 8 }}>{item.icon}</View>
        <AppText textStyle="body1">{item.label}</AppText>
        <Icons.ChevronRight
          color={
            item.status === 'pending'
              ? Colors.checkboxBorderDefault
              : 'transparent'
          }
          style={styles.listItemArrow}
        />
      </TouchableOpacity>
    )
  }

  const renderCompletedItem = item => {
    return (
      <View key={item.key} style={styles.listItemCompleted}>
        <AppText textStyle="body1">{item.completedLabel}</AppText>
        <Icons.CheckActive />
      </View>
    )
  }

  const renderPrivacyModal = () => {
    return (
      <Modal
        isVisible={privacyVisible}
        animationIn="slideInRight"
        animationInTiming={200}
        animationOut="slideOutRight"
        animationOutTiming={180}
        onBackButtonPress={() => setPrivacyVisible(false)}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <Privacy onClose={() => setPrivacyVisible(false)} />
      </Modal>
    )
  }

  useEffect(() => {
    navigation.addListener('focus', getStatus)
    return () => {
      navigation.removeListener('focus', getStatus)
    }
  }, [])

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <TransitionIndicator
        loading={isLoading}
        backdropStyle={{ backgroundColor: '#fff' }}
      />
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Icons.Back
            style={styles.backButton}
            height={normalize(24)}
            width={normalize(24)}
          />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: normalize(25) }}>
          <Icons.VerifiedProfile height={normalize(80)} width={normalize(80)} />
          <View style={styles.headingWrapper}>
            <AppText textStyle="display6">Get bee-rified!</AppText>
            <AppText
              textStyle="price"
              color={Colors.neutralsWhitesmoke}
              customStyle={styles.badgeContainer}>
              {verifications.filter(item => item.status === 'completed').length}{' '}
              of {verifications.length}
            </AppText>
          </View>
          <Text
            style={[
              typography.body2,
              { marginBottom: normalize(24), color: Colors.contentPlaceholder },
            ]}>
            Complete your profile and verification to validate your account and
            ensure that only you can access your account. It will also make your
            customer feel more secure during transactions.
          </Text>

          {verifications.filter(
            verification => verification.status === 'pending'
          ).length >= 3 ? (
            <View>
              <Text
                style={[
                  typography.body1,
                  typography.medium,
                  { marginBottom: normalize(4) },
                ]}>
                Start the verification process now
              </Text>
              <Text
                style={[
                  typography.body2,
                  {
                    marginBottom: normalize(24),
                    color: Colors.contentPlaceholder,
                  },
                ]}>
                Provide all the necessary info and requirements.
              </Text>
            </View>
          ) : (
            verifications.some(item => item.status === 'pending') && (
              <Text style={[typography.subtitle1, styles.listHeader]}>
                Pending
              </Text>
            )
          )}

          {verifications
            .filter(item => item.status === 'pending')
            .map(renderItem)}

          {verifications.some(item =>
            ['review', 'submitted'].includes(item.status)
          ) && (
            <Text style={[typography.subtitle1, styles.listHeader]}>
              For Review
            </Text>
          )}

          {verifications
            .filter(item => ['review', 'submitted'].includes(item.status))
            .map(renderItem)}

          {verifications.some(item => item.status === 'completed') && (
            <Text
              style={[typography.subtitle1, { marginVertical: normalize(8) }]}>
              Already Completed
            </Text>
          )}
          {verifications
            .filter(item => item.status === 'completed')
            .map(renderCompletedItem)}

          <View style={{ flexDirection: 'row', padding: normalize(16) }}>
            <Icons.Lock width={normalize(24)} height={normalize(24)} />
            <Text
              style={[
                typography.caption,
                {
                  lineHeight: normalize(18),
                  marginLeft: 12,
                  maxWidth: '90%',
                },
              ]}>
              Your privacy is important to us, we do not share your personal
              information. Check our{' '}
              <Text
                style={[
                  typography.caption,
                  {
                    textDecorationLine: 'underline',
                    color: Colors.contentOcean,
                  },
                ]}
                onPress={() => {
                  setPrivacyVisible(true)
                }}>
                Privacy Policy
              </Text>{' '}
              for more details.
            </Text>
          </View>

          {renderPrivacyModal()}
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: normalize(24),
    marginTop: getStatusBarHeight(),
  },
  backButton: { color: '#1F1A54', width: normalize(24), height: normalize(24) },
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
    marginTop: 8,
    alignItems: 'center',
  },
  listItem: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutralsZircon,
    padding: normalize(12),
    paddingRight: normalize(48),
    borderRadius: 8,
    marginBottom: normalize(16),
    backgroundColor: '#fff',
  },
  listItemCompleted: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalize(16),
  },
  listHeader: {
    marginBottom: 15,
  },
  listItemArrow: {
    position: 'absolute',
    right: normalize(12),
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
        name="map-location"
        component={MapLocationScreen}
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
