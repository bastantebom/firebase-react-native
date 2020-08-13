import React from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

const LoadingScreen = ({children}) => {
  return (
    <SkeletonContent>
      {children}
    </SkeletonContent>
  )
};

export default LoadingScreen;
