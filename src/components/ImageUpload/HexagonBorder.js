import React from 'react';
import {View} from 'react-native';
import {
  Svg,
  Polygon,
  Defs,
  ClipPath,
  Image,
  Path,
  Rect,
} from 'react-native-svg';
import {EmptyAvatar} from '@/assets/images/icons';
import {normalize} from '@/globals';

const HexagonBorder = ({imgSrc, size}) => {
  return (
    <View>
      {imgSrc ? (
        <View style={{marginTop: normalize(-70)}}>
          <Svg height={size * 2} width={size} viewBox="0 0 100 100">
            {/* <Defs> */}
            <Polygon
              points="93.30127018922194,75 50,100 6.698729810778076,75.00000000000001 6.698729810778062,25.000000000000014 49.99999999999999,0 93.30127018922194,25.000000000000018"
              stroke="white"
              strokeLinejoin="round"
              strokeWidth={7}
            />
            <ClipPath id="clip">
              <Polygon points="93.30127018922194,75 50,100 6.698729810778076,75.00000000000001 6.698729810778062,25.000000000000014 49.99999999999999,0 93.30127018922194,25.000000000000018" />
            </ClipPath>
            {/* </Defs> */}
            <Image
              width="100%"
              height="50%"
              opacity="1"
              href={imgSrc}
              clipPath="url(#clip)"
            />
          </Svg>
        </View>
      ) : (
        <EmptyAvatar />
      )}
    </View>
  );
};

export default HexagonBorder;
