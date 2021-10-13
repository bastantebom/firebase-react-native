import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  Text,
} from 'react-native'

import { ContactUsBee, ContactSuccess } from '@/assets/images'
import {
  EmailContactUs,
  CallContactUs,
  ContactLocation,
  Icons,
} from '@/assets/images/icons'
import { UserContext } from '@/context/UserContext'
import { normalize, Colors } from '@/globals'
import Api from '@/services/Api'
import Loader from '@/components/loader'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { iconSize, isEmail } from '@/globals/Utils'
import typography from '@/globals/typography'
import utilStyles from '@/globals/util-styles'
import TextInput from '@/components/textinput'
import Button from '@/components/Button'
import Toast from '@/components/toast'
import StatusBar from '@/components/StatusBar'

/**
 * @typedef {object} ContactUsSreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {ContactUsSreenProps} ContactUsSreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'ContactUsSreen'>} param0 */
const ContactUsSreen = ({ navigation }) => {
  const contactNumber = '+65 6988 3863'
  const contactEmail = 'hello@servbees.com'

  const { userInfo } = useContext(UserContext)
  const [isSent, setIsSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: userInfo.full_name || '',
    email: userInfo.email || '',
    message: '',
  })

  const [errors, setErrors] = useState({
    full_name: '',
    email: '',
    message: '',
  })

  const [dirtyStates, setDirtyStates] = useState([])

  const handleOnSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await Api.contactUs({ body: formData })
      if (!response.success) throw new Error(response.message)

      setFormData({ ...formData, message: '' })
      setIsSent(true)
    } catch (error) {
      console.log(error)
      Toast.show({
        label: 'Oops, something went wrong.',
        timeout: 5000,
        dismissible: true,
        type: 'error',
        screenId: 'root',
      })
    }
    setIsLoading(false)
  }

  const handlePhoneNumberPress = () => {
    Linking.openURL(`tel:${contactNumber}`)
  }

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${contactEmail}`)
  }

  const checkErrors = () => {
    const { full_name, email, message } = formData
    const errors = {
      full_name: '',
      email: '',
      message: '',
    }
    if (!full_name.length) errors.full_name = 'Full name is required.'
    if (!email.length) errors.email = 'Email is required.'
    else if (!isEmail(email)) errors.email = 'Invalid email.'
    else if (!message.length) errors.message = 'Message is required.'

    setErrors(errors)
  }

  const canSubmit = () => {
    return !Object.values(errors).some(error => error.length)
  }

  const onPrivacyPress = () => {
    const toInject = `
        document.querySelector('.show-card-mobile').style.display = 'none';
        document.querySelector('.cards-mobile').style.display = 'none';
        document.querySelector('.header').style.display = 'none';
        document.querySelector('.sub-title-holder').style.display = 'none';
        document.querySelector('.banner-wrapper').style.display = 'none';
        document.querySelector('.vector-dash').style.paddingTop = '0';
        document.querySelector('.section-cta').style.display = 'none';
        document.querySelector('.footer').style.display = 'none';
        true;
        `

    navigation.navigate('NBTScreen', {
      screen: 'profile',
      params: {
        screen: 'about',
        params: {
          screen: 'webview',
          params: {
            url: 'https://servbees.com/privacy/',
            title: 'Privacy Policy',
            injectedJavaScript: toInject,
          },
        },
      },
    })
  }

  useEffect(() => {
    checkErrors()
  }, [formData])
  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
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
              Contact Us
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          {!isSent ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={[
                  styles.section,
                  { borderTopEndRadius: 0, borderTopStartRadius: 0 },
                ]}>
                <View style={styles.imageWrapper}>
                  <ContactUsBee {...iconSize(200)} />
                </View>

                <View style={[utilStyles.row, utilStyles.alignEnd]}>
                  <EmailContactUs {...iconSize(24)} />
                  <TouchableOpacity onPress={handleEmailPress}>
                    <Text
                      style={[typography.body2, { marginLeft: normalize(8) }]}>
                      {contactEmail}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    utilStyles.row,
                    utilStyles.alignEnd,
                    { marginTop: normalize(18) },
                  ]}>
                  <CallContactUs {...iconSize(24)} />
                  <TouchableOpacity onPress={handlePhoneNumberPress}>
                    <Text
                      style={[typography.body2, { marginLeft: normalize(8) }]}>
                      {contactNumber}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={[utilStyles.row, { marginTop: normalize(18) }]}>
                  <ContactLocation {...iconSize(24)} />
                  <View style={{ marginLeft: normalize(8) }}>
                    <Text style={[typography.body2, typography.medium]}>
                      Singapore
                    </Text>
                    <Text style={typography.body2}>
                      32 Flora Drive #02-12, Singapore 50689242{'\n'}
                    </Text>
                    <Text style={[typography.body2, typography.medium]}>
                      Philippines
                    </Text>
                    <Text style={typography.body2}>
                      8/F 8 Rockwell Building, Hidalgo Drive, Rockwell Center,
                      Makati City 1210
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.section}>
                <Text
                  style={[
                    typography.subtitle1,
                    { color: Colors.primaryMidnightBlue },
                  ]}>
                  Hit buzz anytime!
                </Text>
                <Text style={[typography.body1, { marginTop: normalize(8) }]}>
                  Interested in being a partner? Thinking of offering your
                  products or services on Servbees? Have some questions? Get in
                  touch with us so we can get buzzy together!
                </Text>
                <View style={styles.formWrapper}>
                  <TextInput
                    containerStyle={[
                      styles.formInput,
                      errors.full_name.length &&
                      dirtyStates.includes('full_name')
                        ? { borderColor: Colors.secondaryBrinkPink }
                        : {},
                    ]}
                    label="Full Name"
                    value={formData.full_name}
                    onChangeText={full_name => {
                      setDirtyStates([
                        ...new Set([...dirtyStates, 'full_name']),
                      ])
                      setFormData(data => ({ ...data, full_name }))
                    }}
                    onBlur={() =>
                      setDirtyStates([
                        ...new Set([...dirtyStates, 'full_name']),
                      ])
                    }
                    message={
                      dirtyStates.includes('full_name') && errors.full_name
                    }
                    messageStyle={{ color: Colors.secondaryBrinkPink }}
                  />
                  <TextInput
                    containerStyle={[
                      styles.formInput,
                      errors.email.length && dirtyStates.includes('email')
                        ? { borderColor: Colors.secondaryBrinkPink }
                        : {},
                    ]}
                    label="Email Address"
                    value={formData.email}
                    onChangeText={email => {
                      setDirtyStates([...new Set([...dirtyStates, 'email'])])
                      setFormData(data => ({ ...data, email }))
                    }}
                    onBlur={() =>
                      setDirtyStates([...new Set([...dirtyStates, 'email'])])
                    }
                    message={dirtyStates.includes('email') && errors.email}
                    messageStyle={{ color: Colors.secondaryBrinkPink }}
                  />
                  <TextInput
                    containerStyle={{
                      ...styles.formInput,
                      ...(errors.message.length &&
                      dirtyStates.includes('message')
                        ? { borderColor: Colors.secondaryBrinkPink }
                        : {}),
                    }}
                    multiline={true}
                    numberOfLines={3}
                    label="Message"
                    value={formData.message}
                    onChangeText={message => {
                      setDirtyStates([...new Set([...dirtyStates, 'message'])])
                      setFormData(data => ({ ...data, message }))
                    }}
                    onBlur={() =>
                      setDirtyStates([...new Set([...dirtyStates, 'message'])])
                    }
                    message={dirtyStates.includes('message') && errors.message}
                    messageStyle={{ color: Colors.secondaryBrinkPink }}
                  />
                </View>
                <View
                  style={[
                    utilStyles.row,
                    { justifyContent: 'center', marginTop: normalize(36) },
                  ]}>
                  <Icons.InfoCircle style={{ color: Colors.icon }} />
                  <Text
                    style={[typography.caption, { marginLeft: normalize(10) }]}>
                    By submitting, you agree to our{' '}
                    <Text
                      style={[typography.link, typography.medium]}
                      onPress={onPrivacyPress}>
                      Privacy Policy
                    </Text>
                  </Text>
                </View>
                <View style={styles.buttonsWrapper}>
                  <Button
                    type={canSubmit() ? 'primary' : 'disabled'}
                    disabled={!canSubmit()}
                    label="Submit"
                    onPress={handleOnSubmit}
                  />
                </View>
              </View>
            </ScrollView>
          ) : (
            <SuccessMessage navigation={navigation} />
          )}
        </View>
      </View>
    </>
  )
}

const SuccessMessage = ({ navigation }) => {
  return (
    <>
      <View style={styles.successMessage}>
        <ScrollView style={styles.successMessageContent}>
          <View style={styles.imageWrapper}>
            <ContactSuccess />
            <Text
              style={[
                typography.body2narrow,
                typography.medium,
                { color: Colors.primaryMidnightBlue, marginTop: normalize(8) },
              ]}>
              Thanks for messaging us!
            </Text>
            <Text
              style={[
                typography.body2,
                typography.textCenter,
                { marginTop: normalize(8) },
              ]}>
              Your message has been successfully sent. We’ll review your inquiry
              and get back to you very soon.
            </Text>
          </View>
        </ScrollView>
        <View style={styles.buttonsWrapper}>
          <Button label="Okay" type="primary" onPress={navigation.goBack} />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
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
  imageWrapper: {
    marginBottom: normalize(24),
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: Colors.neutralsZircon,
  },
  section: {
    borderBottomEndRadius: normalize(8),
    borderTopEndRadius: normalize(8),
    borderBottomStartRadius: normalize(8),
    borderTopStartRadius: normalize(8),
    backgroundColor: '#fff',
    padding: normalize(24),
    marginBottom: normalize(8),
  },
  formWrapper: {
    marginTop: normalize(24),
  },
  formInput: {
    marginBottom: normalize(24),
  },
  buttonsWrapper: {
    marginTop: normalize(24),
  },
  successMessage: {
    backgroundColor: '#fff',
    flex: 1,
    padding: normalize(24),
  },
  successMessageContent: {
    flex: 1,
  },
})
export default ContactUsSreen
