//import liraries
import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'

import {
  ScreenHeaderTitle,
  PaddingView,
  AppButton,
  FloatingAppInput,
  AppText,
  ProfileImageUpload,
  TransitionIndicator,
  AppRadio,
} from '@/components'
import { AppInput, Validator, valueHandler } from '@/components/AppInput'

import storage from '@react-native-firebase/storage'

import {
  ArrowRight,
  ArrowDown,
  Calendar,
  VerifiedGreen,
  CircleAdd,
} from '@/assets/images/icons'

import { Colors, normalize } from '@/globals'
import GenderList from './Gender'
import Modal from 'react-native-modal'
import DateTimePicker from '@react-native-community/datetimepicker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import moment from 'moment'
import ProfileInfoService from '@/services/Profile/ProfileInfo'
import CoverPhotoUpload from '@/components/ImageUpload/CoverPhotoUpload'
import AddAddress from './AddAddress'
import EditLogin from './EditLogin'
import SetPassword from './SetPassword'
// create a component
const EditProfile = ({
  toggleEditProfile,
  toggleMenu,
  triggerNotify,
  source,
}) => {
  const [addAddress, setAddAddress] = useState(false)
  const [editLogin, setEditLogin] = useState(false)
  const [provider, setProvider] = useState('')
  const has_password = false
  const [date, setDate] = useState(new Date(1598051730000))
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)
  const [genderVisible, setGenderVisible] = useState(false)
  const { userInfo, user, setUserInfo } = useContext(UserContext)
  const { setNeedsRefresh } = useContext(Context)
  const [imageSource, setImageSource] = useState(null)
  const [imageCoverSource, setImageCoverSource] = useState(null)
  const [transferred, setTransferred] = useState(0)
  const [IS_UPDATING, setIS_UPDATING] = useState(false)

  const {
    cover_photo,
    profile_photo,
    display_name,
    full_name,
    username,
    description,
    addresses,
    email,
    secondary_email,
    phone_number,
    birth_date,
    gender,
  } = userInfo

  const { uid } = user

  const [cPhoto, setCPhoto] = useState(cover_photo)
  const [pPhoto, setPPhoto] = useState(profile_photo)
  const [profilePhotoClick, setProfilePhotoClick] = useState(false)
  const [dName, setDName] = useState(display_name ? display_name : full_name)
  const [name, setName] = useState(full_name)
  const [uName, setUName] = useState(username)
  const [invalidUser, setInvalidUser] = useState(true)
  const [invalidUserFormat, setInvalidUserFormat] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState({})
  const [additional, setAdditional] = useState(null)

  const [enabled, setEnabled] = useState(false)
  const [errors, setErrors] = useState({
    dName: {
      passed: true,
      shown: false,
      message: '',
    },
    name: {
      passed: true,
      shown: false,
      message: '',
    },
    uName: {
      passed: true,
      shown: false,
      message: '',
    },
  })

  const checkErrorState = () => {
    let temp = true
    for (const [key, value] of Object.entries(errors)) {
      if (!value.passed) {
        temp = false
        setEnabled(temp)
        break
      }
      setEnabled(temp)
    }
  }

  useEffect(() => {
    checkErrorState()
  }, [errors])

  const [verified, setVerified] = useState(false)
  const [desc, setDesc] = useState(description)
  const [em, setEm] = useState(email)
  const [sEm, setSEm] = useState(secondary_email)
  const [mobile, setMobile] = useState(phone_number)
  const [bDate, setBDate] = useState(birth_date)
  const [g, setG] = useState(gender)

  const toggleAddAddress = () => {
    setAdditional(true)
    setSelectedAddress(addresses.find(address => address.default))
    setAddAddress(!addAddress)
  }

  const toggleEditLogin = prov => {
    setEditLogin(!editLogin)
    setProvider(prov)
  }

  const toggleGender = () => {
    setGenderVisible(!genderVisible)
    if (show) setShow(!show)
  }

  const showMode = currentMode => {
    setShow(true)
    setMode(currentMode)
  }

  const showDatepicker = () => {
    if (show) {
      setShow(false)
    } else {
      Keyboard.dismiss()
      showMode('date')
    }
  }

  useEffect(() => {
    let isSubscribed = true
    if (userInfo) {
      if (isSubscribed) setDateFromString()
    }
    return () => (isSubscribed = false)
  }, [])

  const setDateFromString = () => {
    if (bDate) {
      setDate(moment(new Date(bDate)).toDate())
    }
  }

  const setGenderFromModal = data => {
    const tempG =
      data === 'notsay'
        ? 'Rather not say'
        : data === 'female'
        ? 'Female'
        : 'Male'
    setG(tempG)
  }

  const setBirthday = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setDate(currentDate)
    setBDate(moment.utc(currentDate).add(1, 'day').format('MM/DD/YYYY'))
  }

  const uploadImageHandler = async image => {
    if (image) {
      const { uri } = image
      //console.log('Sa If');
      let filename = uri
      if (!Platform.OS === 'ios')
        filename = uri.substring(uri.lastIndexOf('/') + 1)
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri

      setTransferred(0)
      const task = storage().ref()
      const fileRef = task.child(`${user.uid}/display-photos/${filename}`)
      await fileRef.putFile(uploadUri)
      return Promise.resolve(await fileRef.getDownloadURL())
    } else {
      return Promise.reject('empty')
    }
  }

  const updateProfile = async () => {
    const dataToUpdate = {
      display_name: dName,
      description: desc,
      full_name: name,
      username: uName,
      birth_date: bDate,
      email: em,
      secondary_email: sEm,
      phone_number: mobile,
      gender: g,
      addresses: userInfo.addresses,
    }

    Object.keys(dataToUpdate).forEach(
      key => dataToUpdate[key] === undefined && delete dataToUpdate[key]
    )

    setIS_UPDATING(true)
    const images = [imageCoverSource, imageSource]

    const uploadProfileImagesHandler = () =>
      Promise.all(
        images.map(async image => {
          try {
            const res = await uploadImageHandler(image)
            return res
          } catch (error) {
            return error
          }
        })
      )

    await uploadProfileImagesHandler().then(response => {
      dataToUpdate.cover_photo = response[0] === 'empty' ? cPhoto : response[0]
      dataToUpdate.profile_photo =
        response[1] === 'empty' ? pPhoto : response[1]

      ProfileInfoService.updateUser(dataToUpdate, uid)
        .then(response => {
          if (response.success) {
            setIS_UPDATING(false)
            setUserInfo({ ...userInfo, ...response.data })
            setNeedsRefresh(true)
            triggerNotify(true)
            toggleEditProfile()
            if (source === 'own-menu') toggleMenu()
          } else {
            setIS_UPDATING(false)
          }
        })
        .catch(error => {
          setIS_UPDATING(false)
          console.log(error)
        })
    })
  }

  const changeDefaultAddress = selected => {
    const nAdd = [...addresses]
    nAdd.forEach((address, index) => {
      selected === index ? (address.default = true) : (address.default = false)
    })
    setUserInfo({ ...userInfo, addresses: [...nAdd] })
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <TransitionIndicator loading={IS_UPDATING} />
        <PaddingView paddingSize={3}>
          <ScreenHeaderTitle
            iconSize={16}
            title="Edit Profile"
            close={toggleEditProfile}
          />
        </PaddingView>
        <KeyboardAwareScrollView
          style={styles.container}
          extraScrollHeight={40}
          keyboardOpeningTime={50}>
          <View
            style={[
              styles.contentWrapper,
              {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                marginBottom: 0,
              },
            ]}>
            <PaddingView paddingSize={3}>
              <CoverPhotoUpload
                imgSourceHandler={imgSrc => {
                  setImageCoverSource(imgSrc)
                }}
                imgSrc={cPhoto}
              />
            </PaddingView>
          </View>
          <View
            style={[
              styles.contentWrapper,
              {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                marginBottom: 0,
              },
            ]}>
            <PaddingView paddingSize={3}>
              <View style={styles.profilePhoto}>
                <View>
                  <ProfileImageUpload
                    imgSourceHandler={imgSrc => {
                      setImageSource(imgSrc)
                      setProfilePhotoClick(false)
                    }}
                    size={80}
                    imgSrc={pPhoto}
                    profilePhotoClick={profilePhotoClick}
                    setProfilePhotoClick={setProfilePhotoClick}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setProfilePhotoClick(true)
                  }}>
                  <AppText
                    textStyle="caption"
                    color={Colors.contentOcean}
                    customStyle={{ marginLeft: normalize(8) }}>
                    Tap Image to change Profile Picture
                  </AppText>
                </TouchableOpacity>
              </View>
            </PaddingView>
          </View>
          <View style={styles.contentWrapper}>
            <PaddingView paddingSize={3}>
              <Validator errorState={errors.dName}>
                <AppInput
                  label="Display Name"
                  onChangeText={dName => {
                    setDName()
                    valueHandler(
                      dName,
                      'display_name',
                      'dName',
                      errors,
                      setErrors,
                      setDName
                    )
                  }}
                  value={dName}
                  onKeyPress={() => {
                    setErrors({
                      ...errors,
                      dName: {
                        ...errors.dName,
                        shown: false,
                      },
                    })
                  }}
                />
              </Validator>
              <AppText
                textStyle="caption"
                color={Colors.profileLink}
                customStyle={{ marginTop: normalize(5) }}>
                Help people discover your account by using a name that describes
                you or your service. This could be the name of your business, or
                your nickname.
              </AppText>
              <AppText
                textStyle="caption"
                color={Colors.profileLink}
                customStyle={{
                  marginTop: normalize(24),
                  marginBottom: normalize(5),
                }}>
                You can only change your Display Name twice every 14 days.
              </AppText>
              <Validator errorState={errors.name} style={{ marginBottom: 16 }}>
                <AppInput
                  label="Full Name"
                  onChangeText={name =>
                    valueHandler(name, '', 'name', errors, setErrors, setName)
                  }
                  value={name}
                  onKeyPress={() => {
                    setErrors({
                      ...errors,
                      name: {
                        ...errors.name,
                        shown: false,
                      },
                    })
                  }}
                />
              </Validator>
              <View style={{ position: 'relative' }}>
                <Validator
                  errorState={errors.uName}
                  style={{ marginBottom: 16 }}>
                  <AppInput
                    label="Username"
                    onChangeText={uName =>
                      valueHandler(
                        uName,
                        'username',
                        'uName',
                        errors,
                        setErrors,
                        setUName,
                        user.uid
                      )
                    }
                    value={uName}
                    onKeyPress={() => {
                      setErrors({
                        ...errors,
                        uName: {
                          ...errors.uName,
                          shown: false,
                        },
                      })
                    }}
                  />
                </Validator>
                <View style={styles.passwordToggle}>
                  {errors.uName.passed ? (
                    <VerifiedGreen
                      width={normalize(16)}
                      height={normalize(16)}
                    />
                  ) : null}
                </View>
              </View>
              {!invalidUser ? (
                <AppText textStyle="caption" customStyle={styles.errorCopy}>
                  Username has already been used
                </AppText>
              ) : null}
              <View style={{ flexDirection: 'row' }}>
                <AppText textStyle="caption">servbees.com/</AppText>
                <AppText textStyle="caption2">{uName}</AppText>
              </View>

              <AppText
                textStyle="caption"
                color={invalidUserFormat ? Colors.errorInput : ''}>
                Only use characters, numbers, dash and a dot (.){' '}
              </AppText>

              <TextInput
                value={desc}
                multiline={true}
                placeholder="Description"
                placeholderTextColor={Colors.profileLink}
                numberOfLines={Platform.OS === 'ios' ? null : 6}
                minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
                style={[styles.input]}
                onChangeText={desc => {
                  setDesc(desc)
                }}
                underlineColorAndroid={'transparent'}
                textAlignVertical="top"
              />
            </PaddingView>
          </View>
          <View style={styles.contentWrapper}>
            <PaddingView paddingSize={3}>
              <AppText
                textStyle="body1"
                customStyle={{ marginBottom: normalize(8) }}>
                Address
              </AppText>

              <AppText
                textStyle="body2"
                customStyle={{ marginBottom: normalize(8) }}>
                Choose your default address. You can also save multiple
                addresses.
              </AppText>

              {addresses.map((address, index) => {
                const customBorder =
                  index > 0
                    ? {
                        borderTopWidth: 1,
                        borderTopColor: Colors.neutralsGainsboro,
                      }
                    : {}
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 16,
                      ...customBorder,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                      }}>
                      <AppRadio
                        value={address.default}
                        valueChangeHandler={() => {
                          changeDefaultAddress(index)
                        }}
                        style={{
                          backgroundColor: Colors.neutralsWhite,
                          paddingLeft: 0,
                          margin: 0,
                        }}
                      />
                    </View>

                    <View
                      style={{
                        flex: 8,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                      }}>
                      <AppText textStyle="body1medium">
                        {address.name ? address.name : 'Home'}
                      </AppText>
                      <AppText textStyle="caption">
                        {address.full_address}
                      </AppText>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setAdditional(index)
                        setSelectedAddress(address)
                        setAddAddress(true)
                      }}
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                      }}>
                      <View>
                        <ArrowRight width={24} height={24} />
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              })}

              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={toggleAddAddress}>
                <CircleAdd width={24} height={24} />
                <AppText
                  customStyle={{ marginLeft: 12 }}
                  textStyle="body2"
                  color={Colors.contentOcean}>
                  Add an Address
                </AppText>
              </TouchableOpacity>
            </PaddingView>
          </View>
          <View
            style={[
              styles.contentWrapper,
              {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                marginBottom: 0,
              },
            ]}>
            <PaddingView paddingSize={3}>
              <AppText
                textStyle="body1"
                customStyle={{ marginBottom: normalize(8) }}>
                Personal Information
              </AppText>

              {em ? (
                <>
                  <AppText textStyle="body2">Email</AppText>
                  <AppText textStyle="body1">{em}</AppText>
                  <TouchableOpacity
                    style={{ marginTop: 8 }}
                    onPress={() => {
                      toggleEditLogin('email')
                    }}>
                    <AppText textStyle="body2" color={Colors.contentOcean}>
                      Change Email Address
                    </AppText>
                  </TouchableOpacity>
                </>
              ) : null}

              {mobile ? (
                <>
                  <AppText textStyle="body2">Mobile Number</AppText>
                  <AppText textStyle="body1">{mobile}</AppText>
                  <TouchableOpacity
                    style={{ marginTop: 8 }}
                    onPress={() => {
                      toggleEditLogin('mobile')
                    }}>
                    <AppText textStyle="body2" color={Colors.contentOcean}>
                      Change Mobile Number
                    </AppText>
                  </TouchableOpacity>
                </>
              ) : null}

              <View style={{ position: 'relative', marginTop: 16 }}>
                <FloatingAppInput
                  value={bDate}
                  label="Birthday"
                  customStyle={{ marginBottom: normalize(16) }}
                  onFocus={showDatepicker}
                  editable={false}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 12,
                    right: 12,
                  }}
                  onPress={showDatepicker}>
                  <View>
                    <Calendar height={normalize(24)} width={normalize(24)} />
                  </View>
                </TouchableOpacity>
                {show && (
                  <DateTimePicker
                    value={date}
                    mode={mode}
                    display="default"
                    onChange={setBirthday}
                  />
                )}
              </View>
              <View style={{ position: 'relative' }}>
                <FloatingAppInput
                  value={g}
                  label="Gender"
                  onFocus={toggleGender}
                  customStyle={{ marginBottom: normalize(16) }}
                  editable={false}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 12,
                    right: 12,
                  }}
                  onPress={toggleGender}>
                  <View>
                    <ArrowDown height={normalize(24)} width={normalize(24)} />
                  </View>
                </TouchableOpacity>
              </View>
            </PaddingView>
          </View>
          <View
            style={[
              styles.contentWrapper,
              {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                marginBottom: 0,
                paddingLeft: normalize(24),
                paddingRight: normalize(24),
                paddingBottom: normalize(24),
              },
            ]}>
            <AppButton
              text="Save"
              type="primary"
              height="xl"
              disabled={!enabled}
              customStyle={{
                backgroundColor: !enabled
                  ? Colors.buttonDisable
                  : Colors.primaryYellow,
                borderColor: !enabled
                  ? Colors.buttonDisable
                  : Colors.primaryYellow,
              }}
              onPress={() => updateProfile()}
            />
          </View>
        </KeyboardAwareScrollView>

        <Modal
          isVisible={addAddress}
          animationIn="slideInRight"
          animationInTiming={750}
          animationOut="slideOutRight"
          animationOutTiming={750}
          onBackButtonPress={() => setAddAddress(false)}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          <AddAddress
            toggleAddAddress={toggleAddAddress}
            address={selectedAddress}
            additional={additional}
          />
        </Modal>

        <Modal
          isVisible={genderVisible}
          animationIn="slideInUp"
          animationInTiming={500}
          animationOut="slideOutDown"
          animationOutTiming={500}
          onSwipeComplete={toggleGender}
          swipeDirection="down"
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          customBackdrop={
            <TouchableWithoutFeedback onPress={toggleGender}>
              <View style={{ flex: 1, backgroundColor: 'black' }} />
            </TouchableWithoutFeedback>
          }>
          <View>
            <GenderList
              toggleGender={toggleGender}
              setGenderValue={pGender => setGenderFromModal(pGender)}
            />
          </View>
        </Modal>

        <Modal
          isVisible={editLogin}
          animationIn="slideInRight"
          animationInTiming={750}
          animationOut="slideOutRight"
          animationOutTiming={750}
          onBackButtonPress={() => setEditLogin(false)}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          {has_password ? (
            <EditLogin
              toggleEditLogin={prov => toggleEditLogin(prov)}
              provider={provider}
            />
          ) : (
            <SetPassword
              toggleEditLogin={prov => toggleEditLogin(prov)}
              provider={provider}
            />
          )}
        </Modal>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutralsZircon,
    width: Dimensions.width,
  },
  contentWrapper: {
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 8,
    marginBottom: 6,
  },

  profilePhoto: {
    flexDirection: 'row',
    height: normalize(30),
    alignItems: 'center',
  },

  input: {
    color: Colors.contentEbony,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    letterSpacing: 0.5,
    borderColor: Colors.neutralGray,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },

  errorCopy: {
    color: Colors.errorInput,
    marginBottom: 12,
  },

  passwordToggle: {
    position: 'absolute',
    right: normalize(10),
    top: normalize(18),
  },
})

export default EditProfile
