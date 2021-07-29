import { Images, ProfileHeaderDefault } from '@/assets/images'
import { Icons } from '@/assets/images/icons'
import Loader from '@/components/loader'
import Toast from '@/components/toast'
import { UserContext } from '@/context/UserContext'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import utilStyles from '@/globals/util-styles'
import {
  generateDynamicLink,
  getPreviewLinkData,
  iconSize,
  isUrl,
  parseSocialLink,
  shallowCompare,
  timePassed,
} from '@/globals/Utils'
import Api from '@/services/Api'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Share,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  RefreshControl,
  Linking,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import HexagonImageMask from './components/hexagon-image-mask'
import moment from 'moment'
import Button from '@/components/Button'
import pluralize from 'pluralize'
import PostCard from '../Post/components/post-card'
import { firebase } from '@react-native-firebase/storage'
import { Context } from '@/context'
import { PureComponent } from 'react'
import TouchableOpacityGesture from 'react-native-gesture-handler/touchables/TouchableOpacity'
import ModalComponent from '../orders/modals'
import Avatar from '@/components/Avatar/avatar'
import { CommonActions } from '@react-navigation/native'
import LottieView from 'lottie-react-native'
import assetLoader from '@/assets/animations/asset-loader.json'
import Q from 'q'
import { cloneDeep } from 'lodash'
import Drawer from '@/components/drawer'
import AsyncStorage from '@react-native-community/async-storage'

const { height, width } = Dimensions.get('window')
const headerHeight = normalize(158)
const gap = normalize(56)
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
 * @typedef {object} ProfileScreenProps
 * @property {string} uid
 */

/**
 * @typedef {object} RootProps
 * @property {ProfileScreenProps} ProfileScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'ProfileScreen'>} param0 */
const ProfileScreen = ({ navigation, route }) => {
  const { userInfo } = useContext(UserContext)
  const { setCreatePostPopupVisible, setDashboardNeedsRefresh } = useContext(
    Context
  )
  const { uid } = route.params || {}

  const scrollViewRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [postsCount, setPostsCount] = useState(0)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [selectedNav, setSelectedNav] = useState('posts')
  const [posts, setPosts] = useState({})
  const [verifiedProgress, setVerifiedProgress] = useState(0)
  const [headerContentLayout, setHeaderContentLayout] = useState({})
  const [moreInfoLayout, setMoreInfoLayout] = useState({})
  const [otherProfileMenuVisible, setOtherProfileMenuVisible] = useState(false)
  const [isFollowRequesting, setIsFollowRequesting] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isPendingVerified, setIsPendingVerified] = useState(false)
  const [isFollowing, setIsFollowing] = useState(null)
  const [
    confirmReportUserModalVisible,
    setConfirmReportUserModalVisible,
  ] = useState(false)
  const [currentTemperature, setCurrentTemperature] = useState(null)
  const [
    confirmBlockUserModalVisible,
    setConfirmBlockUserModalVisible,
  ] = useState(false)
  const [
    confirmUnfollowUserModalVisible,
    setConfirmUnfollowUserModalVisible,
  ] = useState(false)

  const [
    confirmUnfollowModalDeferred,
    setConfirmUnfollowModalDeferred,
  ] = useState()

  const [temperatureNoteVisible, setTemperatureNoteVisible] = useState(null)

  const [verificationStatus, setVerificationStatus] = useState({})
  const [pendingRequests, setPendingRequests] = useState({})

  const scrollY = useRef(new Animated.Value(0)).current
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  )

  const [hasMorePost, setHasMorePost] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const handleOnRefresh = async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    setPosts({})
    setCurrentPage(0)
    setHasMorePost(true)
    await loadData({
      page: 0,
      limit: 5,
    })
    setIsRefreshing(false)
  }

  const loadData = useCallback(
    async (filters = {}) => {
      setIsLoading(true)
      try {
        const isOtherUser = uid && uid !== userInfo?.uid
        const requests = [
          Api.getUserPosts({
            uid: uid || userInfo?.uid,
            ...filters,
          }),
        ]

        if (isOtherUser) {
          requests.push(Api.isFollowing({ uid }))
        }

        const [getPostsResponse, isFollowingResponse] = await Promise.all(
          requests
        )

        if (!getPostsResponse.success) throw new Error(getPostsResponse.message)

        const { data, total_pages, total_posts, page } = getPostsResponse
        const newPosts = data
          .filter(post => !!post)
          .map(post => ({ ...post, $isLoading: true }))
          .reduce(
            (_posts, post) => ({
              ..._posts,
              [post.id]: post,
            }),
            {}
          )

        if (!total_pages && !total_posts) setIsEmpty(true)
        if (page >= total_pages) setHasMorePost(false)

        setIsFollowing(isFollowingResponse?.is_following)
        setCurrentPage(page)
        setPosts(posts => ({ ...posts, ...newPosts }))
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
      setPosts,
      setIsLoading,
      setIsFollowing,
      setCurrentPage,
      setPosts,
      setCurrentTemperature,
      setHasMorePost,
      setIsEmpty,
    ]
  )

  useEffect(() => {
    loadData({
      page: 0,
      limit: 5,
    })
    const subscribers = []
    subscribers.push(
      firebase
        .firestore()
        .collection('users')
        .doc(uid || userInfo?.uid)
        .onSnapshot(async snap => {
          const data = snap?.data?.()
          setUserData(data || {})
        })
    )

    subscribers.push(
      firebase
        .firestore()
        .collection('counts')
        .doc(uid || userInfo?.uid)
        .onSnapshot(snap => {
          const data = snap?.data?.()
          if (!isNaN(data?.followers) && data.followers !== followersCount)
            setFollowersCount(data.followers)
          if (!isNaN(data?.following && data.following !== followingCount))
            setFollowingCount(data.following)
          if (!isNaN(data?.posts) && data.posts !== postsCount)
            setPostsCount(data.posts)
        })
    )

    if (!userInfo?.uid) return
    subscribers.push(
      firebase
        .firestore()
        .collection('temperatures')
        .where('uid', '==', uid || userInfo?.uid)
        .orderBy('date', 'desc')
        .limit(1)
        .onSnapshot(snap => {
          const data = snap?.docs?.[0]?.data?.()
          setCurrentTemperature(data || undefined)
        })
    )

    subscribers.push(
      firebase
        .firestore()
        .doc(`account_verifications/${uid || userInfo?.uid}`)
        .onSnapshot(snap => {
          const data = snap?.data() || {}
          const isVerified = [
            data.email?.status,
            data.phone?.status,
            data.profile?.status,
            data.id?.status,
          ].every(status => status === 'completed')
          const isPendingVerified =
            [
              data.email?.status,
              data.phone?.status,
              data.profile?.status,
            ].every(status => status === 'completed') &&
            data.id?.status === 'submitted'

          setIsVerified(isVerified)
          setIsPendingVerified(isPendingVerified)
          setVerificationStatus(data)
        })
    )

    return () => subscribers.forEach(unsubscribe => unsubscribe())
  }, [])

  useEffect(() => {
    if (currentTemperature === undefined && userInfo?.uid && !uid) {
      AsyncStorage.getItem('show-log-temperature').then(shouldShowLogTemp => {
        if (!shouldShowLogTemp || shouldShowLogTemp !== 'false')
          setTemperatureNoteVisible(true)
      })
    }
  }, [currentTemperature])

  useEffect(() => {
    if (temperatureNoteVisible === false) {
      AsyncStorage.setItem('show-log-temperature', 'false')
    }
  }, [temperatureNoteVisible])

  useEffect(() => {
    setVerifiedProgress(
      Object.values(verificationStatus).reduce(
        (a, verification) =>
          a +
          (['completed', 'submitted'].includes(verification?.status) ? 1 : 0),
        0
      ) * 25
    )
  }, [verificationStatus])

  useEffect(() => {
    Object.values(posts)
      .filter(post => !post.$promise)
      .forEach(async post => {
        if (posts[post.id].$promise) return
        setPosts(posts => ({
          ...posts,
          [post.id]: {
            ...posts[post.id],
            $promise: getPostData(post).then(([getLikesResponse]) => {
              setPosts(posts => ({
                ...posts,
                [post.id]: {
                  ...posts[post.id],
                  likes: getLikesResponse.likes || [],
                },
              }))
            }),
          },
        }))
      })
  }, [posts])

  useEffect(() => {
    if (
      !confirmUnfollowUserModalVisible &&
      !confirmUnfollowModalDeferred?.isFulfilled
    )
      confirmUnfollowModalDeferred?.resolve(false)
  }, [confirmUnfollowUserModalVisible])

  const getPostData = post => {
    return Promise.all([Api.getPostLikes({ pid: post.id })])
  }

  const handleOnBackPress = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleOnSharePress = useCallback(async () => {
    try {
      const url = await generateDynamicLink({
        type: 'profile',
        params: { uid: userInfo?.uid },
        social: await getPreviewLinkData({ type: 'user', data: userInfo }),
      })
      await Share.share({ url, message: url })
    } catch (error) {
      console.log(error)
    }
  }, [])

  const handleOnFollowPress = useCallback(async () => {
    if (otherProfileMenuItems) setOtherProfileMenuVisible(false)
    if (isFollowing) {
      const deferred = Q.defer()
      setConfirmUnfollowUserModalVisible(true)
      setConfirmUnfollowModalDeferred(deferred)

      const result = await deferred.promise
      if (!result) return
    }
    setIsFollowRequesting(true)
    try {
      const response = await Api[isFollowing ? 'unfollowUser' : 'followUser']({
        uid: userData?.uid,
      })
      if (!response.success) throw new Error(response.message)
      setIsFollowing(!isFollowing)
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
    setIsFollowRequesting(false)
  }, [setIsFollowRequesting, setIsFollowing, isFollowing])

  const handleOnQrPress = useCallback(() => {}, [])

  const handleOnMenuPress = useCallback(() => {
    if (userData?.uid !== userInfo?.uid) {
      setOtherProfileMenuVisible(true)
    } else {
      navigation.push('NBTScreen', {
        screen: 'profile',
        params: {
          screen: 'profile-menu',
        },
      })
    }
  }, [setOtherProfileMenuVisible, navigation, userData?.uid, userInfo?.uid])

  const handleOnBlockPress = useCallback(async () => {
    if (!userData?.uid) return
    setConfirmBlockUserModalVisible(false)
    setIsPageLoading(true)
    try {
      const response = await Api.blockUser({ uid: userData?.uid })
      if (!response.success) throw new Error(response.message)
      Toast.show({
        type: 'success',
        timeout: 5000,
        dismissible: true,
        screenId: 'root',
        label: (
          <Text style={typography.body2}>
            You successfuly blocked{' '}
            <Text style={typography.medium}>{userData?.full_name}</Text>
          </Text>
        ),
      })
      setDashboardNeedsRefresh(true)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'TabStack' }],
        })
      )
    } catch (error) {
      console.log(error)
      Toast.show({
        type: 'error',
        timeout: 5000,
        dismissible: true,
        screenId: 'root',
        label: 'There was an error blocking this user',
      })
    }
    setIsPageLoading(false)
  }, [
    setIsPageLoading,
    setConfirmBlockUserModalVisible,
    setDashboardNeedsRefresh,
  ])

  const handleOnReportPress = useCallback(() => {
    setConfirmReportUserModalVisible(false)
    navigation.push('NBTScreen', {
      screen: 'profile',
      params: {
        screen: 'report',
        params: {
          screen: 'report-user',
          params: {
            user: userData,
          },
        },
      },
    })
  }, [navigation, setConfirmBlockUserModalVisible])

  const handleOnEditProfilePress = useCallback(() => {
    navigation.push('NBTScreen', {
      screen: 'profile',
      params: {
        screen: 'edit-profile',
      },
    })
  }, [navigation])

  const handleOnUpdateTemperaturePress = useCallback(async () => {
    setTemperatureNoteVisible(false)
    navigation.push('NBTScreen', {
      screen: 'profile',
      params: {
        screen: 'temperature',
        params: {
          screen: 'update-temperature',
        },
      },
    })
  }, [navigation])

  const handleOnTemperatureAboutPress = useCallback(async () => {
    setTemperatureNoteVisible(false)
    navigation.push('NBTScreen', {
      screen: 'profile',
      params: {
        screen: 'temperature',
        params: {
          screen: 'temperature-about',
        },
      },
    })
  }, [navigation])

  const handleOnVerifyPress = useCallback(() => {
    navigation.push('NBTScreen', {
      screen: 'Verification',
    })
  }, [navigation])

  const handleOnFollowersPress = useCallback(() => {
    navigation.push('NBTScreen', {
      screen: 'profile',
      params: {
        screen: 'followers',
        params: {
          user: userData,
        },
      },
    })
  }, [navigation, userData?.uid])

  const handleOnDiscoverPress = useCallback(() => {
    navigation.push('TabStack', { screen: 'Servbees' })
  }, [navigation])

  const handleOnCreatePostPress = useCallback(() => {
    if (userInfo) setCreatePostPopupVisible(true)
    else {
      navigation.push('posts', {
        params: {
          screen: 'guest-post',
        },
      })
    }
  }, [setCreatePostPopupVisible, navigation])

  const handleOnEndReached = useCallback(() => {
    if (!scrolled || !hasMorePost || isLoading) return
    setScrolled(false)

    loadData({
      page: currentPage + 1,
      limit: 5,
    })
  }, [loadData, setScrolled, scrolled, hasMorePost, isLoading])

  const handleOnPostPress = useCallback(post => {
    navigation.push('NBTScreen', {
      screen: 'posts',
      params: {
        screen: 'published-post',
        params: {
          id: post.id,
          uid: post.uid,
        },
      },
    })
  }, [])

  const handleOnLikePress = useCallback(
    post => {
      const oldLikes = cloneDeep(post.likes || [])
      const newLikes = cloneDeep(post.likes || [])

      const isLiked = oldLikes.includes(userInfo?.uid)
      if (isLiked) newLikes.splice(newLikes.indexOf(userInfo?.uid), 1)
      else newLikes.push(userInfo?.uid)

      try {
        if (pendingRequests[`${post.id}_like`]) return
        setPendingRequests(requests => ({
          ...requests,
          [`${post.id}_like`]: true,
        }))

        setPosts(posts => ({
          ...posts,
          [post.id]: { ...posts[post.id], likes: newLikes },
        }))

        Api[isLiked ? 'unlikePost' : 'likePost']({ pid: post.id })
      } catch (error) {
        console.log(error)

        setPosts(posts => ({
          ...posts,
          [post.id]: { ...posts[post.id], likes: oldLikes },
        }))

        Toast.show({
          type: 'error',
          timeout: 5000,
          dismissible: true,
          screenId: 'profile',
          label: 'Uh-oh, An error occurred. Please try again',
        })
      }
      const newPendingRequests = pendingRequests
      delete newPendingRequests[`${post.id}_like`]

      setPendingRequests(newPendingRequests)
    },
    [setPendingRequests, pendingRequests]
  )

  const renderItem = ({ item }) => {
    return (
      <PostCard
        post={item}
        onPostPress={handleOnPostPress}
        onLikePress={handleOnLikePress}
        currentLocation={null}
        containerStyle={styles.postCard}
        showLikeButton={!!item.likes}
      />
    )
  }

  const handleOnHeaderContentLayout = useCallback(event => {
    setHeaderContentLayout(event.nativeEvent.layout)
  }, [])

  const handleOnMoreInfoLayout = useCallback(event => {
    setMoreInfoLayout(event.nativeEvent.layout)
  }, [])

  const containerStyle = {
    ...(selectedNav === 'info'
      ? {
          height: normalize(
            headerContentLayout.height
              ? headerContentLayout.height +
                  headerHeight -
                  gap +
                  (moreInfoLayout.height || 0)
              : height
          ),
        }
      : {}),
    paddingTop: headerHeight,
    backgroundColor: '#fff',
  }

  const otherProfileMenuItems = [
    {
      id: 'follow',
      label: (
        <Text
          style={[
            typography.body1,
            typography.medium,
            styles.otherProfileMenuItemLabel,
          ]}>
          {!isFollowing ? 'Follow' : 'Unfollow'} @{userData?.username}
        </Text>
      ),
      icon: <Icons.AddFriend style={styles.iconsAddFriend} {...iconSize(24)} />,
      onPress: handleOnFollowPress,
    },
    {
      id: 'report',
      label: (
        <Text
          style={[
            typography.body1,
            typography.medium,
            styles.otherProfileMenuItemLabel,
          ]}>
          Report @{userData?.username}
        </Text>
      ),
      icon: <Icons.Report style={styles.iconsAddFriend} {...iconSize(24)} />,
      onPress: () => {
        setOtherProfileMenuVisible(false)
        setConfirmReportUserModalVisible(true)
      },
    },
    {
      id: 'block',
      label: (
        <Text
          style={[
            typography.body1,
            typography.medium,
            styles.otherProfileMenuItemLabel,
            styles.brinkPink,
          ]}>
          Block @{userData?.username}
        </Text>
      ),
      icon: <Icons.CircleBlock style={styles.brinkPink} {...iconSize(24)} />,
      onPress: () => {
        setOtherProfileMenuVisible(false)
        setConfirmBlockUserModalVisible(true)
      },
    },
  ]

  const renderOtherProfileMenuModal = () => {
    return (
      <ModalComponent
        isVisible={otherProfileMenuVisible}
        setIsVisible={setOtherProfileMenuVisible}>
        {otherProfileMenuVisible && (
          <View style={styles.otherProfileMenu}>
            {otherProfileMenuItems.map(item => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.otherProfileMenuItem}
                  onPress={item.onPress}
                  activeOpacity={0.7}>
                  {item.icon}
                  {item.label}
                </TouchableOpacity>
              )
            })}
            <Button
              style={styles.marginTopOnly}
              label="Cancel"
              type="disabled"
              onPress={() => setOtherProfileMenuVisible(false)}
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
        {confirmReportUserModalVisible && userData && (
          <View style={styles.confirmReportUserModal}>
            <View style={styles.avatarContainer}>
              <Avatar
                path={userData?.profile_photo}
                size="64x64"
                style={styles.avatarComponent}
              />
            </View>
            <Text style={[typography.display6, styles.reportCopy]}>
              Report {(userData?.full_name || '').split(' ')[0]}
            </Text>
            <Text
              style={[
                typography.body2,
                typography.textCenter,
                styles.marginTopOneGrid,
              ]}>
              Servbees won’t tell {(userData?.full_name || '').split(' ')[0]}{' '}
              that you reported her/him.
            </Text>
            <View style={[styles.divider, styles.solitudeColor]} />
            <Button
              style={[
                utilStyles.row,
                utilStyles.alignCenter,
                utilStyles.justifyCenter,
                styles.buttonAdditionalStyle,
              ]}
              onPress={handleOnReportPress}>
              <Icons.Report style={styles.brinkPink} {...iconSize(24)} />
              <Text
                style={[typography.body2, styles.reportCopyAdditionalStyle]}>
                Report @{userData?.username}
              </Text>
            </Button>

            <Button
              style={styles.fullButton}
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
        {confirmBlockUserModalVisible && userData && (
          <View style={styles.confirmUnfollowUserModal}>
            <View style={styles.blockContainer}>
              <Avatar
                path={userData?.profile_photo}
                size="64x64"
                style={styles.avatarComponent}
              />
            </View>
            <Text
              style={[typography.display6, styles.midnightBlueAndMarginTop]}>
              Block {(userData?.full_name || '').split(' ')[0]}
            </Text>
            <Text
              style={[
                typography.body2,
                typography.textCenter,
                styles.marginTopOneGrid,
              ]}>
              Once blocked, they won't be able to see your profile and posts.
              They will not receive any notifications that they have been
              blocked.
            </Text>
            <View style={[styles.divider, styles.brinkPink]} />
            <Button
              style={[
                utilStyles.row,
                utilStyles.alignCenter,
                utilStyles.justifyCenter,
                styles.widthMarginLeft,
              ]}
              onPress={handleOnBlockPress}>
              <Icons.Report style={styles.brinkPink} {...iconSize(24)} />
              <Text style={[typography.body2, styles.brinkPinkAndLeft]}>
                Block @{userData?.username}
              </Text>
            </Button>

            <Button
              style={styles.fullButton}
              label="Cancel"
              type="disabled"
              onPress={() => setConfirmBlockUserModalVisible(false)}
            />
          </View>
        )}
      </ModalComponent>
    )
  }

  const renderConfirmUnfollowUserModal = () => {
    return (
      <ModalComponent
        isVisible={confirmUnfollowUserModalVisible}
        setIsVisible={setConfirmUnfollowUserModalVisible}>
        {confirmUnfollowUserModalVisible && userData && (
          <View style={styles.confirmBlockUserModal}>
            <View style={styles.blockContainer}>
              <Avatar
                path={userData?.profile_photo}
                size="64x64"
                style={styles.avatarComponent}
              />
            </View>
            <Text style={[typography.display6, styles.brinkPinkVertical]}>
              Unfollow {(userData?.full_name || '').split(' ')[0]}
            </Text>
            <View style={[styles.divider, styles.solitudeColor]} />
            <Button
              style={[
                utilStyles.row,
                utilStyles.alignCenter,
                utilStyles.justifyCenter,
                styles.fullWidthBottom,
              ]}
              onPress={() => {
                confirmUnfollowModalDeferred.resolve(true)
                setConfirmUnfollowUserModalVisible(false)
              }}>
              <Icons.CircleHide style={styles.brinkPink} {...iconSize(24)} />
              <Text style={[typography.body2, styles.brinkPinkAndLeft]}>
                Unfollow @{userData?.username}
              </Text>
            </Button>

            <Button
              style={styles.fullButton}
              label="Cancel"
              type="disabled"
              onPress={() => setConfirmUnfollowUserModalVisible(false)}
            />
          </View>
        )}
      </ModalComponent>
    )
  }

  const renderTemperatureNoteModal = () => {
    return (
      <Drawer
        isVisible={!!temperatureNoteVisible}
        hide={() => setTemperatureNoteVisible(false)}>
        <View style={styles.temperatureNote}>
          <Images.LogTemp width="100%" />
          <View style={styles.temperatureNoteContent}>
            <Text
              style={[
                typography.display5,
                typography.textCenter,
                styles.midnightBlueAndMarginTopOne,
              ]}>
              Log your Temperature
            </Text>
            <Text
              style={[
                typography.body1,
                typography.textCenter,
                { marginTop: normalize(12) },
              ]}>
              Your safety and the safety of others is important to us. Let's
              work together in keeping our Servbees community safe and healthy.
            </Text>

            <View
              style={[
                utilStyles.row,
                utilStyles.alignCenter,
                { marginTop: normalize(32) },
              ]}>
              <Icons.InfoCircle
                style={{ color: Colors.icon, marginRight: normalize(6) }}
                {...iconSize(16)}
              />
              <Text
                style={[
                  typography.body2,
                  { color: Colors.contentPlaceholder },
                ]}>
                Things to note:
              </Text>
            </View>
            <Text
              style={[
                typography.body2,
                { color: Colors.contentPlaceholder, marginTop: normalize(6) },
              ]}>
              Your temperature will be publicly displayed on your profile for
              your customers.
            </Text>
            <Text
              style={[
                typography.body2,
                { color: Colors.contentPlaceholder, marginTop: normalize(6) },
              ]}>
              Need more info?{' '}
              <Text
                style={typography.link}
                onPress={handleOnTemperatureAboutPress}>
                Learn More
              </Text>
            </Text>
            <View style={{ marginTop: normalize(40) }}>
              <Button
                onPress={handleOnUpdateTemperaturePress}
                type="primary"
                label="Log Temperature"
              />
              <Button
                style={{ marginTop: normalize(8) }}
                labelStyle={{ color: Colors.link }}
                onPress={() => setTemperatureNoteVisible(false)}
                label="I’ll do it later"
              />
            </View>
          </View>
        </View>
      </Drawer>
    )
  }

  return (
    <>
      <View style={[utilStyles.flex1, { position: 'relative' }]}>
        <StatusBar
          translucent={true}
          barStyle="light-content"
          backgroundColor="transparent"
        />
        <Toast
          ref={ref => Toast.setRef(ref, 'profile')}
          containerStyle={{
            marginTop: getStatusBarHeight() + normalize(8),
          }}
        />
        <Loader style={{ zIndex: 1 }} visible={isPageLoading} />
        <LinearGradient
          style={{
            flex: 1,
            position: 'absolute',
            top: 0,
            zIndex: 4,
            width: '100%',
            height: headerHeight,
          }}
          colors={['rgba(0,0,0,.45)', 'transparent']}
          locations={[0, 0.2]}
          pointerEvents="none"
        />
        <ProfileHeader
          scrollY={scrollY}
          onBackPress={handleOnBackPress}
          onSharePress={handleOnSharePress}
          onFollowPress={handleOnFollowPress}
          onQrPress={handleOnQrPress}
          onMenuPress={handleOnMenuPress}
          userInfo={userInfo}
          uid={userData?.uid}
          showFollowButton={isFollowing !== null}
          isFollowing={isFollowing}
          isFollowRequesting={isFollowRequesting}
        />
        <ProfileAvatar
          profilePhoto={userData?.profile_photo}
          scrollY={scrollY}
        />
        <Animated.FlatList
          keyExtractor={item => item.id}
          data={Object.values(posts)}
          onEndReached={handleOnEndReached}
          renderItem={renderItem}
          ref={scrollViewRef}
          style={styles.wrapper}
          onScroll={onScroll}
          bounces={false}
          scrollEventThrottle={16}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          onMomentumScrollBegin={() => setScrolled(true)}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              progressViewOffset={headerHeight}
              titleColor={Colors.primaryMidnightBlue}
              tintColor={Colors.primaryYellow}
              onRefresh={handleOnRefresh}
            />
          }
          contentContainerStyle={containerStyle}
          ItemSeparatorComponent={() => (
            <View style={[styles.divider, { marginVertical: 0 }]} />
          )}
          ListHeaderComponent={
            <View style={styles.content} onLayout={handleOnHeaderContentLayout}>
              <ProfileSecondaryHeader
                name={userData?.display_name || userData?.full_name}
                scrollY={scrollY}
                onSharePress={handleOnSharePress}
                onFollowPress={handleOnFollowPress}
                onQrPress={handleOnQrPress}
                onMenuPress={handleOnMenuPress}
                userInfo={userInfo}
                verified={userData?.account_verified}
                uid={userData?.uid}
                showFollowButton={isFollowing !== null}
                isFollowing={isFollowing}
                isFollowRequesting={isFollowRequesting}
                verified={isVerified}
                pendingVerified={isPendingVerified}
              />
              <ProfileInfo
                userData={userData}
                userInfo={userInfo}
                scrollY={scrollY}
                verifiedProgress={verifiedProgress}
                postsCount={postsCount}
                followersCount={followersCount}
                onEditProfilePress={handleOnEditProfilePress}
                onUpdateTemperaturePress={handleOnUpdateTemperaturePress}
                onVerifyPress={handleOnVerifyPress}
                onFollowersPress={handleOnFollowersPress}
                currentTemperature={currentTemperature}
                verified={isVerified}
                pendingVerified={isPendingVerified}
              />
              <Badges items={userData?.badges} scrollY={scrollY} />
              <ProfileNav
                scrollY={scrollY}
                selectedNav={selectedNav}
                onPress={setSelectedNav}
              />
              <ProfileMoreInfo
                hidden={selectedNav === 'posts' ? true : false}
                scrollY={scrollY}
                onLayout={handleOnMoreInfoLayout}
                onEditProfilePress={handleOnEditProfilePress}
                containerStyle={{
                  bottom: -(moreInfoLayout.height || 0),
                }}
                verificationStatus={verificationStatus}
                userData={userData}
                userInfo={userInfo}
                followersCount={followersCount}
                followingCount={followingCount}
              />
            </View>
          }
          ListHeaderComponentStyle={{ elevation: 1 }}
          ListEmptyComponent={
            isEmpty && (
              <EmptyPostsState
                onDiscoverPress={handleOnDiscoverPress}
                onCreatePostPress={handleOnCreatePostPress}
                userInfo={userInfo}
                userData={userData}
              />
            )
          }
          ListFooterComponent={
            !hasMorePost && !isEmpty ? (
              <ListFooter />
            ) : (
              isLoading && <ListLoader />
            )
          }
          stickyHeaderIndices={[0]}
        />
      </View>
      {renderOtherProfileMenuModal()}
      {renderConfirmReportUserModal()}
      {renderConfirmBlockUserModal()}
      {renderConfirmUnfollowUserModal()}
      {renderTemperatureNoteModal()}
    </>
  )
}

const ListFooter = () => {
  return (
    <View style={styles.listFooter}>
      <Text style={[typography.caption, { color: Colors.contentPlaceholder }]}>
        No more new posts.
      </Text>
    </View>
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

class ProfileMoreInfo extends PureComponent {
  render() {
    const translateY = this.props.scrollY.interpolate({
      inputRange: [0, headerHeight - 1, headerHeight],
      outputRange: [0, 0, -1],
    })

    const isOwn = this.props.userData?.uid === this.props.userInfo?.uid
    const verifiedProgress =
      Object.values(this.props.verificationStatus).reduce(
        (a, verification) => a + (verification?.status === 'completed' ? 1 : 0),
        0
      ) * 25

    const hasPendingVerification = Object.values(
      this.props.verificationStatus
    ).some(verification => verification?.status === 'submitted')

    const filteredLinks = (this.props.userData?.links || []).filter(link =>
      isUrl(link.toLowerCase())
    )

    const websites = filteredLinks.filter(
      link => parseSocialLink(link.toLowerCase()) === 'website'
    )

    const iconStyle = { color: Colors.link }
    const urlIcons = {
      facebook: <Icons.SocialFacebook style={iconStyle} {...iconSize(24)} />,
      twitter: <Icons.SocialTwitter style={iconStyle} {...iconSize(24)} />,
      instagram: <Icons.SocialInstagram style={iconStyle} {...iconSize(24)} />,
      youtube: <Icons.SocialYoutube style={iconStyle} {...iconSize(24)} />,
      tiktok: <Icons.SocialTiktok style={iconStyle} {...iconSize(24)} />,
      vimeo: <Icons.SocialVimeo style={iconStyle} {...iconSize(24)} />,
      twitch: <Icons.SocialTwitch style={iconStyle} {...iconSize(24)} />,
      dribbble: <Icons.SocialDribbble style={iconStyle} {...iconSize(24)} />,
      medium: <Icons.SocialMedium style={iconStyle} {...iconSize(24)} />,
      github: <Icons.SocialGithub style={iconStyle} {...iconSize(24)} />,
      website: <Icons.Globe style={iconStyle} {...iconSize(24)} />,
    }

    const socialLinks = filteredLinks
      .map(link => ({
        type: parseSocialLink(link.toLowerCase()),
        link,
      }))
      .filter(({ type }) => {
        return !!type && type !== 'website'
      })
      .map(({ type, link }) => ({
        link,
        icon: urlIcons[type],
      }))

    const handleOnLinkPress = link => {
      Linking.openURL(link)
    }

    const renderEmptyState = () => {
      if (
        this.props.userData?.description?.length ||
        hasPendingVerification ||
        verifiedProgress > 25
      )
        return

      return (
        <View
          style={[
            utilStyles.justifyCenter,
            utilStyles.alignCenter,
            { padding: normalize(8) },
          ]}>
          <Images.NoInfo {...iconSize(140)} />
          <Text
            style={[
              typography.subtitle1,
              typography.textCenter,
              { marginTop: normalize(16) },
            ]}>
            {isOwn
              ? 'Help us get to know you better'
              : `No additional information about ${this.props.userData?.full_name}`}
          </Text>
          {isOwn && (
            <>
              <Text
                style={[
                  typography.body2,
                  typography.textCenter,
                  { marginTop: normalize(8) },
                ]}>
                Additional information about you will be posted here. Complete
                your profile now.
              </Text>
              <TouchableOpacityGesture
                onPress={this.props.onEditProfilePress}
                activeOpacity={0.7}>
                <Text
                  onPress={this.props.onEditProfilePress}
                  style={[
                    typography.body2,
                    typography.medium,
                    typography.link,
                    { marginTop: normalize(16) },
                  ]}>
                  Complete your Profile
                </Text>
              </TouchableOpacityGesture>
            </>
          )}
        </View>
      )
    }

    const renderContent = () => {
      if (
        !(
          hasPendingVerification ||
          verifiedProgress > 25 ||
          this.props.userData?.description?.length
        )
      )
        return

      return (
        <View>
          <Text style={typography.subtitle2}>About</Text>
          <Text style={[typography.body2, { marginTop: normalize(16) }]}>
            {!!this.props.userData?.description?.length
              ? this.props.userData?.description
              : isOwn
              ? 'Hey, Buzybee! Tell us more about you'
              : `No additional information about ${this.props.userData?.full_name}`}
          </Text>

          <View
            style={[
              utilStyles.row,
              utilStyles.alignCenter,
              { marginTop: normalize(16) },
            ]}>
            <View style={[utilStyles.row, utilStyles.alignCenter]}>
              <Icons.Users
                style={{ color: Colors.ServbeesYellow }}
                {...iconSize(16)}
              />
              <Text
                style={[
                  typography.caption,
                  typography.medium,
                  { marginLeft: normalize(4) },
                ]}>
                {this.props.followersCount || 0}
              </Text>
              <Text style={[typography.caption, { marginLeft: normalize(4) }]}>
                {pluralize('Follower', this.props.followersCount || 0)}
              </Text>
            </View>
            <View
              style={[
                utilStyles.row,
                utilStyles.alignCenter,
                { marginLeft: normalize(16) },
              ]}>
              <Text
                style={[
                  typography.caption,
                  typography.medium,
                  { marginLeft: normalize(4) },
                ]}>
                {this.props.followingCount || 0}
              </Text>
              <Text style={[typography.caption, { marginLeft: normalize(4) }]}>
                Following
              </Text>
            </View>
          </View>
        </View>
      )
    }

    const renderLinks = () => {
      return (
        !!filteredLinks.length && (
          <View style={styles.linksWrapper}>
            {!!websites.length && (
              <>
                <Text
                  style={[
                    typography.subtitle2,
                    { marginBottom: normalize(4) },
                  ]}>
                  {pluralize('Website', websites.length)}
                </Text>
                {websites.map((link, index) => (
                  <Text
                    key={index}
                    style={[
                      typography.subtitle2,
                      typography.link,
                      { marginTop: normalize(8) },
                    ]}
                    onPress={() => handleOnLinkPress(link)}>
                    {link}
                  </Text>
                ))}
              </>
            )}
            {!!socialLinks.length && (
              <View style={styles.linksWrapper}>
                <Text
                  style={[
                    typography.subtitle2,
                    { marginBottom: normalize(12) },
                  ]}>
                  Social Links
                </Text>
                <View style={styles.socialLinks}>
                  {socialLinks.map(({ link, icon }, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      style={{ marginRight: normalize(16) }}
                      onPress={() => handleOnLinkPress(link)}>
                      {icon}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )
      )
    }

    const renderVerificationStatus = () => {
      if (verifiedProgress === 100 || !isOwn) return

      return (
        <View style={styles.verificationStatus}>
          <Text style={typography.subtitle2}>
            We’re reviewing your profile and documents.{' '}
          </Text>
          <Text style={[typography.caption, { marginTop: normalize(4) }]}>
            You’ll get bee-rified soon!
          </Text>
          <View
            style={[
              utilStyles.row,
              utilStyles.alignCenter,
              utilStyles.justifySpaceBetween,
              { marginTop: normalize(16) },
            ]}>
            <View>
              <View style={[utilStyles.row, utilStyles.alignCenter]}>
                {this.props.verificationStatus.id?.status !== 'completed' ? (
                  <Icons.CirclePending {...iconSize(24)} />
                ) : (
                  <Icons.CheckActive {...iconSize(24)} />
                )}
                <Text
                  style={[
                    typography.body2,
                    {
                      color: Colors.contentPlaceholder,
                      marginLeft: normalize(8),
                    },
                  ]}>
                  Government I.D.
                </Text>
              </View>
              <View
                style={[
                  utilStyles.row,
                  utilStyles.alignCenter,
                  { marginTop: normalize(18) },
                ]}>
                {this.props.verificationStatus.email?.status !== 'completed' ? (
                  <Icons.CirclePending {...iconSize(24)} />
                ) : (
                  <Icons.CheckActive {...iconSize(24)} />
                )}
                <Text
                  style={[
                    typography.body2,
                    {
                      color: Colors.contentPlaceholder,
                      marginLeft: normalize(8),
                    },
                  ]}>
                  Email Address
                </Text>
              </View>
            </View>
            <View>
              <View style={[utilStyles.row, utilStyles.alignCenter]}>
                {this.props.verificationStatus.phone?.status !== 'completed' ? (
                  <Icons.CirclePending {...iconSize(24)} />
                ) : (
                  <Icons.CheckActive {...iconSize(24)} />
                )}
                <Text
                  style={[
                    typography.body2,
                    {
                      color: Colors.contentPlaceholder,
                      marginLeft: normalize(8),
                    },
                  ]}>
                  Mobile Number
                </Text>
              </View>
              <View
                style={[
                  utilStyles.row,
                  utilStyles.alignCenter,
                  { marginTop: normalize(18) },
                ]}>
                {this.props.verificationStatus.profile?.status !==
                  'completed' ||
                this.props.verificationStatus?.id !== 'completed' ? (
                  <Icons.CirclePending {...iconSize(24)} />
                ) : (
                  <Icons.CheckActive {...iconSize(24)} />
                )}
                <Text
                  style={[
                    typography.body2,
                    {
                      color: Colors.contentPlaceholder,
                      marginLeft: normalize(8),
                    },
                  ]}>
                  Profile Info
                </Text>
              </View>
            </View>
          </View>
        </View>
      )
    }

    return (
      <>
        {/* <Text>{typeof this.props.hidden}</Text> */}
        {!this.props.hidden && (
          <Animated.View
            onLayout={this.props.onLayout}
            style={[
              styles.moreInfoWrapper,
              this.props.containerStyle,
              {
                transform: [{ translateY }],
              },
            ]}>
            {renderEmptyState()}
            {renderContent()}
            {renderLinks()}
            {renderVerificationStatus()}
          </Animated.View>
        )}
      </>
    )
  }
}

class EmptyPostsState extends PureComponent {
  render() {
    const isOwn = this.props.userData?.uid === this.props.userInfo?.uid
    return (
      <View style={styles.emptyPostsStateWrapper}>
        <Images.NoPosts {...iconSize(140)} />
        <Text
          style={[
            typography.subtitle1,
            typography.textCenter,
            { marginTop: normalize(16) },
          ]}>
          {isOwn
            ? 'No posts yet? Get buzzing!'
            : `${this.props.userData?.full_name} has no posts yet`}
        </Text>
        {isOwn && (
          <>
            <Text
              style={[
                typography.body2,
                typography.textCenter,
                { marginTop: normalize(8) },
              ]}>
              Start posting offers, browse through the latest deals, or book a
              service you need today.
            </Text>
            <Text
              style={[
                typography.body2,
                typography.medium,
                { marginTop: normalize(16) },
              ]}>
              <Text
                style={typography.link}
                onPress={this.props.onDiscoverPress}>
                Discover
              </Text>{' '}
              or{' '}
              <Text
                style={typography.link}
                onPress={this.props.onCreatePostPress}>
                Post
              </Text>
            </Text>
          </>
        )}
      </View>
    )
  }
}

class Badges extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: this.props.items,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const badges = this.props.items || []
    if (!badges.length) return null
    const badgeIcons = {
      newbee: <Images.Newbee {...iconSize(64)} />,
      beerified: <Images.Beerified {...iconSize(64)} />,
    }

    const badgeLabels = {
      newbee: 'NewBee',
      beerified: 'Bee-rified',
    }

    const translateY = this.props.scrollY.interpolate({
      inputRange: [0, headerHeight - 1, headerHeight],
      outputRange: [0, 0, -1],
    })

    return (
      <Animated.View
        style={[styles.badgesWrapper, { transform: [{ translateY }] }]}>
        <Text
          style={[
            typography.body2,
            typography.medium,
            { textTransform: 'uppercase', marginLeft: normalize(16) },
          ]}>
          {pluralize('Badge', (badges || []).length, true)}
        </Text>
        <ScrollView
          contentContainerStyle={styles.badges}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {badges.map((badge, index) => (
            <View style={styles.badge} key={index}>
              {badgeIcons[badge]}
              <Text
                style={[typography.caption, { marginVertical: normalize(7) }]}>
                {badgeLabels[badge]}
              </Text>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    )
  }
}

class ProfileHeader extends PureComponent {
  render() {
    const translateY = this.props.scrollY.interpolate({
      inputRange: [0, headerHeight - gap],
      outputRange: [0, -headerHeight + gap],
      extrapolateRight: 'clamp',
    })

    const headerContentTranslateY = this.props.scrollY.interpolate({
      inputRange: [0, headerHeight - gap],
      outputRange: [0, headerHeight / 3],
      extrapolateRight: 'clamp',
    })

    const isOwn =
      this.props.userInfo?.uid && this.props.uid === this.props.userInfo.uid

    return (
      <>
        <HeaderActions
          scrollY={this.props.scrollY}
          onSharePress={this.props.onSharePress}
          onFollowPress={this.props.onFollowPress}
          onQrPress={this.props.onQrPress}
          onMenuPress={this.props.onMenuPress}
          onBackPress={this.props.onBackPress}
          isOwn={isOwn}
          showFollowButton={this.props.showFollowButton}
          isFollowing={this.props.isFollowing}
          isFollowRequesting={this.props.isFollowRequesting}
        />
        <Animated.View
          style={{
            position: 'absolute',
            height: headerHeight,
            width,
            transform: [{ translateY }],
            zIndex: 3,
            top: 0,
            overflow: 'hidden',
          }}>
          <Animated.View
            style={{
              transform: [{ translateY: headerContentTranslateY }],
            }}>
            <ProfileHeaderDefault
              width={normalize(375 * 1.2)}
              height={normalize(158 * 1.2)}
            />
          </Animated.View>
          <View style={styles.sectionOffset} />
        </Animated.View>
      </>
    )
  }
}

class ProfileAvatar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: this.props.items,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const translateY = this.props.scrollY.interpolate({
      inputRange: [0, headerHeight / 2],
      outputRange: [-headerHeight / 2, -headerHeight],
      extrapolateRight: 'clamp',
    })

    const translateX = this.props.scrollY.interpolate({
      inputRange: [0, headerHeight / 2 - gap, headerHeight - gap],
      outputRange: [0, 0, -60],
      extrapolateRight: 'clamp',
    })

    const scale = this.props.scrollY.interpolate({
      inputRange: [0, headerHeight / 2 - gap, headerHeight - gap],
      outputRange: [1, 1, 0.21],
      extrapolateRight: 'clamp',
    })

    return (
      <Animated.View
        style={[
          styles.avatarWrapper,
          {
            top: headerHeight,
            transform: [
              {
                translateY,
                translateX,
                scale,
              },
            ],
          },
        ]}>
        <HexagonImageMask
          size={150}
          path={this.props.profilePhoto}
          dimensions="256x256"
          scale={0.5}
        />
      </Animated.View>
    )
  }
}

class HeaderActions extends PureComponent {
  render() {
    const opacity = this.props.scrollY.interpolate({
      inputRange: [gap / 2, gap],
      outputRange: [1, 0],
    })

    return (
      <>
        <Animated.View style={[styles.headerActions, { opacity }]}>
          {!this.props.isOwn && (
            <TouchableOpacityGesture
              style={styles.headerButton}
              activeOpacity={0.7}
              onPress={this.props.onBackPress}>
              <Icons.Back style={styles.headerIcon} {...iconSize(22)} />
            </TouchableOpacityGesture>
          )}
          <View style={styles.headerButtonsWrapper}>
            <Animated.View style={styles.headerButtonGroup}>
              {!this.props.isOwn && this.props.showFollowButton && (
                <View
                  style={this.props.isFollowRequesting ? { opacity: 0.7 } : {}}>
                  <TouchableOpacityGesture
                    style={[styles.headerButton, styles.followButton]}
                    disabled={this.props.isFollowRequesting}
                    activeOpacity={0.7}
                    onPress={this.props.onFollowPress}>
                    {this.props.isFollowRequesting ? (
                      <View
                        style={{ marginLeft: normalize(4), ...iconSize(16) }}>
                        <LottieView source={assetLoader} autoPlay />
                      </View>
                    ) : (
                      <Icons.CircleAdd
                        style={{ color: '#fff' }}
                        {...iconSize(16)}
                      />
                    )}

                    <Text
                      style={[
                        typography.button2,
                        typography.medium,
                        { color: '#fff', marginLeft: normalize(4) },
                      ]}>
                      {this.props.isFollowing ? 'Unfollow' : 'Follow'}
                    </Text>
                  </TouchableOpacityGesture>
                </View>
              )}
              <TouchableOpacityGesture
                style={styles.headerButton}
                activeOpacity={0.7}
                onPress={this.props.onSharePress}>
                <Icons.Share style={styles.headerIcon} {...iconSize(22)} />
              </TouchableOpacityGesture>
              {/* <TouchableOpacityGesture
                style={styles.headerButton}
                activeOpacity={0.7}
                onPress={this.props.onQrPress}>
                <Icons.QR style={styles.headerIcon} {...iconSize(22)} />
              </TouchableOpacityGesture> */}
              {this.props.isOwn && (
                <TouchableOpacityGesture
                  style={[styles.headerButton, { marginRight: 0 }]}
                  activeOpacity={0.7}
                  onPress={this.props.onMenuPress}>
                  <Icons.Menu style={styles.headerIcon} {...iconSize(22)} />
                </TouchableOpacityGesture>
              )}
              {!this.props.isOwn && (
                <TouchableOpacityGesture
                  style={[styles.headerButton, { marginRight: 0 }]}
                  activeOpacity={0.7}
                  onPress={this.props.onMenuPress}>
                  <Icons.VerticalEllipsis
                    style={styles.headerIcon}
                    {...iconSize(22)}
                  />
                </TouchableOpacityGesture>
              )}
            </Animated.View>
          </View>
        </Animated.View>
      </>
    )
  }
}

class ProfileSecondaryHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      actionButtonsWidth: 0,
      name: this.props.name,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  handleOnActionButtonsLayout = event => {
    this.setState({
      actionButtonsWidth: event.nativeEvent.layout.width,
    })
  }

  render() {
    const translateY = this.props.scrollY.interpolate({
      inputRange: [0, headerHeight - gap, headerHeight],
      outputRange: [0, 0, gap],
      extrapolateRight: 'clamp',
    })

    const opacity = this.props.scrollY.interpolate({
      inputRange: [gap / 2, gap],
      outputRange: [0, 1],
    })

    const nameOpacity = this.props.scrollY.interpolate({
      inputRange: [headerHeight + 10, headerHeight + 30],
      outputRange: [0, 1],
    })

    const nameTranslateY = this.props.scrollY.interpolate({
      inputRange: [headerHeight + 10, headerHeight + 30],
      outputRange: [28, -4],
      extrapolateRight: 'clamp',
    })

    const isOwn =
      this.props.userInfo?.uid && this.props.uid === this.props.userInfo.uid

    return (
      <Animated.View
        style={[
          styles.secondaryHeader,
          {
            transform: [{ translateY }],
            opacity,
            overflow: 'hidden',
          },
        ]}>
        <Animated.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: normalize(width - this.state.actionButtonsWidth - 112),
            marginLeft: normalize(56),
            transform: [{ translateY: nameTranslateY }],
            opacity: nameOpacity,
          }}>
          <Text
            numberOfLines={1}
            style={[
              typography.subtitle1,
              typography.medium,
              { color: Colors.primaryMidnightBlue },
            ]}>
            {this.props.name}
          </Text>
          <View
            style={{
              height: normalize(12),
              width: normalize(24),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {!!this.props.verified && (
              <Icons.Verified
                style={{ marginLeft: normalize(4) }}
                {...iconSize(16)}
              />
            )}
            {!!this.props.pendingVerified && (
              <Icons.VerifiedPending
                style={{ marginLeft: normalize(4) }}
                {...iconSize(16)}
              />
            )}
          </View>
        </Animated.View>
        <Animated.View
          style={[
            styles.headerButtonGroup,
            {
              transform: [{ translateY: normalize(-5) }],
              marginRight: normalize(16),
            },
          ]}
          onLayout={this.handleOnActionButtonsLayout}>
          {!isOwn && this.props.showFollowButton && (
            <View style={this.props.isFollowRequesting ? { opacity: 0.7 } : {}}>
              <TouchableOpacityGesture
                style={[styles.headerButtonLight, styles.followButton]}
                activeOpacity={0.7}
                disabled={this.props.isFollowRequesting}
                onPress={this.props.onFollowPress}>
                {this.props.isFollowRequesting ? (
                  <View style={{ ...iconSize(16) }}>
                    <LottieView source={assetLoader} autoPlay />
                  </View>
                ) : (
                  <Icons.CircleAdd
                    style={{ color: Colors.primaryMidnightBlue }}
                    {...iconSize(16)}
                  />
                )}
                <Text
                  style={[
                    typography.button2,
                    typography.medium,
                    { marginLeft: normalize(4) },
                  ]}>
                  {this.props.isFollowing ? 'Unfollow' : 'Follow'}
                </Text>
              </TouchableOpacityGesture>
            </View>
          )}
          <TouchableOpacityGesture
            style={styles.headerButtonLight}
            activeOpacity={0.7}
            onPress={this.props.onSharePress}>
            <Icons.Share style={styles.headerIconLight} {...iconSize(22)} />
          </TouchableOpacityGesture>
          {/* <TouchableOpacity
            style={styles.headerButtonLight}
            activeOpacity={0.7}
            onPress={this.props.onQrPress}>
            <Icons.QR style={styles.headerIconLight} {...iconSize(22)} />
          </TouchableOpacity> */}
          {isOwn && (
            <TouchableOpacityGesture
              style={[styles.headerButtonLight, { marginRight: 0 }]}
              activeOpacity={0.7}
              onPress={this.props.onMenuPress}>
              <Icons.Menu style={styles.headerIconLight} {...iconSize(22)} />
            </TouchableOpacityGesture>
          )}

          {!isOwn && (
            <TouchableOpacityGesture
              style={[styles.headerButtonLight, { marginRight: 0 }]}
              activeOpacity={0.7}
              onPress={this.props.onMenuPress}>
              <Icons.VerticalEllipsis
                style={styles.headerIconLight}
                {...iconSize(22)}
              />
            </TouchableOpacityGesture>
          )}
        </Animated.View>
      </Animated.View>
    )
  }
}

class ProfileInfo extends PureComponent {
  render() {
    const dateJoined = this.props.userData?.date_joined
      ? moment(this.props.userData.date_joined).format('MMM YYYY')
      : null

    const defaultAddress =
      (this.props.userData?.addresses || []).find(address => address.default) ||
      this.props.userData?.addresses?.[0]

    const translateY = this.props.scrollY.interpolate({
      inputRange: [0, headerHeight - 1, headerHeight],
      outputRange: [0, 0, -1],
    })

    const isOwn =
      this.props.userInfo?.uid &&
      this.props.userInfo?.uid === this.props.userData?.uid

    return (
      <>
        <View style={styles.counts}>
          <View style={styles.count}>
            <Text
              style={[typography.subtitle1, { marginBottom: normalize(2) }]}>
              {this.props.postsCount}
            </Text>
            <Text
              style={[
                typography.caption,
                { color: Colors.contentPlaceholder },
              ]}>
              Posts
            </Text>
          </View>

          <TouchableOpacityGesture
            onPress={this.props.onFollowersPress}
            activeOpacity={0.7}
            style={styles.count}>
            <Text
              style={[typography.subtitle1, { marginBottom: normalize(2) }]}>
              {this.props.followersCount}
            </Text>
            <Text
              style={[
                typography.caption,
                { color: Colors.contentPlaceholder },
              ]}>
              Followers
            </Text>
          </TouchableOpacityGesture>
        </View>
        <Animated.View
          style={[styles.profileInfo, { transform: [{ translateY }] }]}>
          <View style={[utilStyles.row, utilStyles.alignCenter]}>
            <Text
              style={[
                typography.subtitle1,
                typography.medium,
                { color: Colors.primaryMidnightBlue },
              ]}>
              {this.props.userData?.display_name ||
                this.props.userData?.full_name}
              <View
                style={{
                  height: normalize(12),
                  width: normalize(24),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {!!this.props.verified && (
                  <Icons.Verified
                    style={{ marginLeft: normalize(4) }}
                    {...iconSize(16)}
                  />
                )}
                {!!this.props.pendingVerified && (
                  <Icons.VerifiedPending
                    style={{ marginLeft: normalize(4) }}
                    {...iconSize(16)}
                  />
                )}
              </View>
            </Text>
          </View>
          <View
            style={[
              utilStyles.row,
              utilStyles.alignCenter,
              { marginTop: normalize(4), flexWrap: 'wrap' },
            ]}>
            {!!this.props.userData?.full_name && (
              <Text
                style={[
                  typography.body1,
                  typography.medium,
                  {
                    color: Colors.contentPlaceholder,
                    marginRight: normalize(16),
                  },
                ]}>
                {this.props.userData.full_name}
              </Text>
            )}
            {!!this.props.userData?.username && (
              <Text
                style={[
                  typography.body1,
                  { color: Colors.contentPlaceholder },
                ]}>
                @{this.props.userData.username}
              </Text>
            )}
          </View>

          {isOwn && (
            <View style={styles.profileButtons}>
              {this.props.currentTemperature ? (
                <TouchableOpacityGesture
                  activeOpacity={0.7}
                  onPress={this.props.onUpdateTemperaturePress}
                  style={[
                    styles.pill,
                    styles.temperature,
                    { marginRight: normalize(10) },
                  ]}>
                  <Icons.Temperature
                    style={{ color: Colors.secondaryLavenderBlue }}
                    {...iconSize(16)}
                  />

                  <Text
                    style={[typography.caption, { marginLeft: normalize(4) }]}>
                    <Text style={typography.medium}>
                      {parseFloat(this.props.currentTemperature.value)}°
                    </Text>
                    <Text> at </Text>
                    {timePassed(
                      Date.now() / 1000 -
                        this.props.currentTemperature.date._seconds
                    )}
                    <Text> ago </Text>
                  </Text>
                  <Text
                    style={[
                      typography.caption,
                      typography.link,
                      typography.medium,
                    ]}>
                    Update
                  </Text>
                </TouchableOpacityGesture>
              ) : (
                <>
                  {this.props.currentTemperature !== null && (
                    <Button
                      type="secondary-outline"
                      onPress={this.props.onUpdateTemperaturePress}
                      style={[
                        utilStyles.row,
                        utilStyles.alignCenter,
                        styles.profileButton,
                        { marginRight: normalize(10) },
                      ]}>
                      <Icons.Temperature
                        style={{
                          color: Colors.primaryMidnightBlue,
                          marginRight: normalize(4),
                        }}
                        {...iconSize(16)}
                      />
                      <Text
                        style={[
                          typography.caption,
                          { color: Colors.primaryMidnightBlue },
                        ]}>
                        Log your temperature
                      </Text>
                    </Button>
                  )}
                </>
              )}

              <Button
                type="secondary-outline"
                onPress={this.props.onEditProfilePress}
                style={[
                  utilStyles.row,
                  utilStyles.alignCenter,
                  styles.profileButton,
                ]}>
                <Icons.PencilPaper
                  style={{
                    color: Colors.primaryMidnightBlue,
                    marginRight: normalize(4),
                  }}
                  {...iconSize(16)}
                />
                <Text
                  style={[
                    typography.caption,
                    { color: Colors.primaryMidnightBlue },
                  ]}>
                  Edit Profile
                </Text>
              </Button>
            </View>
          )}

          <View style={styles.divider} />
          <View
            style={[
              utilStyles.row,
              utilStyles.alignCenter,
              { flexWrap: 'wrap', marginBottom: normalize(24) },
            ]}>
            {!!dateJoined && (
              <View
                style={[
                  utilStyles.row,
                  utilStyles.alignCenter,
                  { marginRight: normalize(8) },
                ]}>
                <Icons.Bee2 {...iconSize(16)} />
                <Text
                  style={[
                    typography.body1,
                    {
                      marginLeft: normalize(4),
                      color: Colors.contentPlaceholder,
                    },
                  ]}>
                  Joined {dateJoined}
                </Text>
              </View>
            )}
            {!!defaultAddress && (
              <View style={[utilStyles.row, utilStyles.alignCenter]}>
                <Icons.NavigationPin
                  style={{ color: Colors.secondaryBrinkPink }}
                  {...iconSize(16)}
                />
                <Text
                  style={[
                    typography.body1,
                    {
                      marginLeft: normalize(4),
                      color: Colors.contentPlaceholder,
                    },
                  ]}>
                  {defaultAddress.city}
                </Text>
              </View>
            )}
          </View>

          {isOwn && this.props.verifiedProgress < 100 && (
            <TouchableOpacity
              onPress={this.props.onVerifyPress}
              activeOpacity={0.7}
              style={styles.verifiedStepsWrapper}>
              <View style={styles.verifiedStepsContent}>
                <View style={utilStyles.row}>
                  <Icons.Verified {...iconSize(24)} />
                  <View
                    style={[
                      utilStyles.flex1,
                      { marginHorizontal: normalize(8) },
                    ]}>
                    <Text style={[typography.body2, typography.medium]}>
                      Get bee-rified
                    </Text>
                    <Text
                      style={[typography.caption, { marginTop: normalize(4) }]}>
                      Safeguard your account and boost your credibility within
                      the community.
                    </Text>
                  </View>
                  <Icons.ChevronRight
                    style={{ color: Colors.primaryMidnightBlue }}
                    {...iconSize(16)}
                  />
                </View>
                <View style={styles.verifiedProgressWrapper}>
                  <View
                    style={[
                      styles.verifiedProgress,
                      { width: `${this.props.verifiedProgress}%` },
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        </Animated.View>
      </>
    )
  }
}

class ProfileNav extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      navLayout: {},
      navItems: {},
    }
  }

  handleOnNavLayout = event => {
    this.setState({
      navLayout: event.nativeEvent.layout,
    })
  }

  render() {
    const handleOnNavItemLayout = (event, item) => {
      const { layout } = event.nativeEvent
      this.setState({
        navItems: {
          ...this.state.navItems,
          [item]: layout,
        },
      })
    }

    const handleOnNavPress = navItem => {
      configureAnimation()
      if (this.props.selectedNav !== navItem) this.props.onPress(navItem)
    }

    const selectedNavItemLayout =
      this.state.navItems[this.props.selectedNav] || this.state.navItems['post']
    const selectedIndicatorStyle = selectedNavItemLayout
      ? {
          width: selectedNavItemLayout.width,
          left: selectedNavItemLayout.x,
        }
      : {}

    const translateY = this.props.scrollY.interpolate({
      inputRange: [
        0,
        headerHeight,
        headerHeight +
          (this.state.navLayout.y || headerHeight) -
          (headerHeight - gap + 2),
      ],
      outputRange: [
        0,
        0,
        -(this.state.navLayout.y || headerHeight) + (headerHeight - gap) - 2,
      ],
      extrapolateRight: 'clamp',
    })

    return (
      <Animated.ScrollView
        style={[styles.navWrapper, { transform: [{ translateY }] }]}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.nav}
        onLayout={this.handleOnNavLayout}>
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onLayout={event => handleOnNavItemLayout(event, 'posts')}
          onPress={() => handleOnNavPress('posts')}>
          <Text
            style={[
              typography.body2,
              typography.medium,
              this.props.selectedNav === 'posts' ? { color: Colors.link } : {},
            ]}>
            POSTS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onLayout={event => handleOnNavItemLayout(event, 'info')}
          onPress={() => handleOnNavPress('info')}>
          <Text
            style={[
              typography.body2,
              typography.medium,
              this.props.selectedNav === 'info' ? { color: Colors.link } : {},
            ]}>
            MORE INFO
          </Text>
        </TouchableOpacity>

        <View
          style={[styles.selectedNavItemIndicator, selectedIndicatorStyle]}
        />
      </Animated.ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    position: 'relative',
  },
  headerActions: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    padding: normalize(16),
    width: '100%',
    justifyContent: 'flex-end',
    zIndex: 6,
    paddingTop: normalize(12 + getStatusBarHeight()),
  },
  headerButtonsWrapper: {
    position: 'relative',
    flex: 1,
  },
  headerButtonGroup: {
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
  },
  headerButton: {
    padding: normalize(5),
    zIndex: 2,
    backgroundColor: '#2e303459',
    borderRadius: normalize(24),
    marginRight: normalize(8),
  },
  headerButtonLight: {
    padding: normalize(5),
    zIndex: 2,
    marginRight: normalize(8),
  },
  headerIcon: {
    color: '#fff',
  },
  headerIconLight: {
    color: Colors.primaryMidnightBlue,
  },
  sectionOffset: {
    height: normalize(8),
    borderTopStartRadius: normalize(6),
    borderTopEndRadius: normalize(6),
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 10,
    bottom: normalize(-1),
    left: 0,
    width: '100%',
  },
  counts: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    marginRight: normalize(6),
    marginTop: normalize(8),
  },
  count: {
    alignItems: 'center',
    marginRight: normalize(36),
  },
  profileInfo: {
    marginTop: normalize(100),
    paddingHorizontal: normalize(16),
    alignItems: 'flex-start',
  },
  secondaryHeader: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 4,
    height: normalize(48),
    borderBottomWidth: normalize(4),
    borderBottomColor: Colors.neutralsZircon,
    alignItems: 'center',
    flexDirection: 'row',
  },
  pill: {
    paddingVertical: normalize(9),
    paddingHorizontal: normalize(8),
    flexDirection: 'row',
    borderRadius: normalize(4),
    alignItems: 'center',
  },
  temperature: {
    backgroundColor: Colors.secondarySolitude,
  },
  divider: {
    height: normalize(1),
    width: '100%',
    backgroundColor: Colors.neutralsZirconLight,
    marginVertical: normalize(16),
  },
  badges: {
    flexDirection: 'row',
    marginTop: normalize(16),
    paddingHorizontal: normalize(16),
  },
  badge: {
    alignItems: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(9),
  },
  navWrapper: {
    zIndex: 5,
    marginTop: normalize(8),
    borderTopWidth: normalize(4),
    borderTopColor: Colors.neutralsZircon,
    borderBottomColor: Colors.neutralGray,
    borderBottomWidth: normalize(1),
    backgroundColor: '#fff',
  },
  nav: {
    paddingHorizontal: normalize(24),
  },
  navItem: {
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(8),
    marginRight: normalize(8),
  },
  selectedNavItemIndicator: {
    borderTopEndRadius: normalize(10),
    borderTopStartRadius: normalize(10),
    height: normalize(4),
    backgroundColor: Colors.link,
    position: 'absolute',
    bottom: 0,
  },
  avatarWrapper: {
    position: 'absolute',
    left: normalize(8),
    zIndex: 5,
  },
  moreInfoWrapper: {
    paddingHorizontal: normalize(16),
    paddingTop: normalize(24),
    paddingBottom: normalize(48),
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 1,
    width: '100%',
  },
  emptyPostsStateWrapper: {
    paddingHorizontal: normalize(28),
    paddingVertical: normalize(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedStepsWrapper: {
    width: '100%',
    marginBottom: normalize(16),
  },
  verifiedStepsContent: {
    padding: normalize(16),
    borderWidth: normalize(1),
    borderColor: Colors.neutralsZircon,
    borderRadius: normalize(4),
  },
  verifiedProgressWrapper: {
    position: 'relative',
    width: '100%',
    height: normalize(8),
    backgroundColor: Colors.secondarySolitude,
    borderRadius: normalize(100),
    marginTop: normalize(8),
  },
  verifiedProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: Colors.contentOcean,
    borderRadius: normalize(100),
  },
  postCard: {
    backgroundColor: '#fff',
    paddingHorizontal: normalize(16),
    marginVertical: normalize(12),
  },
  followButton: {
    padding: normalize(8),
    flexDirection: 'row',
  },
  otherProfileMenu: {
    backgroundColor: '#fff',
    padding: normalize(24),
  },
  otherProfileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(10),
  },
  otherProfileMenuItemLabel: {
    marginLeft: normalize(8),
    color: Colors.contentPlaceholder,
  },
  confirmReportUserModal: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: normalize(24),
    paddingBottom: normalize(12),
    paddingHorizontal: normalize(28),
  },
  confirmBlockUserModal: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: normalize(24),
    paddingBottom: normalize(12),
    paddingHorizontal: normalize(28),
  },
  confirmUnfollowUserModal: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: normalize(24),
    paddingBottom: normalize(12),
    paddingHorizontal: normalize(28),
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
  listFooter: {
    paddingVertical: normalize(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationStatus: {
    borderTopWidth: normalize(1),
    borderTopColor: Colors.secondarySolitude,
    marginTop: normalize(16),
    paddingTop: normalize(16),
  },
  linksWrapper: {
    borderTopWidth: normalize(1),
    borderTopColor: Colors.secondarySolitude,
    marginTop: normalize(16),
    paddingTop: normalize(16),
  },
  socialLinks: {
    flexDirection: 'row',
  },
  profileButtons: {
    marginTop: normalize(16),
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  profileButton: {
    borderWidth: normalize(1),
    paddingVertical: normalize(8),
    minWidth: normalize(120),
    justifyContent: 'center',
  },
  temperatureNote: {
    backgroundColor: '#fff',
  },
  temperatureNoteContent: {
    padding: normalize(24),
    paddingTop: 0,
  },
  iconsAddFriend: {
    color: Colors.contentPlaceholder,
  },
  brinkPink: {
    color: Colors.secondaryBrinkPink,
  },
  marginTopOnly: {
    marginTop: normalize(16),
  },
  avatarContainer: {
    height: normalize(44),
    width: normalize(44),
    borderRadius: normalize(24),
    overflow: 'hidden',
  },
  avatarComponent: {
    height: '100%',
    width: '100%',
    borderRadius: normalize(24),
  },
  reportCopy: {
    color: Colors.primaryMidnightBlue,
    marginTop: normalize(16),
  },
  marginTopOneGrid: {
    marginTop: normalize(8),
  },
  solitudeColor: {
    backgroundColor: Colors.secondarySolitude,
  },
  buttonAdditionalStyle: { width: '100%', marginBottom: normalize(12) },
  reportCopyAdditionalStyle: {
    color: Colors.secondaryBrinkPink,
    marginLeft: normalize(8),
  },
  fullButton: { width: '100%' },
  blockContainer: {
    height: normalize(44),
    width: normalize(44),
  },
  midnightBlueAndMarginTop: {
    color: Colors.primaryMidnightBlue,
    marginTop: normalize(16),
  },
  widthMarginLeft: { width: '100%', marginBottom: normalize(12) },
  brinkPinkAndLeft: {
    color: Colors.secondaryBrinkPink,
    marginLeft: normalize(8),
  },
  brinkPinkVertical: {
    color: Colors.primaryMidnightBlue,
    marginVertical: normalize(16),
  },
  fullWidthBottom: { width: '100%', marginBottom: normalize(12) },
  midnightBlueAndMarginTopOne: {
    color: Colors.primaryMidnightBlue,
    marginTop: normalize(8),
  },
})

export default ProfileScreen
