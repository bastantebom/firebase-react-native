import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native'

import Modal from 'react-native-modal'

import {
  ScreenHeaderTitle,
  PaddingView,
  AppText,
  AppButton,
} from '@/components'

import { Colors, normalize } from '@/globals'
import { ArrowDown } from '@/assets/images/icons'
import { SuccessPayout } from '@/assets/images'
import FloatingAppInput from '@/components/AppInput/AppInput'
import BankList from './BankList'

const PayoutDetails = ({ close, selectedPayout }) => {
  const [showBankList, setShowBankList] = useState(false)
  const [gcashNumber, setGcashNumber] = useState('')
  const [paypalAccoutName, setPaypalAccoutName] = useState('')
  const [paypalEmailAddress, setPaypalEmailAddress] = useState('')
  const [bankAccoutName, setBankAccoutName] = useState('')
  const [bankAccountNumber, setBankAccountNumber] = useState('')
  const [selectedBank, setSelectedBank] = useState('')

  const toggleBankList = () => setShowBankList(!showBankList)

  const bankSelect = item => setSelectedBank(item)

  const onSave = () => {
    if (selectedBank) {
      return <Success />
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle
        title={selectedPayout}
        close={close}
        paddingSize={3}
        iconSize={normalize(20)}
      />
      <PaddingView
        paddingSize={3}
        style={{
          paddingBottom: 0,
        }}>
        <View
          style={{
            justifyContent: 'space-between',
            height: '90%',
          }}>
          {selectedPayout === 'GCash' ? (
            <View>
              <AppText
                textStyle="body1"
                color={Colors.primaryMidnightBlue}
                customStyle={{ marginBottom: normalize(4) }}>
                Enter your GCash mobile number
              </AppText>
              <AppText
                textStyle="caption"
                customStyle={{ marginBottom: normalize(32) }}>
                This is where your future payouts will be deposited weekly on
                Thursday for payments made using credit/debit, e-wallets, and
                PayPal.
              </AppText>
              <FloatingAppInput
                label="+63 10 digit number"
                onChangeText={gcashNumber => setGcashNumber(gcashNumber)}
                value={gcashNumber}
              />
            </View>
          ) : selectedPayout === 'Bank' ? (
            <View>
              <View>
                <AppText
                  textStyle="body1"
                  color={Colors.primaryMidnightBlue}
                  customStyle={{ marginBottom: normalize(4) }}>
                  Enter your Bank account details
                </AppText>
                <AppText
                  textStyle="caption"
                  customStyle={{ marginBottom: normalize(32) }}>
                  This is where your future payouts will be deposited weekly on
                  Thursday for payments made using credit/debit, e-wallets, and
                  PayPal.
                </AppText>
                <TouchableOpacity activeOpacity={0.7} onPress={toggleBankList}>
                  <View pointerEvents="none">
                    <FloatingAppInput
                      label="Select bank"
                      value={selectedBank}
                      style={{
                        marginBottom: normalize(16),
                        color: 'transparent',
                      }}
                    />
                    <AppText
                      textStyle="body1"
                      customStyle={{
                        position: 'absolute',
                        left: normalize(16),
                        top: normalize(20),
                      }}>
                      {selectedBank}
                    </AppText>
                    <View
                      style={{
                        position: 'absolute',
                        right: normalize(16),
                        top: normalize(12),
                      }}>
                      <ArrowDown height={normalize(24)} width={normalize(24)} />
                    </View>
                  </View>
                </TouchableOpacity>
                <FloatingAppInput
                  label="Account Name"
                  onChangeText={bankAccoutName =>
                    setBankAccoutName(bankAccoutName)
                  }
                  value={bankAccoutName}
                  style={{ marginBottom: normalize(16) }}
                />
                <FloatingAppInput
                  label="Account Number"
                  onChangeText={bankAccountNumber =>
                    setBankAccountNumber(bankAccountNumber)
                  }
                  value={bankAccountNumber}
                />
              </View>
            </View>
          ) : selectedPayout === 'PayPal' ? (
            <View>
              <AppText
                textStyle="body1"
                color={Colors.primaryMidnightBlue}
                customStyle={{ marginBottom: normalize(4) }}>
                Enter your PayPal account details
              </AppText>
              <AppText
                textStyle="caption"
                customStyle={{ marginBottom: normalize(32) }}>
                This is where your future payouts will be deposited weekly on
                Thursday for payments made using credit/debit, e-wallets, and
                PayPal.
              </AppText>
              <FloatingAppInput
                label="Account Name"
                onChangeText={paypalAccoutName =>
                  setPaypalAccoutName(paypalAccoutName)
                }
                value={paypalAccoutName}
                style={{ marginBottom: normalize(16) }}
              />
              <FloatingAppInput
                label="Email Address"
                onChangeText={paypalEmailAddress =>
                  setPaypalEmailAddress(paypalEmailAddress)
                }
                value={paypalEmailAddress}
              />
            </View>
          ) : null}
          <AppButton type="primary" text="Save" onPress={() => onSave()} />
        </View>
      </PaddingView>

      <Modal
        isVisible={showBankList}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutRight"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <BankList close={toggleBankList} bankChoice={bankSelect} />
      </Modal>
    </SafeAreaView>
  )
}

const Success = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScreenHeaderTitle iconSize={normalize(20)} paddingSize={3} />
        <View
          style={{
            paddingHorizontal: normalize(24),
            height: '85%',
            justifyContent: 'space-between',
            paddingTop: normalize(24),
          }}>
          <View style={{ alignItems: 'center' }}>
            <SuccessPayout />
            <AppText
              textStyle="body1medium"
              customStyle={{
                marginTop: normalize(32),
                marginBottom: normalize(8),
              }}>
              Payout Method Successfully Saved
            </AppText>
            <AppText textStyle="body2" customStyle={{ textAlign: 'center' }}>
              Your future payouts will be deposited to your preferred payout
              method.
            </AppText>
          </View>
          <AppButton text="Okay" type="primary" />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default PayoutDetails
