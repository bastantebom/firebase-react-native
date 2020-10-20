import React, { useState } from 'react';
import {
  View,
} from 'react-native';

import {
  AppText,
  AppRadio,
  BottomSheetHeader
} from '@/components';

import { normalize } from '@/globals';

import {
  Public
} from '@/assets/images/icons';

const PrivacyModal = () => {
  const [publicPost, setPublicPost] = useState(true);
  const RadioStateHandler = (val) => {
    if (val === 'public') {
      setPublicPost(true);
    }
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        // height: '28%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 20,
        paddingBottom: 30
      }}>

      <BottomSheetHeader />
      <View
        style={{ paddingTop: 30 }}>
        <AppText textStyle="body3">Who can see your post?</AppText>
        <View style={{ position: 'relative', paddingTop: 10 }}>
          <View style={{ position: 'absolute', top: 19 }}>
            <Public width={normalize(19)} height={normalize(19)} />
          </View>
          <AppRadio
            label={<><AppText textStyle="caption2">Public</AppText></>}
            value={publicPost}
            style={{ paddingLeft: 25 }}
            valueChangeHandler={() => RadioStateHandler('public')}
          />
        </View>
        <AppText textStyle="captionDashboard">Post can be seen by anyone on or off Servbees.</AppText>
      </View>
    </View>
  );
}

export default PrivacyModal;