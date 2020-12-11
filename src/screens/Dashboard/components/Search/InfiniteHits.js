import React, { useContext, useState, useEffect } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { Colors, normalize } from '@/globals'
import { AppButton, AppText } from '@/components'
import { Context } from '@/context'
import { UserContext } from '@/context/UserContext'
import Tags from './Tags'
import Highlight from './Highlight'

const InfiniteHits = ({ value }) => {
  const {
    searchType,
    results,
    handleOnEndReach,
    handleOnUserEndReach,
    page,
  } = useContext(Context)
  const { user } = useContext(UserContext)

  const navigation = useNavigation()

  const goToPost = post => {
    const params = {
      data: post,
      viewing: true,
      created: false,
      edited: false,
    }
    navigation.navigate('NBTScreen', {
      screen: 'OthersPost',
      params: { ...params, othersView: true },
    })
  }

  const openProfile = item => {
    const uid = item.uid
    if (user && user.uid === uid) {
      navigation.navigate('Profile', {
        screen: 'Profile',
      })
    } else {
      navigation.navigate('NBTScreen', {
        screen: 'OthersProfile',
        params: { uid: uid },
      })
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {results.length !== 0 ? (
        <FlatList
          data={results}
          keyExtractor={item => item.objectID}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            searchType === 'posts'
              ? handleOnEndReach(value)
              : handleOnUserEndReach(value)
          }}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>
                  searchType === 'posts' ? goToPost(item) : openProfile(item)
                }>
                <Highlight hit={item} />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={{ paddingTop: 16 }}>
          <AppText textStyle="subtitle1">
            Your search “{value}” did not match any post.{' '}
          </AppText>
          <AppText textStyle="subtitle1">Try another search?</AppText>
          <View style={{ marginVertical: 15 }}>
            <AppText textStyle="caption">
              - Check if the spelling is correct
            </AppText>
            <AppText textStyle="caption">- Use different keywords</AppText>
          </View>
          <AppButton
            text="Change your location or distance"
            type="primary"
            height="sm"
            customStyle={{ paddingVertical: 5, height: normalize(40) }}
          />
          <Tags />
        </View>
      )}
    </View>
  )
}

export default InfiniteHits

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderColor: Colors.neutralGray,
  },
  item: {
    flex: 1,
    // flexDirection: 'row',
    paddingVertical: 10,
    flexDirection: 'column',
  },
})
