//import liraries
import React, { useState, useContext } from 'react'
import { View, StyleSheet, SafeAreaView, Dimensions } from 'react-native'

import {
  ScreenHeaderTitle,
  PaddingView,
  AppText,
  AppButton,
  FloatingAppInput,
} from '@/components'
import { UserContext } from '@/context/UserContext'

import { normalize, Colors } from '@/globals'
import Verify from './VerifyAccount'
import Modal from 'react-native-modal'

// create a component
const EditLogin = ({ toggleEditLogin, provider }) => {
  const { userInfo, user, setUserInfo } = useContext(UserContext)
  const [newEmail, setNewEmail] = useState('')
  const [newMobile, setNewMobile] = useState('')
  const [password, setPassword] = useState('')
  const [enabled, setEnabled] = useState(false)
  const [verify, setVerify] = useState(false)
  const isEmail = provider === 'email' ? true : false

  const emailChangeHandler = newEmail => {
    const email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    email.test(newEmail) === true ? setEnabled(true) : setEnabled(false)
    setNewEmail(newEmail)
  }

  const toggleVerify = () => {
    setVerify(!verify)
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <PaddingView paddingSize={3}>
          <ScreenHeaderTitle
            iconSize={16}
            title={isEmail ? 'Change Email Address' : 'Change Mobile Number'}
            close={() => {
              toggleEditLogin('')
            }}
          />
        </PaddingView>
        <View style={{ flex: 1, backgroundColor: Colors.neutralsZircon }}>
          <View style={[styles.contentWrapper]}>
            <PaddingView paddingSize={3}>
              <View>
                <View style={{ paddingVertical: 32 }}>
                  <AppText textStyle="body2">
                    {isEmail ? 'Current Email' : 'Current Mobile Number'}
                  </AppText>
                  <AppText textStyle="body1">
                    {isEmail ? userInfo.email : userInfo.phone_number}
                  </AppText>

                  <AppText
                    textStyle="captionConstant"
                    customStyle={{ marginTop: normalize(18) }}>
                    {isEmail
                      ? 'You signed up using Something. Something copy here. Something, something.'
                      : 'You signed up using Something. Something copy here. Something, something.'}
                  </AppText>
                </View>
              </View>
            </PaddingView>
          </View>
          <View
            style={[
              styles.contentWrapper,
              {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                marginBottom: 0,
              },
            ]}>
            <PaddingView paddingSize={3}>
              <AppText textStyle="body2">
                {isEmail ? 'Change Email Address' : 'Change Mobile Number'}
              </AppText>
              <AppText textStyle="captionConstant">
                {isEmail ? 'Something, Something' : 'Something, Something'}
              </AppText>
              {isEmail ? (
                <FloatingAppInput
                  value={newEmail}
                  label="New Email"
                  customStyle={{ marginBottom: normalize(16), marginTop: 40 }}
                  onChangeText={newEmail => {
                    emailChangeHandler(newEmail)
                  }}
                />
              ) : (
                <FloatingAppInput
                  value={newMobile}
                  label="New Mobile Number"
                  customStyle={{ marginBottom: normalize(16) }}
                  onChangeText={() => {
                    setNewMobile(newMobile)
                  }}
                />
              )}

              <FloatingAppInput
                value={password}
                label="Password"
                customStyle={{ marginBottom: normalize(16) }}
                onChangeText={password => {
                  setPassword(password)
                }}
              />
            </PaddingView>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              padding: 24,
              backgroundColor: Colors.neutralsWhite,
            }}>
            <AppButton
              text={isEmail ? 'Verify your email' : 'Verify your number'}
              type="primary"
              size="l"
              height="xl"
              disabled={!enabled}
              customStyle={{
                backgroundColor: !enabled
                  ? Colors.buttonDisable
                  : Colors.primaryYellow,
                borderColor: !enabled
                  ? Colors.buttonDisable
                  : Colors.primaryYellow,
              }}
              onPress={toggleVerify}
            />
          </View>
        </View>
      </SafeAreaView>
      <Modal
        isVisible={verify}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        onBackButtonPress={() => setVerify(false)}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <Verify
          toggleVerify={toggleVerify}
          provider={provider}
          login={isEmail ? newEmail : newMobile}
        />
      </Modal>
    </>
  )
}

// define your styles
const styles = StyleSheet.create({
  contentWrapper: {
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 8,
    marginBottom: 6,
  },
  copyWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: normalize(24),
    backgroundColor: Colors.neutralsWhite,
  },
  centerCopy: {
    textAlign: 'left',
    marginBottom: normalize(8),
  },
  input: {
    color: Colors.contentEbony,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    letterSpacing: 0.5,
    borderColor: Colors.neutralGray,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
})

//make this component available to the app
export default EditLogin
