import React, { useContext, useEffect, useState } from 'react'
import { View, Dimensions } from 'react-native'
import { Divider } from 'react-native-paper'
import { TempHistory } from '@/screens/Profile/components'
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
  StarRating,
  BeeJoinedTime,
  NavigationPinRed,
} from '@/assets/images/icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Modal from 'react-native-modal'
import { UserContext } from '@/context/UserContext'

const ProfileInfo = ({ profileData }) => {
  const {
    display_name,
    account_verified,
    full_name,
    username,
    temperature,
    temperature_history,
    ratings_count,
    ratings_average,
    date_joined,
    addresses,
    address,
    account,
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
            temperature && temperature.value ? toggleHistory() : ''
          }}>
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

        {/* <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}}>
        <StarRating width={normalize(16)} height={normalize(16)} />
        <AppText textStyle="body3" customStyle={{marginRight: 8}}>
          {' '}
          {ratings_average} out of 5
        </AppText>
        <AppText textStyle="body2" customStyle={{marginRight: 8}}>
          ({ratings_count} Ratings)
        </AppText>
      </View> */}

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
      <Divider
        style={[
          GlobalStyle.dividerStyle,
          {
            marginVertical: normalize(16),
            backgroundColor: Colors.neutralsZircon,
            height: normalize(4),
          },
        ]}
      />
      <Modal
        isVisible={history}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <TempHistory profileData={profileData} toggleHistory={toggleHistory} />
      </Modal>
    </>
  )
}

export default ProfileInfo
