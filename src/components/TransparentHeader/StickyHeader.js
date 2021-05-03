import React, { useContext } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import Modal from 'react-native-modal'
import Share from 'react-native-share'
import { useNavigation } from '@react-navigation/native'

import { AppText, CacheableImage, HexagonBorder } from '@/components'
import { QRScreen, PostEllipsis, OtherPostEllipsis } from './components'
import {
  HeaderShareGray,
  HeaderMenuGray,
  HeaderFollowingBlack,
  HeaderFollowBlack,
  HeaderEllipsisGray,
} from '@/assets/images/icons'
import { normalize, GlobalStyle, Colors } from '@/globals'
import { UserContext } from '@/context/UserContext'
import { generateDynamicLink, getPreviewLinkData, isUrl } from '@/globals/Utils'
import { ProfileHeaderDefault } from '@/assets/images'

const StickyHeader = ({
  toggleEllipsisState,
  ellipsisState,
  toggleFollowing,
  type,
  toggleQR,
  QR,
  backFunction,
  editPostFunction,
  deletePostFunction,
  userInfo,
  userID,
  hidePost,
  postTitle,
  postId,
  isFollowing,
  coverPhotoUrl,
}) => {
  const navigation = useNavigation()
  const { user } = useContext(UserContext)
  const { display_name, full_name, profile_photo } = userInfo
  const name = display_name || full_name

  const handleShare = async () => {
    try {
      const url = await generateDynamicLink({
        type: 'profile',
        params: { uid: userInfo.uid },
        social: await getPreviewLinkData({ type: 'user', data: userInfo }),
      })
      await Share.open({ url })
    } catch (error) {
      console.log(error)
    }
  }

  if (type === 'profile') {
    return (
      <>
        <View
          style={{
            bottom: 0,
            height: normalize(58),
            width: '100%',
          }}>
          <View
            style={{
              height: normalize(70),
              overflow: 'hidden',
              backgroundColor: Colors.neutralsZirconLight,
            }}>
            {coverPhotoUrl && userInfo.cover_photo && isUrl(coverPhotoUrl) ? (
              <CacheableImage
                source={{ uri: coverPhotoUrl }}
                style={{ width: normalize(375), height: normalize(158) }}
              />
            ) : (
              <ProfileHeaderDefault
                width={normalize(375 * 1.2)}
                height={normalize(158 * 1.2)}
              />
            )}
          </View>
        </View>
        <View style={styles.profileStickyHeader}>
          <View
            style={{
              flexDirection: 'row',
              width: '60%',
              position: 'relative',
            }}>
            <View style={styles.profileImageWrapper}>
              <HexagonBorder
                size={40}
                path={profile_photo}
                dimensions="64x64"
              />
            </View>
            <AppText
              textStyle="subtitle2"
              color={Colors.primaryMidnightBlue}
              numberOfLines={1}
              customStyle={{ paddingLeft: normalize(45) }}>
              {name}
            </AppText>
          </View>
          {user?.uid === userInfo?.uid ? (
            <View
              style={{
                flexDirection: 'row',
                width: '40%',
                paddingLeft: 25,
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity activeOpacity={0.7} onPress={handleShare}>
                <View style={GlobalStyle.marginLeft1}>
                  <HeaderShareGray
                    width={normalize(22)}
                    height={normalize(22)}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate('NBTScreen', {
                    screen: 'own-menu',
                  })
                }}>
                <View style={GlobalStyle.marginLeft2}>
                  <HeaderMenuGray
                    width={normalize(22)}
                    height={normalize(22)}
                  />
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            user && (
              <View
                style={{
                  flexDirection: 'row',
                  width: '40%',
                  paddingLeft: 25,
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity activeOpacity={0.7} onPress={toggleFollowing}>
                  <View style={GlobalStyle.marginLeft1}>
                    {isFollowing ? (
                      <HeaderFollowingBlack
                        width={normalize(22)}
                        height={normalize(22)}
                      />
                    ) : (
                      <HeaderFollowBlack
                        width={normalize(22)}
                        height={normalize(22)}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={handleShare}>
                  <View style={GlobalStyle.marginLeft1}>
                    <HeaderShareGray
                      width={normalize(22)}
                      height={normalize(22)}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={toggleEllipsisState}>
                  <View style={GlobalStyle.marginLeft1}>
                    <HeaderEllipsisGray
                      width={normalize(22)}
                      height={normalize(22)}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>

        <Modal
          isVisible={QR}
          animationIn="slideInUp"
          animationInTiming={450}
          animationOut="slideOutLeft"
          animationOutTiming={450}
          style={{
            margin: 0,
            backgroundColor: 'white',
            height: Dimensions.get('window').height,
          }}>
          <QRScreen toggleQR={toggleQR} />
        </Modal>
      </>
    )
  }
}

const styles = StyleSheet.create({
  profileImageWrapper: {
    width: normalize(40),
    height: normalize(40),
    marginTop: normalize(40),
    position: 'absolute',
    alignItems: 'center',
  },
  followButton: {
    borderRadius: 20,
    flexDirection: 'row',
    height: normalize(32),
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  profileStickyHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: normalize(56),
    paddingHorizontal: normalize(16),
    backgroundColor: Colors.neutralsWhite,
    alignItems: 'center',
    borderBottomColor: Colors.neutralGray,
    borderBottomWidth: normalize(4),
    borderTopLeftRadius: normalize(6),
    borderTopWidth: normalize(1),
    borderTopColor: Colors.neutralsZirconLight,
    borderTopRightRadius: normalize(6),
  },
})

export default StickyHeader
