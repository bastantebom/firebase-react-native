//import liraries
import React from 'react'
import { View, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
//import {Colors} from 'react-native/Libraries/NewAppScreen';
import { HeaderBackGray } from '@/assets/images/icons'
import { AppText, PaddingView } from '@/components'
import { normalize } from '@/globals'
import { TouchableOpacity } from 'react-native-gesture-handler'
// create a component
const Connections = ({ toggleConnections }) => {
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
              <TouchableOpacity onPress={toggleConnections} activeOpacity={0.7}>
                <HeaderBackGray width={normalize(24)} height={normalize(24)} />
              </TouchableOpacity>
            </View>
          </PaddingView>
        </View>

        <View>
          <View style={styles.container}>
            <AppText>Following Followers list</AppText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
})

//make this component available to the app
export default Connections
