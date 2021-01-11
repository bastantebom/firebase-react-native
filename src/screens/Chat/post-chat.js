import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Animated,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import Modal from 'react-native-modal'

import { normalize, Colors } from '@/globals'
import { AppRadio, AppText, ScreenHeaderTitle } from '@/components'
import {
  BlueDot,
  PostParcelBlue,
  Search,
  TrashWhite,
  HorizontalWhiteEllipsis,
} from '@/assets/images/icons'
import ChatOptions from './components/ChatOptions'
import MultiChatOptions from './components/MultiChatOptions'

const { width } = Dimensions.get('window')
const PADDING = 16
const SEARCH_FULL_WIDTH = width - PADDING * 2
const SEARCH_SHRINK_WIDTH = normalize(45)

const PostChat = () => {
  const navigation = useNavigation()

  const messages = [
    {
      user_name: 'Trizh',
      icon: require('@/assets/images/default-profile.png'),
      message:
        'Would like to follow up an order. I ordered 20 minutes ago. I’m hungry!',
      read: false,
    },
    {
      user_name: 'Gail',
      icon: require('@/assets/images/default-profile.png'),
      message: 'Okay po',
      read: false,
    },
    {
      user_name: 'Pia',
      icon: require('@/assets/images/default-profile.png'),
      message: 'Do you have Keto-friendly set?',
      read: false,
    },
    {
      user_name: 'Grae',
      icon: require('@/assets/images/default-profile.png'),
      message: 'Hello! I’d like to make amendments to my order please :)',
      read: true,
    },
    {
      user_name: 'Jayson',
      icon: require('@/assets/images/default-profile.png'),
      message:
        'Have you received my payment? I can try GCash if my BPI QR doesn’t work Have you received my payment? I can try GCash if my BPI QR doesn’t work',
      read: true,
    },
    {
      user_name: 'Rey',
      icon: require('@/assets/images/default-profile.png'),
      message: 'sent you an attachment',
      read: true,
    },
  ]

  const [value, setValue] = useState('')

  const handleChange = value => {
    setValue(value)
  }

  const [showChatOptions, setShowChatOptions] = useState(false)
  const [showMultiChatOptions, setShowMultiChatOptions] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [inputLength] = useState(new Animated.Value(SEARCH_SHRINK_WIDTH))
  const [cancelPosition] = useState(new Animated.Value(0))
  const [opacity] = useState(new Animated.Value(0))

  const onFocus = () => {
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_FULL_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(cancelPosition, {
        toValue: 16,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
    setIsSearchFocused(true)
  }

  const onBlur = () => {
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_SHRINK_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(cancelPosition, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
    setIsSearchFocused(false)
  }

  const handleSearchPress = () => {
    if (!isSearchFocused) {
      onFocus()
    } else {
      onBlur()
    }
  }

  const renderRightActions = dragX => {
    const trans = dragX.interpolate({
      inputRange: [-200, -100, 100, 200],
      outputRange: [-200, -100, 100, 200],
    })
    return (
      <Animated.View
        style={[
          styles.swipeout,
          {
            transform: [{ translateX: trans }],
          },
        ]}>
        <RectButton
          style={[
            styles.swipeOption,
            { backgroundColor: Colors.primaryMidnightBlue },
          ]}
          onPress={() => setShowChatOptions(true)}>
          <HorizontalWhiteEllipsis />
        </RectButton>

        <RectButton
          style={[
            styles.swipeOption,
            { backgroundColor: Colors.secondaryBrinkPink },
          ]}>
          <View>
            <TrashWhite />
          </View>
        </RectButton>
      </Animated.View>
    )
  }

  const getOption = option => {}

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeaderTitle
        title="Post Chats"
        iconSize={normalize(16)}
        paddingSize={3}
        close={() => navigation.goBack()}
        withOptions
        openOptions={() => setShowMultiChatOptions(true)}
      />
      <View style={styles.postChatHeader}>
        <View style={{ flexDirection: 'row', paddingTop: normalize(15) }}>
          <PostParcelBlue />
          <AppText textStyle="body2" customStyle={{ marginLeft: normalize(8) }}>
            Wayne's Burgers and Smoothies
          </AppText>
        </View>
        <Animated.View style={[styles.search, { width: inputLength }]}>
          <TextInput
            onBlur={onBlur}
            onFocus={onFocus}
            style={{
              fontFamily: 'RoundedMplus1c-Regular',
              fontSize: normalize(14),
              paddingRight: normalize(25),
            }}
          />
          <TouchableOpacity
            style={[styles.searchIcon]}
            onPress={handleSearchPress}>
            <Search width={normalize(20)} height={normalize(20)} />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: normalize(25) }}>
        {messages.map((chat, i) => {
          return (
            <Swipeable renderRightActions={renderRightActions} key={i}>
              <View style={{ marginBottom: normalize(15) }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {}}
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: normalize(16),
                  }}>
                  <Image source={chat.icon} style={styles.icon} />
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <AppText
                        textStyle="caption2"
                        customStyle={{
                          paddingRight: 15,
                          width: '90%',
                          marginBottom: normalize(4),
                        }}
                        numberOfLines={1}>
                        {chat.user_name}
                      </AppText>
                      <AppText
                        textStyle="metadata"
                        color={Colors.contentPlaceholder}>
                        1m
                      </AppText>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <AppText
                        textStyle={chat.read ? 'caption2' : 'caption'}
                        customStyle={{ width: '90%' }}
                        numberOfLines={2}>
                        {chat.message}
                      </AppText>
                      {chat.read && <BlueDot />}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </Swipeable>
          )
        })}
      </ScrollView>
      <Modal
        isVisible={showChatOptions}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setShowChatOptions(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <ChatOptions close={() => setShowChatOptions(false)} />
      </Modal>
      <Modal
        isVisible={showMultiChatOptions}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback
            onPress={() => setShowMultiChatOptions(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <MultiChatOptions
          close={() => setShowMultiChatOptions(false)}
          options={getOption}
        />
      </Modal>
    </SafeAreaView>
  )
}

export default PostChat

const styles = StyleSheet.create({
  parent: { flex: 1, backgroundColor: 'white' },
  postChatHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingBottom: normalize(20),
    paddingHorizontal: normalize(16),
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  icon: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: 50,
    marginRight: normalize(15),
  },
  search: {
    height: normalize(45),
    paddingHorizontal: normalize(16),
    position: 'absolute',
    right: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.neutralGray,
    backgroundColor: 'white',
  },
  searchIcon: {
    position: 'absolute',
    zIndex: 999,
    top: 13,
    right: 12,
  },
  swipeout: {
    width: normalize(140),
    flexDirection: 'row',
    backgroundColor: 'red',
  },
  swipeOption: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
