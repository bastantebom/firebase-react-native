import React, { useState } from 'react'
import AppText from '@/components/AppText/AppText'
import ImagePicker from 'react-native-image-crop-picker';
import AppButton from '@/components/AppButton';
import { View, Text, Alert } from 'react-native';
import {
  Svg,
  Circle,
  Polygon,
  Rect,
  Defs,
  ClipPath,
  Image,
  SvgUri
} from 'react-native-svg';

const HexagonBorder = ({ imgSrc }) => {

  return (
    <View >
      <Svg height="500" width="500" viewBox="0 0 100 100">
        <Defs>
          <ClipPath id="clip">
            <Polygon
              points="71.65063509461098,62.5 50,75 28.349364905389038,62.50000000000001 28.34936490538903,37.50000000000001 49.99999999999999,25 71.65063509461098,37.50000000000001"
              // cx="100%" 
              // cy="100%"
            />
          </ClipPath>
        </Defs>
        <Image
          // x="0"
          // y="0"
          width="100%"
          height="100%"
          // preserveAspectRatio="xMidYMid slice"
          opacity="1"
          href={imgSrc}
          clipPath="url(#clip)"
        />
      </Svg>
      <Text>hi</Text>
    </View>
  )
}

export default HexagonBorder;