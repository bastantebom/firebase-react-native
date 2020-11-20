import React, { useState, useEffect } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Keyboard,
  SafeAreaView,
  Animated,
} from 'react-native'
import Modal from 'react-native-modal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { AppText, BottomSheetHeader } from '@/components'

import { PriceInput } from '@/components/AppInput'

import { normalize, Colors } from '@/globals'
import BasketModal from './BasketModal'

import { ChevronRight } from '@/assets/images/icons'

import SelectPostModal from './SelectPostModal'
import Api from '@/services/Api'

const OfferModal = ({ postType, postData }) => {
  const [offer, setOffer] = useState(null)
  const [message, setMessage] = useState(null)
  const [selectedPost, setSelectedPost] = useState()
  const [selectedPostDetails, setSelectedPostDetails] = useState({})

  const [selectPostModal, showSelectPostModal] = useState(false)
  const [basketModal, showBasketModal] = useState(false)
  const [animatedPadding] = useState(new Animated.Value(30))

  function onKeyboardDidShow(e) {
    const keyboardHeight = e.endCoordinates.height
    keyboardToggleAnimation(keyboardHeight)
  }

  function onKeyboardDidHide() {
    keyboardToggleAnimation(0)
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow)
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide)
    return () => {
      Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow)
      Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide)
    }
  }, [])

  let paddingAnimatedStyle = {
    paddingTop: normalize(10),
    paddingBottom: animatedPadding,
  }

  let keyboardToggleAnimation = height => {
    Animated.timing(animatedPadding, {
      toValue: height + 30,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }

  const [offerData, setOfferData] = useState({})

  useEffect(() => {
    setOfferData({
      price: offer,
      message,
    })
  }, [offer, message, selectPostModal])

  const selectNeedFunction = post_id => {
    setSelectedPost(post_id)
  }

  const getPostDetail = async post_id => {
    const post = await Api.getPost({ pid: post_id })

    const { data, success } = post

    if (success) {
      setSelectedPostDetails(data)
    }
    console.log({ post })
  }

  useEffect(() => {
    if (selectedPost) {
      getPostDetail(selectedPost)
    }
  }, [selectedPost])

  return (
    <>
      <View>
        <KeyboardAwareScrollView
          keyboardOpeningTime={50}
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingHorizontal: 20,
          }}>
          <BottomSheetHeader />
          <Animated.View style={paddingAnimatedStyle}>
            <AppText textStyle="subtitle1" customStyle={{ marginBottom: 24 }}>
              Make An Offer
            </AppText>

            <PriceInput
              style={{ marginBottom: 16 }}
              value={offer}
              keyboardType="number-pad"
              onChangeText={text => setOffer(text)}
              placeholder="00"
              label="You are offering"
            />

            <TextInput
              value={message}
              multiline={true}
              placeholder="Message"
              placeholderTextColor={Colors.neutralGray}
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
                paddingVertical: 8,
                marginBottom: 16,
                textAlign: 'left',
              }}
              onChangeText={text => setMessage(text)}
              underlineColorAndroid={'transparent'}
              textAlignVertical="top"
              scrollEnabled={false}
            />

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
                {!selectedPost ? (
                  <View style={{ flexDirection: 'column' }}>
                    <AppText textStyle="body2">Send a post</AppText>
                    <AppText textStyle="caption">Send one of your post</AppText>
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor: 'red',
                      height: normalize(48),
                      width: normalize(48),
                    }}>
                    <AppText>{selectedPostDetails?.title}</AppText>
                  </View>
                )}
                <ChevronRight />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => showBasketModal(true)}>
              <AppText textStyle="body3">View Summary</AppText>
            </TouchableOpacity>
          </Animated.View>
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
          postData={postData}
          offerData={offerData}
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
        <SelectPostModal
          closeModal={() => showSelectPostModal(false)}
          selectNeedFunction={selectNeedFunction}
        />
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
