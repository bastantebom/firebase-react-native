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
    <View>
      <Svg height="360" width="340" viewBox="0 0 100 100">
        <Defs>
          <ClipPath id="clip">
            <Polygon
              // points='25,0, 75,0, 100,50, 75,100, 25,100, 0,50'
              points="25,0, 75,0, 100,50, 75,100, 25,100, 0,50"
              // points="93.30127018922194,75 50,100 6.698729810778076,75.00000000000001 6.698729810778062,25.000000000000014 49.99999999999999,0 93.30127018922194,25.000000000000018"
              onPress={() => Alert.alert('press polygon')}
            />
          </ClipPath>
        </Defs>
        <Image
          width="100%"
          height="100%"
          opacity="1"
          href={imgSrc}
          clipPath="url(#clip)"
        />
      </Svg>
    </View>
  )
}

export default HexagonBorder;