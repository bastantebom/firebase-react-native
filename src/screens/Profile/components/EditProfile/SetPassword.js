import React, { useState, useContext } from 'react'
import { View, StyleSheet, SafeAreaView, Dimensions } from 'react-native'

import {
  ScreenHeaderTitle,
  PaddingView,
  AppText,
  AppButton,
} from '@/components'
import { UserContext } from '@/context/UserContext'

import { normalize, Colors } from '@/globals'
import NewPassword from './NewPassword'
import Modal from 'react-native-modal'

const SetPassword = ({ toggleEditLogin, provider }) => {
  const { userInfo } = useContext(UserContext)
  const [password, setPassword] = useState(false)
  const isEmail = provider === 'email' ? true : false

  const toggleSetPassword = () => {
    setPassword(!password)
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <PaddingView paddingSize={3}>
          <ScreenHeaderTitle
            title={isEmail ? 'Change Email Address' : 'Change Mobile Number'}
            close={() => {
              toggleEditLogin('')
            }}
          />
        </PaddingView>
        <View style={{ flex: 1 }}>
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

                  <AppButton
                    text="Set Password"
                    type="primary"
                    height="xl"
                    onPress={toggleSetPassword}
                    customStyle={{ marginTop: normalize(18), width: '50%' }}
                  />
                </View>
              </View>
            </PaddingView>
          </View>
        </View>
      </SafeAreaView>
      <Modal
        isVisible={password}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        onBackButtonPress={() => setPassword(false)}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <NewPassword
          toggleSetPassword={() => toggleSetPassword()}
          provider={provider}
        />
      </Modal>
    </>
  )
}

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

export default SetPassword
