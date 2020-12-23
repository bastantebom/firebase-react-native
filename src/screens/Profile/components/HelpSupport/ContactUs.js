import React, { useState, useContext } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native'
import {
  ScreenHeaderTitle,
  PaddingView,
  AppText,
  AppButton,
} from '@/components'
import { ContactUsBee, ContactSuccess } from '@/assets/images'
import AdminFunctionsService from '@/services/Admin/AdminFunctions'
import {
  EmailContactUs,
  CallContactUs,
  ContactLocation,
  InfoGray,
} from '@/assets/images/icons'
import { UserContext } from '@/context/UserContext'
import { normalize, Colors } from '@/globals'
import FloatingAppInput from '@/components/AppInput/AppInput'

const ContactUs = ({ toggleContactUs }) => {
  const { userInfo } = useContext(UserContext)
  const [contact, setContact] = useState({
    full_name: newName,
    email: newEmail,
    message: '',
  })
  const [newName, setNewName] = useState(userInfo.full_name)
  const [newEmail, setNewEmail] = useState(userInfo.email)
  const [messageSuccess, setMessageSuccess] = useState(false)

  const handleSubmit = async () => {
    try {
      const res = await AdminFunctionsService.contactServbees(contact)

      if (res.success) {
        setContact({ ...contact, message: '' })
        setMessageSuccess(true)
      }
    } catch (error) {}
  }

  const MessageSuccess = () => {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <ScreenHeaderTitle iconSize={0} title="Contact Us" paddingSize={3} />
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
      {!messageSuccess ? (
        <SafeAreaView style={{ flex: 1 }}>
          <ScreenHeaderTitle
            iconSize={16}
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
                    <AppText
                      textStyle="body2"
                      customStyle={{ marginLeft: normalize(16) }}>
                      hello@servbees.com
                    </AppText>
                  </View>
                  <View
                    style={{ flexDirection: 'row', marginTop: normalize(20) }}>
                    <CallContactUs
                      width={normalize(18)}
                      height={normalize(18)}
                    />
                    <AppText
                      textStyle="body2"
                      customStyle={{ marginLeft: normalize(16) }}>
                      +65 6988 3863
                    </AppText>
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
                  value={newName}
                  onChangeText={newName => {
                    setNewName(newName)
                  }}
                  wrapperStyle={{ marginBottom: normalize(24) }}
                />
                <FloatingAppInput
                  label="Email address"
                  value={newEmail}
                  onChangeText={newEmail => {
                    setNewEmail(newEmail)
                  }}
                  wrapperStyle={{ marginBottom: normalize(24) }}
                />
                <TextInput
                  multiline={true}
                  value={contact.message}
                  placeholder="Your message"
                  placeholderTextColor={Colors.profileLink}
                  numberOfLines={Platform.OS === 'ios' ? null : 6}
                  minHeight={Platform.OS === 'ios' && 8 ? 20 * 6 : null}
                  style={[styles.input]}
                  onChangeText={text => {
                    setContact({
                      ...contact,
                      message: text,
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
                  onPress={() => handleSubmit()}
                  disabled={contact.message.length < 1}
                  customStyle={{
                    backgroundColor:
                      contact.message.length < 1
                        ? Colors.buttonDisable
                        : Colors.primaryYellow,
                    borderColor:
                      contact.message.length < 1
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
