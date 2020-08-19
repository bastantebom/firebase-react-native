import React, {useState, useEffect} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {View, TouchableOpacity, Alert} from 'react-native';
import {Svg, Polygon, Defs, ClipPath, Image} from 'react-native-svg';
import {utils} from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {ProgressBar} from 'react-native-paper';

import AppButton from '../AppButton/AppButton';
import AppText from '../AppText/AppText';
import HexagonBorder from '@/components/ImageUpload/HexagonBorder';
import {UploadIcon} from '@/assets/images/icons';

const ProfileImageUpload = ({size, imgSourceHandler, imgSrc}) => {
  const currentUser = auth().currentUser;

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [isVisible, setIsVisible] = useState(true);

  const [imageSource, setImageSource] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const handleSelect = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      // includeBase64: true,
    })
      .then((response) => {
        const source = {uri: response.path};
        console.log(source);
        setImageSource(source);

        // const uri = image.path;
        // setImageSource(uri)
        // console.log(image.filename)
        imgSourceHandler(source);
        setIsVisible(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const uploadImage = async () => {
    const {uri} = imageSource;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    setUploading(true);
    setTransferred(0);

    const task = storage()
      // .ref(filename)
      .ref(`${currentUser.uid}/display-photos/${filename}`)
      .putFile(uploadUri)
      // .then((res) => {
      //   console.log(res)
      // })

    // set progress state
    task.on('state_changed', (snapshot) => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });

    try {
      await task;
    } catch (e) {
      console.error(e);
    }

    setUploading(false);

    Alert.alert('Photo uploaded!', 'Your photo has been uploaded!');
    setImageSource(null);
  };

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <View>
      <TouchableOpacity
        onPress={() => handleSelect()}
        style={{display: isVisible && !imgSrc ? 'flex' : 'none'}}>
        <UploadIcon height={size} width={size} />
      </TouchableOpacity>
      <View style={{display: !isVisible || imgSrc ? 'flex' : 'none'}}>
        <Svg
          height={size}
          width={size}
          viewBox="0 0 100 100"
          strokeLinejoin="round">
          <Defs>
            <ClipPath id="clip">
              <Polygon
                points="47.5 5.66987, 48.2899 5.30154, 49.13176 5.07596, 50 5, 50.86824 5.07596, 51.7101 5.30154, 52.5 5.66987, 87.14102 25.66987, 87.85495 26.16978, 88.47124 26.78606, 88.97114 27.5, 89.33948 28.2899, 89.56505 29.13176, 89.64102 30, 89.64102 70, 89.56505 70.86824, 89.33948 71.7101, 88.97114 72.5, 88.47124 73.21394, 87.85495 73.83022, 87.14102 74.33013, 52.5 94.33013, 51.7101 94.69846, 50.86824 94.92404, 50 95, 49.13176 94.92404, 48.2899 94.69846, 47.5 94.33013, 12.85898 74.33013, 12.14505 73.83022, 11.52876 73.21394, 11.02886 72.5, 10.66052 71.7101, 10.43495 70.86824, 10.35898 70, 10.35898 30, 10.43495 29.13176, 10.66052 28.2899, 11.02886 27.5, 11.52876 26.78606, 12.14505 26.16978, 12.85898 25.66987"
                strokeLinejoin="round"
              />
            </ClipPath>
          </Defs>
          <Image
            width="100%"
            height="100%"
            opacity="1"
            href={imageSource || imgSrc}
            clipPath="url(#clip)"
            onPress={() => handleSelect()}
          />
        </Svg>
      </View>
      {/* <AppButton
        text="Save"
        onPress={() => uploadImage()}
      /> */}

      {uploading ? (
        <View>
          <ProgressBar progress={transferred} />
        </View>
      ) : null}

      {/* {imageSource !== null ? (
        <HexagonBorder imgSrc={{uri: imageSource.uri}} />
        // <Image source={{ uri: image.uri }} style={styles.imageBox} />
      ) : null} */}
    </View>
  );
};

export default ProfileImageUpload;
