import React, { useState, useContext } from 'react'
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
import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'

const PayoutDetails = ({ navigation, route }) => {
  const { payout, method } = route.params

  const [payoutData, setPayoutData] = useState({ method })
  const [showBankList, setShowBankList] = useState(false)
  const { user } = useContext(UserContext)

  const onSave = async () => {
    let success = false
    if (!payout) {
      const result = await Api.savePayout({ body: payoutData })
      success = result.success
    } else {
      const result = await Api.updatePayout({ uid: user.uid, body: payoutData })
      success = result.success
    }
    if (success) navigation.navigate('payout-success')
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle
        title={method}
        close={() => navigation.goBack()}
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
          {method === 'GCash' ? (
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
                onChangeText={value =>
                  setPayoutData({
                    ...payoutData,
                    account_number: `+63${value}`,
                  })
                }
                value={payoutData.account_number || ''}
              />
            </View>
          ) : method === 'Bank' ? (
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
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowBankList(true)}>
                  <View pointerEvents="none">
                    <FloatingAppInput
                      label={'Select bank'}
                      value={payoutData.bank || ''}
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
                      {payoutData.bank}
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
                  onChangeText={value =>
                    setPayoutData({
                      ...payoutData,
                      account_name: value,
                    })
                  }
                  value={payoutData.account_name || ''}
                  style={{ marginBottom: normalize(16) }}
                />
                <FloatingAppInput
                  label="Account Number"
                  onChangeText={value =>
                    setPayoutData({
                      ...payoutData,
                      account_number: value,
                    })
                  }
                  value={payoutData.account_number || ''}
                />
              </View>
            </View>
          ) : method === 'PayPal' ? (
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
                onChangeText={value =>
                  setPayoutData({
                    ...payoutData,
                    account_name: value,
                  })
                }
                value={payoutData.account_name || ''}
                style={{ marginBottom: normalize(16) }}
              />
              <FloatingAppInput
                label="Email Address"
                onChangeText={value =>
                  setPayoutData({
                    ...payoutData,
                    email_address: value,
                  })
                }
                value={payoutData.email_address || ''}
              />
            </View>
          ) : null}
          <AppButton type="primary" text="Save" onPress={onSave} />
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
        <BankList
          close={() => setShowBankList(false)}
          payoutData={payoutData}
          setPayoutData={setPayoutData}
        />
      </Modal>
    </SafeAreaView>
  )
}

export default PayoutDetails
