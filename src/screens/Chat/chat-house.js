import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  Animated,
  TextInput,
  Dimensions,
} from 'react-native'

import { useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal'

import { normalize, Colors } from '@/globals'
import { AppText, ScreenHeaderTitle } from '@/components'
import { BlueDot, ChatBlue, ChevronDown, Search } from '@/assets/images/icons'

import ChatSort from './components/ChatSort'

const { width } = Dimensions.get('window')
const PADDING = 16
const SEARCH_FULL_WIDTH = width - PADDING * 2
const SEARCH_SHRINK_WIDTH = normalize(45)

const ChatHouse = () => {
  const navigation = useNavigation()

  const [chatSort, setChatSort] = useState(false)
  const [sortCategory, setSortCategory] = useState('All Messages')

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

  const messages = [
    {
      post:
        'Wayne’s Burgers and Smoothies Wayne’s Burgers and Smoothies Wayne’s Burgers and Smoothies',
      icon: require('@/assets/images/burger.jpg'),
    },
    {
      post: "Wayne's Desserts",
      icon: require('@/assets/images/burger.jpg'),
    },
    {
      post: "Wayne's Desserts",
      icon: require('@/assets/images/burger.jpg'),
    },
  ]

  const getSortSelected = choice => {
    setSortCategory(choice)
  }

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeaderTitle
        title="All Chats"
        iconSize={normalize(16)}
        paddingSize={3}
        close={() => navigation.goBack()}
        withOptions
        openOptions={() => {}}
      />
      <View style={styles.chatHeader}>
        <TouchableOpacity style={styles.sort} onPress={() => setChatSort(true)}>
          <AppText
            textStyle="body3"
            customStyle={{ marginRight: normalize(8) }}>
            {sortCategory}
          </AppText>
          <ChevronDown width={normalize(20)} height={normalize(20)} />
        </TouchableOpacity>
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
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: normalize(16),
          paddingBottom: normalize(25),
        }}>
        {messages.map((post, i) => {
          return (
            <View key={i} style={{ marginBottom: normalize(15) }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('PostChat')}
                style={{
                  flexDirection: 'row',
                }}>
                <Image source={post.icon} style={styles.icon} />
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '85%',
                    }}>
                    <AppText
                      textStyle="body2medium"
                      customStyle={{
                        paddingRight: 15,
                        width: '90%',
                        marginBottom: normalize(4),
                      }}
                      numberOfLines={1}>
                      {post.post}
                    </AppText>
                    <AppText
                      textStyle="metadata"
                      color={Colors.contentPlaceholder}>
                      1m
                    </AppText>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <ChatBlue />
                    <AppText
                      textStyle="caption"
                      customStyle={{ marginLeft: normalize(4) }}
                      color={Colors.contentOcean}>
                      4 New in 23 chats
                    </AppText>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )
        })}
      </ScrollView>
      <Modal
        isVisible={chatSort}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setChatSort(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <ChatSort close={() => setChatSort(false)} choice={getSortSelected} />
      </Modal>
    </SafeAreaView>
  )
}

export default ChatHouse

const styles = StyleSheet.create({
  parent: { flex: 1, backgroundColor: 'white' },
  chatHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingBottom: normalize(20),
    paddingHorizontal: normalize(16),
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  sort: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: normalize(15),
  },
  icon: {
    width: normalize(64),
    height: normalize(64),
    borderRadius: 8,
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
})
