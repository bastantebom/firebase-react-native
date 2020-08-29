//import liraries
import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors, normalize} from '@/globals';

import {NoInfo} from '@/assets/images';
import {AppText, PaddingView} from '@/components';
import {UserContext} from '@/context/UserContext';
import {ScrollView} from 'react-native-gesture-handler';

// create a component
const MoreInfo = () => {
  const {userInfo} = useContext(UserContext);
  const [hasInfo, setHasInfo] = useState(false);
  //const [email, setEmail] = useState('');
  //const [name, setName] = useState('');
  const {description} = userInfo;

  useEffect(() => {
    //console.log(description);
    if (description) {
      if (description.trim().length > 0) {
        //console.log('moreinfo');
        setHasInfo(true);
      }
    }
  }, [description]);

  const WithInfo = () => {
    return (
      <>
        <View
          style={{borderBottomColor: Colors.neutralGray, borderBottomWidth: 1}}>
          <PaddingView paddingSize={4}>
            <View style={styles.titleWrapper}>
              <AppText textStyle="subtitle2">About</AppText>
            </View>
            <View style={styles.infoContentWrapper}>
              <ScrollView>
                <AppText textStyle="body2">{description}</AppText>
              </ScrollView>
            </View>
            {/* <View style={styles.connectionWrapper}>
              <View style={styles.followers}>
                <Users width={normalize(14)} height={normalize(14)} />
                <AppText
                  textStyle="caption"
                  color={Colors.profileLink}
                  customStyle={{marginLeft: 4}}>
                  29 Followers
                </AppText>
              </View>
              <View style={styles.following}>
                <AppText textStyle="caption" color={Colors.profileLink}>
                  8 Following
                </AppText>
              </View>
            </View> */}
          </PaddingView>
        </View>
        {/* <PaddingView paddingSize={4}>
          <View style={styles.verifiedTitle}>
            <AppText textStyle="subtitle2">
              User is verified by Servbees!
            </AppText>
          </View>
        </PaddingView> */}
      </>
    );
  };

  return (
    <>
      {hasInfo ? (
        <WithInfo />
      ) : (
        <ScrollView>
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
            {/* <View style={styles.linksWrapper}>
            <TouchableOpacity>
              <AppText textStyle="body1" color={Colors.contentOcean}>
                Complete your Profile
              </AppText>
            </TouchableOpacity>
          </View> */}
          </View>
        </ScrollView>
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

  infoContentWrapper: {
    marginTop: normalize(12),
    marginBottom: normalize(21),
  },

  connectionWrapper: {
    flexDirection: 'row',
  },

  followers: {
    marginRight: normalize(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
});

//make this component available to the app
export default MoreInfo;
