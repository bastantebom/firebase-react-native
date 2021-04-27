import React, { useState, useContext } from 'react'
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { Divider } from 'react-native-paper'
import Modal from 'react-native-modal'
import { ArchivePostMenu, Icons } from '@/assets/images/icons'

import { AppText, PaddingView, ScreenHeaderTitle } from '@/components'
import { Colors, normalize } from '@/globals'
import {
  MenuEdit,
  MenuLogOut,
  HidePost,
  AboutRed,
  BlockedUsers,
  ChangePasswordRed,
  LikedPostMenu,
  ContactUs,
  Notifications,
  InviteFriendsMenu,
} from '@/assets/images/icons'

import {
  About,
  ContactServbees,
  FaqScreen,
  NotificationSettings,
} from '@/screens/Profile/components'
import { UserContext } from '@/context/UserContext'
import { getStatusBarHeight } from 'react-native-status-bar-height'

const OwnMenu = ({ navigation, triggerNotify }) => {
  const { providerData, signOut } = useContext(UserContext)
  const [about, setAbout] = useState(false)
  const [contactServbees, setContactServbees] = useState(false)
  const [questions, setQuestions] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [hasPassword] = useState(
    providerData.some(pd => pd.providerId === 'password')
  )

  const toggleAbout = () => setAbout(!about)
  const toggleContactUs = () => setContactServbees(!contactServbees)
  const toggleFaq = () => setQuestions(!questions)

  const handleChangePasswordPress = () => {
    navigation.navigate('NBTScreen', { screen: 'change-password' })
  }

  const accountMenuItems = [
    {
      label: 'Liked Posts',
      onPress: () => {
        navigation.navigate('NBTScreen', {
          screen: 'liked-posts',
        })
      },
      icon: () => (
        <LikedPostMenu width={normalize(20)} height={normalize(20)} />
      ),
    },
    {
      label: 'Edit Profile',
      onPress: () => {
        navigation.navigate('NBTScreen', {
          screen: 'edit-profile',
        })
      },
      icon: () => <MenuEdit width={normalize(20)} height={normalize(20)} />,
    },
    {
      label: 'Archived Posts',
      onPress: () => {
        navigation.navigate('NBTScreen', {
          screen: 'posts',
          params: {
            screen: 'archived-posts',
          },
        })
      },
      icon: () => (
        <ArchivePostMenu width={normalize(20)} height={normalize(20)} />
      ),
    },
    {
      label: 'Hidden Posts',
      onPress: () => {
        navigation.navigate('NBTScreen', {
          screen: 'posts',
          params: {
            screen: 'hidden-posts',
          },
        })
      },
      icon: () => <HidePost width={normalize(20)} height={normalize(20)} />,
    },
    {
      label: 'Invite Friends',
      onPress: () => {
        navigation.navigate('NBTScreen', {
          screen: 'invite-friends',
        })
      },
      icon: () => (
        <InviteFriendsMenu width={normalize(20)} height={normalize(20)} />
      ),
    },
  ]

  // Removed from current build
  const notificationComponent = () => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setNotifications(true)}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 16,
              alignItems: 'center',
            }}>
            <Notifications width={normalize(20)} height={normalize(20)} />
            <AppText customStyle={{ marginLeft: 12 }} textStyle="body1">
              Notification
            </AppText>
          </View>
        </TouchableOpacity>

        <Modal
          isVisible={notifications}
          animationIn="slideInRight"
          animationInTiming={450}
          animationOut="slideOutLeft"
          animationOutTiming={450}
          onBackButtonPress={() => setNotifications(false)}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          <NotificationSettings />
        </Modal>
      </>
    )
  }

  return (
    <>
      <ScreenHeaderTitle
        title="Settings"
        close={navigation.goBack}
        paddingSize={3}
      />
      <View style={styles.wrapper}>
        <ScrollView>
          <View
            style={{
              paddingBottom: 24,
              borderTopEndRadius: 8,
              borderTopStartRadius: 8,
            }}>
            <PaddingView paddingSize={3}>
              <View>
                <AppText
                  textStyle="body3"
                  customStyle={{ marginBottom: normalize(16) }}>
                  Account
                </AppText>

                {accountMenuItems.map(
                  ({ label, onPress, icon, hidden }) =>
                    !hidden && (
                      <TouchableOpacity
                        key={label}
                        activeOpacity={0.7}
                        onPress={onPress}>
                        <View style={styles.menuItem}>
                          {icon()}
                          <AppText
                            customStyle={styles.menuItemLabel}
                            textStyle="body1">
                            {label}
                          </AppText>
                        </View>
                      </TouchableOpacity>
                    )
                )}
              </View>

              <Divider
                style={{
                  backgroundColor: Colors.neutralGray,
                  marginVertical: 24,
                }}
              />

              <View>
                <AppText textStyle="body3" customStyle={{ marginBottom: 16 }}>
                  Payouts
                </AppText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('NBTScreen', {
                      screen: 'payout-methods',
                      params: {
                        screen: 'payout-method',
                      },
                    })
                  }>
                  <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                    <Icons.PayoutWallet
                      width={normalize(24)}
                      height={normalize(24)}
                    />
                    <AppText customStyle={{ marginLeft: 8 }} textStyle="body1">
                      Payout Method
                    </AppText>
                  </View>
                </TouchableOpacity>
              </View>

              <Divider
                style={{
                  backgroundColor: Colors.neutralGray,
                  marginVertical: 24,
                }}
              />

              <View>
                <AppText
                  textStyle="body3"
                  customStyle={{ marginBottom: normalize(16) }}>
                  Help and Support
                </AppText>

                <TouchableOpacity activeOpacity={0.7} onPress={toggleContactUs}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ContactUs width={normalize(20)} height={normalize(20)} />
                    <AppText customStyle={{ marginLeft: 12 }} textStyle="body1">
                      Contact Us
                    </AppText>
                  </View>
                </TouchableOpacity>
              </View>

              <Divider
                style={{
                  backgroundColor: Colors.neutralGray,
                  marginVertical: 24,
                }}
              />

              <View>
                <AppText
                  textStyle="body3"
                  customStyle={{ marginBottom: normalize(16) }}>
                  Settings and Privacy
                </AppText>

                {hasPassword && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleChangePasswordPress}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 16,
                        alignItems: 'center',
                      }}>
                      <ChangePasswordRed
                        width={normalize(20)}
                        height={normalize(20)}
                      />
                      <AppText
                        customStyle={{ marginLeft: 12 }}
                        textStyle="body1">
                        Change Password
                      </AppText>
                    </View>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={{ marginTop: !hasPassword ? normalize(16) : 0 }}
                  activeOpacity={0.7}
                  onPress={() => {
                    navigation.navigate('NBTScreen', {
                      screen: 'block-user',
                    })
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 16,
                      alignItems: 'center',
                    }}>
                    <BlockedUsers
                      width={normalize(20)}
                      height={normalize(20)}
                    />
                    <AppText customStyle={{ marginLeft: 12 }} textStyle="body1">
                      Blocked Users
                    </AppText>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7} onPress={toggleAbout}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 16,
                      alignItems: 'center',
                    }}>
                    <AboutRed width={normalize(20)} height={normalize(20)} />
                    <AppText customStyle={{ marginLeft: 12 }} textStyle="body1">
                      About
                    </AppText>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    signOut().then(() => {
                      navigation.navigate('Onboarding')
                    })
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MenuLogOut width={normalize(20)} height={normalize(20)} />
                    <AppText customStyle={{ marginLeft: 12 }} textStyle="body1">
                      Log out
                    </AppText>
                  </View>
                </TouchableOpacity>
              </View>
            </PaddingView>
          </View>
        </ScrollView>
      </View>

      <Modal
        isVisible={about}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <About toggleAbout={toggleAbout} />
      </Modal>

      <Modal
        isVisible={contactServbees}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <ContactServbees toggleContactUs={toggleContactUs} />
      </Modal>

      <Modal
        isVisible={questions}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <FaqScreen toggleFaq={toggleFaq} />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: normalize(16),
    alignItems: 'center',
  },
  menuItemLabel: { marginLeft: normalize(12) },
})

export default OwnMenu
