import React from 'react';
import {Text, View} from 'react-native';
import {
  Svg,
  Polygon,
  Defs,
  ClipPath,
  Image,
  Path,
  Rect,
} from 'react-native-svg';
import {EmptyAvatar, ProfileImageDefault} from '@/assets/images/icons';
import {normalize, Colors} from '@/globals';
import {AppText} from '@/components';

const HexagonBorder = ({imgSrc, size}) => {
  return (
    <View>
      <View
        style={{
          marginTop: normalize(-62), 
          position: 'absolute'
        }}
      >
        <Svg height={size * 2} width={size} viewBox="0 0 100 100">
          <Polygon
            points="45 1.33975, 46.5798 0.60307, 48.26352 0.15192, 50 0, 51.73648 0.15192, 53.4202 0.60307, 55 1.33975, 89.64102 21.33975, 91.06889 22.33956, 92.30146 23.57212, 93.30127 25, 94.03794 26.5798, 94.48909 28.26352, 94.64102 30, 94.64102 70, 94.48909 71.73648, 94.03794 73.4202, 93.30127 75, 92.30146 76.42788, 91.06889 77.66044, 89.64102 78.66025, 55 98.66025, 53.4202 99.39693, 51.73648 99.84808, 50 100, 48.26352 99.84808, 46.5798 99.39693, 45 98.66025, 10.35898 78.66025, 8.93111 77.66044, 7.69854 76.42788, 6.69873 75, 5.96206 73.4202, 5.51091 71.73648, 5.35898 70, 5.35898 30, 5.51091 28.26352, 5.96206 26.5798, 6.69873 25, 7.69854 23.57212, 8.93111 22.33956, 10.35898 21.33975"
            stroke={Colors.promoCopy}
            strokeLinejoin="round"
            strokeWidth={8}
            opacity={.05}
          />
        </Svg>
      </View>
      <View style={{ marginTop: normalize(-65) }}>
        <Svg height={size * 2} width={size} viewBox="0 0 100 100">
          <Polygon
            points="45 1.33975, 46.5798 0.60307, 48.26352 0.15192, 50 0, 51.73648 0.15192, 53.4202 0.60307, 55 1.33975, 89.64102 21.33975, 91.06889 22.33956, 92.30146 23.57212, 93.30127 25, 94.03794 26.5798, 94.48909 28.26352, 94.64102 30, 94.64102 70, 94.48909 71.73648, 94.03794 73.4202, 93.30127 75, 92.30146 76.42788, 91.06889 77.66044, 89.64102 78.66025, 55 98.66025, 53.4202 99.39693, 51.73648 99.84808, 50 100, 48.26352 99.84808, 46.5798 99.39693, 45 98.66025, 10.35898 78.66025, 8.93111 77.66044, 7.69854 76.42788, 6.69873 75, 5.96206 73.4202, 5.51091 71.73648, 5.35898 70, 5.35898 30, 5.51091 28.26352, 5.96206 26.5798, 6.69873 25, 7.69854 23.57212, 8.93111 22.33956, 10.35898 21.33975"
            stroke="white"
            strokeLinejoin="round"
            strokeWidth={7}
            style={{backgroundColor: Colors.buttonDisable}}
          />
          <ClipPath id="clip" style={{backgroundColor: Colors.buttonDisable}}>
            <Polygon
              style={{backgroundColor: Colors.buttonDisable}}
              points="45 1.33975, 46.5798 0.60307, 48.26352 0.15192, 50 0, 51.73648 0.15192, 53.4202 0.60307, 55 1.33975, 89.64102 21.33975, 91.06889 22.33956, 92.30146 23.57212, 93.30127 25, 94.03794 26.5798, 94.48909 28.26352, 94.64102 30, 94.64102 70, 94.48909 71.73648, 94.03794 73.4202, 93.30127 75, 92.30146 76.42788, 91.06889 77.66044, 89.64102 78.66025, 55 98.66025, 53.4202 99.39693, 51.73648 99.84808, 50 100, 48.26352 99.84808, 46.5798 99.39693, 45 98.66025, 10.35898 78.66025, 8.93111 77.66044, 7.69854 76.42788, 6.69873 75, 5.96206 73.4202, 5.51091 71.73648, 5.35898 70, 5.35898 30, 5.51091 28.26352, 5.96206 26.5798, 6.69873 25, 7.69854 23.57212, 8.93111 22.33956, 10.35898 21.33975"
            />
          </ClipPath>
          <Image
            width="100%"
            height="50%"
            opacity="1"
            href={
              imgSrc ? imgSrc : require('@/assets/images/default-profile.png')
            }
            // profile-image-default.svg
            // href={imgSrc}
            // source={{
            //   uri: imgSrc
            // }}
            style={{backgroundColor: Colors.buttonDisable}}
            clipPath="url(#clip)"
            onResponderRelease={() => {
              alert('Test');
            }}
          />
        </Svg>
      </View>
    </View>
  );
};

export default HexagonBorder;
