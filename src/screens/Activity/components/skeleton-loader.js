import React from 'react'
import SkeletonContent from 'react-native-skeleton-content-nonexpo'

import { Colors, normalize } from '@/globals'

const SkeletonLoader = ({ isLoading }) => {
  return (
    <SkeletonContent
      isLoading={isLoading}
      layout={orderLoader}></SkeletonContent>
  )
}

const orderLoader = [
  {
    height: normalize(15),
    width: normalize(180),
    borderRadius: normalize(30),
    overflow: 'hidden',
  },
]

export default SkeletonLoader
