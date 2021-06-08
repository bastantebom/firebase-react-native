import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-paper'

import { AppText } from '@/components'
import { Icons } from '@/assets/images/icons'

import { normalize, Colors } from '@/globals'

const ChatSort = ({ choice, close }) => {
  const choices = [
    {
      label: 'All Chats',
      value: 'all',
      description:
        'Replies to posts and orders, new messages, and all your chat history in one inbox.',
      icon: <Icons.AllChat />,
    },
    {
      label: 'Own Posts',
      value: 'own posts',
      description: 'Conversations with your customers.',
      icon: <Icons.OwnPostsChats />,
    },
    {
      label: 'Orders',
      value: 'orders',
      description:
        'Messages to other Seller or Service Bees for your orders and bookings.',
      icon: <Icons.OrdersChats />,
    },
    {
      label: 'Chat History',
      value: 'past',
      description:
        'Messages from completed, cancelled, declined, and recently deleted posts.',
      icon: <Icons.PastsChats />,
    },
  ]

  const onSortSelect = item => {
    choice(item)
    close()
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          paddingTop: normalize(10),
          paddingBottom: normalize(35),
        }}>
        <View style={styles.bottomSheetHeader} />
      </View>
      <AppText
        textStyle="body2"
        customStyle={{
          paddingVertical: normalize(10),
          paddingHorizontal: normalize(25),
        }}
        color={Colors.contentPlaceholder}>
        View by
      </AppText>

      {choices.map(option => {
        return (
          <View
            key={option.value}
            style={{
              paddingHorizontal: normalize(25),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                paddingVertical: normalize(16),
              }}
              onPress={() => onSortSelect(option)}>
              <View
                style={{ marginRight: normalize(10), marginTop: normalize(4) }}>
                {option.icon}
              </View>
              <View style={{ paddingRight: normalize(20) }}>
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginBottom: normalize(4.5) }}>
                  {option.label}
                </AppText>
                <AppText textStyle="body2" customStyle={{ color: '#515057' }}>
                  {option.description}
                </AppText>
              </View>
            </TouchableOpacity>
            <Divider style={styles.divider} />
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomSheetHeader: {
    backgroundColor: '#EAEAEA',
    height: normalize(5),
    width: normalize(40),
  },
  divider: {
    width: '100%',
    backgroundColor: Colors.neutralsZircon,
  },
})

export default ChatSort
