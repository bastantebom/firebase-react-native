/**
 * Component for profile info
 */

import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

import {AppText} from '@/components';
import {GlobalStyle, Colors} from '@/globals';
import {Verified} from '@/assets/images/icons';

const ProfileInfo = () => {
  return (
    <View style={{flexDirection: 'row'}}>
      <View style={styles.userInfoImageContainer}>
        <Image
          style={GlobalStyle.image}
          source={{
            uri:
              'https://upload.wikimedia.org/wikipedia/commons/0/08/Charlize_Theron_WonderCon_2012_%28Straighten_Crop%29.jpg',
          }}
        />
      </View>
      <View style={{marginLeft: 8, justifyContent: 'center'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AppText textStyle="body1medium" customStyle={{marginRight: 4}}>
            Charlize Theron
          </AppText>
          <Verified />
        </View>
        <View style={{}}>
          <AppText textStyle="body2" color={Colors.contentPlaceholder}>
            @{'oldguard'.toLowerCase()}
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoImageContainer: {
    height: normalize(42),
    width: normalize(42),
    borderRadius: normalize(42 / 2),
    overflow: 'hidden',
  },
});

export default ProfileInfo;
