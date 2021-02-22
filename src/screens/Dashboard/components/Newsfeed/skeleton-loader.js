import React from 'react'
import { ScrollView } from 'react-native'
import SkeletonContent from 'react-native-skeleton-content-nonexpo'

import { Colors, normalize } from '@/globals'

const SkeletonLoader = ({ isLoading, type }) => {
  return (
    <ScrollView>
      <SkeletonContent
        isLoading={isLoading}
        layout={
          type === 'liked' ? skeletonLoaderLiked : skeletonLoaderStyles
        }></SkeletonContent>
    </ScrollView>
  )
}

const skeletonLoaderLiked = [
  {
    height: normalize(26),
    width: normalize(26),
    borderRadius: normalize(32 / 2),
    overflow: 'hidden',
  },
]

const skeletonLoaderStyles = [
  {
    width: '100%',
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
  {
    width: '100%',
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
  {
    width: '100%',
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
  {
    width: '100%',
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
  {
    width: '100%',
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
]

export default SkeletonLoader
