import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView
} from 'react-native';
import AppText from '@/components/AppText/AppText';
import AppButton from '@/components/AppButton';
import auth from '@react-native-firebase/auth';
import ProfileImageUpload from '@/components/ImageUpload/ProfileImageUpload';
import PostFilter from '@/components/PostFilter/PostFilter';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

function Profile({ navigation }) {

  const currentUser = auth().currentUser.email;

  return (
    <View style={styles.container}>
      <AppText textStyle="body1" > Sample Profile </AppText>
      <AppButton
        text="Go back to dashboard"
        onPress={() => navigation.goBack()}
        type="primary"
        size="sm"
      />
      <AppText>Welcome, {currentUser}</AppText>
      {/* <ProfileImageUpload/>
      <PostFilter/> */}
    </View>
  )
}

export default Profile;