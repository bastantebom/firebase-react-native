import React, { useState, useContext } from 'react'
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native'
import { Divider } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal'

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
  ArchivePostMenu,
  InviteFriendsMenu,
  Faq,
  ContactUs,
  Notifications,
} from '@/assets/images/icons'

import {
  EditProfile,
  About,
  BlockList,
  HiddenPost,
  LikedPost,
  ArchivedPost,
  InviteFriends,
  ContactServbees,
  FaqScreen,
  PayoutMethod,
  NotificationSettings,
} from '@/screens/Profile/components'
import { UserContext } from '@/context/UserContext'

const OwnMenu = ({ toggleMenu: close, signOut, triggerNotify }) => {
  const navigation = useNavigation()
  const { providerData } = useContext(UserContext)
  const [editProfile, setEditProfile] = useState(false)
  const [about, setAbout] = useState(false)
  const [blockUser, setBlockUser] = useState(false)
  const [hiddenPost, setHiddenPost] = useState(false)
  const [likePost, setLikePost] = useState(false)
  const [archivedPost, setArchivedPost] = useState(false)
  const [inviteFriends, setInviteFriends] = useState(false)
  const [contactServbees, setContactServbees] = useState(false)
  const [questions, setQuestions] = useState(false)
  const [payoutMethod, setPayoutMethod] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [hasPassword, setHasPassword] = useState(
    providerData.some(pd => pd.providerId === 'password')
  )

  const toggleEditProfile = () => setEditProfile(!editProfile)
  const toggleAbout = () => setAbout(!about)
  const toggleBlockedUser = () => setBlockUser(!blockUser)
  const toggleHiddenPost = () => setHiddenPost(!hiddenPost)
  const toggleLikePost = () => setLikePost(!likePost)
  const toggleArchivedPost = () => setArchivedPost(!archivedPost)
  const toggleInviteFriends = () => setInviteFriends(!inviteFriends)
  const toggleContactUs = () => setContactServbees(!contactServbees)
  const toggleFaq = () => setQuestions(!questions)
  const togglePayoutMethod = () => setPayoutMethod(!payoutMethod)

  const handleChangePasswordPress = () => {
    navigation.navigate('NBTScreen', { screen: 'change-password' })
    close()
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenHeaderTitle
        title="Settings"
        iconSize={normalize(20)}
        close={close}
        paddingSize={3}
      />
      <ScrollView>
        <View
          style={{
            backgroundColor: 'white',
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

              <TouchableOpacity activeOpacity={0.7} onPress={toggleLikePost}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 16,
                    alignItems: 'center',
                  }}>
                  <LikedPostMenu width={normalize(20)} height={normalize(20)} />
                  <AppText customStyle={{ marginLeft: 12 }} textStyle="body1">
                    Liked Posts
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={toggleEditProfile}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 16,
                    alignItems: 'center',
                  }}>
                  <MenuEdit width={normalize(20)} height={normalize(20)} />
                  <AppText customStyle={{ marginLeft: 12 }} textStyle="body1">
                    Edit Profile
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleArchivedPost}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 16,
                    alignItems: 'center',
                  }}>
                  <ArchivePostMenu
                    width={normalize(20)}
                    height={normalize(20)}
                  />
                  <AppText customStyle={{ marginLeft: 12 }} textStyle="body1">
                    Archived Post
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={toggleHiddenPost}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 16,
                    alignItems: 'center',
                  }}>
                  <HidePost width={normalize(22)} height={normalize(22)} />
                  <AppText customStyle={{ marginLeft: 11 }} textStyle="body1">
                    Hidden Posts
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleInviteFriends}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <InviteFriendsMenu
                    width={normalize(22)}
                    height={normalize(22)}
                  />
                  <AppText customStyle={{ marginLeft: 11 }} textStyle="body1">
                    Invite Friends
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

              <TouchableOpacity activeOpacity={0.7} onPress={toggleFaq}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 16,
                    alignItems: 'center',
                  }}>
                  <Faq width={normalize(20)} height={normalize(20)} />
                  <AppText customStyle={{ marginLeft: 12 }} textStyle="body1">
                    Frequently Asked Questions
                  </AppText>
                </View>
              </TouchableOpacity>

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
                    <AppText customStyle={{ marginLeft: 12 }} textStyle="body1">
                      Change Password
                    </AppText>
                  </View>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={{ marginTop: !hasPassword ? normalize(16) : 0 }}
                activeOpacity={0.7}
                onPress={toggleBlockedUser}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 16,
                    alignItems: 'center',
                  }}>
                  <BlockedUsers width={normalize(20)} height={normalize(20)} />
                  <AppText customStyle={{ marginLeft: 12 }} textStyle="body1">
                    Blocked Users
                  </AppText>
                </View>
              </TouchableOpacity>

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

              <TouchableOpacity activeOpacity={0.7} onPress={signOut}>
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

      <Modal
        isVisible={editProfile}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <EditProfile
          toggleMenu={close}
          toggleEditProfile={toggleEditProfile}
          triggerNotify={triggerNotify}
          source="own-menu"
        />
      </Modal>

      <Modal
        isVisible={blockUser}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <BlockList toggleBlockedUser={toggleBlockedUser} />
      </Modal>

      <Modal
        isVisible={hiddenPost}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <HiddenPost toggleHiddenPost={toggleHiddenPost} />
      </Modal>

      <Modal
        isVisible={likePost}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <LikedPost toggleMenu={close} toggleLikePost={toggleLikePost} />
      </Modal>

      <Modal
        isVisible={archivedPost}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <ArchivedPost toggleArchivedPost={toggleArchivedPost} />
      </Modal>

      <Modal
        isVisible={inviteFriends}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <InviteFriends toggleInviteFriends={toggleInviteFriends} />
      </Modal>

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

      <Modal
        isVisible={payoutMethod}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        onBackButtonPress={togglePayoutMethod}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <PayoutMethod close={togglePayoutMethod} />
      </Modal>

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
        <NotificationSettings close={() => setNotifications(false)} />
      </Modal>
    </SafeAreaView>
  )
}

export default OwnMenu
