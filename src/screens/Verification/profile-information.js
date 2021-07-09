import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native'
import Modal from 'react-native-modal'
import {
  AppText,
  PaddingView,
  AppButton,
  ScreenHeaderTitle,
  FloatingAppInput,
  TransitionIndicator,
  AppRadio,
} from '@/components'
import { Colors, normalize } from '@/globals'
import AppColor from '@/globals/Colors'
import { Calendar, ArrowDown, Icons } from '@/assets/images/icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import GenderList from '../Profile/components/EditProfile/Gender'
import { UserContext } from '@/context/UserContext'
import { parse, format } from 'date-fns/esm'
import VF from '@/components/AppInput/ValidationFunctions'
import Api from '@/services/Api'
import { iconSize } from '@/globals/Utils'

/** @param {import('@react-navigation/stack').StackScreenProps<{}, 'ProfileInformation'>} param0 */
const ProfileInformationScreen = ({ navigation }) => {
  const { user, setUserInfo } = useContext(UserContext)

  const [errors, setErrors] = useState({
    username: '',
    email: '',
  })

  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    birthDate: format(new Date(), 'MM/dd/yyyy'),
    email: '',
    username: '',
    gender: '',
    addresses: [],
  })

  const [datePickerValue, setDatePickerValue] = useState(
    parse(formData.birthDate, 'MM/dd/yyyy', new Date())
  )

  const [isLoading, setIsLoading] = useState(true)
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false)
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
  const handleBirthDateChange = (event, value) => {
    setIsDatePickerVisible(Platform.OS === 'ios')
    setFormData({
      ...formData,
      birthDate: format(new Date(value) || new Date(), 'MM/dd/yyyy'),
    })
  }

  const handleUsernameChange = async value => {
    setFormData({
      ...formData,
      username: value,
    })
    try {
      await VF.usernameValidator(value)
      setErrors(errors => ({ ...errors, username: '' }))
    } catch (error) {
      setErrors(errors => ({ ...errors, username: error }))
    }
  }

  const handleEmailChange = async value => {
    setFormData({
      ...formData,
      email: value,
    })
    try {
      await VF.emailValidator(value)
      setErrors(errors => ({ ...errors, email: '' }))
    } catch (error) {
      setErrors(errors => ({ ...errors, email: error }))
    }
  }

  const handleDefaultAddressChange = _address => {
    const addresses = formData.addresses
    const index = addresses.indexOf(_address)

    if (!~index) return
    const defaultAddress = addresses.find(address => address.default)
    delete defaultAddress.default

    addresses[index].default = true

    setFormData(previousValue => ({
      ...previousValue,
      addresses,
    }))
  }

  const handleRemoveAddress = address => {
    const addresses = formData.addresses
    const index = addresses.indexOf(address)

    if (!~index) return
    addresses.splice(index, 1)
    setFormData(previousValue => ({
      ...previousValue,
      addresses,
    }))
    navigation.goBack()
  }

  const handleSubmitAddress = (address, newValue) => {
    const addresses = formData.addresses

    const index = addresses.indexOf(address)
    if (~index) addresses[index] = newValue
    else addresses.push({ ...newValue })
    setFormData(previousValue => ({
      ...previousValue,
      addresses,
    }))
    navigation.goBack()
  }

  const hasErrors = () => Object.values(errors).some(error => error.length)
  const handleSubmit = async () => {
    const {
      birthDate,
      displayName,
      email,
      fullName,
      gender,
      username,
      addresses,
    } = formData

    try {
      await Api.updateUser({
        uid: user.uid,
        body: {
          birth_date: birthDate,
          display_name: displayName,
          email,
          full_name: fullName,
          gender,
          username,
          addresses,
        },
      })
      navigation.goBack()
    } catch (error) {
      console.log(error.message || error)
    }
  }

  const getUserInfo = async () => {
    const response = await Api.getUser({ uid: user.uid })
    const {
      full_name,
      display_name,
      username,
      email,
      birth_date,
      gender,
      addresses,
    } = response.data

    const { account, ...userInfo } = response.data
    setUserInfo(userInfo)
    setFormData({
      fullName: full_name,
      displayName: display_name || full_name,
      birthDate: format(
        birth_date ? new Date(birth_date) : new Date(),
        'MM/dd/yyyy'
      ),
      email,
      username,
      gender,
      addresses,
    })
    setDatePickerValue(
      birth_date ? parse(birth_date, 'MM/dd/yyyy', new Date()) : new Date()
    )
    setIsLoading(false)
  }

  useEffect(() => {
    if (!isDatePickerVisible) Keyboard.dismiss()
  }, [isDatePickerVisible])

  useEffect(() => {
    formData.birthDate &&
      setDatePickerValue(parse(formData.birthDate, 'MM/dd/yyyy', new Date()))
  }, [formData.birthDate])

  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TransitionIndicator
        loading={isLoading}
        backdropStyle={{ backgroundColor: '#fff' }}
      />
      <PaddingView paddingSize={3}>
        <ScreenHeaderTitle
          title="Profile Information"
          close={navigation.goBack}
        />
      </PaddingView>

      <KeyboardAwareScrollView
        style={{ backgroundColor: Colors.neutralsZircon }}
        extraScrollHeight={40}
        keyboardOpeningTime={50}>
        <View
          style={[
            styles.contentWrapper,
            {
              borderTopEndRadius: 0,
              borderTopStartRadius: 0,
            },
          ]}>
          <PaddingView paddingSize={3}>
            <AppText textStyle="body1" customStyle={styles.customHeading}>
              Public Profile
            </AppText>
            <FloatingAppInput
              label="Display Name"
              value={formData.displayName}
              onChangeText={displayName =>
                setFormData({
                  ...formData,
                  displayName,
                })
              }
              customStyle={styles.customInput}
            />
            <AppText
              textStyle="caption"
              color={Colors.contentPlaceholder}
              customStyle={{ marginBottom: 25 }}>
              Help people discover your account by using a name that describes
              you or your service. This could be the name of your business, or
              your nickname.
            </AppText>
            <AppText
              textStyle="caption"
              color={Colors.contentPlaceholder}
              customStyle={{ marginBottom: 16 }}>
              You can only change your Display Name twice every 14 days.
            </AppText>
            <FloatingAppInput
              label="Full name"
              value={formData.fullName}
              onChangeText={fullName =>
                setFormData({
                  ...formData,
                  fullName,
                })
              }
              customStyle={styles.customInput}
            />

            <FloatingAppInput
              value={formData.username}
              onChangeText={handleUsernameChange}
              label="Username"
              customStyle={styles.customInput}
            />
            <View style={{ flexDirection: 'row' }}>
              <AppText textStyle="caption" color={Colors.contentPlaceholder}>
                servbees.com/
              </AppText>
              <AppText textStyle="caption2" color={Colors.contentPlaceholder}>
                {formData.username || 'username'}
              </AppText>
            </View>
            <AppText textStyle="caption" color={Colors.contentPlaceholder}>
              Only use characters, numbers, and a dot (.)
            </AppText>
          </PaddingView>
        </View>

        <View style={styles.contentWrapper}>
          <PaddingView paddingSize={3}>
            <AppText textStyle="body1" customStyle={styles.customHeading}>
              Address
            </AppText>
            <AppText
              textStyle="body2"
              color={Colors.contentPlaceholder}
              customStyle={{ marginBottom: 16 }}>
              Choose your default address. You can also save multiple addresses.
            </AppText>

            {formData.addresses.map((address, index) => (
              <View
                key={index}
                style={[
                  styles.address,
                  index && {
                    borderTopWidth: 1,
                    borderTopColor: Colors.neutralsGainsboro,
                  },
                ]}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}>
                  <AppRadio
                    value={address.default}
                    valueChangeHandler={() =>
                      handleDefaultAddressChange(address)
                    }
                    style={{
                      backgroundColor: Colors.neutralsWhite,
                      paddingLeft: 0,
                      margin: 0,
                    }}
                  />
                </View>

                <TouchableOpacity
                  style={{
                    flex: 8,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}
                  onPress={() => {
                    navigation.navigate('add-address', {
                      address,
                      onSubmit: handleSubmitAddress,
                      onRemove: handleRemoveAddress,
                    })
                  }}>
                  <AppText textStyle="body1medium">
                    {address.name || 'Home'}
                  </AppText>
                  <AppText textStyle="caption">{address.full_address}</AppText>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                navigation.push('add-address', {
                  onSubmit: handleSubmitAddress,
                  onRemove: handleRemoveAddress,
                })
              }}>
              <Icons.CircleAdd
                style={{ marginRight: normalize(8), color: Colors.link }}
                {...iconSize(24)}
              />
              <AppText textStyle="body2" color={Colors.contentOcean}>
                Add an Address
              </AppText>
            </TouchableOpacity>
          </PaddingView>
        </View>

        <View
          style={[
            styles.contentWrapper,
            {
              borderBottomEndRadius: 0,
              borderBottomStartRadius: 0,
              marginBottom: 0,
            },
          ]}>
          <PaddingView paddingSize={3}>
            <AppText textStyle="body1" customStyle={styles.customHeading}>
              Personal Information
            </AppText>
            <AppText
              textStyle="body2"
              color={Colors.contentPlaceholder}
              customStyle={{ marginBottom: 16 }}>
              This won't be part of your public profile
            </AppText>
            <View>
              <FloatingAppInput
                selectTextOnFocus={false}
                value={formData.email}
                label="Email"
                keyboardType="email-address"
                customStyle={styles.customInput}
                onChangeText={handleEmailChange}
              />
            </View>
            <View style={{ position: 'relative' }}>
              <View pointerEvents="none">
                <FloatingAppInput
                  value={formData.birthDate}
                  label="Birthday"
                  customStyle={{ marginBottom: normalize(16) }}
                />
              </View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                }}
                onPress={() => setIsDatePickerVisible(!isDatePickerVisible)}>
                <Calendar height={normalize(24)} width={normalize(24)} />
              </TouchableOpacity>
              {isDatePickerVisible && (
                <DateTimePicker
                  value={datePickerValue}
                  mode="date"
                  display="default"
                  onChange={handleBirthDateChange}
                />
              )}
            </View>
            <View style={{ position: 'relative' }}>
              <View pointerEvents="none">
                <FloatingAppInput
                  value={formData.gender}
                  label="Gender"
                  customStyle={{ marginBottom: normalize(16) }}
                />
              </View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                }}
                onPress={() => setIsGenderModalVisible(true)}>
                <ArrowDown height={normalize(24)} width={normalize(24)} />
              </TouchableOpacity>
            </View>
            <AppButton
              text="Verify"
              type="Save"
              height="xl"
              disabled={hasErrors()}
              customStyle={{
                ...styles.customButtonStyle,
                backgroundColor: hasErrors()
                  ? AppColor.buttonDisable
                  : AppColor.primaryYellow,

                borderColor: hasErrors()
                  ? AppColor.buttonDisable
                  : AppColor.primaryYellow,
              }}
              onPress={handleSubmit}
            />
          </PaddingView>
        </View>
      </KeyboardAwareScrollView>
      <Modal
        isVisible={isGenderModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={250}
        animationOutTiming={200}
        onSwipeComplete={() => setIsGenderModalVisible(false)}
        swipeDirection="down"
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        customBackdrop={
          <TouchableWithoutFeedback
            onPress={() => setIsGenderModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <View>
          <GenderList
            value={formData.gender}
            onChange={gender => {
              setFormData({
                ...formData,
                gender,
              })
              setIsGenderModalVisible(false)
            }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalHeader: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 32,
  },
  customInput: {
    marginBottom: normalize(16),
  },
  customHeading: {
    marginBottom: normalize(16),
  },
  contentWrapper: {
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 15,
    marginBottom: 8,
  },
  customButtonStyle: {
    borderWidth: 1.5,
    marginBottom: 16,
    borderRadius: 4,
  },
  address: {
    flexDirection: 'row',
    paddingVertical: normalize(16),
  },
})

export default ProfileInformationScreen
