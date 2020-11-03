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

import { AppText, BottomSheetHeader, PaddingView } from '@/components'
import { Colors, normalize } from '@/globals'
import {
  ProfileMute,
  ProfileReport,
  ProfileBlockRed,
  HeaderBackGray,
  MenuLiked,
  MenuEdit,
  MenuKey,
  MenuInfo,
  MenuChat,
  MenuBell,
  MenuArchive,
  MenuLogOut,
  MenuTelephone,
  MenuAddFriend,
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
  ChangePassword,
  BlockList,
  HiddenPost,
  LikedPost,
  ArchivedPost,
  InviteFriends,
  ContactServbees,
  FaqScreen,
} from '@/screens/Profile/components'

const OwnMenu = ({ toggleMenu, signOut, triggerNotify }) => {
  const navigation = useNavigation()
  const [editProfile, setEditProfile] = useState(false)
  const [about, setAbout] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  const [blockUser, setBlockUser] = useState(false)
  const [hiddenPost, setHiddenPost] = useState(false)
  const [likePost, setLikePost] = useState(false)
  const [archivedPost, setArchivedPost] = useState(false)
  const [inviteFriends, setInviteFriends] = useState(false)
  const [contactServbees, setContactServbees] = useState(false)
  const [questions, setQuestions] = useState(false)

  const toggleEditProfile = () => {
    setEditProfile(!editProfile)
  }

  const toggleAbout = () => {
    setAbout(!about)
  }

  const toggleChangePassword = () => {
    setChangePassword(!changePassword)
  }

  const toggleBlockedUser = () => {
    setBlockUser(!blockUser)
  }

  const toggleHiddenPost = () => {
    setHiddenPost(!hiddenPost)
  }

  const toggleLikePost = () => {
    setLikePost(!likePost)
  }

  const toggleArchivedPost = () => {
    setArchivedPost(!archivedPost)
  }

  const toggleInviteFriends = () => {
    setInviteFriends(!inviteFriends)
  }

  const toggleContactUs = () => {
    setContactServbees(!contactServbees)
  }

  const toggleFaq = () => {
    setQuestions(!questions)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View
          style={{
            backgroundColor: 'white',
            paddingBottom: 24,
            borderTopEndRadius: 8,
            borderTopStartRadius: 8,
          }}>
          <PaddingView paddingSize={3}>
            <View
              style={{
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 32,
              }}>
              <TouchableOpacity
                onPress={toggleMenu}
                activeOpacity={0.7}
                style={{ position: 'absolute', left: 0 }}>
                <HeaderBackGray width={normalize(16)} height={normalize(16)} />
              </TouchableOpacity>
              <AppText textStyle="body3">Settings</AppText>
            </View>

            <View>
              <AppText customStyle={{ marginLeft: 8 }} textStyle="body3">
                Account
              </AppText>

              <TouchableOpacity
                style={{ marginTop: normalize(16) }}
                activeOpacity={0.7}
                onPress={toggleLikePost}>
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <LikedPostMenu width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{ marginLeft: 8 }} textStyle="body1">
                    Liked Post
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={toggleEditProfile}>
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <MenuEdit width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{ marginLeft: 8 }} textStyle="body1">
                    Edit Profile
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleArchivedPost}>
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <ArchivePostMenu
                    width={normalize(24)}
                    height={normalize(24)}
                  />
                  <AppText customStyle={{ marginLeft: 8 }} textStyle="body1">
                    Archived Post
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={toggleHiddenPost}>
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <HidePost width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{ marginLeft: 8 }} textStyle="body1">
                    Hidden Posts
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleInviteFriends}>
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <InviteFriendsMenu
                    width={normalize(24)}
                    height={normalize(24)}
                  />
                  <AppText customStyle={{ marginLeft: 8 }} textStyle="body1">
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
              <AppText textStyle="body3" customStyle={{ marginBottom: 16 }}>
                Help and Support
              </AppText>

              <TouchableOpacity activeOpacity={0.7} onPress={toggleFaq}>
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <Faq width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{ marginLeft: 8 }} textStyle="body1">
                    Frequently Asked Questions
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={toggleContactUs}>
                <View style={{ flexDirection: 'row' }}>
                  <ContactUs width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{ marginLeft: 8 }} textStyle="body1">
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
              {/* <AppText textStyle="body3" customStyle={{marginBottom: 16}}>
                Settings and Privacy
              </AppText> */}
              <AppText customStyle={{ marginLeft: 8 }} textStyle="body3">
                Settings and Privacy
              </AppText>

              <TouchableOpacity
                style={{ marginTop: normalize(16) }}
                activeOpacity={0.7}
                onPress={toggleChangePassword}>
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <ChangePasswordRed
                    width={normalize(24)}
                    height={normalize(24)}
                  />
                  <AppText customStyle={{ marginLeft: 8 }} textStyle="body1">
                    Change Password
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={toggleBlockedUser}>
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <BlockedUsers width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{ marginLeft: 8 }} textStyle="body1">
                    Blocked Users
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <Notifications width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{ marginLeft: 8 }} textStyle="body1">
                    Notification
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={toggleAbout}>
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <AboutRed width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{ marginLeft: 8 }} textStyle="body1">
                    About
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={signOut}>
                <View style={{ flexDirection: 'row' }}>
                  <MenuLogOut width={normalize(24)} height={normalize(24)} />
                  <AppText customStyle={{ marginLeft: 8 }} textStyle="body1">
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
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <EditProfile
          toggleMenu={toggleMenu}
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
        {/* <FilterSlider modalToggler={toggleModal} /> */}
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
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <LikedPost toggleMenu={toggleMenu} toggleLikePost={toggleLikePost} />
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
        {/* <FilterSlider modalToggler={toggleModal} /> */}
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
        {/* <FilterSlider modalToggler={toggleModal} /> */}
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
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <About toggleAbout={toggleAbout} />
      </Modal>

      <Modal
        isVisible={changePassword}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <ChangePassword toggleChangePassword={toggleChangePassword} />
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
        {/* <FilterSlider modalToggler={toggleModal} /> */}
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
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <FaqScreen toggleFaq={toggleFaq} />
      </Modal>
    </SafeAreaView>
  )
}

export default OwnMenu
