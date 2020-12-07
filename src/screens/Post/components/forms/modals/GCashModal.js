import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, StyleSheet } from 'react-native'
import {
  openInAppBrowser,
  closeInAppBrowser,
  thousandsSeparators,
} from '@/globals/Utils'
import firestore from '@react-native-firebase/firestore'
import Api from '@/services/Api'

import {
  AppButton,
  AppCheckbox,
  AppText,
  ScreenHeaderTitle,
} from '@/components'
import { Colors, normalize } from '@/globals'
import { LogoGCash } from '@/assets/images'

const GCashModal = ({ closeModal, orderDetails }) => {
  const [terms, setTerms] = useState(false)

  const handleFormChange = () => setTerms(!terms)

  const handleSubmit = async () => {
    const response = await Api.createSourcePayment({
      body: {
        amount: orderDetails.totalPrice * 100,
        type: 'gcash',
        currency: 'PHP',
        order_id: orderDetails.id,
      },
    })

    if (response.success) openInAppBrowser(response.data.redirect.checkout_url)
  }

  useEffect(() => {
    return firestore()
      .doc(`orders/${orderDetails.id}`)
      .onSnapshot(snap => {
        if (snap.data().status === 'paid') closeModal()

        closeInAppBrowser()
      })
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScreenHeaderTitle
        close={closeModal}
        title="GCash"
        iconSize={normalize(16)}
        paddingSize={3}
      />
      <View
        style={{
          height: '89%',
          paddingHorizontal: normalize(25),
          justifyent: 'space-between',
        }}>
        <View>
          <View
            style={{
              paddingTop: 25,
              width: '100%',
              alignItems: 'center',
              paddingBottom: 15,
            }}>
            <LogoGCash width={normalize(150)} height={normalize(50)} />
          </View>
          <View style={styles.border}>
            <AppText customStyle={styles.textStyle}>
              Amount P{thousandsSeparators(orderDetails.totalPrice.toFixed(2))}
            </AppText>
          </View>
          <View style={[styles.border, { marginBottom: 25 }]}>
            <AppText customStyle={styles.textStyle}>
              Ref No. / Payment ID: {orderDetails.id}
            </AppText>
          </View>
          <AppText customStyle={styles.textStyle}>
            Please confirm the transaction within{' '}
            <AppText color={Colors.red}>15 minutes</AppText>
          </AppText>
        </View>
        <View style={{ paddingBottom: 35 }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <AppCheckbox
              Icon=""
              label=""
              value={terms}
              valueChangeHandler={value => handleFormChange(value)}
              style={{
                paddingLeft: 0,
                marginRight: 5,
                paddingTop: 0,
                backgroundColor: 'transparent',
              }}
            />
            <AppText
              customStyle={{
                fontWeight: '700',
                maxWidth: '90%',
                paddingBottom: 20,
              }}>
              Check here to indicate that you have read and agree to
              Paymongo/Servbees’s Privacy Notice before providing your details
            </AppText>
          </View>
          <AppButton
            text="Proceed"
            type="tertiary"
            disabled={!terms}
            customStyle={{ backgroundColor: '#353B50' }}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
export default GCashModal

const styles = StyleSheet.create({
  border: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 16,
    width: '100%',
    marginVertical: 16,
  },
  textStyle: {
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
})
