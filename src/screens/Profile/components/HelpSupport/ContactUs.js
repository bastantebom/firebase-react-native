//import liraries
import React, { useState, useContext } from 'react'
import { View, StyleSheet, SafeAreaView, TextInput } from 'react-native'
import {
  ScreenHeaderTitle,
  PaddingView,
  AppText,
  AppButton,
  Notification,
} from '@/components'
import { ContactUsImg } from '@/assets/images'
import AdminFunctionsService from '@/services/Admin/AdminFunctions'
import {
  EmailContactUs,
  CallContactUs,
  LocationContactUs,
  CircleTick,
} from '@/assets/images/icons'
import { UserContext } from '@/context/UserContext'
import { Context } from '@/context'
import { normalize, Colors } from '@/globals'

// create a component
const ContactUs = ({ toggleContactUs }) => {
  const { userInfo } = useContext(UserContext)
  const { openNotification, closeNotification } = useContext(Context)
  const [contact, setContact] = useState({
    full_name: userInfo.full_name,
    email: userInfo.email,
    message: '',
  })
  const [notificationMessage, setNotificationMessage] = useState()
  const [notificationType, setNotificationType] = useState()

  const handleSubmit = async () => {
    try {
      const res = await AdminFunctionsService.contactServbees(contact)

      if (res.success) {
        triggerNotification(
          'Your message has been sent, please wait for our feedbaack',
          'success'
        )
        setContact({ ...contact, message: '' })
      }
    } catch (error) {}
  }

  const triggerNotification = (message, type) => {
    setNotificationType(type)
    setNotificationMessage(
      <AppText
        textStyle="body2"
        customStyle={
          type === 'success' ? notificationText : notificationErrorTextStyle
        }>
        {message}
      </AppText>
    )
    openNotification()
    closeNotificationTimer()
  }

  const notificationErrorTextStyle = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    color: 'white',
    flexWrap: 'wrap',
  }

  const notificationText = {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    flexWrap: 'wrap',
  }

  const closeNotificationTimer = () => {
    setTimeout(() => {
      setNotificationType()
      setNotificationMessage()
      closeNotification()
    }, 5000)
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <Notification
          type={notificationType}
          customStyle={{
            position: 'absolute',
          }}
          icon={<CircleTick />}>
          {notificationMessage}
        </Notification>
        <View style={{ padding: 24 }}>
          <ScreenHeaderTitle
            iconSize={16}
            title="Contact Us"
            close={toggleContactUs}
          />
        </View>

        <View style={{ flex: 1, backgroundColor: Colors.neutralsZircon }}>
          <View style={[styles.contentWrapper]}>
            <PaddingView paddingSize={3}>
              <View style={styles.imageWrapper}>
                <ContactUsImg width={normalize(214)} height={normalize(214)} />
              </View>
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <EmailContactUs
                    width={normalize(24)}
                    height={normalize(24)}
                  />
                  <AppText
                    textStyle="body2"
                    customStyle={{ marginLeft: normalize(16) }}>
                    hello@servbees.com
                  </AppText>
                </View>
                <View
                  style={{ flexDirection: 'row', marginTop: normalize(20) }}>
                  <CallContactUs width={normalize(24)} height={normalize(24)} />
                  <AppText
                    textStyle="body2"
                    customStyle={{ marginLeft: normalize(16) }}>
                    +63 2 7746-2061
                  </AppText>
                </View>
                <View
                  style={{ flexDirection: 'row', marginTop: normalize(20) }}>
                  <LocationContactUs
                    width={normalize(24)}
                    height={normalize(24)}
                  />
                  <AppText
                    textStyle="body2"
                    customStyle={{
                      marginLeft: normalize(16),
                      flex: 1,
                      flexWrap: 'wrap',
                    }}>
                    142-48 Pinatubo Street Barangka Ilaya Mandaluyong City 1550
                  </AppText>
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
                textStyle="body2"
                customStyle={{ marginBottom: normalize(16) }}>
                Send us a message!
              </AppText>
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
        </View>
      </SafeAreaView>
    </>
  )
}

// define your styles
// define your styles
const styles = StyleSheet.create({
  imageWrapper: {
    marginBottom: normalize(16),
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

//make this component available to the app
export default ContactUs
