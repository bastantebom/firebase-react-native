import React, { useState, useContext, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList
} from 'react-native'
import { AppInput, PaddingView, AppText, AppButton } from '@/components';
import { Colors, normalize } from '@/globals';
import {
  HeaderBackGray,
  ArrowRight,
  Lock,
  FolderAdd
} from '@/assets/images/icons';
import {
  OnboardingIllustration1
} from '@/assets/images';
import { VerifyMap } from './Map';
import Modal from 'react-native-modal';
import { CameraId } from './components/CameraId';

export const UploadGovernmentId = ({back}) => {
  
  const [screen, setScreen] = useState('idAdd');

  const verificationReqs = [
    {
      id: 0,
      title: 'Driver\'s License',
      icon: <FolderAdd width={normalize(25)} height={normalize(25)} />,
      // route: toggleProfile(),
      // completed: false
    },
    {
      id: 1,
      title: 'Passport',
      icon: <FolderAdd width={normalize(25)} height={normalize(25)} />,
      // route: 'profile',
      // completed: false
    },
    {
      id: 2,
      title: 'NBI Clearance',
      icon: <FolderAdd width={normalize(25)} height={normalize(25)} />,
      // route: 'profile',
      // completed: false
    },
    {
      id: 3,
      title: 'Voter\'s ID',
      icon: <FolderAdd width={normalize(25)} height={normalize(25)} />,
      // route: 'profile',
      // completed: true
    },
    {
      id: 4,
      title: 'Student\'s ID',
      icon: <FolderAdd width={normalize(25)} height={normalize(25)} />,
      // route: 'profile',
      // completed: true
    }
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.list, {marginBottom: 28}]} 
      // onPress={() => toggleProfile()}
      onPress={() => 
        item.id === 0 ? 
          toggleProfile() :
        item.id === 1 ?
          toggleMobileVerification() :
        item.id === 2 ?
        toggleUploadId() :
        null
        }
    >
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
    <SafeAreaView style={{ flex: 1 }} >
      { screen === 'idAdd' ? (
        <PaddingView paddingSize={3}>
          <View 
          style={{ justifyContent: 'space-between', height: '100%' }}
          >
            <View>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={screen === 'idAdd' ? back : () => setScreen('idAdd')}
                  activeOpacity={0.7}
                  style={{position: 'absolute', left: 0 }}
                >
                  <HeaderBackGray width={normalize(16)} height={normalize(16)} />
                </TouchableOpacity>
                <AppText textStyle="body3">&nbsp;</AppText>
              </View>
              <OnboardingIllustration1/>
              <AppText 
                textStyle="body1"
                customStyle={{ marginBottom: 8 }}
              >
                Let's add your ID
              </AppText>
              <AppText textStyle="body2" color={Colors.contentPlaceholder}>We need to know that it's really you, to avoid fake accounts. Please choose an ID type you want to use for verification</AppText>
              <View style={{ flexDirection: 'row', marginTop: 30 }}>
                <Lock width={normalize(25)} height={normalize(25)} />
                <AppText textStyle="caption" customStyle={{ marginLeft: 12 }}>This information won't be shared with other people who use Servbees</AppText>
              </View>
            </View>
            <AppButton
              text="Next"
              type="primary"
              onPress={() => setScreen('idType')}
            />
          </View>
        </PaddingView> 
        ) : screen === 'idType' ? (
          <PaddingView paddingSize={3}>
            <View 
            style={{ justifyContent: 'space-between', height: '100%' }}
            >
              <View>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    onPress={() => setScreen('idAdd')}
                    activeOpacity={0.7}
                    style={{position: 'absolute', left: 0 }}
                  >
                    <HeaderBackGray width={normalize(16)} height={normalize(16)} />
                  </TouchableOpacity>
                  <AppText textStyle="body3">&nbsp;</AppText>
                </View>
                <View>
                  <AppText textStyle="body1" customStyle={{ marginBottom: 25 }}>First, select an ID type to add</AppText>
                  <FlatList
                    data={verificationReqs}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    // ListHeaderComponent={<AppText textStyle="subtitle1" customStyle={{ marginBottom: 20 }}>Pending</AppText>}
                  />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 30 }}>
                  <Lock width={normalize(25)} height={normalize(25)} />
                  <AppText textStyle="caption" customStyle={{ marginLeft: 12 }}>This information won't be shared with other people who use Servbees</AppText>
                </View>
              </View>
              <AppButton
                text="Next"
                type="primary"
                onPress={() => setScreen('uploadId')}
              />
            </View>
          </PaddingView>   
        ) : (
          <CameraId/>
        )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalHeader: {
    // position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 32,
  },
  customInput: {
    marginTop: 40
  },
  list: {
    flexDirection: 'row',
    // marginBottom: 28,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})