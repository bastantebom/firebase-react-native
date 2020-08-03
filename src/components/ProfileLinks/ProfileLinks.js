//import liraries
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {normalize, Colors} from '@/globals';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {AppText} from '@/components';
// create a component
const ProfileLinks = ({onClickHives, onClickFollowers}) => {
  return (
    <View style={styles.profileLinksWrapper}>
      <View style={styles.firstLink}>
        <AppText textStyle="subtitle1">9</AppText>
        <AppText textStyle="caption" color={Colors.profileLink}>
          Posts
        </AppText>
      </View>
      <TouchableOpacity onPress={onClickFollowers}>
        <View style={styles.individualLink}>
          <AppText textStyle="subtitle1">29</AppText>
          <AppText textStyle="caption" color={Colors.profileLink}>
            Followers
          </AppText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClickHives}>
        <View style={styles.individualLink}>
          <AppText textStyle="subtitle1">4</AppText>
          <AppText textStyle="caption" color={Colors.profileLink}>
            Hives
          </AppText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  profileLinksWrapper: {
    width: '66%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: normalize(48),
    height: normalize(48),
    //backgroundColor: 'blue',
  },

  firstLink: {
    alignItems: 'center',
  },

  individualLink: {
    alignItems: 'center',
    marginLeft: normalize(24),
  },
});

//make this component available to the app
export default ProfileLinks;
