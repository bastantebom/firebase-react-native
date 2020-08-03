//import liraries
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {NoReview} from '@/assets/images';
import {Colors, normalize} from '@/globals';

import {AppText, Reviews} from '@/components';

// create a component
const Review = () => {
  const [hasReview, setHasReview] = useState(false);

  const WithReview = () => {
    return <Reviews />;
  };
  return (
    <>
      {hasReview ? (
        <WithReview />
      ) : (
        <View style={styles.container}>
          <View style={styles.imageWrapper}>
            <NoReview width={normalize(140)} height={normalize(140)} />
          </View>
          <View style={styles.copyWrapper}>
            <AppText textStyle="display6" customStyle={styles.centerCopy}>
              No reviews yet...
            </AppText>
            <AppText
              textStyle="body3"
              color={Colors.profileLink}
              customStyle={styles.centerCopy}>
              Chorva Ipsum Echelity Bongga ang Kiber
            </AppText>
          </View>
        </View>
      )}
    </>
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
    borderTopColor: Colors.neutralGray,
    borderTopWidth: 1,
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

  linksWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(16),
  },

  copySpacing: {
    marginLeft: normalize(8),
    marginRight: normalize(8),
  },
});
//make this component available to the app
export default Review;
