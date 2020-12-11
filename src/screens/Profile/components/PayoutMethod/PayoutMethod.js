import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native'
import Modal from 'react-native-modal'

import {
  ScreenHeaderTitle,
  PaddingView,
  AppText,
  AppButton,
} from '@/components'

import { EmptyPayout } from '@/assets/images'
import { Colors, normalize } from '@/globals'
import ChangePayoutMethod from './ChangePayoutMethod'

const PayoutMethod = ({ close }) => {
  const [payoutMethod, setPayoutMethod] = useState('')
  const [changePayoutMethod, setChangePayoutMethod] = useState(false)

  const toggleChangePayout = () => setChangePayoutMethod(!changePayoutMethod)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle
        title="Payout Method"
        close={close}
        paddingSize={3}
        iconSize={normalize(20)}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}>
        <PaddingView paddingSize={3}>
          {!payoutMethod ? (
            <View
              style={{
                justifyContent: 'space-between',
                height: '100%',
              }}>
              <View style={{ alignItems: 'center' }}>
                <EmptyPayout />
                <AppText
                  textStyle="body1medium"
                  customStyle={{
                    marginTop: normalize(25),
                    marginBottom: normalize(8),
                  }}>
                  Add your preferred payout method
                </AppText>
                <AppText
                  textStyle="body2"
                  customStyle={{
                    textAlign: 'center',
                    marginBottom: normalize(14),
                  }}>
                  The orders paid via Credit/Debit, GCash, GrabPay, or PayPal
                  are credited to your preferred payout method after an order
                  has been completed and the payment becomes eligible for
                  payout.
                </AppText>
                <View
                  style={{
                    backgroundColor: Colors.secondarySolitude,
                    padding: normalize(16),
                    borderRadius: 8,
                    marginBottom: normalize(25),
                  }}>
                  <AppText
                    textStyle="caption"
                    customStyle={{ marginBottom: normalize(16) }}>
                    After your payment has been credited, you should receive a
                    confirmation via notification, SMS, or email.
                  </AppText>
                  <TouchableOpacity activeOpacity={0.7}>
                    <AppText
                      textStyle="body2medium"
                      color={Colors.contentOcean}>
                      View FAQ
                    </AppText>
                  </TouchableOpacity>
                </View>
              </View>
              <AppButton
                text="Add payout method"
                type="primary"
                onPress={toggleChangePayout}
              />
            </View>
          ) : (
            <View>
              <AppText
                textStyle="body1"
                color={Colors.primaryMidnightBlue}
                customStyle={{ marginBottom: normalize(4) }}>
                Your preferred payout method
              </AppText>
              <AppText
                textStyle="caption"
                customStyle={{ marginBottom: normalize(32) }}>
                This is where your payments paid via Credit/Debit, GCash,
                GrabPay, or PayPal will be credited.
              </AppText>
              <View style={styles.payoutInput}>
                <AppText textStyle="body2medium">
                  GCash <AppText textStyle="body2">+63 917 888 1029</AppText>
                </AppText>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleChangePayout}>
                <AppText textStyle="body2medium" color={Colors.contentOcean}>
                  Change payout method
                </AppText>
              </TouchableOpacity>
            </View>
          )}
        </PaddingView>
      </ScrollView>

      <Modal
        isVisible={changePayoutMethod}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutRight"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <ChangePayoutMethod close={toggleChangePayout} />
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  payoutInput: {
    borderColor: Colors.neutralsZircon,
    borderWidth: 1,
    borderRadius: 4,
    padding: normalize(16),
    marginBottom: normalize(12),
  },
})

export default PayoutMethod
