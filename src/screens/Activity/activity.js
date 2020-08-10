import React, {useContext} from 'react'
import {
  View,
  Text,
} from 'react-native';
import { AppText } from '@/components';
import {UserContext} from '@/context/UserContext';

const Activity = () => {

  const { isLoggedIn, user } = useContext(UserContext);

  return (
    <View>
      <Text>Activity</Text>
      { isLoggedIn && 
        <>
          <AppText>{user.displayName}</AppText>
          <AppText>{user.email}</AppText>
          <AppText>{user.uid}</AppText>
        </>
      }
    </View>
  )
}

export default Activity;
