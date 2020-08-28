import React, {Component} from 'react';
import FastImage from 'react-native-fast-image';

const CacheableImage = (props) => {
  console.log('PROPS');
  console.log(props);

  return (
    <FastImage
      // style={{width: 200, height: 200}}
      source={{
        uri:
          'https://firebasestorage.googleapis.com/v0/b/codes-servbees.appspot.com/o/JlW54zJC8EVqLhxeLsP7H0dvUuT2%2Fpost-photo%2FIMG_0005?alt=media&token=f3aa3382-2be0-4693-aefc-22e665dd7436',
        // headers: {Authorization: 'someAuthToken'},
        priority: FastImage.priority.normal,
      }}
      resizeMode={FastImage.resizeMode.cover}
      {...props}
    />
  );
};

export default CacheableImage;
