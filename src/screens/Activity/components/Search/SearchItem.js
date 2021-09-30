import React, { useContext, useState, useEffect } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { Colors, normalize } from '@/globals'
import { AppText } from '@/components'
import { Context } from '@/context'
import { UserContext } from '@/context/UserContext'

const SearchItem = ({ value }) => {
  const {
    searchType,
    results,
    handleOnEndReach,
    handleOnUserEndReach,
    page,
  } = useContext(Context)
  const { user } = useContext(UserContext)

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: 16 }}>
        <AppText textStyle="subtitle1">
          Your search “{value}” did not match any post. Try another search?
        </AppText>
      </View>
    </View>
  )
}

export default SearchItem

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderColor: Colors.neutralGray,
  },
  item: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'column',
  },
})
