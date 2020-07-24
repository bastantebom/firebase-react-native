import React, { useState } from 'react'
import ImagePicker from 'react-native-image-crop-picker';
import { View, TouchableOpacity } from 'react-native';
import {
  Svg,
  Polygon,
  Defs,
  ClipPath,
  Image,
} from 'react-native-svg';

import UploadIcon from '@/assets/images/icons/profile-upload.svg';


const ProfileImageUpload = () => {

  const [imageSource, setImageSource] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  const handleSelect = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      const uri = image.path;
      setImageSource(uri)
      setIsVisible(false)
    }).catch(e => {
      console.log(e)
    });
  }

  return (
    <View>
      <TouchableOpacity onPress={() => handleSelect()} style={{ display : isVisible ? 'flex' : 'none' }}>
        <UploadIcon height="240" width="240"/>
      </TouchableOpacity>
      <View style={{ display : !isVisible ? 'flex' : 'none' }}>
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
            href={imageSource && imageSource}
            clipPath="url(#clip)"
            onPress={() => handleSelect()}
          />
        </Svg>
      </View>
      {/* <HexagonBorder imgSrc={imageSource} /> */}
    </View>
  )
}

export default ProfileImageUpload;