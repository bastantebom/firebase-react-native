import React, { useContext, useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native'
import { normalize, Colors } from '@/globals'
import { AppText, PaddingView, ScreenHeaderTitle } from '@/components'
import { ChevronDown, ChevronRight, UserCircle } from '@/assets/images/icons'
import { Context } from '@/context'
import { useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal'
import ChatSort from './components/ChatSort'

const { width, height } = Dimensions.get('window')

const ChatHouse = () => {
  const navigation = useNavigation()

  const [chatSort, setChatSort] = useState(false)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.parent}>
        <ScreenHeaderTitle
          title="All Chats"
          iconSize={normalize(16)}
          paddingSize={3}
          close={() => navigation.goBack()}
          withOptions
          openOptions={() => {}}
        />
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            paddingBottom: normalize(20),
            paddingHorizontal: normalize(16),
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => setChatSort(true)}>
            <AppText
              textStyle="body3"
              customStyle={{ marginRight: normalize(8) }}>
              All Messages
            </AppText>
            <ChevronDown width={normalize(20)} height={normalize(20)} />
          </TouchableOpacity>
        </View>
      </View>
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
        <ChatSort />
      </Modal>
    </SafeAreaView>
  )
}

export default ChatHouse

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    zIndex: 9999,
    backgroundColor: 'white',
  },
})
