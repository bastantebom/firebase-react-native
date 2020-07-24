import React from 'react'
import { View } from 'react-native';
import {
  Svg,
  Polygon,
  Defs,
  ClipPath,
  Image,
} from 'react-native-svg';

const HexagonBorder = ({ imgSrc }) => {
  return (
    <View>
      <Svg height="240" width="240" viewBox="0 0 100 100">
        <Defs>
          <ClipPath id="clip">
            <Polygon
              points="93.30127018922194,75 50,100 6.698729810778076,75.00000000000001 6.698729810778062,25.000000000000014 49.99999999999999,0 93.30127018922194,25.000000000000018"
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