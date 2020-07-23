import React, { useState } from 'react'
import AppText from '@/components/AppText/AppText'
import ImagePicker from 'react-native-image-crop-picker';
import AppButton from '@/components/AppButton';
import { View, Text, Image } from 'react-native';
import HexagonBorder from '@/components/ImageUpload/HexagonBorder';

const ImageUpload = () => {

  const [imageSource, setImageSource] = useState(null);

  const handleSelect = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
      // cropperCircleOverlay: true
    }).then(image => {
      const uri = image.path;
      setImageSource(uri)
    });
  }

  return (
    <View>
      <AppButton
        text="Image upload"
        onPress={() => handleSelect()}
        type="primary"
        size="sm"
      />
      { imageSource !== null ? (
        <Image 
          style={{ width: 200, height: 200, resizeMode: 'cover' }}
          source={{
            uri: imageSource
          }} 
        />
      ) : (
        null
      )}
    </View>
  )
}

export default ImageUpload;