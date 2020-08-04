//import liraries
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors, normalize} from '@/globals';

import {NoInfo} from '@/assets/images';
import {AppText} from '@/components';
import {TouchableOpacity} from 'react-native-gesture-handler';

// create a component
const MoreInfo = () => {
  const [hasInfo, setHasInfo] = useState(false);
  return (
    <>
      {hasInfo ? null : ( //<WithReview />
        <View style={styles.container}>
          <View style={styles.imageWrapper}>
            <NoInfo width={normalize(140)} height={normalize(140)} />
          </View>
          <View style={styles.copyWrapper}>
            <AppText textStyle="display6" customStyle={styles.centerCopy}>
              Complete your profile
            </AppText>
            <AppText
              textStyle="body3"
              color={Colors.profileLink}
              customStyle={styles.centerCopy}>
              Additional information about you will be posted here. Complete
              your profile now.
            </AppText>
          </View>
          <View style={styles.linksWrapper}>
            <TouchableOpacity>
              <AppText textStyle="body1" color={Colors.contentOcean}>
                Complete your Profile
              </AppText>
            </TouchableOpacity>
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
export default MoreInfo;
