import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text
} from 'react-native';
import { List, Avatar  } from 'react-native-paper';
import Users from '@/assets/images/icons/users.svg';
import Groups from '@/assets/images/icons/group.svg';
import Lock from '@/assets/images/icons/private-lock.svg';

import {AppText, AppButton} from '@/components';
import { AppViewContainer } from '@/components';
import { Colors } from '@/globals';


const Hive = ({ }) => {
  return (
    <>
      <View style={{ flexDirection: 'row', alignContent: 'center',  alignItems: 'center', padding: 15 }}>
        {/* <View> */}
          <Avatar.Image 
            source={require('../../assets/images/profile.png')} 
          />
          <View style={{ marginTop: 15, marginLeft: 15 }}>
            <AppText textStyle="body1" >Tropang Woodlands</AppText>
            <AppText textStyle="caption" color={Colors.contentPlaceholder}>Friends from Pioneer Woodlands</AppText>
            <View style={{ flexDirection: 'row' }}>
              <Users/>
              {/* <AppText textStyle="eyebrow2">
                
              </AppText> */}
              <Groups/>
              <View style={{ backgroundColor: Colors.neutralsZircon, borderRadius: 20, flexDirection: 'row', paddingHorizontal: 11, paddingVertical: 5, justifyContent: 'center', maxWidth: 130 }}>
                <Lock/>
                <AppText textStyle="caption" color={Colors.primaryMidnightBlue} customStyle={{ paddingLeft: 8 }}>Private Group</AppText>
              </View>
            </View>
          </View>
        {/* </View> */}
        <AppButton
          text="Join"
          size={"sm"}
          type={"primary"}
          customStyle={{ maxWidth: 100, paddingHorizontal: 0, marginLeft: 0 }}
          height={"sm"}
        />
      </View>
      {/* <List.Item
        style={styles.container}
        title="Tropang Woodlands"
        descriptionNumberOfLines={2}
        description={
          <Text style={{ flexDirection: 'column' }}>
            <Text>Friends from Burgers</Text>
              <Users/>
              <Groups/>
          </Text>
        }
        left={props => 
          <Avatar.Image 
          {...props} 
          source={require('../../assets/images/profile.png')} 
          />
        }
        right={props => 
          <AppButton
            {...props}
            text="Join"
            size={"sm"}
            type={"primary"}
            customStyle={{ maxWidth: 100, paddingHorizontal: 0 }}
            height={"sm"}
          />
        }
      /> */}
    </>
  )
}

export default Hive;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'stretch',
    alignContent: 'center',
    justifyContent: 'center',
    height: 'auto'
  }
})