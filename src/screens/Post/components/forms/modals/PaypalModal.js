import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import WebViewModal from '@/screens/Post/components/forms/modals/WebViewModal'

import { thousandsSeparators } from '@/globals/Utils'
import firestore from '@react-native-firebase/firestore'
import Api from '@/services/Api'

import {
  AppButton,
  AppCheckbox,
  AppText,
  ScreenHeaderTitle,
} from '@/components'

import { Colors, normalize } from '@/globals'
import { LogoPaypal } from '@/assets/images'

const PaypalModal = ({ closeModal, orderDetails }) => {
  const [webViewLink, setWebViewLink] = useState('')
  const [terms, setTerms] = useState(false)

  const handleSubmit = async () => {
    const response = await Api.createPaypalPayment({
      body: {
        amount: orderDetails.totalPrice,
        currency: 'PHP',
        order_id: orderDetails.id,
      },
    })

    setWebViewLink(response.links[1].href)
  }

  useEffect(() => {
    return firestore()
      .doc(`orders/${orderDetails.id}`)
      .onSnapshot(snap => {
        if (snap.data().status === 'paid') closeModal()

        setWebViewLink('')
      })
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScreenHeaderTitle
        close={closeModal}
        title="PayPal"
        iconSize={normalize(16)}
        paddingSize={3}
      />
      <View
        style={{
          height: '89%',
          paddingHorizontal: normalize(25),
          justifyContent: 'space-between',
        }}>
        <View>
          <View
            style={{
              paddingTop: 25,
              width: '100%',
              alignItems: 'center',
              paddingBottom: 15,
            }}>
            <LogoPaypal />
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
              valueChangeHandler={() => setTerms(!terms)}
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
            onPress={handleSubmit}
            disabled={!terms}
            text="Proceed"
            type="tertiary"
            customStyle={{ backgroundColor: '#353B50' }}
          />
        </View>
      </View>

      <Modal
        isVisible={!!webViewLink.length}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        style={styles.webViewModal}>
        <WebViewModal link={webViewLink}>
          <ScreenHeaderTitle
            close={() => setWebViewLink('')}
            title="PayPal"
            iconSize={normalize(16)}
            paddingSize={3}
          />
        </WebViewModal>
      </Modal>
    </SafeAreaView>
  )
}
export default PaypalModal

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
  webViewModal: {
    margin: 0,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
  },
})
