//import liraries
import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {normalize, Colors} from '@/globals';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Following from './components/connections';
import Hives from './components/hives';
import Modal from 'react-native-modal';

import {AppText} from '@/components';
// create a component
const ProfileLinks = ({
  visibleHives,
  visibleFollowing,
  toggleHives,
  toggleConnections,
  userInfo,
}) => {
  const {post_count} = userInfo;
  return (
    <>
      <View style={styles.profileLinksWrapper}>
        <View style={styles.firstLink}>
          <AppText textStyle="subtitle1">
            {post_count > 0 ? post_count : 0}
          </AppText>
          <AppText
            textStyle="caption"
            color={Colors.profileLink}
            customStyle={{paddingLeft: normalize(8)}}>
            {post_count == 1 ? 'Post' : 'Posts'}
          </AppText>
        </View>
        {/* <TouchableOpacity onPress={toggleConnections}>
          <View style={styles.individualLink}>
            <AppText textStyle="subtitle1">29</AppText>
            <AppText textStyle="caption" color={Colors.profileLink}>
              Followers
            </AppText>
          </View>
        </TouchableOpacity> */}
        {/* <TouchableOpacity onPress={toggleHives}>
          <View style={styles.individualLink}>
            <AppText textStyle="subtitle1">4</AppText>
            <AppText textStyle="caption" color={Colors.profileLink}>
              Hives
            </AppText>
          </View>
        </TouchableOpacity> */}
      </View>

      <Modal
        isVisible={visibleFollowing}
        animationIn="slideInUp"
        animationInTiming={750}
        animationOut="slideOutDown"
        animationOutTiming={750}
        onSwipeComplete={toggleConnections}
        swipeDirection="down"
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <Following toggleConnections={toggleConnections} />
      </Modal>

      <Modal
        isVisible={visibleHives}
        animationIn="slideInUp"
        animationInTiming={750}
        animationOut="slideOutDown"
        animationOutTiming={750}
        onSwipeComplete={toggleHives}
        swipeDirection="down"
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <Hives toggleHives={toggleHives} />
      </Modal>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  profileLinksWrapper: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: normalize(14),
    height: normalize(48),
    //backgroundColor: 'blue',
  },

  firstLink: {
    alignItems: 'center',
    flexDirection: 'row', //added for phase 1
    backgroundColor: Colors.secondarySolitude,
    paddingTop: normalize(10.5),
    paddingBottom: normalize(10.5),
    paddingLeft: normalize(62),
    paddingRight: normalize(62),
    borderRadius: normalize(16),
  },

  individualLink: {
    alignItems: 'center',
    marginLeft: normalize(24),
  },
});

//make this component available to the app
export default ProfileLinks;
