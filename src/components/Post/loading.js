import React from 'react'
import SkeletonContent from 'react-native-skeleton-content-nonexpo'

import { normalize, Colors } from '@/globals'

const LoadingPublicPost = ({ children, isLoading }) => {
  return (
    <SkeletonContent
      containerStyle={{ flexDirection: 'column' }}
      isLoading={isLoading}
      layout={[
        {
          flexDirection: 'row',
          padding: 16,
          paddingBottom: 8,
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
          paddingHorizontal: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: Colors.neutralsZircon,

          children: [
            {
              width: normalize(122),
              height: normalize(126),
            },
            {
              paddingLeft: 8,

              children: [
                {
                  width: normalize(213),
                  height: normalize(21),
                  marginBottom: 8,
                },
                {
                  width: normalize(40),
                  height: normalize(18),
                  marginBottom: 8,
                },
                {
                  width: normalize(213),
                  height: normalize(1),
                  marginVertical: 8,
                },
                {
                  width: normalize(180),
                  height: normalize(21),
                  marginBottom: 8,
                },
                {
                  width: normalize(140),
                  height: normalize(21),
                  marginBottom: 8,
                },
              ],
            },
          ],
        },
      ]}>
      {children}
    </SkeletonContent>
  )
}

const LoadingOwnPost = ({ children, isLoading }) => {
  return (
    <SkeletonContent
      containerStyle={{ flexDirection: 'column' }}
      isLoading={isLoading}
      layout={[
        {
          backgroundColor: 'white',
          margin: 16,
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 4,
          children: [
            {
              flexDirection: 'row',
              padding: 12,
              children: [
                {
                  height: normalize(72),
                  width: normalize(64),
                  borderRadius: normalize(8),
                  overflow: 'hidden',
                },
                {
                  marginLeft: 8,
                  flexDirection: 'column',
                  children: [
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                      children: [
                        {
                          width: normalize(20),
                          height: normalize(20),
                          borderRadius: normalize(20 / 2),
                        },
                        {
                          width: normalize(100),
                          height: normalize(18),
                          marginLeft: 8,
                        },
                      ],
                    },
                    {
                      width: normalize(100),
                      height: normalize(18),
                      marginBottom: 8,
                    },
                    {
                      width: normalize(240),
                      height: normalize(18),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]}>
      {children}
    </SkeletonContent>
  )
}

const LoadingScreen = {
  LoadingPublicPost,
  LoadingOwnPost,
}

export default LoadingScreen
