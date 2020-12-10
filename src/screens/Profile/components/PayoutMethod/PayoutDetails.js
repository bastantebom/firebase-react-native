import React, { useState } from 'react'
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
                      style={{ marginBottom: normalize(16) }}
                    />
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
          <AppButton type="primary" text="Save" />
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

export default PayoutDetails
