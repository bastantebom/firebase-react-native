import React, {createRef, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';

import {AppText, BottomSheetHeader} from '@/components';
import EllipsisMenu from './components/EllipsisMenu';
import OwnMenu from './components/OwnMenu';
import QRScreen from './components/QRScreen';

import {
  HeaderBack,
  HeaderShare,
  HeaderQR,
  HeaderMenu,
  HeaderFollowing,
  HeaderFollow,
  HeaderEllipsis,
  ProfileMute,
  ProfileReport,
  ProfileBlockRed,
} from '@/assets/images/icons';
import {normalize, GlobalStyle} from '@/globals';

const TransparentHeader = ({
  toggleEllipsisState,
  ellipsisState,
  following,
  toggleFollowing,
  type,
  toggleMenu,
  menu,
  toggleQR,
  QR,
  signOut,
}) => {
  if (type === 'own')
    return (
      <>
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
            <View></View>

            {/* Right aligned icons */}
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity activeOpacity={0.7}>
                <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                  <HeaderShare width={normalize(16)} height={normalize(16)} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={toggleQR}>
                <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                  <HeaderQR width={normalize(16)} height={normalize(16)} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={toggleMenu}>
                <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                  <HeaderMenu width={normalize(16)} height={normalize(16)} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <Modal
          isVisible={menu}
          animationIn="slideInUp"
          animationInTiming={750}
          animationOut="slideOutDown"
          animationOutTiming={750}
          onSwipeComplete={toggleMenu}
          swipeDirection="down"
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          {/* <FilterSlider modalToggler={toggleModal} /> */}
          <OwnMenu signOut={signOut} toggleMenu={toggleMenu} />
        </Modal>

        <Modal
          isVisible={QR}
          animationIn="slideInUp"
          animationInTiming={750}
          animationOut="slideOutDown"
          animationOutTiming={750}
          onSwipeComplete={toggleQR}
          swipeDirection="down"
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          {/* <FilterSlider modalToggler={toggleModal} /> */}
          <QRScreen  toggleQR={toggleQR} />
        </Modal>
      </>
    );

  if (type === 'other')
    return (
      <>
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
              <TouchableOpacity activeOpacity={0.7} onPress={toggleFollowing}>
                <View style={[styles.followButton, GlobalStyle.marginLeft1]}>
                  {following ? (
                    <HeaderFollowing
                      width={normalize(16)}
                      height={normalize(16)}
                    />
                  ) : (
                    <HeaderFollow
                      width={normalize(16)}
                      height={normalize(16)}
                    />
                  )}
                  <AppText
                    textStyle="button3"
                    color="white"
                    customStyle={{marginLeft: 4}}>
                    {following ? 'Unfollow' : 'Follow'}
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7}>
                <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                  <HeaderShare width={normalize(16)} height={normalize(16)} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleEllipsisState}>
                <View style={[styles.circle, GlobalStyle.marginLeft1]}>
                  <HeaderEllipsis
                    width={normalize(16)}
                    height={normalize(16)}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <Modal
          isVisible={ellipsisState}
          animationIn="slideInUp"
          animationInTiming={500}
          animationOut="slideOutDown"
          animationOutTiming={500}
          onSwipeComplete={toggleEllipsisState}
          swipeDirection="down"
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          customBackdrop={
            <TouchableWithoutFeedback
              onPress={() => {
                toggleEllipsisState();
              }}>
              <View style={{flex: 1, backgroundColor: 'black'}} />
            </TouchableWithoutFeedback>
          }>
          {/* <FilterSlider modalToggler={toggleModal} /> */}
          <EllipsisMenu toggleEllipsisState={toggleEllipsisState} />
        </Modal>
      </>
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
