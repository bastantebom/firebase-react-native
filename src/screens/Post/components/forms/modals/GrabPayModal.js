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
  PaddingView,
  ScreenHeaderTitle,
} from '@/components'

import { Colors, normalize } from '@/globals'
import { LogoGrabPay } from '@/assets/images'

const GrabPayModal = ({ closeModal, orderDetails }) => {
  const [webViewLink, setWebViewLink] = useState('')
  const [terms, setTerms] = useState(false)

  const handleFormChange = () => setTerms(!terms)

  const handleSubmit = async () => {
    const response = await Api.createSourcePayment({
      body: {
        amount: orderDetails.totalPrice * 100,
        type: 'grab_pay',
        currency: 'PHP',
        order_id: orderDetails.id,
      },
    })

    if (response.success) setWebViewLink(response.data.redirect.checkout_url)
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
    <>
      <View
        style={{
          backgroundColor: '#EDF0F8',
          height: normalize(170),
          width: '100%',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          opacity: 1,
          zIndex: -1,
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <ScreenHeaderTitle
          close={closeModal}
          title="GrabPay"
          iconSize={normalize(16)}
          paddingSize={3}
        />
        <PaddingView
          paddingSize={3}
          style={{
            paddingTop: 0,
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <View>
            <View
              style={{
                paddingHorizontal: normalize(25),
                justifyent: 'space-between',
                backgroundColor: Colors.neutralsWhite,
                elevation: 3,
                borderRadius: 4,
                marginBottom: normalize(24),
              }}>
              <View
                style={{
                  paddingTop: normalize(25),
                  width: '100%',
                  alignItems: 'center',
                  paddingBottom: normalize(15),
                }}>
                <LogoGrabPay />
              </View>
              <View style={{ alignItems: 'center' }}>
                <AppText textStyle="display6">
                  ₱{thousandsSeparators(orderDetails.totalPrice.toFixed(2))}
                </AppText>
                <AppText textStyle="caption">Amount</AppText>
              </View>
              <View style={[styles.border, { marginBottom: 25 }]}>
                <AppText
                  textStyle="caption"
                  customStyle={{ textAlign: 'center' }}>
                  Ref No. / Payment ID: {orderDetails.id}
                </AppText>
              </View>
            </View>
            <AppText textStyle="body2" customStyle={{ textAlign: 'center' }}>
              Please confirm the transaction within{'\n'}
              <AppText textStyle="body2medium" color={Colors.red}>
                15 minutes
              </AppText>
            </AppText>
          </View>

          <View>
            <View style={{ flexDirection: 'row' }}>
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
                textStyle="body2"
                customStyle={{
                  maxWidth: '90%',
                  paddingBottom: 20,
                }}>
                Check here to indicate that you have read and agree to
                Paymongo/Servbees’s Privacy Notice before providing your details
              </AppText>
            </View>
            <AppButton
              text="Proceed"
              type="primary"
              disabled={!terms}
              onPress={handleSubmit}
              customStyle={{
                backgroundColor: !terms
                  ? Colors.neutralsZirconLight
                  : Colors.primaryYellow,
                borderColor: !terms
                  ? Colors.neutralsZirconLight
                  : Colors.primaryYellow,
              }}
            />
          </View>
        </PaddingView>

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
              title="GCash"
              iconSize={normalize(16)}
              paddingSize={3}
            />
          </WebViewModal>
        </Modal>
      </SafeAreaView>
    </>
  )
}
export default GrabPayModal

const styles = StyleSheet.create({
  border: {
    borderColor: '#cacbcc',
    borderWidth: 1,
    padding: 16,
    width: '100%',
    marginVertical: 16,
    borderRadius: 4,
  },
  webViewModal: {
    margin: 0,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
  },
})
