//import liraries
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { normalize, Colors } from '@/globals';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Following from './components/connections';
import Hives from './components/hives';
import Modal from 'react-native-modal';

import ProfileInfoService from '@/services/Profile/ProfileInfo';

import { AppText } from '@/components';
// create a component
const ProfileLinks = ({
  visibleHives,
  visibleFollowing,
  toggleHives,
  toggleConnections,
  userInfo,
  addFollowers,
}) => {

  const { uid } = userInfo;
  const [followers, setFollowers] = useState(0);

  //console.log(uid);
  useEffect(() => {
    let mounted = true;
    if (uid && mounted)
      ProfileInfoService.getFollowers(uid)
        .then((response) => {
          setFollowers(response.data.length);
          //if (mounted) setOtherUserInfo(response.data);
        })
        .catch((err) => {
          console.log('Err: ' + err);
        });
    return () => {
      mounted = false;
    };
  }, [uid]);

  useEffect(() => {
    let mounted = true;
    if (addFollowers !== null) {
      if (addFollowers) {
        setFollowers(followers + 1);
      } else {
        setFollowers(followers - 1);
      }
      console.log('nag follow');
    }
    return () => {
      mounted = false;
    };
  }, [addFollowers]);

  const { post_count } = userInfo;
  //const [followers, setFollowers] = useState(0);
  //console.log(userInfo);
  return (
    <>
      <View style={styles.profileLinksWrapper}>
        <View style={styles.firstLink}>
          <AppText textStyle="subtitle1">
            {post_count > 0 ? post_count : 0}
          </AppText>
          <AppText
            textStyle="captionDashboard"
            color={Colors.profileLink}
            customStyle={{ paddingLeft: normalize(8) }}>
            {post_count == 1 ? 'Post' : 'Posts'}
          </AppText>
        </View>
        <TouchableOpacity onPress={toggleConnections}>
          <View style={styles.individualLink}>
            <AppText textStyle="subtitle1">{followers > 0 ? followers : 0}</AppText>
            <AppText textStyle="captionDashboard" color={Colors.profileLink}>
              {followers > 1 ? 'Follower' : 'Followers'}
            </AppText>
          </View>
        </TouchableOpacity>
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
  },

  individualLink: {
    alignItems: 'center',
    marginLeft: normalize(24),
  },
});

//make this component available to the app
export default ProfileLinks;
