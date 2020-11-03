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
import NewLogin from './NewLogin'
import Modal from 'react-native-modal'

// create a component
const EditLogin = ({ toggleSetPassword, provider }) => {
  const { userInfo, user, setUserInfo } = useContext(UserContext)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [enabled, setEnabled] = useState(false)
  const [newLogin, setNewLogin] = useState(false)
  const isEmail = provider === 'email' ? true : false

  const toggleNewLogin = () => {
    setNewLogin(!newLogin)
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <PaddingView paddingSize={3}>
          <ScreenHeaderTitle
            iconSize={16}
            title="Set New Password"
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
                value={password}
                label="New Password"
                customStyle={{ marginBottom: normalize(16) }}
                onChangeText={password => {
                  setPassword(password)
                }}
              />
              <FloatingAppInput
                value={confirmPassword}
                label="Confirm Password"
                customStyle={{ marginBottom: normalize(16) }}
                onChangeText={confirmPassword => {
                  setConfirmPassword(confirmPassword)
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
              text="Confirm"
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
              onPress={toggleNewLogin}
            />
          </View>
        </View>
      </SafeAreaView>
      <Modal
        isVisible={newLogin}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        onBackButtonPress={() => setNewLogin(false)}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <NewLogin toggleNewLogin={() => toggleNewLogin()} provider={provider} />
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
