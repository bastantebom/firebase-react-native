//import liraries
import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

import {ScreenHeaderTitle, AppText, PaddingView, Posts} from '@/components';
import {normalize, Colors} from '@/globals';
import {NoPost} from '@/assets/images';

// create a component
const LikedPost = ({toggleLikePost}) => {
  const [hasLikePost, setHasLikePost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let dummyData = [
    {
      username: 'carldallo1021',
      delivery_method: {
        pickup: true,
      },
      full_name: 'Carl Angelo Dallosss',
      images: [
        'https://firebasestorage.googleapis.com/v0/b/codes-servbees.appspot.com/o/Wtioew1evSULbDoa6hDTVGLbwKm1%2Fpost-photo%2F3269d771-5130-4446-a30d-602a7eef91b7.jpg?alt=media&token=5c60fdfc-6bdc-4643-889e-255ee2959875',
      ],
      uid: 'Wtioew1evSULbDoa6hDTVGLbwKm1',
      display_name: 'Carl New Storessssss',
      payment_method: 'Cash',
      price: 99,
      description: 'Keyboard description',
      post_id: 'Wtioew1evSULbDoa6hDTVGLbwKm1_12',
      post_type: 'sell',
      available: true,
      account_verified: false,
      store_location: {
        city: 'Santo Domingo',
        longitude: 120.8872137,
        province: ' Nueva Ecija',
        latitude: 15.6411014,
        country: ' Philippines',
      },
      date_posted: {
        _seconds: 1601557228,
        _nanoseconds: 928000000,
      },
      email: 'angelo@fullstack.ph',
      profile_photo: '',
      title: 'Keyboard',
      _geoloc: {
        lat: 15.6411014,
        lon: 120.8872137,
      },
      objectID: 'Wtioew1evSULbDoa6hDTVGLbwKm1_12',
      _highlightResult: {
        username: {
          value: 'carldallo1021',
          matchLevel: 'none',
          matchedWords: [],
        },
        full_name: {
          value: 'Carl Angelo Dallosss',
          matchLevel: 'none',
          matchedWords: [],
        },
        display_name: {
          value: 'Carl New Storessssss',
          matchLevel: 'none',
          matchedWords: [],
        },
        description: {
          value: 'Keyboard description',
          matchLevel: 'none',
          matchedWords: [],
        },
        store_location: {
          city: {
            value: 'Santo Domingo',
            matchLevel: 'none',
            matchedWords: [],
          },
        },
        email: {
          value: 'angelo@fullstack.ph',
          matchLevel: 'none',
          matchedWords: [],
        },
        title: {
          value: 'Keyboard',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
    },
    {
      date_posted: {
        _seconds: 1600857005,
        _nanoseconds: 496000000,
      },
      display_name: 'Dynaquestakslhjmdaksjdhaskj',
      payment_method: '123',
      post_id: 'Nk2N6sdbShQkP2etWW0HVbvlLv62_10',
      username: 'sasdas',
      email: 'pcmprieto@gmail.com',
      full_name: 'Paul Prieto',
      delivery_method: {
        pickup: true,
      },
      available: true,
      post_type: 'sell',
      title: 'Asd',
      store_location: {
        latitude: 14.585322,
        longitude: 120.983207,
        province: ' Metro Manila',
        country: ' Philippines',
        city: 'City Of Manila',
      },
      uid: 'Nk2N6sdbShQkP2etWW0HVbvlLv62',
      images: [],
      account_verified: false,
      description: '2',
      price: null,
      profile_photo:
        'https://firebasestorage.googleapis.com/v0/b/codes-servbees.appspot.com/o/Nk2N6sdbShQkP2etWW0HVbvlLv62%2Fdisplay-photos%2FUsers%2F360pixels%2FLibrary%2FDeveloper%2FCoreSimulator%2FDevices%2FCEAB8A3C-69DE-4583-A222-AACAD1DE7BF4%2Fdata%2FContainers%2FData%2FApplication%2FD9160AF1-FF03-402A-83A4-A992EAD2190A%2Ftmp%2Freact-native-image-crop-picker%2F99BB3358-5D52-421D-80C1-0ADC869862B4.jpg?alt=media&token=436754ec-23b2-4c81-a820-1e2042f40f0a',
      _geoloc: {
        lat: 14.585322,
        lon: 120.983207,
      },
      objectID: 'Nk2N6sdbShQkP2etWW0HVbvlLv62_10',
      _highlightResult: {
        display_name: {
          value: 'Dynaquestakslhjmdaksjdhaskj',
          matchLevel: 'none',
          matchedWords: [],
        },
        username: {
          value: 'sasdas',
          matchLevel: 'none',
          matchedWords: [],
        },
        email: {
          value: 'pcmprieto@gmail.com',
          matchLevel: 'none',
          matchedWords: [],
        },
        full_name: {
          value: 'Paul Prieto',
          matchLevel: 'none',
          matchedWords: [],
        },
        title: {
          value: 'Asd',
          matchLevel: 'none',
          matchedWords: [],
        },
        store_location: {
          city: {
            value: 'City Of Manila',
            matchLevel: 'none',
            matchedWords: [],
          },
        },
        description: {
          value: '2',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
    },
  ];

  const EmptyLikedPost = () => {
    return (
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <NoPost width={normalize(140)} height={normalize(140)} />
        </View>
        <View style={styles.copyWrapper}>
          <AppText textStyle="display6" customStyle={styles.centerCopy}>
            Posts you like appears here
          </AppText>
          <AppText
            textStyle="body3"
            color={Colors.profileLink}
            customStyle={styles.centerCopy}>
            Browse through and discover nearby services and products.
          </AppText>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <PaddingView paddingSize={3}>
        <ScreenHeaderTitle
          iconSize={16}
          title="Liked Posts"
          close={toggleLikePost}
        />
      </PaddingView>
      {hasLikePost ? (
        <Posts
          type="liked"
          data={dummyData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      ) : (
        <EmptyLikedPost />
      )}

      {/* About Servbees Modal */}
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.emptyStateBackground,
    padding: normalize(16),
  },
  imageWrapper: {
    marginBottom: normalize(16),
  },
  copyWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCopy: {
    textAlign: 'center',
    marginBottom: normalize(8),
  },
});

//make this component available to the app
export default LikedPost;
