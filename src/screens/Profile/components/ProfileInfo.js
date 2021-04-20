import React, { useContext, useEffect, useState } from 'react'
import { View, Dimensions } from 'react-native'
import { Divider } from 'react-native-paper'
import { AppText } from '@/components'
import {
  normalize,
  Colors,
  joinedDate,
  GlobalStyle,
  timePassedShort,
} from '@/globals'
import {
  Verified,
  Temperature,
  BeeJoinedTime,
  NavigationPinRed,
} from '@/assets/images/icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '@/context/UserContext'

const ProfileInfo = ({ profileData }) => {
  const navigation = useNavigation()
  const {
    display_name,
    account_verified,
    full_name,
    username,
    temperature,
    temperature_history,
    date_joined,
    addresses,
  } = profileData

  const ALLOWED_TEMP = 37.2

  const [history, setHistory] = useState(false)
  const toggleHistory = () => {
    setHistory(!history)
  }

  const { fetch } = useContext(UserContext)

  useEffect(() => {
    if (!profileData.success) {
      fetch()
    }
  }, [])

  let timeAgo = time => {
    return !timePassedShort(time) ? ' just now' : timePassedShort(time) + ' ago'
  }

  const VerifiedBadge = ({ size }) => {
    return account_verified ? (
      <Verified width={normalize(size)} height={normalize(size)} />
    ) : null
  }

  return (
    <>
      <View style={{ paddingHorizontal: 16, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppText
            textStyle="subtitle1"
            color={Colors.primaryMidnightBlue}
            customStyle={{ marginRight: 8 }}>
            {display_name || full_name}
          </AppText>
          <VerifiedBadge size={15} />
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <AppText textStyle="body3" customStyle={{ marginRight: 16 }}>
            {full_name}
          </AppText>
          {username ? (
            <AppText textStyle="body2" customStyle={{ marginRight: 16 }}>
              @{username}
            </AppText>
          ) : (
            <TouchableOpacity>
              <AppText textStyle="body2" customStyle={{ marginRight: 16 }}>
                @ADDUSERID
              </AppText>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
          }}
          onPress={() => {
            temperature &&
              temperature.value &&
              navigation.navigate('NBTScreen', {
                screen: 'temperature-history',
                params: {
                  temperature_history,
                },
              })
          }}
          activeOpacity={1}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 8,
              paddingVertical: 4,
              backgroundColor:
                temperature?.value && temperature.value > ALLOWED_TEMP
                  ? Colors.secondaryPomelo
                  : Colors.secondarySolitude,

              borderRadius: 16,
            }}>
            <Temperature width={normalize(16)} height={normalize(16)} />
            <AppText textStyle="caption" customStyle={{ marginLeft: 4 }}>
              {temperature?.value
                ? temperature?.value +
                  ' °C at ' +
                  timeAgo(Date.now() / 1000 - temperature.date._seconds)
                : 'No record shown'}
            </AppText>
          </View>
        </TouchableOpacity>

        <Divider
          style={[
            GlobalStyle.dividerStyle,
            { marginVertical: 16, backgroundColor: 'rgba(164, 176, 190, 0.6)' },
          ]}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: normalize(10),
          }}>
          <BeeJoinedTime width={normalize(16)} height={normalize(16)} />
          <AppText
            textStyle="body2"
            customStyle={{ marginLeft: 4, marginRight: 16 }}>
            Joined {joinedDate(date_joined)}
          </AppText>
          <NavigationPinRed width={normalize(16)} height={normalize(16)} />
          <AppText
            textStyle="body2"
            customStyle={{ marginLeft: 4, marginRight: 16 }}>
            {addresses
              ? addresses.find(address => address.default).city
              : 'Manila City'}
          </AppText>
        </View>
      </View>
    </>
  )
}

export default ProfileInfo
