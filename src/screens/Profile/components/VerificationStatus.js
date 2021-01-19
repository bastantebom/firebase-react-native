//import liraries
import React, { useState } from 'react'
import { View } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { normalize, Colors } from '@/globals'
import { Verified, ArrowRight } from '@/assets/images/icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { AppText } from '@/components'
import { useNavigation } from '@react-navigation/native'

// create a component
const VerificationStatus = ({ statusPercentage }) => {
  const [verification, setVerification] = useState(false)
  const toggleVerification = () => {
    setVerification(!verification)
  }

  const navigation = useNavigation()

  return (
    <View
      style={{
        paddingHorizontal: 24,
        backgroundColor: Colors.neutralsWhite,
      }}>
      <View
        style={{
          padding: 16,
          borderColor: Colors.neutralsZircon,
          borderWidth: 1,
          borderRadius: 4,
        }}>
        <TouchableOpacity
          onPress={() => toggleVerification()}
          style={{ flexDirection: 'row' }}>
          <View
            style={{
              alignItems: 'flex-start',
            }}>
            <Verified width={24} height={24} />
          </View>
          <View style={{ marginHorizontal: 16 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('NBTScreen', {
                  screen: 'Verification',
                })
              }}>
              <AppText textStyle="body1" color={Colors.primaryMidnightBlue}>
                Get bee-rified
              </AppText>
              <AppText textStyle="caption" color={Colors.primaryMidnightBlue}>
                Safeguard your account and boost your credibility within the
                community.
              </AppText>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 2, alignItems: 'flex-end' }}>
            <ArrowRight width={24} height={24} />
          </View>
        </TouchableOpacity>

        <ProgressBar
          progress={statusPercentage}
          color={Colors.contentOcean}
          style={{ height: 8, borderRadius: 50, marginTop: 8 }}
        />
      </View>
    </View>
  )
}

//make this component available to the app
export default VerificationStatus
