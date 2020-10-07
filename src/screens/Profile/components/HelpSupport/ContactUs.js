//import liraries
import React, {useState, useContext} from 'react';
import {View, StyleSheet, SafeAreaView, TextInput} from 'react-native';

import {ScreenHeaderTitle, PaddingView, AppText, AppButton} from '@/components';

import {ContactUsImg} from '@/assets/images';
import {
  EmailContactUs,
  CallContactUs,
  LocationContactUs,
} from '@/assets/images/icons';
import {normalize, Colors} from '@/globals';

// create a component
const ContactUs = ({toggleContactUs}) => {
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <PaddingView paddingSize={3}>
          <ScreenHeaderTitle
            iconSize={16}
            title="Contact Us"
            close={toggleContactUs}
          />
        </PaddingView>
        <View style={{flex: 1, backgroundColor: Colors.neutralsZircon}}>
          <View style={[styles.contentWrapper]}>
            <PaddingView paddingSize={3}>
              <View style={styles.imageWrapper}>
                <ContactUsImg width={normalize(214)} height={normalize(214)} />
              </View>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <EmailContactUs
                    width={normalize(24)}
                    height={normalize(24)}
                  />
                  <AppText
                    textStyle="body2"
                    customStyle={{marginLeft: normalize(16)}}>
                    hello@servbees.com
                  </AppText>
                </View>
                <View style={{flexDirection: 'row', marginTop: normalize(20)}}>
                  <CallContactUs width={normalize(24)} height={normalize(24)} />
                  <AppText
                    textStyle="body2"
                    customStyle={{marginLeft: normalize(16)}}>
                    +63 2 7746-2061
                  </AppText>
                </View>
                <View style={{flexDirection: 'row', marginTop: normalize(20)}}>
                  <LocationContactUs
                    width={normalize(24)}
                    height={normalize(24)}
                  />
                  <AppText
                    textStyle="body2"
                    customStyle={{
                      marginLeft: normalize(16),
                      flex: 1,
                      flexWrap: 'wrap',
                    }}>
                    142-48 Pinatubo Street Barangka Ilaya Mandaluyong City 1550
                  </AppText>
                </View>
              </View>
            </PaddingView>
          </View>
          <View
            style={[
              styles.contentWrapper,
              {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                marginBottom: 0,
              },
            ]}>
            <PaddingView paddingSize={3}>
              <AppText
                textStyle="body2"
                customStyle={{marginBottom: normalize(16)}}>
                Send us a message!
              </AppText>
              <TextInput
                multiline={true}
                placeholder="Your message"
                placeholderTextColor={Colors.profileLink}
                numberOfLines={Platform.OS === 'ios' ? null : 6}
                minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
                style={[styles.input]}
                onChangeText={(desc) => {
                  setDesc(desc);
                }}
                underlineColorAndroid={'transparent'}
                textAlignVertical="top"
              />

              <AppButton
                text="Submit"
                type="primary"
                size="l"
                height="xl"
                onPress={() => {}}
                customStyle={{marginTop: normalize(20)}}
              />
            </PaddingView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

// define your styles
// define your styles
const styles = StyleSheet.create({
  imageWrapper: {
    marginBottom: normalize(16),
    alignItems: 'center',
  },
  contentWrapper: {
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 8,
    marginBottom: 6,
  },
  copyWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: normalize(24),
    backgroundColor: Colors.neutralsWhite,
  },
  centerCopy: {
    textAlign: 'left',
    marginBottom: normalize(8),
  },
  input: {
    color: Colors.contentEbony,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    letterSpacing: 0.5,
    borderColor: Colors.neutralGray,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
});

//make this component available to the app
export default ContactUs;
