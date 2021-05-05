import { Icons } from '@/assets/images/icons'
import { BottomSheetHeader } from '@/components'
import Button from '@/components/Button'
import RadioButton from '@/components/radio-button'
import { Context } from '@/context'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import React, { useContext, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  UIManager,
  Platform,
  LayoutAnimation,
} from 'react-native'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

/**
 * @param {object} props
 * @param {function} props.close
 * @param {object} props.post
 **/
const ChangeShippingMethodModal = ({ close, post }) => {
  const { basket, setBasket } = useContext(Context)
  const [method, setMethod] = useState(
    post.type === 'sell' ? basket.shippingMethod : basket.bookingMethod
  )
  const title =
    post.type === 'sell' ? 'Change Shipping Method' : 'Change Booking Method'

  const handleOnConfirmPress = () => {
    const newBasket = { ...basket }
    if (post.type === 'sell') newBasket.shippingMethod = method
    else if (post.type === 'service') {
      newBasket.bookingMethod = method
      if (method === 'walkin') newBasket.bookingAddress = post.location
    }

    setBasket(newBasket)
    close()
  }

  const handleOnMethodPress = method => {
    configureAnimation()
    setMethod(method)
  }

  const handleOnBackPress = () => {
    close()
  }

  const configureAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 120,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
    })
  }

  return (
    <View style={styles.container}>
      <BottomSheetHeader />
      <TouchableOpacity
        style={{ marginTop: normalize(24) }}
        activeOpacity={0.7}
        onPress={handleOnBackPress}>
        <Icons.Close
          style={{ color: Colors.primaryMidnightBlue }}
          {...iconSize(24)}
        />
      </TouchableOpacity>

      <View>
        <Text style={[typography.subtitle1, { marginTop: normalize(16) }]}>
          {title}
        </Text>

        {post.type === 'sell' ? (
          <>
            <View
              style={{
                borderBottomWidth: normalize(1),
                borderBottomColor: Colors.Gainsboro,
              }}>
              <RadioButton
                containerStyle={styles.shippingMethod}
                value={method === 'delivery'}
                onPress={() => handleOnMethodPress('delivery')}>
                <Text
                  style={[
                    typography.body1narrow,
                    typography.medium,
                    { flex: 1 },
                  ]}>
                  Delivery
                </Text>
                <Icons.Truck
                  style={{ color: Colors.icon, marginRight: normalize(8) }}
                  {...iconSize(24)}
                />
              </RadioButton>
            </View>

            <View>
              <RadioButton
                containerStyle={styles.shippingMethod}
                value={method === 'pickup'}
                onPress={() => handleOnMethodPress('pickup')}>
                <Text
                  style={[
                    typography.body1narrow,
                    typography.medium,
                    { flex: 1 },
                  ]}>
                  Pick up
                </Text>
                <Icons.Pickup
                  style={{ color: Colors.icon, marginRight: normalize(8) }}
                  {...iconSize(24)}
                />
              </RadioButton>
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                borderBottomWidth: normalize(1),
                borderBottomColor: Colors.Gainsboro,
              }}>
              <RadioButton
                containerStyle={styles.shippingMethod}
                value={method === 'appointment'}
                onPress={() => handleOnMethodPress('appointment')}>
                <Text
                  style={[
                    typography.body1narrow,
                    typography.medium,
                    { flex: 1 },
                  ]}>
                  By Appointment
                </Text>
                <Icons.Appointment
                  style={{ color: Colors.icon, marginRight: normalize(8) }}
                  {...iconSize(24)}
                />
              </RadioButton>
            </View>

            <View>
              <RadioButton
                containerStyle={styles.shippingMethod}
                value={method === 'walkin'}
                onPress={() => handleOnMethodPress('walkin')}>
                <Text
                  style={[
                    typography.body1narrow,
                    typography.medium,
                    { flex: 1 },
                  ]}>
                  Walk-in
                </Text>
                <Icons.Pickup
                  style={{ color: Colors.icon, marginRight: normalize(8) }}
                  {...iconSize(24)}
                />
              </RadioButton>
            </View>
          </>
        )}

        <View style={styles.buttonWrapper}>
          <Button
            label="Confirm"
            type="primary"
            onPress={handleOnConfirmPress}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
    paddingHorizontal: normalize(16),
  },
  buttonWrapper: {
    paddingTop: 0,
    paddingBottom: normalize(24),
  },
  shippingMethod: {
    paddingVertical: normalize(16),
    flexDirection: 'row-reverse',
  },
})

export default ChangeShippingMethodModal
