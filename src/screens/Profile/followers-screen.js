import { Images } from '@/assets/images'
import { Icons } from '@/assets/images/icons'
import Avatar from '@/components/Avatar/avatar'
import Button from '@/components/Button'
import { UserContext } from '@/context/UserContext'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import utilStyles from '@/globals/util-styles'
import { iconSize } from '@/globals/Utils'
import Api from '@/services/Api'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { PureComponent } from 'react'
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Platform,
  UIManager,
  TouchableOpacity,
  LayoutAnimation,
  RefreshControl,
  FlatList,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import TouchableOpacityGesture from 'react-native-gesture-handler/touchables/TouchableOpacity'
import ModalComponent from '../orders/modals'
import LottieView from 'lottie-react-native'
import assetLoader from '@/assets/animations/asset-loader.json'
import Q from 'q'
import Toast from '@/components/toast'
import { Context } from '@/context'
import Loader from '@/components/loader'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const configureAnimation = (duration = 120) => {
  LayoutAnimation.configureNext({
    duration,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: { type: LayoutAnimation.Types.easeInEaseOut },
  })
}

/**
 * @typedef {Object} User
 * @property {string} uid
 * @property {string} full_name
 * @property {string} display_name
 */

/**
 * @typedef {Object} FollowersScreenProps
 * @property {User} user
 */

/**
 * @typedef {Object} RootProps
 * @property {FollowersScreenProps} FollowersScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'FollowersScreen'>} param0 */
const FollowersScreen = ({ navigation, route }) => {
  const { user } = route.params
  const { setDashboardNeedsRefresh } = useContext(Context)
  const { userInfo } = useContext(UserContext)
  const [selectedNav, setSelectedNav] = useState('followers')
  const [navLayouts, setNavLayouts] = useState({})

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [followers, setFollowers] = useState({})
  const [following, setFollowing] = useState({})
  const [followersInitialized, setFollowersInitialized] = useState(false)
  const [followingInitialized, setFollowingInitialized] = useState(false)
  const [requests, setRequests] = useState({})
  const [selectedUser, setSelectedUser] = useState({})
  const [isMenuVisible, setIsMenuVisible] = useState(false)

  const [
    confirmUnfollowUserModalVisible,
    setConfirmUnfollowUserModalVisible,
  ] = useState(false)
  const [
    confirmUnfollowUserModalDeferred,
    setConfirmUnfollowUserModalDeferred,
  ] = useState()

  const [
    confirmReportUserModalVisible,
    setConfirmReportUserModalVisible,
  ] = useState(false)
  const [
    confirmReportUserModalDeferred,
    setConfirmReportUserModalDeferred,
  ] = useState()

  const [
    confirmBlockUserModalVisible,
    setConfirmBlockUserModalVisible,
  ] = useState(false)
  const [
    confirmBlockUserModalDeferred,
    setConfirmBlockUserModalDeferred,
  ] = useState()

  const [isFollowersScrolled, setIsFollowersScrolled] = useState(true)
  const [isFollowingScrolled, setIsFollowingScrolled] = useState(true)
  const [followersHasMoreItems, setFollowersHasMoreItems] = useState(true)
  const [followingHasMoreItems, setFollowingHasMoreItems] = useState(true)
  const [isFollowersEmpty, setIsFollowersEmpty] = useState(false)
  const [isFollowingEmpty, setIsFollowingEmpty] = useState(false)
  const [isFollowersLoading, setIsFollowersLoading] = useState(false)
  const [isFollowingLoading, setIsFollowingLoading] = useState(false)
  const [followersLastId, setFollowersLastId] = useState(null)
  const [followingLastId, setFollowingLastId] = useState(null)

  const loadData = async ({ type, lastId } = {}) => {
    if (type === 'followers') setIsFollowersLoading(true)
    else setIsFollowingLoading(true)

    try {
      const params = { uid: user.uid, limit: 10 }
      if (lastId) params.last_id = lastId

      const response = await Api[
        type === 'followers' ? 'getFollowers' : 'getFollowing'
      ](params)
      if (!response.success) throw new Error(response.message)
      const newData = response.data
        .filter(user => !!user)
        .reduce(
          (_users, user) => ({
            ..._users,
            [user.id]: user,
          }),
          {}
        )

      if (type === 'followers') {
        setFollowers(data => ({ ...data, ...newData }))
        setFollowersInitialized(true)
        setFollowersLastId(response.last_id)
        if (!Object.values(followers).length && !response.data.length)
          setIsFollowersEmpty(true)
        if (!response.data.length) setFollowersHasMoreItems(false)
      } else {
        setFollowing(data => ({ ...data, ...newData }))
        setFollowingInitialized(true)
        setFollowingLastId(response.last_id)
        if (!Object.values(following).length && !response.data.length)
          setIsFollowingEmpty(true)
        if (!response.data.length) setFollowingHasMoreItems(false)
      }
    } catch (error) {
      console.log(error)
    }

    if (type === 'followers') setIsFollowersLoading(false)
    else setIsFollowingLoading(false)
  }

  const handleOnRefresh = useCallback(async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    if (selectedNav === 'followers') {
      setFollowers({})
      setFollowersHasMoreItems(true)
      setIsFollowersEmpty(false)
      setFollowersLastId(null)
    } else {
      setFollowing({})
      setFollowingHasMoreItems(true)
      setIsFollowingEmpty(false)
      setFollowingLastId(null)
    }

    await loadData({ type: selectedNav })
    setIsRefreshing(false)
  }, [setFollowers, setFollowing])

  const handleOnNavItemLayout = useCallback(
    (event, item) => {
      const { layout } = event.nativeEvent
      setNavLayouts(layouts => ({ ...layouts, [item]: layout }))
    },
    [setNavLayouts]
  )

  const handleOnNavItemPress = useCallback(
    nav => {
      configureAnimation()
      setSelectedNav(nav)
    },
    [setSelectedNav]
  )

  const getDeferredData = user => {
    return Promise.all([
      Api.getUser({ uid: user.id }),
      Api.isFollowing({ uid: user.id }),
    ])
  }

  useEffect(() => {
    Object.values(followers)
      .filter(user => !user.$promise)
      .forEach(async user => {
        if (followers[user.id].$promise) return
        setFollowers(followers => {
          return {
            ...followers,
            [user.id]: {
              ...followers[user.id],
              $promise: getDeferredData(user)
                .then(([getUserResponse, isFollowingResponse]) => {
                  setFollowers(followers => ({
                    ...followers,
                    [user.id]: {
                      ...followers[user.id],
                      ...getUserResponse.data,
                      is_following: isFollowingResponse.is_following,
                      follow_type: 'follower',
                    },
                  }))
                })
                .catch(error => {
                  console.log(error.message)
                  setFollowers(followers => ({
                    ...followers,
                    [user.id]: {
                      ...followers[user.id],
                      $hasErrors: true,
                    },
                  }))
                }),
            },
          }
        })
      })
  }, [followers])

  useEffect(() => {
    Object.values(following)
      .filter(user => !user.$promise)
      .forEach(async user => {
        if (following[user.id].$promise) return
        setFollowing(following => {
          return {
            ...following,
            [user.id]: {
              ...following[user.id],
              $promise: getDeferredData(user)
                .then(([getUserResponse, isFollowingResponse]) => {
                  setFollowing(following => ({
                    ...following,
                    [user.id]: {
                      ...following[user.id],
                      ...getUserResponse.data,
                      is_following: isFollowingResponse.is_following,
                      follow_type: 'following',
                    },
                  }))
                })
                .catch(() => {
                  console.log(error.message)
                  setFollowing(following => ({
                    ...following,
                    [user.id]: {
                      ...following[user.id],
                      $hasErrors: true,
                    },
                  }))
                }),
            },
          }
        })
      })
  }, [following])

  useEffect(() => {
    if (selectedNav === 'followers' && !followersInitialized)
      loadData({ type: 'followers' })
    else if (selectedNav === 'following' && !followingInitialized)
      loadData({ type: 'following' })
  }, [selectedNav])

  useEffect(() => {
    if (
      !confirmUnfollowUserModalVisible &&
      !confirmUnfollowUserModalDeferred?.isFulfilled
    )
      confirmUnfollowUserModalDeferred?.resolve(false)
  }, [confirmUnfollowUserModalVisible])

  useEffect(() => {
    if (
      !confirmReportUserModalVisible &&
      !confirmReportUserModalDeferred?.isFulfilled
    )
      confirmReportUserModalDeferred?.resolve(false)
  }, [confirmReportUserModalVisible])

  const selectedNavItemLayout =
    navLayouts[selectedNav] || navLayouts['followers']
  const selectedIndicatorStyle = selectedNavItemLayout
    ? {
        width: selectedNavItemLayout.width,
        left: selectedNavItemLayout.x,
      }
    : {}

  const handleOnUserPress = useCallback(
    user => {
      if (userInfo.uid === user.uid) {
        navigation.push('TabStack', { screen: 'You' })
      } else {
        navigation.push('NBTScreen', {
          screen: 'profile',
          params: {
            screen: 'profile',
            params: { uid: user.uid },
          },
        })
      }
    },
    [navigation]
  )

  const handleOnBlockPress = useCallback(
    async user => {
      try {
        const deferred = Q.defer()
        setSelectedUser(user)
        setConfirmBlockUserModalVisible(true)
        setConfirmBlockUserModalDeferred(deferred)

        const result = await deferred.promise
        if (!result) return
        setIsLoading(true)
        const response = await Api.blockUser({ uid: user.id })
        if (!response.success) throw new Error(response.message)

        Toast.show({
          type: 'success',
          timeout: 5000,
          dismissible: true,
          screenId: 'root',
          label: (
            <Text style={typography.body2}>
              You successfuly blocked{' '}
              <Text style={typography.medium}>{user.full_name}</Text>
            </Text>
          ),
        })
        setDashboardNeedsRefresh(true)
        if (user.follow_type === 'followers') {
          const newFollowers = followers
          delete newFollowers[user.id]
          setFollowers(newFollowers)
        } else {
          const newFollowing = following
          delete newFollowing[user.id]
          setFollowing(newFollowing)
        }
      } catch (error) {
        console.log(error)
        Toast.show({
          type: 'error',
          timeout: 5000,
          dismissible: true,
          screenId: 'profile',
          label: 'Uh-oh, An error occurred. Please try again',
        })
      }
      setIsLoading(false)
    },
    [
      setFollowers,
      setSelectedUser,
      setIsLoading,
      setConfirmBlockUserModalVisible,
      setConfirmBlockUserModalDeferred,
      setDashboardNeedsRefresh,
      setFollowers,
      setFollowing,
    ]
  )

  const handleOnReportPress = useCallback(
    async user => {
      try {
        const deferred = Q.defer()
        setSelectedUser(user)
        setConfirmReportUserModalVisible(true)
        setConfirmReportUserModalDeferred(deferred)

        const result = await deferred.promise
        if (!result) return
        navigation.push('NBTScreen', {
          screen: 'profile',
          params: {
            screen: 'report',
            params: {
              screen: 'report-user',
              params: { user },
            },
          },
        })
      } catch (error) {
        console.log(error)
        Toast.show({
          type: 'error',
          timeout: 5000,
          dismissible: true,
          screenId: 'profile',
          label: 'Uh-oh, An error occurred. Please try again',
        })
      }
    },
    [
      navigation,
      setSelectedUser,
      setConfirmReportUserModalVisible,
      setConfirmReportUserModalDeferred,
    ]
  )

  const handleOnFollowPress = useCallback(
    async user => {
      if (user.is_following) {
        const deferred = Q.defer()
        setSelectedUser(user)
        setConfirmUnfollowUserModalVisible(true)
        setConfirmUnfollowUserModalDeferred(deferred)

        const result = await deferred.promise
        if (!result) return
      }

      if (requests[`${user.id}_${user.follow_type}`]) return
      setRequests(requests => ({
        ...requests,
        [`${user.id}_${user.follow_type}`]: true,
      }))
      try {
        await new Promise(resolve => {
          setTimeout(() => {
            if (user.follow_type === 'follower') {
              setFollowers(followers => ({
                ...followers,
                [user.id]: {
                  ...followers[user.id],
                  is_following: !followers[user.id].is_following,
                },
              }))
            } else {
              setFollowing(following => ({
                ...following,
                [user.id]: {
                  ...following[user.id],
                  is_following: !following[user.id].is_following,
                },
              }))
            }
            resolve()
          }, 2000)
        })
      } catch (error) {
        console.log(error)
        Toast.show({
          type: 'error',
          timeout: 5000,
          dismissible: true,
          screenId: 'profile',
          label: 'Uh-oh, An error occurred. Please try again',
        })
      }

      const newRequests = requests
      delete newRequests[`${user.id}_${user.follow_type}`]
      setRequests(newRequests)
    },
    [setRequests, requests, setFollowers]
  )

  const handleOnMenuPress = useCallback(user => {
    setSelectedUser(user)
    setIsMenuVisible(true)
  })

  const handleOnEndReached = useCallback(() => {
    if (selectedNav === 'followers') {
      if (!isFollowersScrolled || isFollowersLoading || !followersHasMoreItems)
        return
      setIsFollowersScrolled(false)
      loadData({ type: selectedNav, lastId: followersLastId })
    } else {
      if (!isFollowingScrolled || isFollowingLoading || !followingHasMoreItems)
        return
      setIsFollowingScrolled(false)
      loadData({ type: selectedNav, lastId: followingLastId })
    }
  }, [
    loadData,
    selectedNav,
    isFollowersScrolled,
    isFollowersLoading,
    followersHasMoreItems,
    setIsFollowersScrolled,
    isFollowingScrolled,
    isFollowingLoading,
    followingHasMoreItems,
    setIsFollowingScrolled,
  ])

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <UserListItem
          user={item}
          onUserPress={handleOnUserPress}
          currentUserId={userInfo?.uid}
          isRequesting={requests[`${item.id}_${item.follow_type}`]}
          onFollowPress={handleOnFollowPress}
          onMenuPress={handleOnMenuPress}
        />
      )
    },
    [handleOnUserPress, userInfo?.uid, requests, handleOnFollowPress]
  )

  const isOwn = userInfo?.uid && userInfo.uid === user?.uid

  const menuItems = [
    {
      id: 'follow',
      label: (
        <Text
          style={[typography.body1, typography.medium, styles.menuItemLabel]}>
          {!selectedUser.is_following ? 'Follow' : 'Unfollow'} @
          {selectedUser?.username}
        </Text>
      ),
      icon: (
        <Icons.AddFriend
          style={{ color: Colors.contentPlaceholder }}
          {...iconSize(24)}
        />
      ),
      onPress: () => {
        setIsMenuVisible(false)
        handleOnFollowPress(selectedUser)
      },
    },
    {
      id: 'report',
      label: (
        <Text
          style={[typography.body1, typography.medium, styles.menuItemLabel]}>
          Report @{selectedUser?.username}
        </Text>
      ),
      icon: (
        <Icons.Report
          style={{ color: Colors.contentPlaceholder }}
          {...iconSize(24)}
        />
      ),
      onPress: () => {
        setIsMenuVisible(false)
        handleOnReportPress(selectedUser)
      },
    },
    {
      id: 'block',
      label: (
        <Text
          style={[
            typography.body1,
            typography.medium,
            styles.menuItemLabel,
            { color: Colors.secondaryBrinkPink },
          ]}>
          Block @{selectedUser?.username}
        </Text>
      ),
      icon: (
        <Icons.CircleBlock
          style={{ color: Colors.secondaryBrinkPink }}
          {...iconSize(24)}
        />
      ),
      onPress: () => {
        setIsMenuVisible(false)
        handleOnBlockPress(selectedUser)
      },
    },
  ]

  const renderConfirmUnfollowUserModal = () => {
    return (
      <ModalComponent
        isVisible={confirmUnfollowUserModalVisible}
        setIsVisible={setConfirmUnfollowUserModalVisible}>
        {confirmUnfollowUserModalVisible && selectedUser && (
          <View style={styles.confirmUnfollowUserModal}>
            <View style={{ height: normalize(44), width: normalize(44) }}>
              <Avatar
                path={selectedUser.profile_photo}
                size="64x64"
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: normalize(24),
                }}
              />
            </View>
            <Text
              style={[
                typography.display6,
                {
                  color: Colors.primaryMidnightBlue,
                  marginVertical: normalize(16),
                },
              ]}>
              Unfollow {(selectedUser.full_name || '').split(' ')[0]}
            </Text>
            <View
              style={[
                styles.divider,
                { backgroundColor: Colors.secondarySolitude },
              ]}
            />
            <Button
              style={[
                utilStyles.row,
                utilStyles.alignCenter,
                utilStyles.justifyCenter,
                { width: '100%', marginBottom: normalize(12) },
              ]}
              onPress={() => {
                confirmUnfollowUserModalDeferred.resolve(true)
                setConfirmUnfollowUserModalVisible(false)
              }}>
              <Icons.CircleHide
                style={{ color: Colors.secondaryBrinkPink }}
                {...iconSize(24)}
              />
              <Text
                style={[
                  typography.body2,
                  {
                    color: Colors.secondaryBrinkPink,
                    marginLeft: normalize(8),
                  },
                ]}>
                Unfollow @{selectedUser.username}
              </Text>
            </Button>

            <Button
              style={{ width: '100%' }}
              label="Cancel"
              type="disabled"
              onPress={() => setConfirmUnfollowUserModalVisible(false)}
            />
          </View>
        )}
      </ModalComponent>
    )
  }

  const renderConfirmReportUserModal = () => {
    return (
      <ModalComponent
        isVisible={confirmReportUserModalVisible}
        setIsVisible={setConfirmReportUserModalVisible}>
        {confirmReportUserModalVisible && selectedUser && (
          <View style={styles.confirmUnfollowUserModal}>
            <View style={{ height: normalize(44), width: normalize(44) }}>
              <Avatar
                path={selectedUser.profile_photo}
                size="64x64"
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: normalize(24),
                }}
              />
            </View>
            <Text
              style={[
                typography.display6,
                {
                  color: Colors.primaryMidnightBlue,
                  marginVertical: normalize(16),
                },
              ]}>
              Report {(selectedUser.full_name || '').split(' ')[0]}
            </Text>
            <View
              style={[
                styles.divider,
                { backgroundColor: Colors.secondarySolitude },
              ]}
            />
            <Button
              style={[
                utilStyles.row,
                utilStyles.alignCenter,
                utilStyles.justifyCenter,
                { width: '100%', marginBottom: normalize(12) },
              ]}
              onPress={() => {
                confirmReportUserModalDeferred.resolve(true)
                setConfirmReportUserModalVisible(false)
              }}>
              <Icons.CircleHide
                style={{ color: Colors.secondaryBrinkPink }}
                {...iconSize(24)}
              />
              <Text
                style={[
                  typography.body2,
                  {
                    color: Colors.secondaryBrinkPink,
                    marginLeft: normalize(8),
                  },
                ]}>
                Report @{selectedUser.username}
              </Text>
            </Button>

            <Button
              style={{ width: '100%' }}
              label="Cancel"
              type="disabled"
              onPress={() => setConfirmReportUserModalVisible(false)}
            />
          </View>
        )}
      </ModalComponent>
    )
  }

  const renderConfirmBlockUserModal = () => {
    return (
      <ModalComponent
        isVisible={confirmBlockUserModalVisible}
        setIsVisible={setConfirmBlockUserModalVisible}>
        {confirmBlockUserModalVisible && selectedUser && (
          <View style={styles.confirmUnfollowUserModal}>
            <View style={{ height: normalize(44), width: normalize(44) }}>
              <Avatar
                path={selectedUser.profile_photo}
                size="64x64"
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: normalize(24),
                }}
              />
            </View>
            <Text
              style={[
                typography.display6,
                {
                  color: Colors.primaryMidnightBlue,
                  marginVertical: normalize(16),
                },
              ]}>
              Block {(selectedUser.full_name || '').split(' ')[0]}
            </Text>
            <View
              style={[
                styles.divider,
                { backgroundColor: Colors.secondarySolitude },
              ]}
            />
            <Button
              style={[
                utilStyles.row,
                utilStyles.alignCenter,
                utilStyles.justifyCenter,
                { width: '100%', marginBottom: normalize(12) },
              ]}
              onPress={() => {
                confirmBlockUserModalDeferred.resolve(true)
                setConfirmBlockUserModalVisible(false)
              }}>
              <Icons.CircleHide
                style={{ color: Colors.secondaryBrinkPink }}
                {...iconSize(24)}
              />
              <Text
                style={[
                  typography.body2,
                  {
                    color: Colors.secondaryBrinkPink,
                    marginLeft: normalize(8),
                  },
                ]}>
                Block @{selectedUser.username}
              </Text>
            </Button>

            <Button
              style={{ width: '100%' }}
              label="Cancel"
              type="disabled"
              onPress={() => setConfirmBlockUserModalVisible(false)}
            />
          </View>
        )}
      </ModalComponent>
    )
  }

  const renderMenu = () => {
    return (
      <ModalComponent isVisible={isMenuVisible} setIsVisible={setIsMenuVisible}>
        <View style={styles.menu}>
          {menuItems.map(item => {
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}>
                {item.icon}
                {item.label}
              </TouchableOpacity>
            )
          })}
          <Button
            style={{ marginTop: normalize(16) }}
            label="Cancel"
            type="disabled"
            onPress={() => setIsMenuVisible(false)}
          />
        </View>
      </ModalComponent>
    )
  }

  return (
    <>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor="#fff"
      />
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
              {user.display_name || user.full_name}
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.nav}>
            <TouchableOpacity
              onPress={() => handleOnNavItemPress('followers')}
              activeOpacity={0.7}
              onLayout={event => handleOnNavItemLayout(event, 'followers')}
              style={styles.navItem}>
              <Text
                style={[
                  typography.button,
                  typography.uppercase,
                  {
                    color:
                      selectedNav === 'followers'
                        ? Colors.secondaryRoyalBlue
                        : Colors.contentPlaceholder,
                  },
                ]}>
                Followers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleOnNavItemPress('following')}
              activeOpacity={0.7}
              onLayout={event => handleOnNavItemLayout(event, 'following')}
              style={styles.navItem}>
              <Text
                style={[
                  typography.button,
                  typography.uppercase,
                  {
                    color:
                      selectedNav === 'following'
                        ? Colors.secondaryRoyalBlue
                        : Colors.contentPlaceholder,
                  },
                ]}>
                Following
              </Text>
            </TouchableOpacity>

            <View
              style={[styles.selectedNavItemIndicator, selectedIndicatorStyle]}
            />
          </View>

          {selectedNav === 'followers' ? (
            <FlatList
              data={Object.values(followers)}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingVertical: normalize(8) }}
              onEndReached={handleOnEndReached}
              onMomentumScrollBegin={() => setIsFollowersScrolled(true)}
              ListEmptyComponent={
                isFollowersEmpty && (
                  <EmptyState
                    fullName={user.full_name}
                    isOwn={isOwn}
                    type="followers"
                  />
                )
              }
              ListFooterComponent={() => isFollowersLoading && <ListLoader />}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  titleColor={Colors.primaryMidnightBlue}
                  tintColor={Colors.primaryYellow}
                  onRefresh={handleOnRefresh}
                />
              }
            />
          ) : (
            <FlatList
              data={Object.values(following)}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingVertical: normalize(8) }}
              onEndReached={handleOnEndReached}
              onMomentumScrollBegin={() => setIsFollowingScrolled(true)}
              ListEmptyComponent={
                isFollowingEmpty && (
                  <EmptyState
                    fullName={user.full_name}
                    isOwn={isOwn}
                    type="following"
                  />
                )
              }
              ListFooterComponent={() => isFollowingLoading && <ListLoader />}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  titleColor={Colors.primaryMidnightBlue}
                  tintColor={Colors.primaryYellow}
                  onRefresh={handleOnRefresh}
                />
              }
            />
          )}
        </View>
      </View>
      {renderMenu()}
      {renderConfirmUnfollowUserModal()}
      {renderConfirmReportUserModal()}
      {renderConfirmBlockUserModal()}
    </>
  )
}

const ListLoader = () => {
  return (
    <View style={styles.listLoader}>
      <View style={styles.spinnerWrapper}>
        <LottieView source={assetLoader} autoPlay />
      </View>
    </View>
  )
}

class EmptyState extends PureComponent {
  render() {
    const firstName = (this.props?.fullName || '').split(' ')[0]

    return this.props.type === 'followers' ? (
      <View style={styles.emptyState}>
        <Images.NoFollowers {...iconSize(140)} />
        <Text style={[typography.subtitle1, typography.textCenter]}>
          {this.props.isOwn
            ? 'Where’s your buzz?'
            : `${this.props.fullName} has no followers yet`}
        </Text>
        <Text
          style={[
            typography.body2,
            typography.textCenter,
            { marginTop: normalize(8) },
          ]}>
          {this.props.isOwn
            ? 'Post about your biz and the bees will follow.'
            : `Bee a friend today. Connect with ${firstName}!`}
        </Text>
      </View>
    ) : (
      <View style={styles.emptyState}>
        <Images.NoFollowing {...iconSize(140)} />
        <Text style={[typography.subtitle1, typography.textCenter]}>
          {this.props.isOwn
            ? 'You are not following anyone yet'
            : `${this.props.fullName} is not following anyone yet`}
        </Text>
        {this.props.isOwn && (
          <Text
            style={[
              typography.body2,
              typography.textCenter,
              { marginTop: normalize(8) },
            ]}>
            Add more Buzzybees and bee-uild your Beeyanihan network!
          </Text>
        )}
      </View>
    )
  }
}

class UserListItem extends PureComponent {
  render() {
    return (
      <View style={styles.userListItem}>
        <TouchableOpacityGesture
          activeOpacity={0.7}
          onPress={() => this.props.onUserPress(this.props.user)}
          style={styles.avatarWrapper}>
          <Avatar
            path={this.props.user.profile_photo}
            size="64x64"
            style={{
              height: '100%',
              width: '100%',
              borderRadius: normalize(24),
            }}
          />
        </TouchableOpacityGesture>
        <View style={[utilStyles.flex1, { marginLeft: normalize(4) }]}>
          <TouchableOpacityGesture
            activeOpacity={0.7}
            onPress={() => this.props.onUserPress(this.props.user)}>
            <View style={[utilStyles.row, utilStyles.alignCenter]}>
              <Text
                style={[typography.body1, typography.medium]}
                numberOfLines={1}>
                {this.props.user.full_name}
              </Text>
              {this.props.user.account_verified && (
                <Icons.Verified
                  style={{ marginLeft: normalize(6) }}
                  {...iconSize(10)}
                />
              )}
            </View>
            <Text
              style={[typography.caption, { color: Colors.icon }]}
              numberOfLines={1}>
              @{this.props.user.username}
            </Text>
          </TouchableOpacityGesture>
        </View>
        {this.props.currentUserId !== this.props.user.id && (
          <Button
            onPress={() => this.props.onFollowPress(this.props.user)}
            style={{ minWidth: normalize(72) }}
            disabled={this.props.isRequesting}
            disabledStyle={{ opacity: 0.7 }}
            type={
              this.props.user.is_following ? 'primary' : 'secondary-outline'
            }
            label={this.props.user.is_following ? 'Following' : 'Follow'}
            size="small"
          />
        )}
        {
          <TouchableOpacity
            style={{ marginLeft: normalize(8) }}
            activeOpacity={0.7}
            disabled={this.props.isRequesting}
            onPress={() => this.props.onMenuPress(this.props.user)}>
            <Icons.VerticalEllipsis
              style={{ color: Colors.icon }}
              {...iconSize(24)}
            />
          </TouchableOpacity>
        }
      </View>
    )
  }
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
  },
  nav: {
    flexDirection: 'row',
    position: 'relative',
  },
  navItem: {
    width: '50%',
    alignItems: 'center',
    padding: normalize(16),
    borderBottomColor: Colors.neutralGray,
    borderBottomWidth: normalize(1),
  },
  selectedNavItemIndicator: {
    borderTopEndRadius: normalize(10),
    borderTopStartRadius: normalize(10),
    height: normalize(4),
    backgroundColor: Colors.link,
    position: 'absolute',
    bottom: 0,
  },
  emptyState: {
    marginTop: normalize(80),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(24),
  },
  avatarWrapper: {
    height: normalize(42),
    width: normalize(42),
    borderRadius: normalize(24),
    overflow: 'hidden',
    marginRight: normalize(8),
  },
  userListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
  },
  menu: {
    backgroundColor: '#fff',
    padding: normalize(24),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(10),
  },
  menuItemLabel: {
    marginLeft: normalize(8),
    color: Colors.contentPlaceholder,
  },
  listLoader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerWrapper: {
    height: normalize(40),
    width: normalize(40),
    marginVertical: normalize(24),
  },
  confirmUnfollowUserModal: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: normalize(24),
    paddingBottom: normalize(12),
    paddingHorizontal: normalize(28),
  },
})

export default FollowersScreen
