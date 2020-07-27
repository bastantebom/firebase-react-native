import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import { List, Avatar  } from 'react-native-paper';

import {AppText, AppButton} from '@/components';


const Hive = ({ }) => {
  return (
    <List.Item
      style={styles.container}
      title="Tropang Woodlands"
      description="Friends from Pioneer Woodlands"
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
    />
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