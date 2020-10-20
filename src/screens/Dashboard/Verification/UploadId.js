import React, { useState, useContext, useEffect } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
  ScrollView
} from 'react-native'
import { PaddingView, AppText, AppButton, ScreenHeaderTitle } from '@/components';
import { Colors, normalize } from '@/globals';
import {
  HeaderBackGray,
  ArrowRight,
  Lock,
  FolderAdd, ChevronRight
} from '@/assets/images/icons';
import { IdVerify, OnboardingIllustration1 } from '@/assets/images';
import { CameraId } from './components/CameraId';

export const UploadGovernmentId = ({ back, backToIndex, confirmPhotoId }) => {
  
  const [screen, setScreen] = useState('idAdd');
  const [idType, setIdType] = useState('');

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
    },
    {
      id: 2,
      title: 'NBI Clearance',
      icon: <FolderAdd width={normalize(25)} height={normalize(25)} />,
    },
    {
      id: 3,
      title: 'Voter\'s ID',
      icon: <FolderAdd width={normalize(25)} height={normalize(25)} />,
    },
    {
      id: 4,
      title: 'Student\'s ID',
      icon: <FolderAdd width={normalize(25)} height={normalize(25)} />,
    }
  ];

  const addLicense = () => {
    setIdType('Driver\'s License');
    setScreen('uploadId');
  }

  const addPassport = () => {
    setIdType('Passport');
    setScreen('uploadId');
  }

  const addClearance = () => {
    setIdType('NBI Clearance');
    setScreen('uploadId');
  }

  const addVoterId = () => {
    setIdType('Voter\'s ID');
    setScreen('uploadId');
  }

  const addStudentId = () => {
    setIdType('Student\'s ID');
    setScreen('uploadId');
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.list, {marginBottom: 28}]} 
      // onPress={() => toggleProfile()}
      onPress={() => 
        item.id === 0 ? 
          addLicense() :
        item.id === 1 ?
          addPassport() :
        item.id === 2 ?
          addClearance() :
        item.id === 3 ?
          addVoterId() :
          addStudentId()
        }
    >
      <View style={styles.list}>
        <View style={{ marginRight: 8 }}>
          {item.icon}
        </View>
        <AppText textStyle="body1">{item.title}</AppText>
      </View>
      <ChevronRight/>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} >
      { screen === 'idAdd' ? (
        <>
          <PaddingView paddingSize={3}>
            <ScreenHeaderTitle
              iconSize={16}
              close={screen === 'idAdd' ? back : () => setScreen('idAdd')}
            />
          </PaddingView>
          <ScrollView>
            <IdVerify/>
            <PaddingView paddingSize={3}>
              <AppText 
                textStyle="body1"
                customStyle={{ marginBottom: normalize(8), marginTop: normalize(16) }}
              >
                Verify Your Identity 
              </AppText>
              <AppText textStyle="body2" color={Colors.contentPlaceholder}>Help us keep Servbees safe for you and all other buzzybees! You can choose a valid ID type to upload for verification purposes. </AppText>

              <View style={{ flexDirection: 'row', marginTop: 30 }}>
                <Lock width={normalize(25)} height={normalize(25)} />
                <AppText textStyle="caption" customStyle={{ marginLeft: 12, maxWidth: '90%' }}>This information won't be shared with other people who use Servbees</AppText>
              </View>
            </PaddingView>
          </ScrollView>
          <PaddingView paddingSize={3}>
            <AppButton
              text="Next"
              type="primary"
              onPress={() => setScreen('idType')}
            />
          </PaddingView>
        </>
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
                  <AppText textStyle="caption" customStyle={{ marginLeft: 12, maxWidth: '90%' }}>This information won't be shared with other people who use Servbees</AppText>
                </View>
              </View>
              {/* <AppButton
                text="Next"
                type="primary"
                onPress={() => setScreen('uploadId')}
              /> */}
            </View>
          </PaddingView>   
        ) : screen === 'uploadId' ? (
          <CameraId 
            back={() => setScreen('idType')} 
            // backToIndex={backToIndex}
            confirmPhotoId={confirmPhotoId}
            id={idType}
          />
        ) : (
          null
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