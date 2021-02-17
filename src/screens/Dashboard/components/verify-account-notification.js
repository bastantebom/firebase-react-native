import React from 'react'
import { Colors, normalize } from '@/globals'
import { Notification } from '@/components/Notification'
import { Icons } from '@/assets/images/icons'
import { View, TouchableOpacity } from 'react-native'
import { AppText } from '@/components'

/**
 * @param {object} param0
 * @param {() => void} param0.onPress
 * @param {() => void} param0.onClose
 */
const VerifyNotifictaion = ({ onPress, onClose }) => {
  return (
    <Notification
      icon={<Icons.VerifiedWhite />}
      onClose={onClose}
      type="primary"
      animationOptions={{ height: 110, delay: 0 }}>
      <View
        style={{
          zIndex: 999,
          position: 'relative',
        }}>
        <View
          style={{
            justifyContent: 'space-evenly',
            marginLeft: normalize(16),
          }}>
          <TouchableOpacity onPress={onPress}>
            <AppText
              textStyle="body2"
              color={Colors.neutralsWhite}
              customStyle={{ marginBottom: 10 }}>
              Safeguard your account and boost your credibility within the
              community.
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText textStyle="body2" color={Colors.neutralsWhite}>
                Get bee-rified
              </AppText>
              <Icons.ChevronRight
                style={{ color: '#fff', marginLeft: normalize(4) }}
                width={normalize(16)}
                height={normalize(16)}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Notification>
  )
}

export default VerifyNotifictaion
