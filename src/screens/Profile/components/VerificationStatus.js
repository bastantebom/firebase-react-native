//import liraries
import React, { useState } from 'react'
import { View } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { normalize, Colors } from '@/globals'
import { Verified, ArrowRight, Icons } from '@/assets/images/icons'
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
              <View
                style={{
                  flexDirection: 'row-reverse',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Icons.ChevronRight
                  style={{
                    color: Colors.primaryMidnightBlue,
                    marginRight: normalize(8),
                  }}
                  width={normalize(18)}
                  height={normalize(18)}
                />
                <AppText
                  textStyle="body2medium"
                  color={Colors.primaryMidnightBlue}
                  customStyle={{ paddingBottom: normalize(4) }}>
                  Get bee-rified!
                </AppText>
              </View>
              <AppText textStyle="caption">
                Safeguard your account and boost your credibility within the
                community.
              </AppText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <ProgressBar
          progress={statusPercentage}
          color={Colors.contentOcean}
          style={{
            backgroundColor: Colors.secondarySolitude,
            height: 8,
            borderRadius: 50,
            marginTop: 8,
          }}
        />
      </View>
    </View>
  )
}

//make this component available to the app
export default VerificationStatus
