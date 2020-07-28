import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {AppText} from '@/components';
import {
  HeaderBack,
  HeaderShare,
  HeaderQR,
  HeaderMenu,
  HeaderFollowing,
  HeaderFollow,
  HeaderEllipsis,
} from '@/assets/images/icons';
import {normalize, GlobalStyle} from '@/globals';

import UploadIcon from '@/assets/images/icons/profile-upload.svg';

const TransparentHeader = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        position: 'absolute',
        zIndex: 1,
        backgroundColor: 'transparent',
      }}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 16,
          width: Dimensions.get('window').width,
          paddingTop: 4,
        }}>
        {/* Left aligned icons */}
        <View>
          <TouchableOpacity activeOpacity={0.7}>
            <View style={styles.circle}>
              <HeaderBack width={normalize(16)} height={normalize(16)} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Right aligned icons */}
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity activeOpacity={0.7}>
            <View style={[styles.followButton, GlobalStyle.marginLeft1]}>
              <HeaderFollow width={normalize(16)} height={normalize(16)} />
              <AppText
                textStyle="button3"
                color="white"
                customStyle={{marginLeft: 4}}>
                Follow
              </AppText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}>
            <View style={[styles.circle, GlobalStyle.marginLeft1]}>
              <HeaderShare width={normalize(16)} height={normalize(16)} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}>
            <View style={[styles.circle, GlobalStyle.marginLeft1]}>
              <HeaderEllipsis width={normalize(16)} height={normalize(16)} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  circle: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(32 / 2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButton: {
    borderRadius: 20,
    flexDirection: 'row',
    height: normalize(32),
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});

export default TransparentHeader;
