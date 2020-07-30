import React, { useState } from 'react'
import {
  Dimensions,
  Button,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text
} from 'react-native'
import { List, Avatar } from 'react-native-paper';
import Modal from 'react-native-modal';
import { AppText, PaddingView } from '@/components';
import {Colors} from '@/globals';

import Card from '@/assets/images/icons/verify-card.svg'
import Mobile from '@/assets/images/icons/verify-mobile.svg'
import Id from '@/assets/images/icons/verify-id.svg'
import ArrowRight from '@/assets/images/icons/arrow-right.svg'

const InitialVerification = () => {

  const DATA = [
    {
      id: 0,
      title: 'Complete profile information',
      icon: <Card/>
    },
    {
      id: 1,
      title: 'Add and verify mobile number',
      icon: <Mobile/>
    },
    {
      id: 2,
      title: 'Upload a government ID',
      icon: <Id/>
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.list, {marginBottom: 28}]} onPress={() => null}>
      <View style={styles.list}>
        <View style={{ marginRight: 8 }}>
          {item.icon}
        </View>
        <AppText textStyle="body1">{item.title}</AppText>
      </View>
      <ArrowRight/>
    </TouchableOpacity>
  );

  return (
    <PaddingView paddingSize={3}>
      <View style={styles.headingWrapper}>
        <AppText textStyle="display6">Get the verified badge</AppText>
        <View style={styles.badgeContainer}>
          <AppText textStyle="price" color={Colors.neutralsWhitesmoke}>1 of 4</AppText>
        </View>
      </View>
      <AppText textStyle="body2" color={Colors.contentPlaceholder}>Complete your profile and verify youridentity for a better Servbees experience!</AppText>

      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </PaddingView>
  )
}

export default InitialVerification;

const styles = StyleSheet.create({
  headingWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  badgeContainer: {
    backgroundColor: Colors.checkboxBorderDefault,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  list: {
    flexDirection: 'row',
    // marginBottom: 28,
    justifyContent: 'space-between'
  }
})