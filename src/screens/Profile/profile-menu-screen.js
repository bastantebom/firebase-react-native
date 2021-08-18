import { ArchivePostMenu, Icons, LikedPostMenu } from '@/assets/images/icons'
import Loader from '@/components/loader'
import Toast from '@/components/toast'
import { UserContext } from '@/context/UserContext'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import { CommonActions } from '@react-navigation/native'
import React, { useContext, useState, useEffect } from 'react'
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { getStatusBarHeight } from 'react-native-status-bar-height'

/**
 * @typedef {object} ProfileMenuScreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {ProfileMenuScreenProps} ProfileMenuScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'ProfileMenuScreen'>} param0 */
const ProfileMenuScreen = ({ navigation }) => {
  const { signOut, providerData } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)
  const [hidePasswordMenuItem, setHidePasswordMenuItem] = useState(false)

  const [menuItems, setMenuItems] = useState([
    {
      id: 'label:account',
      type: 'label',
      label: 'Account',
    },
    {
      id: 'liked-post',
      label: 'Liked Posts',
      icon: <Icons.LikedPostMenu {...iconSize(24)} />,
      onPress: () => {
        navigation.navigate('liked-posts')
      },
    },
    {
      id: 'edit-profile',
      label: 'Edit Profile',
      icon: (
        <Icons.PencilPaper
          style={{ color: Colors.secondaryRoyalBlue }}
          {...iconSize(24)}
        />
      ),
      onPress: () => {
        navigation.navigate('NBTScreen', {
          screen: 'profile',
          params: {
            screen: 'edit-profile',
            params: {
              prevScreen: 'profile-menu',
            },
          },
        })
      },
    },
    {
      id: 'archived-posts',
      label: 'Archived Posts',
      icon: (
        <Icons.Archive
          style={{ color: Colors.secondaryRoyalBlue }}
          {...iconSize(24)}
        />
      ),
      onPress: () => {
        navigation.navigate('NBTScreen', {
          screen: 'posts',
          params: {
            screen: 'archived-posts',
          },
        })
      },
    },
    {
      id: 'hidden-posts',
      label: 'Hidden Posts',
      icon: <Icons.HidePost {...iconSize(24)} />,
      onPress: () => {
        navigation.navigate('NBTScreen', {
          screen: 'posts',
          params: {
            screen: 'hidden-posts',
          },
        })
      },
    },
    {
      id: 'invite-friends',
      label: 'Invite Friends',
      icon: (
        <Icons.AddFriend
          style={{ color: Colors.secondaryRoyalBlue }}
          {...iconSize(24)}
        />
      ),
      onPress: () => {
        navigation.navigate('invite-friends')
      },
    },
    {
      id: 'divider-1',
      type: 'divider',
    },
    {
      id: 'label:payouts',
      type: 'label',
      label: 'Payouts',
    },
    {
      id: 'payout-methods',
      label: 'Payout Method',
      icon: <Icons.PayoutWallet {...iconSize(24)} />,
      onPress: () => {
        navigation.navigate('payout-methods')
      },
    },
    {
      id: 'divider-2',
      type: 'divider',
    },
    {
      id: 'label:help',
      type: 'label',
      label: 'Help and Support',
    },
    // {
    //   id: 'faq',
    //   label: 'Frequently Asked Questions',
    //   icon: <Icons.Faq {...iconSize(24)} />,
    //   onPress: () => {},
    // },
    {
      id: 'contact',
      label: 'Contact Us',
      icon: (
        <Icons.ContactTelephone
          style={{ color: Colors.secondaryDarkTangerine }}
          {...iconSize(24)}
        />
      ),
      onPress: () => {
        navigation.navigate('NBTScreen', {
          screen: 'profile',
          params: {
            screen: 'contact-us',
          },
        })
      },
    },
    {
      id: 'divider-3',
      type: 'divider',
    },
    {
      id: 'label:privacy',
      type: 'label',
      label: 'Settings and Privacy',
    },
    {
      id: 'change-password',
      label: 'Change Password',
      icon: (
        <Icons.Key
          style={{ color: Colors.secondaryOrchid }}
          {...iconSize(24)}
        />
      ),
      onPress: () => {
        navigation.navigate('NBTScreen', {
          screen: 'profile',
          params: {
            screen: 'change-password',
          },
        })
      },
    },
    {
      id: 'blocked-users',
      label: 'Blocked Users',
      icon: (
        <Icons.UserAlt
          style={{ color: Colors.secondaryOrchid }}
          {...iconSize(24)}
        />
      ),
      onPress: () => {
        navigation.navigate('NBTScreen', {
          screen: 'profile',
          params: {
            screen: 'blocked-users',
          },
        })
      },
    },
    // {
    //   id: 'notifications',
    //   label: 'Notifications',
    //   icon: (
    //     <Icons.MenuBell
    //       style={{ color: Colors.secondaryOrchid }}
    //       {...iconSize(24)}
    //     />
    //   ),
    //   onPress: () => {},
    // },
    {
      id: 'about',
      label: 'About',
      icon: (
        <Icons.MenuInfo
          style={{ color: Colors.secondaryOrchid }}
          {...iconSize(24)}
        />
      ),
      onPress: () => {
        navigation.navigate('NBTScreen', {
          screen: 'profile',
          params: {
            screen: 'about',
            params: {
              screen: 'about',
            },
          },
        })
      },
    },
    {
      id: 'logout',
      label: 'Log out',
      icon: (
        <Icons.DoorOut
          style={{ color: Colors.secondaryOrchid }}
          {...iconSize(24)}
        />
      ),
      onPress: async () => {
        setIsLoading(true)
        try {
          await signOut()

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            })
          )
          setIsLoading(false)
        } catch (error) {
          Toast.show({
            label: `Oops! Something went wrong.`,
            type: 'error',
            dismissible: true,
            screenId: 'root',
            timeout: 5000,
          })
          setIsLoading(false)
        }
      },
    },
  ])

  useEffect(() => {
    if (providerData?.[0]) {
      const providerId = providerData[0].providerId

      if (providerId === 'phone' || providerId === 'password')
        setHidePasswordMenuItem(false)
      else setHidePasswordMenuItem(true)
    }
  }, [providerData])

  useEffect(() => {
    if (hidePasswordMenuItem) {
      const passwordIndex = menuItems.findIndex(
        menuItem => menuItem.id === 'change-password'
      )

      if (passwordIndex >= 0) {
        setMenuItems(currentMenuItems => {
          currentMenuItems.splice(passwordIndex, 1)
          return [...currentMenuItems]
        })
      }
    }
  }, [hidePasswordMenuItem])

  const renderItem = item => {
    if (item.type === 'label') {
      return (
        <View key={item.id} style={styles.groupLabel}>
          <Text style={[typography.body2, typography.medium]}>
            {item.label}
          </Text>
        </View>
      )
    } else if (item.type === 'divider') {
      return <View key={item.id} style={styles.divider} />
    }
    return (
      <TouchableOpacity
        key={item.id}
        onPress={item.onPress}
        activeOpacity={0.7}
        style={styles.menuItem}>
        {item.icon}
        <Text style={[typography.body1, styles.menuItemLabel]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <Loader visible={isLoading} />
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor="#fff"
      />
      <Toast
        ref={ref => Toast.setRef(ref, 'profile-menu')}
        containerStyle={{
          marginTop: getStatusBarHeight() + normalize(8),
        }}
      />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>Settings</Text>
          </View>
        </View>
        <ScrollView style={styles.content}>
          {menuItems.map(renderItem)}
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
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
  content: {
    flex: 1,
    paddingHorizontal: normalize(20),
  },
  groupLabel: {
    marginBottom: normalize(16),
  },
  divider: {
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors.neutralGray,
    marginTop: normalize(8),
    marginBottom: normalize(24),
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: normalize(16),
    alignItems: 'center',
  },
  menuItemLabel: {
    marginLeft: normalize(8),
  },
})

export default ProfileMenuScreen
