import React, {Component} from 'react';
import FastImage from 'react-native-fast-image';

const CacheableImage = (props) => {
  // console.log('PROPS');
  // console.log(props.source.uri);

  return (
    <FastImage
      // style={{width: 200, height: 200}}
      resizeMode={FastImage.resizeMode.cover}
      {...props}
      // overwrite source prop.
      source={{
        uri: props?.source?.uri,
        priority: FastImage.priority.normal,
      }}
    />
  );
};

export default CacheableImage;
