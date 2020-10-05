//import liraries
import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

import {ScreenHeaderTitle, AppText, PaddingView, Posts} from '@/components';
import {normalize, Colors} from '@/globals';
import {NoPost} from '@/assets/images';

// create a component
const ArchivedPost = ({toggleArchivedPost}) => {
  const [hasArchivePost, setHasArchivePost] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  let dummyData = [
    {
      profile_photo:
        'https://firebasestorage.googleapis.com/v0/b/codes-servbees.appspot.com/o/gnQYL7TaOjcJmaqBssZ186ti3Wx2%2Fdisplay-photos%2FUsers%2Fbastantebom%2FLibrary%2FDeveloper%2FCoreSimulator%2FDevices%2F1C92E029-2447-4C96-93F1-E2A3DD96702B%2Fdata%2FContainers%2FData%2FApplication%2F53ED2E9A-10A0-4620-A710-98E793400C60%2Ftmp%2Freact-native-image-crop-picker%2F45FB951F-D84B-4B8E-AA6A-0C49E9CFF7FC.jpg?alt=media&token=9697d96f-7c55-4beb-ad95-f975dad91e85',
      available: true,
      title: '1',
      payment_method: 'Cash',
      description: 'Test',
      images: [],
      username: 'jayson',
      account_verified: false,
      date_posted: {
        _seconds: 1601535303,
        _nanoseconds: 120000000,
      },
      email: 'jayson.vergara.ilagan@gmail.com',
      post_type: 'service',
      display_name: 'Jayson Test',
      delivery_method: {},
      post_id: 'gnQYL7TaOjcJmaqBssZ186ti3Wx2_5',
      store_location: {
        country: ' Philippines',
        longitude: 121.073006,
        province: ' Batangas',
        latitude: 13.748336,
        city: 'Batangas City',
      },
      full_name: 'Jayson Ilagan',
      price: 200,
      uid: 'gnQYL7TaOjcJmaqBssZ186ti3Wx2',
      status: 'archived',
    },
    {
      store_location: {
        city: 'Batangas City',
        province: ' Batangas',
        latitude: 13.748336,
        country: ' Philippines',
        longitude: 121.073006,
      },
      available: true,
      full_name: 'Jayson Ilagan',
      post_type: 'service',
      price: 100,
      date_posted: {
        _seconds: 1601534877,
        _nanoseconds: 86000000,
      },
      images: [],
      display_name: 'Jayson Test',
      email: 'jayson.vergara.ilagan@gmail.com',
      post_id: 'gnQYL7TaOjcJmaqBssZ186ti3Wx2_4',
      profile_photo:
        'https://firebasestorage.googleapis.com/v0/b/codes-servbees.appspot.com/o/gnQYL7TaOjcJmaqBssZ186ti3Wx2%2Fdisplay-photos%2FUsers%2Fbastantebom%2FLibrary%2FDeveloper%2FCoreSimulator%2FDevices%2F1C92E029-2447-4C96-93F1-E2A3DD96702B%2Fdata%2FContainers%2FData%2FApplication%2F53ED2E9A-10A0-4620-A710-98E793400C60%2Ftmp%2Freact-native-image-crop-picker%2F45FB951F-D84B-4B8E-AA6A-0C49E9CFF7FC.jpg?alt=media&token=9697d96f-7c55-4beb-ad95-f975dad91e85',
      delivery_method: {},
      description: 'Assess',
      title: '2',
      username: 'jayson',
      account_verified: false,
      uid: 'gnQYL7TaOjcJmaqBssZ186ti3Wx2',
      payment_method: 'Cash',
      status: 'archived',
    },
  ];

  const EmptyArchivePost = () => {
    return (
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <NoPost width={normalize(140)} height={normalize(140)} />
        </View>
        <View style={styles.copyWrapper}>
          <AppText textStyle="display6" customStyle={styles.centerCopy}>
            Posts you’ve archived appears here
          </AppText>
          <AppText
            textStyle="body3"
            color={Colors.profileLink}
            customStyle={styles.centerCopy}>
            Some text here saying not to worry when posts are archived because
            they can re-publish archived posts.
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
          title="Archived Post"
          close={toggleArchivedPost}
        />
      </PaddingView>
      {hasArchivePost ? (
        <Posts
          type="archived"
          data={dummyData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      ) : (
        <EmptyArchivePost />
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
export default ArchivedPost;
