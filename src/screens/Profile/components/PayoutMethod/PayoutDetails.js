import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native'
import Modal from 'react-native-modal'

import { AppText, FloatingAppInput } from '@/components'
import { Colors, normalize } from '@/globals'
import { ArrowDown, Icons } from '@/assets/images/icons'
import BankList from './BankList'
import { UserContext } from '@/context/UserContext'
import Api from '@/services/Api'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Button from '@/components/Button'
import Toast from '@/components/toast'

const PayoutDetails = ({ navigation, route }) => {
  const { payout, method } = route.params

  const [payoutData, setPayoutData] = useState({ method })
  const [showBankList, setShowBankList] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const { user } = useContext(UserContext)

  useEffect(() => {
    accountChange('')
  }, [])

  const accountChange = value => {
    if (value.length > 0 && value.length < 3) return
    let newValue = value
    if (!newValue.includes('+63')) newValue = `+63${value}`
    setPayoutData({ ...payoutData, account_number: newValue })
  }

  const handleOnSave = async () => {
    try {
      const response = await Api.savePayout({ body: payoutData })
      if (!response.success) throw new Error(response.message)

      setIsSaved(true)
      navigation.navigate('payout-success')
    } catch (error) {
      console.log(error)
      Toast.show({
        label: 'Oops! Something went wrong',
        type: 'error',
        dismissible: true,
        timeout: 5000,
        screenId: 'payout-details',
      })
    }
  }

  return (
    <>
      <Toast
        containerStyle={{ marginTop: getStatusBarHeight() + normalize(8) }}
        ref={ref => Toast.setRef(ref, 'payout-details')}
      />
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>
              Payout Method
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          {method === 'GCash' ? (
            <View style={{ flex: 1 }}>
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
                onChangeText={value => accountChange(value)}
                value={payoutData.account_number}
                maxLength={13}
                keyboardType="number-pad"
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
            <View style={{ flex: 1 }}>
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
          <Button type="primary" label="Save" onPress={handleOnSave} />
        </View>
      </View>

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
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
  header: {
    flexDirection: 'row',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    padding: normalize(24),
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
  },
})

export default PayoutDetails
