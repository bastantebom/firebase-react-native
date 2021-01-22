import React from 'react'
import { Hive } from '@/components/Hives'
import { View, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
//import {Colors} from 'react-native/Libraries/NewAppScreen';
import { HeaderBackGray } from '@/assets/images/icons'
import { PaddingView } from '@/components'
import { normalize } from '@/globals'
import { TouchableOpacity } from 'react-native-gesture-handler'

function ProfileHives({ toggleHives }) {
  //navigation.setOptions({
  // title: 'HIVES LIST', // change to user's display name
  //});

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View>
          <PaddingView paddingSize={3}>
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexDirection: 'row',
              }}>
              <TouchableOpacity onPress={toggleHives} activeOpacity={0.7}>
                <HeaderBackGray width={normalize(24)} height={normalize(24)} />
              </TouchableOpacity>
            </View>
          </PaddingView>
        </View>

        <View>
          <View style={styles.container}>
            <Hive />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileHives

const styles = StyleSheet.create({
  // container: {
  //   // flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   height: '100%'
  // }
})
