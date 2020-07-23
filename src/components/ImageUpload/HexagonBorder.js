import React, { useState } from 'react'
import AppText from '@/components/AppText/AppText'
import ImagePicker from 'react-native-image-crop-picker';
import AppButton from '@/components/AppButton';
import { View, Image } from 'react-native';
import {
  Svg,
  Circle,
  Polygon,
  Rect,
  Defs,
  ClipPath,
  Text,
  // Image
} from 'react-native-svg';

const HexagonBorder = () => {

  const [imageSource, setImageSource] = useState(null);

  return (
    <View>
      <Svg height="100% " width="100%" viewBox="0 0 100 100">
        <Defs>
          <ClipPath id="clip">
            <Polygon
              points="71.65063509461098,62.5 50,75 28.349364905389038,62.50000000000001 28.34936490538903,37.50000000000001 49.99999999999999,25 71.65063509461098,37.50000000000001"
              cx="50%" 
              cy="50%"
            />
          </ClipPath>
        </Defs>
        <Image
          x="15%"
          y="15%"
          width="100%"
          height="100%"
          // preserveAspectRatio="xMidYMid slice"
          opacity={1}
          // href={require("../../assets/images/image-1.png")}
          clipPath="url(#clip)"
        />
      </Svg>
    </View>
  )
}

export default HexagonBorder;