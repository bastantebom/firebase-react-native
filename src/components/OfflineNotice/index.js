//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions, SafeAreaView} from 'react-native';
import {AppText} from '@/components';
import {Colors, normalize} from '@/globals';

// create a component
const OfflineNotice = ({top}) => {
  const styles = StyleSheet.create({
    container: {
      width: Dimensions.get('window').width,
      position: 'absolute',
      top: 0 + (top ? top : 0),
      left: 0,
      flexDirection: 'row',
      zIndex: 1,
      backgroundColor: Colors.secondaryBrinkPink,
      padding: 8,
      justifyContent: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <AppText textStyle="body3" color={Colors.neutralsWhite}>
        No Internet Connection
      </AppText>
    </View>
  );
};

// define your styles

//make this component available to the app
export default OfflineNotice;
