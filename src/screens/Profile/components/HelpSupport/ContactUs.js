import React, { useState, useContext } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Linking,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import {
  ScreenHeaderTitle,
  PaddingView,
  AppText,
  AppButton,
  TransitionIndicator,
} from '@/components'
import { ContactUsBee, ContactSuccess } from '@/assets/images'
import {
  EmailContactUs,
  CallContactUs,
  ContactLocation,
  InfoGray,
} from '@/assets/images/icons'
import { UserContext } from '@/context/UserContext'
import { normalize, Colors } from '@/globals'
import FloatingAppInput from '@/components/AppInput/AppInput'
import Api from '@/services/Api'

const ContactUs = ({ toggleContactUs }) => {
  const contactNumber = '+65 6988 3863'
  const contactEmail = 'hello@servbees.com'

  const { userInfo } = useContext(UserContext)
  const [messageSuccess, setMessageSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: userInfo.full_name || '',
    email: userInfo.email || '',
    message: '',
  })

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await Api.contactUs({ body: formData })
      if (!response.success) throw new Error(response.message)

      setFormData({ ...formData, message: '' })
      setMessageSuccess(true)
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Oops, something went wrong.')
    }
    setIsLoading(false)
  }

  const handlePhoneNumberPress = () => {
    Linking.openURL(`tel:${contactNumber}`)
  }

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${contactEmail}`)
  }

  const MessageSuccess = () => {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <ScreenHeaderTitle title="Contact Us" paddingSize={3} />
        <PaddingView paddingSize={3}>
          <View
            style={{
              justifyContent: 'space-between',
              height: '83%',
            }}>
            <View style={{ alignItems: 'center' }}>
              <ContactSuccess />
              <AppText
                textStyle="body1medium"
                color={Colors.primaryMidnightBlue}
                customStyle={{
                  marginTop: normalize(32),
                  marginBottom: normalize(8),
                }}>
                Thanks for messaging us!
              </AppText>
              <AppText textStyle="body1" customStyle={{ textAlign: 'center' }}>
                Your message has been successfully sent. We’ll review your
                inquiry and get back to you very soon.{' '}
              </AppText>
            </View>
          </View>
          <AppButton text="Okay" type="primary" onPress={toggleContactUs} />
        </PaddingView>
      </View>
    )
  }

  return (
    <>
      {isLoading ? <TransitionIndicator loading={isLoading} /> : null}
      {!messageSuccess ? (
        <SafeAreaView style={{ flex: 1 }}>
          <ScreenHeaderTitle
            title="Contact Us"
            close={toggleContactUs}
            paddingSize={3}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: Colors.neutralsZircon,
            }}>
            <View style={styles.contentWrapper}>
              <PaddingView paddingSize={3} style={{ paddingTop: 0 }}>
                <View style={styles.imageWrapper}>
                  <ContactUsBee
                    width={normalize(200)}
                    height={normalize(200)}
                  />
                </View>
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <EmailContactUs
                      width={normalize(23)}
                      height={normalize(23)}
                    />
                    <TouchableOpacity onPress={handleEmailPress}>
                      <AppText
                        textStyle="body2"
                        customStyle={{ marginLeft: normalize(16) }}>
                        {contactEmail}
                      </AppText>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{ flexDirection: 'row', marginTop: normalize(20) }}>
                    <CallContactUs
                      width={normalize(18)}
                      height={normalize(18)}
                    />
                    <TouchableOpacity onPress={handlePhoneNumberPress}>
                      <AppText
                        textStyle="body2"
                        customStyle={{ marginLeft: normalize(16) }}>
                        {contactNumber}
                      </AppText>
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginTop: normalize(20) }}>
                    <View style={{ position: 'absolute' }}>
                      <ContactLocation
                        width={normalize(18)}
                        height={normalize(18)}
                      />
                    </View>
                    <View style={{ marginLeft: normalize(32) }}>
                      <AppText textStyle="body2medium">Singapore</AppText>
                      <AppText textStyle="body2">
                        Flora Drive #02-12, Singapore 50689242
                      </AppText>
                      <AppText
                        textStyle="body2medium"
                        customStyle={{ marginTop: normalize(24) }}>
                        Philippines
                      </AppText>
                      <AppText textStyle="body2">
                        8/F 8 Rockwell Building, Hidalgo Drive, Rockwell Center,
                        Makati City 1210
                      </AppText>
                    </View>
                  </View>
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
                },
              ]}>
              <PaddingView paddingSize={3}>
                <AppText
                  textStyle="subtitle1"
                  color={Colors.primaryMidnightBlue}
                  customStyle={{ marginBottom: normalize(8) }}>
                  Hit buzz anytime!
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{ marginBottom: normalize(16) }}>
                  Interested in being a partner? Thinking of offering your
                  products or services on Servbees? Have some questions? Get in
                  touch with us so we can get buzzy together!
                </AppText>
                <FloatingAppInput
                  label="Full Name"
                  value={formData.full_name}
                  onChangeText={full_name =>
                    setFormData({ ...formData, full_name })
                  }
                  wrapperStyle={{ marginBottom: normalize(24) }}
                />
                <FloatingAppInput
                  label="Email address"
                  value={formData.email}
                  onChangeText={email => setFormData({ ...formData, email })}
                  wrapperStyle={{ marginBottom: normalize(24) }}
                />
                <TextInput
                  multiline={true}
                  value={formData.message}
                  placeholder="Your message"
                  placeholderTextColor={Colors.profileLink}
                  numberOfLines={Platform.OS === 'ios' ? null : 6}
                  minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
                  style={[styles.input]}
                  onChangeText={message => {
                    setFormData({
                      ...formData,
                      message,
                    })
                  }}
                  underlineColorAndroid={'transparent'}
                  textAlignVertical="top"
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: normalize(50),
                    marginBottom: normalize(24),
                  }}>
                  <InfoGray />
                  <AppText
                    textStyle="caption"
                    customStyle={{
                      marginLeft: normalize(12),
                      maxWidth: '85%',
                    }}>
                    By submitting, you agree to our Privacy Policy
                  </AppText>
                </View>
                <AppButton
                  text="Submit"
                  type="primary"
                  size="l"
                  height="xl"
                  onPress={handleSubmit}
                  disabled={formData.message.length < 1}
                  customStyle={{
                    backgroundColor:
                      formData.message.length < 1
                        ? Colors.buttonDisable
                        : Colors.primaryYellow,
                    borderColor:
                      formData.message.length < 1
                        ? Colors.buttonDisable
                        : Colors.primaryYellow,
                  }}
                />
              </PaddingView>
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : (
        <MessageSuccess />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  imageWrapper: {
    marginBottom: normalize(24),
    alignItems: 'center',
  },
  contentWrapper: {
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 8,
    marginBottom: 6,
  },
  copyWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: normalize(24),
    backgroundColor: Colors.neutralsWhite,
  },
  centerCopy: {
    textAlign: 'left',
    marginBottom: normalize(8),
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
})

export default ContactUs
