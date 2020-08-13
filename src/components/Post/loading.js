import React from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

import {normalize} from '@/globals';

const LoadingPublicPost = ({children, isLoading}) => {
  return (
    <SkeletonContent
      containerStyle={{flexDirection: 'column'}}
      isLoading={isLoading}
      layout={[
        {
          flexDirection: 'row',
          children: [
            {
              height: normalize(32),
              width: normalize(32),
              borderRadius: normalize(32 / 2),
              overflow: 'hidden',
            },
            {
              marginLeft: 8,
              justifyContent: 'center',
              children: [
                {
                  width: normalize(100),
                  height: normalize(14),
                  marginBottom: 4,
                },
                {
                  width: normalize(150),
                  height: normalize(12),
                },
              ],
            },
          ],
        },
        {
          flexDirection: 'row',
          children: [
            {
              width: normalize(122),
              height: normalize(126),
              marginBottom: 4,
            },
          ]
        },
      ]}>
      {children}
    </SkeletonContent>
  );
};

const LoadingScreen = {
  LoadingPublicPost,
};

export default LoadingScreen;
