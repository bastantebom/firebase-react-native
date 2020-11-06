import React, { useState } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import Modal from 'react-native-modal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { AppText, BottomSheetHeader } from '@/components'

import { normalize, Colors } from '@/globals'
import BasketModal from './BasketModal'

import { ChevronRight } from '@/assets/images/icons'

import SelectPostModal from './SelectPostModal'

const OfferModal = ({ postType }) => {
  const [offer, setOffer] = useState(null)
  const [message, setMessage] = useState(null)
  const [selectPostModal, showSelectPostModal] = useState(false)
  const [basketModal, showBasketModal] = useState(false)

  return (
    <>
      <View>
        <KeyboardAwareScrollView
          keyboardOpeningTime={50}
          // enableOnAndroid={true}
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingHorizontal: 20,
          }}>
          <BottomSheetHeader />
          <View style={{ paddingTop: normalize(10), paddingBottom: 30 }}>
            <AppText
              textStyle="subtitle1"
              customStyle={{ marginBottom: normalize(25) }}>
              Make An Offer
            </AppText>
            <View
              style={{
                position: 'relative',
                borderColor: Colors.neutralGray,
                borderWidth: 1,
                borderRadius: 4,
                paddingHorizontal: normalize(20),
                paddingVertical: normalize(4),
                marginBottom: normalize(16),
              }}>
              <View
                style={{
                  position: 'absolute',
                  left: 16,
                  top: 4,
                }}>
                <AppText textStyle="body2">You are offering</AppText>
                <AppText textStyle="body2">PHP</AppText>
              </View>
              <View>
                <TextInput
                  style={{
                    textAlign: 'right',
                    fontFamily: 'RoundedMplus1c-Medium',
                    fontSize: normalize(18),
                  }}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={offer}
                  onChangeText={text => setOffer(text)}
                />
              </View>
            </View>
            <View
              style={{
                position: 'relative',
                marginBottom: normalize(16),
              }}>
              <View
                style={{
                  position: 'absolute',
                  left: 16,
                  top: 4,
                }}>
                <AppText textStyle="body2">Message</AppText>
              </View>
              <TextInput
                value={message}
                multiline={true}
                label="Message"
                placeholderTextColor={Colors.contentPlaceholder}
                numberOfLines={Platform.OS === 'ios' ? null : 6}
                minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
                style={{
                  color: Colors.contentEbony,
                  fontFamily: 'RoundedMplus1c-Regular',
                  fontSize: normalize(16),
                  letterSpacing: 0.5,
                  borderColor: Colors.neutralGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  paddingHorizontal: 16,
                  paddingVertical: 30,
                  textAlign: 'left',
                }}
                onChangeText={text => setMessage(text)}
                underlineColorAndroid={'transparent'}
                textAlignVertical="top"
                scrollEnabled={false}
              />
            </View>
            <TouchableOpacity
              style={{
                borderColor: Colors.neutralGray,
                borderWidth: 1,
                borderRadius: 4,
                paddingHorizontal: normalize(20),
                paddingVertical: normalize(20),
              }}
              onPress={() => showSelectPostModal(true)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{ flexDirection: 'column' }}>
                  <AppText textStyle="body2">Send a post</AppText>
                  <AppText textStyle="caption">Send one of your post</AppText>
                </View>
                <ChevronRight />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => showBasketModal(true)}>
              <AppText textStyle="body3">View Summary</AppText>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
      <Modal
        isVisible={basketModal}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        style={{
          margin: 0,
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          height: Dimensions.get('window').height,
        }}>
        <BasketModal
          closeModal={() => showBasketModal(false)}
          postType={postType}
        />
      </Modal>
      <Modal
        isVisible={selectPostModal}
        animationIn="slideInRight"
        animationInTiming={750}
        animationOut="slideOutRight"
        animationOutTiming={750}
        style={{
          margin: 0,
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          height: Dimensions.get('window').height,
        }}>
        <SelectPostModal closeModal={() => showSelectPostModal(false)} />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFD400',
    borderRadius: 3,
    marginTop: normalize(20),
  },
})

export default OfferModal
