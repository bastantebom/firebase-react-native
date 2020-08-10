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
import { UploadIcon } from '@/assets/images/icons';

const ProfileImageUpload = ({size}) => {
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
      .putFile(uploadUri);

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
        style={{display: isVisible ? 'flex' : 'none'}}>
        <UploadIcon height={size} width={size} />
      </TouchableOpacity>
      <View style={{display: !isVisible ? 'flex' : 'none'}}>
        <Svg height={size} width={size} viewBox="0 0 100 100" strokeLinejoin="round">
          <Defs>
            <ClipPath id="clip">
              <Polygon points="93.30127018922194,75 50,100 6.698729810778076,75.00000000000001 6.698729810778062,25.000000000000014 49.99999999999999,0 93.30127018922194,25.000000000000018" strokeLinejoin="round"/>
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
