import { Colors, normalize } from '@/globals'
import React from 'react'
import SkeletonContent from 'react-native-skeleton-content-nonexpo'

const PostCardSkeleton = ({ children, isLoading }) => {
  return (
    <SkeletonContent
      containerStyle={{ flexDirection: 'column' }}
      isLoading={isLoading}
      layout={[
        {
          flexDirection: 'row',
          padding: normalize(16),
          paddingBottom: normalize(8),
          children: [
            {
              height: normalize(32),
              width: normalize(32),
              borderRadius: normalize(32 / 2),
              overflow: 'hidden',
            },
            {
              marginLeft: normalize(8),
              justifyContent: 'center',
              children: [
                {
                  width: normalize(100),
                  height: normalize(14),
                  marginBottom: normalize(4),
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
          paddingHorizontal: normalize(16),
          paddingBottom: normalize(16),
          borderBottomWidth: normalize(1),
          borderBottomColor: Colors.neutralsZircon,

          children: [
            {
              width: normalize(122),
              height: normalize(126),
            },
            {
              paddingLeft: normalize(8),
              children: [
                {
                  width: normalize(213),
                  height: normalize(21),
                  marginBottom: normalize(8),
                },
                {
                  width: normalize(40),
                  height: normalize(18),
                  marginBottom: normalize(8),
                },
                {
                  width: normalize(213),
                  height: normalize(1),
                  marginVertical: normalize(8),
                },
                {
                  width: normalize(180),
                  height: normalize(21),
                  marginBottom: normalize(8),
                },
                {
                  width: normalize(140),
                  height: normalize(21),
                  marginBottom: normalize(8),
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

export default PostCardSkeleton
