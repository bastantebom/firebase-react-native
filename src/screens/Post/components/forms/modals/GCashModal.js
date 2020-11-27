import React, { useState } from 'react'
import { View, SafeAreaView, StyleSheet } from 'react-native'

import {
  AppButton,
  AppCheckbox,
  AppText,
  ScreenHeaderTitle,
} from '@/components'

import { Colors, normalize } from '@/globals'
import { LogoGCash } from '@/assets/images'

const GCashModal = ({ closeModal }) => {
  const [terms, setTerms] = useState(false)

  const handleFormChange = () => {
    setTerms(!terms)
  }

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
            <LogoGCash width={normalize(150)} height={normalize(50)} />
          </View>
          <View style={styles.border}>
            <AppText customStyle={styles.textStyle}>Amount P155.00</AppText>
          </View>
          <View style={[styles.border, { marginBottom: 25 }]}>
            <AppText customStyle={styles.textStyle}>
              Reference No. /Payment ID LAHVBLFDHB
            </AppText>
          </View>
          <AppText customStyle={styles.textStyle}>
            Please confirm the transaction within{' '}
            <AppText color={Colors.red}>15 minutes</AppText>
          </AppText>
        </View>
        <View style={{ paddingBottom: 35 }}>
          <View style={{ flexDirection: 'row' }}>
            <AppCheckbox
              Icon=""
              label=""
              value={terms}
              valueChangeHandler={value => handleFormChange(value)}
              style={{
                marginLeft: 0,
                paddingLeft: 0,
                marginTop: 8,
                backgroundColor: 'transparent',
              }}
            />
            <AppText>
              Check here to indicate that you have read and agree to
              Paymongo/Servbees’s Privacy Notice before providing your details
            </AppText>
          </View>
          <AppButton
            text="Proceed"
            type="tertiary"
            customStyle={{ backgroundColor: '#353B50' }}
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
