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
const NewLogin = ({ toggleSetPassword, provider }) => {
  const { userInfo, user, setUserInfo } = useContext(UserContext)
  const [newLogin, setNewLogin] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [enabled, setEnabled] = useState(false)
  const [verify, setVerify] = useState(false)
  const isEmail = provider === 'email' ? true : false

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
              toggleSetPassword()
            }}
          />
        </PaddingView>
        <View style={{ flex: 1, backgroundColor: Colors.neutralsZircon }}>
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
              <FloatingAppInput
                value={newLogin}
                label={isEmail ? 'New Email' : 'New Mobile Number'}
                customStyle={{ marginBottom: normalize(16) }}
                onChangeText={newLogin => {
                  setNewLogin(newLogin)
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
              // disabled={!enabled}
              // customStyle={{
              //   backgroundColor: !enabled
              //     ? Colors.buttonDisable
              //     : Colors.primaryYellow,
              //   borderColor: !enabled
              //     ? Colors.buttonDisable
              //     : Colors.primaryYellow,
              // }}
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
          login={newLogin}
          provider={provider}
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
export default NewLogin
