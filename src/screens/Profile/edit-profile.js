import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { parse, format } from 'date-fns/esm'
import ImageApi from '@/services/image-api'
import { UserContext } from '@/context/UserContext'
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Colors, normalize } from '@/globals'
import TextInput from '@/components/textinput'

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
import { Icons } from '@/assets/images/icons'
import typography from '@/globals/typography'
import Loader from '@/components/loader'
import { iconSize, parseSocialLink } from '@/globals/Utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Images } from '@/assets/images'
import RadioButton from '@/components/radio-button'
import DateTimePicker from '@react-native-community/datetimepicker'
import Api from '@/services/Api'
import Modal from 'react-native-modal'
import GenderList from '../Profile/components/EditProfile/Gender'
import Button from '@/components/Button'
import utilStyles from '@/globals/util-styles'
import { PureComponent } from 'react'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import assetLoader from '@/assets/animations/asset-loader.json'
import LottieView from 'lottie-react-native'
import Toast from '@/components/toast'
import ImagePicker from 'react-native-image-crop-picker'

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
  const [isLoading, setIsLoading] = useState(false)
  const [coverPhotoURI, setCoverPhotoURI] = useState(null)
  const [currentCoverPhoto, setCurrentCoverPhoto] = useState(null)
  const [profilePhotoURI, setProfilePhotoURI] = useState(null)
  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null)
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false)
  const [isUsernameValid, setIsUsernameValid] = useState(true)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  const [formData, setFormData] = useState({
    displayName: '',
    fullName: '',
    username: '',
    description: '',
    phoneNumber: '',
    birthDate: format(new Date(), 'MM/dd/yyyy'),
    gender: '',
    addresses: [],
    links: [],
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

  const init = async () => {
    const {
      display_name,
      full_name,
      birth_date,
      addresses,
      gender,
      email,
      username,
      description,
      phone_number,
      cover_photo,
      profile_photo,
      links,
    } = userInfo

    setFormData({
      displayName: display_name || '',
      fullName: full_name || '',
      username: username || '',
      description: description || '',
      email: email || '',
      phoneNumber: phone_number?.length ? phone_number.slice(-10) : '',
      addresses: addresses || [],
      gender,
      birthDate: format(
        birth_date ? new Date(birth_date) : new Date(),
        'MM/dd/yyyy'
      ),
      links: links || [],
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

  const checkErrors = useCallback(
    (checkDirty = true) => {
      const newErrors = {
        ...errors,
        displayName: '',
        fullName: '',
        phoneNumber: '',
        gender: '',
      }

      const { fullName, phoneNumber, gender } = formData

      if (
        (checkDirty ? dirtyStates.includes('fullName') : true) &&
        !fullName.length
      )
        newErrors.fullName = 'This field is required'

      if (
        (checkDirty ? dirtyStates.includes('phoneNumber') : true) &&
        (!phoneNumber?.length || !/^\d{10}$/.test(phoneNumber))
      )
        newErrors.phoneNumber = 'Invalid phone number'

      if (
        (checkDirty ? dirtyStates.includes('gender') : true) &&
        !gender?.length
      )
        newErrors.gender = 'This field is required'

      setErrors(newErrors)
      return newErrors
    },
    [dirtyStates, formData, setErrors]
  )

  const hasErrors = useCallback(
    errors => {
      return Object.values(errors).some(error => error.length)
    },
    [errors]
  )

  const validateUsername = useMemo(
    () =>
      AwesomeDebouncePromise(async username => {
        try {
          let message = ''
          if (!/^[a-zA-Z0-9_\.]*$/.test(username)) {
            message = 'Only alphanumeric characters and _ . are allowed'
          } else if (username.length < 3) {
            message = 'Username must be at least 3 characters'
          }

          if (message.length) {
            return {
              valid: false,
              message,
            }
          }

          return await Api.validateUsername({ body: { username } })
        } catch (error) {
          console.log(error)
          return {
            valid: false,
            message: 'There was an error validating username',
          }
        }
      }, 240),
    []
  )

  const handleOnUsernameChange = useCallback(
    async username => {
      setFormData(data => ({ ...data, username }))
      setDirtyStates(dirtyStates => [...new Set([...dirtyStates, 'username'])])
      let error = ''

      setIsCheckingUsername(true)
      const response = await validateUsername(username)

      const { valid, message } = response
      error = valid ? '' : message

      setErrors(errors => {
        errors.username = error
        return errors
      })
      setIsCheckingUsername(false)
    },
    [
      setErrors,
      setFormData,
      setDirtyStates,
      validateUsername,
      setIsCheckingUsername,
    ]
  )

  const handleOnSubmit = async () => {
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
        phone_number: phone_number.length ? `+63${phone_number}` : phone_number,
      }

      if (profilePhotoRef) body.profile_photo = profilePhotoRef.fullPath
      if (coverPhotoRef) body.cover_photo = coverPhotoRef.fullPath

      const response = await Api.updateUser({
        uid: user.uid,
        body,
      })
      if (!response.success) throw new Error(response.message)
      setIsLoading(false)

      Toast.show({
        label: `Success! Your profile has been updated`,
        type: 'success',
        dismissible: true,
        timeout: 5000,
        screenId: route?.params?.['prevScreen'],
      })
      navigation.goBack()
    } catch (error) {
      if (
        error?.message &&
        error.message.includes('phone number already exists')
      )
        setErrors({
          ...errors,
          phoneNumber: 'Mobile number is already registered',
        })
      else if (['phone number'].includes(error.message))
        setErrors({ ...errors, phoneNumber: 'Invalid phone number' })
      else console.log(error)
    }
    setIsLoading(false)
  }

  const handleOnSelectImagePress = async (options, cb) => {
    try {
      const response = await ImagePicker.openPicker(options)
      cb(response.path)
    } catch (error) {
      console.log(error)
    }
  }

  const handleOnSubmitAddress = (address, newValue) => {
    const addresses = [...formData.addresses]

    const index = addresses.indexOf(address)
    if (~index) addresses[index] = newValue
    else addresses.push({ ...newValue })
    setFormData(data => ({ ...data, addresses }))
    navigation.goBack()
  }

  const handleOnAddLinkPress = useCallback(() => {
    if (formData.links.length <= 5)
      setFormData(formData => ({ ...formData, links: [...formData.links, ''] }))
  }, [setFormData, formData])

  const handleOnRemoveLinkPress = useCallback(
    index => {
      setFormData(formData => {
        const newLinks = [...formData.links]
        newLinks.splice(index, 1)
        return { ...formData, links: newLinks }
      })
    },
    [setFormData]
  )

  const handleOnLinkChange = useCallback(
    (index, url) => {
      setFormData(formData => {
        const newLinks = [...formData.links]
        newLinks[index] = url
        return { ...formData, links: newLinks }
      })
    },
    [setFormData]
  )

  const renderCoverPhotoSection = () => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            handleOnSelectImagePress(
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
              <View style={styles.editCoverPhotoButton} activeOpacity={0.7}>
                <Icons.Pencil style={{ color: '#fff' }} {...iconSize(22)} />
              </View>
            </View>
          ) : (
            <View style={styles.uploadCoverPhotoWrapper}>
              <Images.CameraImage
                width={normalize(56)}
                height={normalize(56)}
              />
              <Text style={[typography.body2, { color: Colors.link }]}>
                Upload a Cover Photo
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </>
    )
  }

  const renderProfilePhotoSection = () => {
    return (
      <TouchableOpacity
        style={styles.profilePhotoSection}
        activeOpacity={0.7}
        onPress={() =>
          handleOnSelectImagePress(
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
        <Text
          style={[
            typography.caption,
            typography.link,
            { marginLeft: normalize(16) },
          ]}>
          {profilePhotoURI || currentProfilePhoto
            ? 'Change Profile Photo'
            : 'Upload Profile Photo'}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderNameSection = () => {
    return (
      <>
        <View style={styles.inputWrapper}>
          <TextInput
            value={formData.displayName}
            label="Display Name"
            onChangeText={displayName => {
              setFormData(data => ({ ...data, displayName }))
              setDirtyStates([...new Set([...dirtyStates, 'displayName'])])
            }}
            onBlurInput={() => {
              setDirtyStates([...new Set([...dirtyStates, 'displayName'])])
            }}
            error={
              dirtyStates.includes('displayName') && errors.displayName.length
            }
            errorMessage={
              dirtyStates.includes('displayName') && errors.displayName
            }
          />
        </View>
        <View>
          <Text style={[typography.caption, { marginBottom: normalize(18) }]}>
            Help people discover your account by using a name that describes you
            or your service. This could be the name of your business, or your
            nickname.{' '}
          </Text>
          {/* <Text style={[typography.caption, { marginVertical: normalize(18) }]}>
            You can only change your Display Name twice every 14 days.
          </Text> */}
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            value={formData.fullName}
            label="Full Name"
            onChangeText={fullName => {
              setFormData(data => ({ ...data, fullName }))
              setDirtyStates([...new Set([...dirtyStates, 'fullName'])])
            }}
            onBlurInput={() => {
              setDirtyStates([...new Set([...dirtyStates, 'fullName'])])
            }}
            error={dirtyStates.includes('fullName') && errors.fullName.length}
            errorMessage={dirtyStates.includes('fullName') && errors.fullName}
          />
        </View>

        <View style={[styles.inputWrapper]}>
          <TextInput
            value={formData.username}
            label="Username"
            onChangeText={handleOnUsernameChange}
            onBlurInput={() => {
              setDirtyStates([...new Set([...dirtyStates, 'username'])])
            }}
            error={dirtyStates.includes('username') && errors.username.length}
            errorMessage={
              !isUsernameValid && !isCheckingUsername
                ? "This username isn't allowed. Try another one."
                : dirtyStates.includes('username') && errors.username
            }
            maxLength={30}
            autoCapitalize="none"
            autoCorrect={false}
            rightIcon={
              isCheckingUsername
                ? () => (
                    <View style={styles.loaderIcon}>
                      <LottieView source={assetLoader} autoPlay />
                    </View>
                  )
                : null
            }
          />
        </View>

        <View style={[styles.inputWrapper]}>
          <Text
            style={[
              typography.body2,
              typography.medium,
              {
                color: Colors.contentEbony,
                marginBottom: normalize(8),
              },
            ]}>
            About
          </Text>
          <TextInput
            value={formData.description}
            label="Description"
            onChangeText={description =>
              setFormData(data => ({ ...data, description }))
            }
            multiline={true}
            maxLength={600}
            autoHeight
            minLines={6}
            maxLines={12}
            displayLength={true}
          />
        </View>
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

  const renderAddressesSection = () => {
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
            onSubmit: handleOnSubmitAddress,
            onRemove: handleRemoveAddress,
          },
        },
      })
    }

    return (
      <View>
        <Text
          style={[
            typography.body1,
            typography.medium,
            { marginBottom: normalize(4) },
          ]}>
          Address
        </Text>
        <Text style={[typography.body2, { color: Colors.contentPlaceholder }]}>
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
              <RadioButton
                style={styles.addressRadio}
                value={address.default}
                onPress={() => handleDefaultAddressChange(address)}
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
              <Text style={typography.body2}>{address.name || 'Home'}</Text>
              <Text style={typography.body2}>{address.full_address}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.buttonLink}
          onPress={() => handleAddAddressPress()}>
          <Icons.CircleAdd style={{ color: Colors.link }} {...iconSize(24)} />
          <Text
            style={[
              typography.body2,
              { marginLeft: normalize(12), color: Colors.link },
            ]}>
            Add an Address
          </Text>
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
        <Text
          style={[
            typography.body1,
            typography.medium,
            { marginBottom: normalize(4) },
          ]}>
          Personal Information
        </Text>
        <Text
          style={[
            typography.body2,
            { color: Colors.contentPlaceholder, marginBottom: normalize(16) },
          ]}>
          This won’t be part of your public profile.
        </Text>

        <View style={styles.inputWrapper}>
          <TextInput
            value={formData.email}
            label="Email"
            disabled
            editable={false}
            inputStyle={{ color: Colors.contentEbony }}
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            value={formData.phoneNumber}
            selectTextOnFocus={false}
            placeholder="10 digit phone number"
            placeholderTextColor="#A8AAB7"
            onChangeText={phoneNumber => {
              setFormData(data => ({ ...data, phoneNumber }))
              setDirtyStates([...new Set([...dirtyStates, 'phoneNumber'])])
            }}
            onBlur={() => {
              setDirtyStates([...new Set([...dirtyStates, 'phoneNumber'])])
            }}
            keyboardType="phone-pad"
            returnKeyType="done"
            message={errors.phoneNumber}
            maxLength={10}
            messageStyle={{
              color: Colors.secondaryBrinkPink,
            }}
            containerStyle={[
              errors.phoneNumber.length
                ? { borderColor: Colors.secondaryBrinkPink }
                : {},
            ]}
            inputStyle={styles.phoneNumberInputStyle}>
            <View
              style={{
                position: 'absolute',
                left: normalize(16),
                top: 0,
                bottom: 0,
                height: normalize(54),
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  typography.body1,
                  {
                    color: Colors.icon,
                    lineHeight: Platform.select({
                      android: normalize(24),
                      ios: normalize(0),
                    }),
                    paddingBottom: Platform.select({
                      android: normalize(2),
                      ios: normalize(0),
                    }),
                  },
                ]}>
                +63
              </Text>
            </View>
          </TextInput>
        </View>

        <View style={styles.inputWrapper}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsDatePickerVisible(!isDatePickerVisible)}>
            <TextInput
              value={formData.birthDate}
              label="Birthday"
              onTouchStart={() => setIsDatePickerVisible(!isDatePickerVisible)}
              editable={false}
              rightIcon={() => <Icons.Calendar {...iconSize(24)} />}
              inputStyle={{ color: Colors.contentEbony }}
            />
          </TouchableOpacity>
          {isDatePickerVisible && (
            <DateTimePicker
              value={datePickerValue}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleBirthDateChange}
              style={styles.datePicker}
            />
          )}
        </View>

        <View style={styles.inputWrapper}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsGenderModalVisible(true)}>
            <TextInput
              value={formData.gender}
              label="Gender"
              error={errors.gender?.length}
              errorMessage={errors.gender}
              onTouchStart={() => setIsGenderModalVisible(true)}
              editable={false}
              rightIcon={() => <Icons.ArrowDown {...iconSize(24)} />}
              inputStyle={{ color: Colors.contentEbony }}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderGenderModalSelection = () => {
    return (
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
    )
  }

  useEffect(() => {
    checkErrors()
  }, [formData, dirtyStates])

  useEffect(() => {
    formData.birthDate &&
      setDatePickerValue(parse(formData.birthDate, 'MM/dd/yyyy', new Date()))
  }, [formData.birthDate])

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <Loader visible={isLoading} />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>
              Edit Profile
            </Text>
          </View>
        </View>
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

          <View style={styles.section}>
            {renderPersonalInformationSection()}
          </View>

          <View style={[styles.section, styles.bottomSection]}>
            <LinksSection
              links={formData.links}
              onLinkChange={handleOnLinkChange}
              onAddLinkPress={handleOnAddLinkPress}
              onRemoveLinkPress={handleOnRemoveLinkPress}
              errors={errors.links}
            />
            <View style={styles.submitButtonWrapper}>
              <Button
                label="Save"
                type={
                  hasErrors(errors) || !isUsernameValid || isCheckingUsername
                    ? 'disabled'
                    : 'primary'
                }
                disabled={
                  hasErrors(errors) || !isUsernameValid || isCheckingUsername
                }
                onPress={handleOnSubmit}
              />
            </View>
          </View>

          {renderGenderModalSelection()}
        </KeyboardAwareScrollView>
      </View>
    </>
  )
}

class LinksSection extends PureComponent {
  render() {
    const removeLinkIcon = index => {}

    return (
      <View>
        <Text
          style={[
            typography.body1,
            typography.medium,
            { marginBottom: normalize(4) },
          ]}>
          Add Links
        </Text>
        <Text style={[typography.caption]}>
          Hey, Buzybee! Let your customers know your store or service better.
          {'\n\n'}
          Max of 5 links.
        </Text>

        <View style={{ marginTop: normalize(16) }}>
          {this.props.links.map((link, index) => {
            const icon = getUrlIcon(link)
            return (
              <TextInput
                containerStyle={{
                  marginBottom: normalize(index === 4 ? 0 : 24),
                }}
                key={index}
                onChangeText={url => this.props.onLinkChange(index, url)}
                autoCapitalize="none"
                autoCorrect={false}
                value={link}
                label={icon ? undefined : 'URL'}
                leftIcon={() => icon}
                rightIcon={() => removeLinkIcon(index)}
              />
            )
          })}
        </View>

        {this.props.links.length < 5 && (
          <TouchableOpacity
            onPress={this.props.onAddLinkPress}
            activeOpacity={0.7}
            style={[
              utilStyles.row,
              utilStyles.alignCenter,
              { marginTop: normalize(24) },
            ]}>
            <Icons.CircleAdd
              style={{ color: Colors.link, marginRight: normalize(8) }}
              {...iconSize(24)}
            />
            <Text style={[typography.body2, typography.link]}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const getUrlIcon = url => {
  const iconStyle = { color: Colors.icon }
  const urlIcons = {
    facebook: <Icons.SocialFacebook style={iconStyle} {...iconSize(24)} />,
    twitter: <Icons.SocialTwitter style={iconStyle} {...iconSize(24)} />,
    instagram: <Icons.SocialInstagram style={iconStyle} {...iconSize(24)} />,
    youtube: <Icons.SocialYoutube style={iconStyle} {...iconSize(24)} />,
    tiktok: <Icons.SocialTiktok style={iconStyle} {...iconSize(24)} />,
    vimeo: <Icons.SocialVimeo style={iconStyle} {...iconSize(24)} />,
    twitch: <Icons.SocialTwitch style={iconStyle} {...iconSize(24)} />,
    dribbble: <Icons.SocialDribbble style={iconStyle} {...iconSize(24)} />,
    medium: <Icons.SocialMedium style={iconStyle} {...iconSize(24)} />,
    github: <Icons.SocialGithub style={iconStyle} {...iconSize(24)} />,
    website: <Icons.Globe style={iconStyle} {...iconSize(24)} />,
  }

  return urlIcons[parseSocialLink(url)]
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: getStatusBarHeight(),
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
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
  bottomSection: {
    marginBottom: 0,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
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
    position: 'relative',
    height: normalize(114),
    borderWidth: 0,
    borderRadius: normalize(4),
    overflow: 'hidden',
  },
  editCoverPhotoButton: {
    position: 'absolute',
    top: normalize(10),
    right: normalize(10),
    padding: normalize(5),
    backgroundColor: 'rgba(46, 48, 52, .35)',
    borderRadius: normalize(32),
  },
  coverPhotoPreview: {
    flex: 1,
  },
  profilePhotoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(16),
  },
  inputWrapper: {
    paddingBottom: normalize(24),
    position: 'relative',
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
  inputButton: {
    position: 'absolute',
    top: normalize(12),
    right: normalize(12),
  },
  submitButtonWrapper: {
    paddingTop: normalize(24),
  },
  datePicker: {
    backgroundColor: Colors.neutralsWhite,
    marginTop: normalize(16),
  },
  loaderIcon: {
    height: normalize(24),
    width: normalize(24),
  },
  phoneNumberInputStyle: {
    marginLeft: normalize(35),
    lineHeight: Platform.select({
      android: normalize(24),
      ios: normalize(0),
    }),
  },
})

export default EditProfileScreen
