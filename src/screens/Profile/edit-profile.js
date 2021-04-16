import {
  AppButton,
  AppInput,
  AppRadio,
  ScreenHeaderTitle,
  TransitionIndicator,
} from '@/components'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Modal from 'react-native-modal'
import GenderList from '../Profile/components/EditProfile/Gender'

import ImagePicker from 'react-native-image-crop-picker'
import { Colors, normalize } from '@/globals'
import { Images } from '@/assets/images'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'

import Svg, {
  ClipPath,
  Defs,
  G,
  Image as SvgImage,
  Path,
  Polygon,
  Rect,
  Mask,
} from 'react-native-svg'
import { ArrowDown, Calendar, CircleAdd, Icons } from '@/assets/images/icons'
import { parse, format } from 'date-fns/esm'
import DateTimePicker from '@react-native-community/datetimepicker'
import Api from '@/services/Api'
import ImageApi from '@/services/image-api'

/**
 * @typedef {object} EditProfileScreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {EditProfileScreenProps} EditProfileScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'EditProfileScreen'>} param0 */
const EditProfileScreen = ({ navigation, route }) => {
  const { user, userInfo } = useContext(UserContext)
  const { setNeedsRefresh } = useContext(Context)
  const [isLoading, setIsLoading] = useState(false)
  const [coverPhotoURI, setCoverPhotoURI] = useState(null)
  const [currentCoverPhoto, setCurrentCoverPhoto] = useState(null)
  const [profilePhotoURI, setProfilePhotoURI] = useState(null)
  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null)
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false)
  const [isValidUsername, setIsValidUsername] = useState(true)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  const [formData, setFormData] = useState({
    displayName: '',
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    birthDate: format(new Date(), 'MM/dd/yyyy'),
    gender: '',
    addresses: [],
  })

  const [datePickerValue, setDatePickerValue] = useState(
    parse(formData.birthDate, 'MM/dd/yyyy', new Date())
  )
  const [dirtyStates, setDirtyStates] = useState([])
  const [errors, setErrors] = useState({
    displayName: '',
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
  })

  const initialize = async () => {
    const {
      display_name,
      full_name,
      birth_date,
      addresses,
      gender,
      username,
      phone_number,
      email,
      cover_photo,
      profile_photo,
    } = userInfo

    setFormData({
      displayName: display_name || '',
      fullName: full_name || '',
      username: username || '',
      email: email || '',
      phoneNumber: phone_number || '',
      addresses: addresses || [],
      gender,
      birthDate: format(
        birth_date ? new Date(birth_date) : new Date(),
        'MM/dd/yyyy'
      ),
    })

    if (cover_photo) {
      const url =
        (await ImageApi.getUrl({ path: cover_photo, size: '375x157' })) ||
        (await ImageApi.getUrl({ path }))
      setCurrentCoverPhoto(url)
    }

    if (profile_photo) {
      const url =
        (await ImageApi.getUrl({ path: profile_photo, size: '128x128' })) ||
        (await ImageApi.getUrl({ path }))
      setCurrentProfilePhoto(url)
    }
  }

  const checkErrors = (checkDirty = true) => {
    const errors = {
      displayName: '',
      fullName: '',
      username: '',
      email: '',
      phoneNumber: '',
      gender: '',
    }

    if (
      (checkDirty ? dirtyStates.includes('fullName') : true) &&
      !formData.fullName.length
    )
      errors.fullName = 'This field is required'
    if (
      (checkDirty ? dirtyStates.includes('username') : true) &&
      !formData.username.length
    )
      errors.username = 'This field is required'

    if (
      (checkDirty ? dirtyStates.includes('email') : true) &&
      formData.email.length &&
      !/^\S+@\S+$/.test(formData.email)
    )
      errors.email = 'Invalid email'

    if (
      (checkDirty ? dirtyStates.includes('phoneNumber') : true) &&
      formData.phoneNumber &&
      !/^(09|\+639)\d{9}$/.test(formData.phoneNumber)
    )
      errors.phoneNumber = 'Invalid phone number'

    if (
      (checkDirty ? dirtyStates.includes('gender') : true) &&
      !formData.gender?.length
    )
      errors.gender = 'This field is required'

    setErrors(errors)
    return errors
  }

  const hasErrors = errors => {
    return Object.values(errors).some(error => error.length)
  }

  const handleValidateUsername = useCallback(async username => {
    if (/^([a-zA-Z0-9_.]){0,30}$/.test(username)) {
      setFormData(data => ({ ...data, username }))
      setDirtyStates([...new Set([...dirtyStates, 'username'])])
      setIsValidUsername(true)
      setIsCheckingUsername(false)
    }
  }, [])

  const validateWord = async username => {
    setIsCheckingUsername(true)
    try {
      if (username.length >= 3) {
        const validateUsernameResponse = await Api.validateUsername({
          body: {
            username,
          },
        })
        if (!validateUsernameResponse.success) setIsValidUsername(false)
        setIsValidUsername(validateUsernameResponse.valid)
      } else setIsValidUsername(false)
    } catch (error) {
      setIsValidUsername(false)
    }
    setIsCheckingUsername(false)
  }

  const handleSubmit = async () => {
    if (hasErrors(checkErrors(false))) return

    setIsLoading(true)
    try {
      const profilePhotoRef = profilePhotoURI?.length
        ? await ImageApi.upload({
            uri: profilePhotoURI,
            type: 'profile',
            uid: user.uid,
          })
        : null

      const coverPhotoRef = coverPhotoURI?.length
        ? await ImageApi.upload({
            uri: coverPhotoURI,
            type: 'profile-cover-photos',
            uid: user.uid,
          })
        : null

      const {
        displayName: display_name,
        fullName: full_name,
        birthDate: birth_date,
        phoneNumber: phone_number,
      } = formData

      const body = {
        ...(({ displayName, fullName, birthDate, phoneNumber, ...data }) =>
          data)(formData),
        display_name,
        full_name,
        birth_date,
        phone_number,
      }
      if (profilePhotoRef) body.profile_photo = profilePhotoRef.fullPath
      if (coverPhotoRef) body.cover_photo = coverPhotoRef.fullPath

      const response = await Api.updateUser({
        uid: user.uid,
        body,
      })
      if (!response.success) throw new Error(response.message)
      setIsLoading(false)
      setNeedsRefresh(true)
      navigation.goBack()
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    checkErrors()
  }, [formData, dirtyStates])

  useEffect(() => {
    formData.birthDate &&
      setDatePickerValue(parse(formData.birthDate, 'MM/dd/yyyy', new Date()))
  }, [formData.birthDate])

  useEffect(() => {
    initialize()
  }, [])

  const onSelectImagePress = async (options, cb) => {
    try {
      const response = await ImagePicker.openPicker(options)
      cb(response.path)
    } catch (error) {
      console.log(error)
    }
  }

  const renderCoverPhotoSection = () => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            onSelectImagePress(
              {
                width: normalize(400),
                height: normalize(140),
                cropping: true,
              },
              setCoverPhotoURI
            )
          }>
          {coverPhotoURI || currentCoverPhoto ? (
            <View style={styles.coverPhotoPreviewWrapper}>
              <Image
                style={styles.coverPhotoPreview}
                source={{ uri: coverPhotoURI || currentCoverPhoto }}
              />
            </View>
          ) : (
            <View style={styles.uploadCoverPhotoWrapper}>
              <Images.CameraImage
                width={normalize(56)}
                height={normalize(56)}
              />
              <Text style={styles.uploadCoverPhotoLabel}>
                Upload a Cover Photo
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </>
    )
  }

  const DefaulAvatar = () => {
    return (
      <>
        <Mask
          id="mask0"
          mask-type="alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="100"
          height="100">
          <Rect width="100" height="100" fill="#C4C4C4" />
        </Mask>
        <G mask="url(#mask0)" clipPath="url(#clip)">
          <Path
            d="M94 102L93.7135 101.258C90.7748 92.1309 86.6532 85.5119 78.1676 84.0056L60.8733 78.8336V71.2203C64.3924 68.074 66.4348 64.8313 68.367 59.0509C71.7025 59.7113 75.0673 53.6191 75.8975 49.0705C76.7277 44.5218 75.5007 41.8653 72.2241 41.0564C72.2241 40.7893 72.2241 40.5148 72.2241 40.255C72.2241 27.351 69.3294 13 50.3233 13C31.3171 13 28.4665 27.351 28.4665 40.255C28.4665 40.5148 28.4665 40.7893 28.4665 41.0564C25.2192 41.8653 23.9997 44.5811 24.7931 49.0705C25.5866 53.5598 29.0616 59.7039 32.3677 59.0509C34.2999 64.8313 36.3423 68.074 39.8614 71.2203V78.8336L21.825 83.9685C13.3395 85.4748 9.22525 92.0938 6.28653 101.258L6 102"
            fill="#CACBCC"
          />
        </G>
      </>
    )
  }

  const renderProfilePhotoSection = () => {
    return (
      <TouchableOpacity
        style={styles.profilePhotoSection}
        activeOpacity={0.7}
        onPress={() =>
          onSelectImagePress(
            {
              width: normalize(500),
              height: normalize(500),
              cropping: true,
            },
            setProfilePhotoURI
          )
        }>
        <Svg
          height={80}
          width={80}
          viewBox="0 0 100 100"
          strokeLinejoin="round">
          <Defs>
            <ClipPath id="clip">
              <Polygon
                points="45 1.33975, 46.5798 0.60307, 48.26352 0.15192, 50 0, 51.73648 0.15192, 53.4202 0.60307, 55 1.33975, 89.64102 21.33975, 91.06889 22.33956, 92.30146 23.57212, 93.30127 25, 94.03794 26.5798, 94.48909 28.26352, 94.64102 30, 94.64102 70, 94.48909 71.73648, 94.03794 73.4202, 93.30127 75, 92.30146 76.42788, 91.06889 77.66044, 89.64102 78.66025, 55 98.66025, 53.4202 99.39693, 51.73648 99.84808, 50 100, 48.26352 99.84808, 46.5798 99.39693, 45 98.66025, 10.35898 78.66025, 8.93111 77.66044, 7.69854 76.42788, 6.69873 75, 5.96206 73.4202, 5.51091 71.73648, 5.35898 70, 5.35898 30, 5.51091 28.26352, 5.96206 26.5798, 6.69873 25, 7.69854 23.57212, 8.93111 22.33956, 10.35898 21.33975"
                strokeLinejoin="round"
              />
            </ClipPath>
          </Defs>

          {profilePhotoURI || currentProfilePhoto ? (
            <SvgImage
              width="100%"
              height="100%"
              href={profilePhotoURI || currentProfilePhoto}
              style={{ backgroundColor: Colors.buttonDisable }}
              clipPath="url(#clip)"
            />
          ) : (
            <DefaulAvatar />
          )}

          <Rect
            clipPath="url(#clip)"
            width={'100%'}
            height={'100%'}
            fill="#1f1a54"
            opacity={0.4}
          />
          <G transform="translate(32,32)">
            <Icons.Camera height={normalize(32)} width={normalize(32)} />
          </G>
        </Svg>
        <Text style={styles.uploadProfilePhotoLabel}>
          Tap Image to change Profile Picture
        </Text>
      </TouchableOpacity>
    )
  }

  const renderNameSection = () => {
    return (
      <>
        <View style={styles.inputWrapper}>
          <AppInput
            value={formData.displayName}
            label="Display Name"
            onChangeText={displayName => {
              setFormData(data => ({ ...data, displayName }))
              setDirtyStates([...new Set([...dirtyStates, 'displayName'])])
            }}
            onBlurInput={() => {
              setDirtyStates([...new Set([...dirtyStates, 'displayName'])])
            }}
            error={errors.displayName.length}
            customLabelStyle={
              errors.displayName.length ? { color: Colors.red } : {}
            }
            debounce={false}
          />
          <Text style={styles.errorMessage}>{errors.displayName}</Text>
        </View>
        <View>
          <Text style={styles.nameSectionInfo}>
            Help people discover your account by using a name that describes you
            or your service. This could be the name of your business, or your
            nickname.{' '}
          </Text>
          <Text
            style={[styles.nameSectionInfo, { marginVertical: normalize(18) }]}>
            You can only change your Display Name twice every 14 days.
          </Text>
        </View>

        <View style={styles.inputWrapper}>
          <AppInput
            value={formData.fullName}
            label="Full Name"
            onChangeText={fullName => {
              setFormData(data => ({ ...data, fullName }))
              setDirtyStates([...new Set([...dirtyStates, 'fullName'])])
            }}
            onBlurInput={() => {
              setDirtyStates([...new Set([...dirtyStates, 'fullName'])])
            }}
            error={errors.fullName.length}
            customLabelStyle={
              errors.fullName.length ? { color: Colors.red } : {}
            }
            debounce={false}
          />
          <Text style={styles.errorMessage}>{errors.fullName}</Text>
        </View>

        <View style={[styles.inputWrapper]}>
          <AppInput
            value={formData.username}
            label="Username"
            onChangeText={username => {
              handleValidateUsername(username)
            }}
            onBlurInput={() => {
              setDirtyStates([...new Set([...dirtyStates, 'username'])])
              validateWord(formData.username)
            }}
            error={
              errors.username.length ||
              (!isValidUsername && !isCheckingUsername)
            }
            customLabelStyle={
              errors.username.length ||
              (!isValidUsername && !isCheckingUsername)
                ? { color: Colors.red }
                : {}
            }
            autoCapitalize="none"
            autoCorrect={false}
            debounce={false}
          />
          <Text style={styles.errorMessage}>
            {!isValidUsername && !isCheckingUsername
              ? "This username isn't allowed. Try another one."
              : errors.username}
          </Text>
        </View>
      </>
    )
  }

  const renderAddressesSection = () => {
    const handleSubmitAddress = (address, newValue) => {
      const addresses = [...formData.addresses]

      const index = addresses.indexOf(address)
      if (~index) addresses[index] = newValue
      else addresses.push({ ...newValue })
      setFormData(data => ({ ...data, addresses }))
      navigation.goBack()
    }

    const handleRemoveAddress = address => {
      const addresses = [...formData.addresses]
      const index = addresses.indexOf(address)

      if (!~index) return
      addresses.splice(index, 1)
      setFormData(data => ({ ...data, addresses }))
      navigation.goBack()
    }

    const handleDefaultAddressChange = _address => {
      const addresses = [...formData.addresses]
      const index = addresses.indexOf(_address)

      if (!~index) return
      const defaultAddress = addresses.find(address => address.default)
      defaultAddress && delete defaultAddress.default

      addresses[index].default = true
      setFormData(data => ({ ...data, addresses }))
    }

    const handleAddAddressPress = address => {
      navigation.navigate('NBTScreen', {
        screen: 'Verification',
        params: {
          screen: 'add-address',
          params: {
            address,
            onSubmit: handleSubmitAddress,
            onRemove: handleRemoveAddress,
          },
        },
      })
    }

    return (
      <View>
        <Text style={[styles.sectionTitle, { marginBottom: normalize(4) }]}>
          Address
        </Text>
        <Text style={styles.sectionLabel}>
          Choose your default address. You can also save multiple addresses.
        </Text>

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
            <View style={styles.addressItem}>
              <AppRadio
                style={styles.addressRadio}
                value={address.default}
                valueChangeHandler={() => handleDefaultAddressChange(address)}
              />
            </View>

            <TouchableOpacity
              style={{
                flex: 8,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
              onPress={() => {
                handleAddAddressPress(address)
              }}>
              <Text style={styles.addressName}>{address.name || 'Home'}</Text>
              <Text style={styles.fullAddress}>{address.full_address}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.buttonLink}
          onPress={() => handleAddAddressPress()}>
          <CircleAdd width={normalize(24)} height={normalize(24)} />
          <Text style={styles.addButtonLinkLabel}>Add an Address</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderPersonalInformationSection = () => {
    const handleBirthDateChange = (event, value) => {
      setIsDatePickerVisible(Platform.OS === 'ios')
      if (!value) return
      setFormData({
        ...formData,
        birthDate: format(new Date(value) || new Date(), 'MM/dd/yyyy'),
      })
    }
    return (
      <View>
        <Text style={[styles.sectionTitle, { marginBottom: normalize(4) }]}>
          Personal Information
        </Text>
        <Text style={[styles.sectionLabel, { marginBottom: normalize(16) }]}>
          This won’t be part of your public profile.
        </Text>

        <View style={styles.inputWrapper}>
          <AppInput
            value={formData.email}
            label="Email"
            onChangeText={email => {
              setFormData(data => ({ ...data, email }))
              setDirtyStates([...new Set([...dirtyStates, 'email'])])
            }}
            onBlurInput={() => {
              setDirtyStates([...new Set([...dirtyStates, 'email'])])
            }}
            error={errors.email.length}
            customLabelStyle={errors.email.length ? { color: Colors.red } : {}}
            debounce={false}
            keyboardType={'email-address'}
          />
          <Text style={styles.errorMessage}>{errors.email}</Text>
        </View>

        <View style={styles.inputWrapper}>
          <AppInput
            value={formData.phoneNumber}
            label="Mobile Number"
            onChangeText={phoneNumber => {
              setFormData(data => ({ ...data, phoneNumber }))
              setDirtyStates([...new Set([...dirtyStates, 'phoneNumber'])])
            }}
            onBlurInput={() => {
              setDirtyStates([...new Set([...dirtyStates, 'phoneNumber'])])
            }}
            error={errors.phoneNumber.length}
            customLabelStyle={
              errors.phoneNumber.length ? { color: Colors.red } : {}
            }
            debounce={false}
            keyboardType={'phone-pad'}
          />
          <Text style={styles.errorMessage}>{errors.phoneNumber}</Text>
        </View>

        <View style={styles.inputWrapper}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsDatePickerVisible(!isDatePickerVisible)}>
            <AppInput
              value={formData.birthDate}
              label="Birthday"
              debounce={false}
              onTouchStart={() => setIsDatePickerVisible(!isDatePickerVisible)}
              editable={false}
              inputStyle={{ color: Colors.contentEbony }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.inputButton}
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

        <View style={styles.inputWrapper}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsGenderModalVisible(true)}>
            <AppInput
              value={formData.gender}
              label="Gender"
              debounce={false}
              error={errors.gender?.length}
              customLabelStyle={
                errors.gender?.length ? { color: Colors.red } : {}
              }
              onTouchStart={() => setIsGenderModalVisible(true)}
              editable={false}
              inputStyle={{ color: Colors.contentEbony }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.inputButton}
            activeOpacity={1}
            onPress={() => setIsGenderModalVisible(true)}>
            <ArrowDown height={normalize(24)} width={normalize(24)} />
          </TouchableOpacity>
          <Text style={styles.errorMessage}>{errors.gender}</Text>
        </View>
      </View>
    )
  }

  const renderSubmitButton = () => {
    return (
      <View style={styles.submitButtonWrapper}>
        <AppButton
          text="Save"
          type="primary"
          height="xl"
          disabled={hasErrors(errors) || !isValidUsername || isCheckingUsername}
          customStyle={{
            ...styles.customButtonStyle,
            backgroundColor:
              hasErrors(errors) || !isValidUsername || isCheckingUsername
                ? Colors.buttonDisable
                : Colors.primaryYellow,

            borderColor:
              hasErrors(errors) || !isValidUsername || isCheckingUsername
                ? Colors.buttonDisable
                : Colors.primaryYellow,
          }}
          onPress={handleSubmit}
        />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <TransitionIndicator loading={isLoading} />
      <ScreenHeaderTitle
        paddingSize={3}
        title="Edit Profile"
        close={navigation.goBack}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        extraHeight={40}
        keyboardOpeningTime={50}>
        <View
          style={[
            styles.section,
            {
              borderTopEndRadius: 0,
              borderTopStartRadius: 0,
            },
          ]}>
          {renderCoverPhotoSection()}
          {renderProfilePhotoSection()}
          {renderNameSection()}
        </View>
        <View style={[styles.section, { paddingBottom: normalize(12) }]}>
          {renderAddressesSection()}
        </View>
        <View style={[styles.section, { marginBottom: 0 }]}>
          {renderPersonalInformationSection()}
        </View>
        {renderSubmitButton()}

        <Modal
          isVisible={isGenderModalVisible}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={180}
          animationOutTiming={150}
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
                setFormData({ ...formData, gender })
                setIsGenderModalVisible(false)
              }}
            />
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.neutralsZirconLight,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: normalize(10),
    padding: normalize(24),
    marginBottom: normalize(8),
  },
  uploadCoverPhotoWrapper: {
    height: normalize(114),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.neutralGray,
    borderRadius: normalize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPhotoPreviewWrapper: {
    height: normalize(114),
    borderWidth: 0,
    borderRadius: normalize(4),
    overflow: 'hidden',
  },
  coverPhotoPreview: {
    flex: 1,
  },
  uploadCoverPhotoLabel: {
    color: Colors.link,
    fontSize: normalize(14),
    lineHeight: normalize(21),
    fontFamily: 'RoundedMplus1c-Regular',
    letterSpacing: 0.25,
  },
  profilePhotoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(16),
  },
  uploadProfilePhotoLabel: {
    flex: 1,
    color: Colors.link,
    fontSize: normalize(12),
    lineHeight: normalize(18),
    fontFamily: 'RoundedMplus1c-Regular',
    letterSpacing: 0.4,
    marginLeft: normalize(16),
  },
  errorMessage: {
    bottom: 3,
    color: Colors.secondaryBrinkPink,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    margin: 0,
    padding: 0,
    position: 'absolute',
  },
  inputWrapper: {
    paddingBottom: normalize(24),
    position: 'relative',
  },
  nameSectionInfo: {
    color: Colors.placeholderTextColor,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    lineHeight: normalize(18),
    letterSpacing: 0.4,
  },
  sectionTitle: {
    color: Colors.contentEbony,
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(16),
    lineHeight: normalize(24),
  },
  sectionLabel: {
    color: Colors.placeholderTextColor,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    letterSpacing: 0.25,
  },
  addButtonLinkLabel: {
    color: Colors.link,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    letterSpacing: 0.25,
    marginLeft: normalize(12),
  },
  buttonLink: {
    flexDirection: 'row',
    paddingVertical: normalize(12),
  },
  address: {
    flexDirection: 'row',
    paddingVertical: normalize(16),
  },
  addressItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  addressRadio: {
    backgroundColor: Colors.neutralsWhite,
    paddingLeft: 0,
    margin: 0,
  },
  addressName: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    letterSpacing: 0.4,
  },
  fullAddress: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    letterSpacing: 0.4,
  },
  inputButton: {
    position: 'absolute',
    top: normalize(12),
    right: normalize(12),
  },
  submitButtonWrapper: {
    padding: normalize(24),
    paddingTop: 0,
    backgroundColor: '#fff',
  },
})

export default EditProfileScreen
