import React, {useContext} from 'react'
import {
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import { AppText } from '@/components';
import {UserContext} from '@/context/UserContext';

const Activity = () => {
  const { user } = useContext(UserContext);

  return (
    <SafeAreaView>
      <Text>Activity</Text>
      { user && 
        <>
          <AppText>{user.displayName}</AppText>
          <AppText>{user.email}</AppText>
          <AppText>{user.uid}</AppText>
        </>
      }
    </SafeAreaView>
  )
}

export default Activity;
