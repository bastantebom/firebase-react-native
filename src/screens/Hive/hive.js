import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';

import {ProfileList, AppText} from '@/components';

const Hive = () => {
  const [followersModal, setFollowersModal] = useState(false);

  const toggleFollowersModal = () => {
    setFollowersModal(!followersModal);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text>Hive Screen</Text>
      {/* <TouchableOpacity onPress={toggleFollowersModal}>
        <AppText>Open modal</AppText>
      </TouchableOpacity>

      <Modal
        isVisible={followersModal}
        animationIn="slideInUp"
        animationInTiming={750}
        animationOut="slideOutLeft"
        animationOutTiming={750}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
          justifyContent: 'flex-start'
        }}>
        <FilterSlider modalToggler={toggleModal} />

        <ProfileList closeModal={toggleFollowersModal} />
      </Modal> */}
    </SafeAreaView>
  );
};

export default Hive;
