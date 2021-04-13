import React, { useState } from 'react'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native'
import Modal from 'react-native-modal'
import {
  ScreenHeaderTitle,
  FloatingAppInput,
  AppText,
  AppButton,
} from '@/components'
import MapLocation from './map-location'
import { Colors, normalize } from '@/globals'
import { ArrowRight } from '@/assets/images/icons'

/**
 * @typedef {Object} Address
 * @property {string} name
 * @property {string} details
 * @property {string} notes
 * @property {string} full_address
 * @property {boolean} default
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} city
 * @property {string} province
 * @property {string} country
 */

/**
 * @typedef {Object} AddAddress
 * @property {Address} address
 * @property {function | undefined} onSubmit
 * @property {function | undefined} onRemove
 */

/**
 * @typedef {Object} RootProps
 * @property {AddAddress} AddAddress
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'AddAddress'>} param0 */
const AddAddressScreen = ({ navigation, route }) => {
  const address = route.params?.address || {
    full_address: '',
    notes: '',
    details: '',
    name: '',
    longitude: 0,
    latitude: 0,
    city: '',
    province: '',
    country: '',
    default: false,
  }

  const [addressData, setAddressData] = useState(address)

  const onRemove = route.params?.onRemove || (() => {})
  const onSubmit = route.params?.onSubmit || (() => {})

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)

  const handleRemove = () => {
    setIsConfirmModalVisible(true)
  }

  const handleMapLocationChange = location => {
    setAddressData({ ...addressData, ...address, ...location })
  }

  const handleSubmit = () => {
    onSubmit(address, addressData)
  }

  const showMapLocation = () => {
    navigation.navigate('map-location', {
      address: addressData,
      onSelect: handleMapLocationChange,
    })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          padding: 24,
        }}>
        <ScreenHeaderTitle
          title={route.params?.address ? 'Edit Address' : 'Add an Address'}
          close={navigation.goBack}
        />

        <FloatingAppInput
          value={addressData.name}
          onChangeText={name => setAddressData({ ...addressData, name })}
          label="Name"
          customStyle={{
            marginBottom: normalize(16),
            marginTop: normalize(24),
          }}
          placeholder="ex. Work, School, Other"
        />

        <View style={{ flex: 1, position: 'relative' }}>
          <TouchableOpacity onPress={showMapLocation}>
            <FloatingAppInput
              value={addressData.full_address.replace(/(.{24})..+/, '$1...')}
              label="Address"
              editable={false}
              customStyle={{ marginBottom: normalize(16) }}
              onPress={showMapLocation}
              onTouchStart={showMapLocation}
            />
            <View
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
              }}>
              <ArrowRight height={normalize(24)} width={normalize(24)} />
            </View>
          </TouchableOpacity>

          <FloatingAppInput
            value={addressData.details}
            label="Address Details"
            placeholder="ex. House, Floor, Unit Number"
            customStyle={{ marginBottom: normalize(16) }}
            onChangeText={details =>
              setAddressData({ ...addressData, details })
            }
          />

          <FloatingAppInput
            value={addressData.notes}
            label="Notes"
            placeholder="ex. Yellow Gate"
            customStyle={{ marginBottom: normalize(16) }}
            onChangeText={notes => setAddressData({ ...addressData, notes })}
          />

          {route.params?.address && !address?.default && (
            <TouchableOpacity onPress={handleRemove}>
              <AppText textStyle="body2" color={Colors.errColor}>
                Remove
              </AppText>
            </TouchableOpacity>
          )}

          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              bottom: 0,
            }}>
            <AppButton
              text={route.params?.address ? 'Update address' : 'Add address'}
              type="primary"
              height="xl"
              onPress={handleSubmit}
            />
          </View>
        </View>
      </View>

      {/* <Modal
        isVisible={isMapModalVisible}
        animationIn="slideInRight"
        animationInTiming={280}
        animationOut="slideOutRight"
        animationOutTiming={280}
        onBackButtonPress={() => setIsMapModalVisible(false)}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <MapLocation
          back={() => setIsMapModalVisible(false)}
          address={addressData}
          onChange={handleMapLocationChange}
        />
      </Modal> */}

      <Modal
        isVisible={isConfirmModalVisible}
        animationIn="bounceIn"
        animationInTiming={280}
        animationOut="bounceOut"
        animationOutTiming={280}
        style={{
          margin: 0,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        customBackdrop={
          <TouchableWithoutFeedback
            onPress={() => setIsConfirmModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <View
          style={{
            backgroundColor: 'white',
            height: normalize(300),
            width: normalize(300),
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}>
          <AppText textStyle="display6" customStyle={{ marginBottom: 16 }}>
            Remove this Address?
          </AppText>

          <AppText
            textStyle="caption"
            customStyle={{ textAlign: 'center' }}
            customStyle={{ marginBottom: 16 }}>
            Are you sure you want to remove this address?
          </AppText>

          <TouchableOpacity
            onPress={() => {
              setIsConfirmModalVisible(false)
              onRemove(address)
            }}
            style={{
              backgroundColor: Colors.yellow2,
              paddingVertical: 14,
              width: '100%',
              alignItems: 'center',
              marginBottom: 16,
              borderRadius: 4,
            }}>
            <AppText textStyle="button2">Remove</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsConfirmModalVisible(false)}
            style={{
              paddingVertical: 14,
              width: '100%',
              alignItems: 'center',
            }}>
            <AppText textStyle="button2" color={Colors.contentOcean}>
              Cancel
            </AppText>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default AddAddressScreen
