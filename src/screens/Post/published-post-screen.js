import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  LayoutAnimation,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from 'react-native'
import { Icons } from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import {
  generateDynamicLink,
  getPreviewLinkData,
  iconSize,
} from '@/globals/Utils'
import PostImage, { DefaultPostImage } from '@/components/Post/post-image'
import Swiper from 'react-native-swiper'
import LinearGradient from 'react-native-linear-gradient'
import Avatar from '@/components/Avatar/avatar'
import { formatNumber } from 'react-native-currency-input'
import utilStyles from '@/globals/util-styles'
import { format, formatDistanceToNow, isWithinInterval } from 'date-fns/esm'
import Modal from 'react-native-modal'
import PostDescriptionModal from './modals/post-description'
import Button from '@/components/Button'
import Api from '@/services/Api'
import openMap from 'react-native-open-maps'
import Loader from '@/components/loader'
import Share from 'react-native-share'
import { UserContext } from '@/context/UserContext'
import { ImageModal } from './components/ImageModal'
import MakeOfferModal from './modals/make-offer'
import MenuDrawer from './modals/menu'
import AddToBasketModal from './modals/add-to-basket'
import { Context } from '@/context'
import cloneDeep from 'lodash.clonedeep'
import firestore from '@react-native-firebase/firestore'
import ConfirmResetBasketModal from './modals/confirm-reset-basket'
import ConfirmModal from './modals/confirm'
import Q from 'q'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Toast from '@/components/toast'
import { CommonActions, useFocusEffect } from '@react-navigation/native'
import StatusBar from '@/components/StatusBar'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const { height, width } = Dimensions.get('window')

/**
 * @param {object} User
 * @property {string} uid
 */

/**
 * @typedef {object} Post
 * @property {string} title
 * @property {string} description
 * @property {string} type
 * @property {number} price
 * @property {string} uid
 * @property {User} user
 *
 */

/**
 * @typedef {object} PublishedPostScreenProps
 * @property {Post} post
 * @property {string} id
 * @property {string} type
 * @property {boolean} preview
 * @property {string} uid
 * @property {User} user
 * @property {function} onPublishPress
 */

/**
 * @typedef {object} RootProps
 * @property {PublishedPostScreenProps} PublishedPostScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'PublishedPostScreen'>} param0 */
const PublishedPostScreen = ({ navigation, route }) => {
  const { id, uid, preview = false, onPublishPress } = route.params
  const { userInfo } = useContext(UserContext)
  const { basket, setBasket, setDashboardNeedsRefresh } = useContext(Context)

  const post = useRef(route.params.post)
  const [isLoading, setIsLoading] = useState(false)
  const scrollViewRef = useRef()
  const categoriesNavRef = useRef()
  const user = useRef(route.params.post?.user || route.params.user)
  const [contentHeight, setContentHeight] = useState(0)
  const [scheduleExpanded, setScheduleExpanded] = useState(false)
  const [shippingMethodsExpanded, setShippingMethodsExpanded] = useState(false)
  const [descriptionLines, setDescriptionLines] = useState(0)
  const [categorySections, setCategorySections] = useState({})
  const categorySectionsRef = useRef(categorySections)
  const [categoryNavItems, setCategoryNavItems] = useState({})
  const [buttonsOffset, setButtonsOffset] = useState(0)
  const targetScroll = useRef(null)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [menuDrawerVisible, setMenuDrawerVisible] = useState(false)
  const [addToBasketModalVisible, setAddToBasketModalVisible] = useState(false)
  const [addToBasketModalItem, setAddToBasketModalItem] = useState(null)
  const [existingOrder, setExistingOrder] = useState()
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [confirmModalMessage, setConfirmModalMessage] = useState(false)
  const [confirmModalTitle, setConfirmModalTitle] = useState(false)
  const [confirmModalCallback, setConfirmModalCallback] = useState(() => {})

  const [makeOfferModalVisible, setMakeOfferModalVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(
    post.current?.items?.[0]?.category
  )
  const selectedCategoryRef = useRef(selectedCategory)
  const [selectedCategoryValue, setSelectedCategoryValue] = useState(
    selectedCategory
  )
  const [confirmResetBasketVisible, setConfirmResetBasketVisible] = useState(
    false
  )
  const [resetBasketDeferred, setResetBasketDeferred] = useState()
  const [imageModalImages, setImageModalImages] = useState([])
  const [imageModalSelectedIndex, setImageModalSelectedIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const mounted = useRef(true)

  const [
    postDescriptionModalVisible,
    setPostDescriptionModalVisible,
  ] = useState(false)

  const headerHeight = normalize(350)
  const gap = normalize(100)

  const scrollY = useRef(new Animated.Value(0)).current
  const onScroll = Animated.event(
    [
      {
        nativeEvent: { contentOffset: { y: scrollY } },
      },
    ],
    { useNativeDriver: true }
  )

  const handleOnCategoryPress = category => {
    if (!categorySections[category]) return
    const { y } = categorySections[category]
    scrollViewRef.current.scrollTo({ y })
    categoriesNavRef.current.scrollTo({
      x: categoryNavItems[category].x - normalize(24),
    })
    targetScroll.current = y
    setTimeout(() => {
      targetScroll.current = null
    }, 500)
    setSelectedCategory(category)
  }

  const getPostData = async () => {
    try {
      const responses = await Promise.all([
        Api.getPost({ pid: id }),
        Api.getPostLikes({ pid: id }),
      ])
      const [getPostResponse, getLikesResponse] = responses

      if (!getPostResponse.success) throw new Error(getPostResponse.message)
      if (!getLikesResponse.success) throw new Error(getLikesResponse.message)

      post.current = getPostResponse.data
      post.current.likes = getLikesResponse.likes || []
      setIsLiked(!!post.current.likes?.includes?.(userInfo?.uid))
    } catch (error) {
      Alert.alert('Error', 'Oops, something went wrong')
      console.log(error.message)
    }
  }

  const getUserData = async () => {
    try {
      const response = await Api.getUser({ uid })
      if (!response.success) throw new Error(response.message)

      user.current = response.data
    } catch (error) {
      Alert.alert('Error', 'Oops, something went wrong')
      console.log(error.message)
    }
  }

  const handleOnBackPress = event => {
    event && event.preventDefault()
    navigation.removeListener('beforeRemove', handleOnBackPress)
    if (!navigation.canGoBack()) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'TabStack' }],
        })
      )
    } else {
      navigation.goBack()
    }
  }

  useFocusEffect(
    useCallback(() => {
      navigation.removeListener('beforeRemove', handleOnBackPress)
      navigation.addListener('beforeRemove', handleOnBackPress)

      return () => navigation.removeListener('beforeRemove', handleOnBackPress)
    }, [navigation])
  )

  useEffect(() => {
    const promises = []

    if (id && !post.current) promises.push(getPostData())
    if (uid && !user.current) promises.push(getUserData())
    let listener

    if (!preview && (id || post.current?.id) && userInfo?.uid) {
      setIsLoading(true)
      const promise = new Promise(resolve => {
        listener = firestore()
          .collection('orders')
          .where('post_id', '==', id || post.current.id)
          .where('status', '==', 'pending')
          .where('buyer_id', '==', userInfo.uid)
          .onSnapshot(snap => {
            const order = snap?.docs?.[0]?.data?.()
            setExistingOrder(order)
            resolve()
          })
        promises.push(promise)
      })
    }

    setIsLoading(true)
    Promise.all(promises).finally(() => {
      setIsLoading(false)
    })

    scrollY.addListener(({ value }) => {
      if (targetScroll.current && targetScroll.current !== value) return
      else if (targetScroll.current && targetScroll.current === value) {
        targetScroll.current = null
        return
      }
      const [category] =
        Object.entries(categorySectionsRef.current).find(
          ([category, section]) =>
            value + headerHeight + buttonsOffset > section.y &&
            value + headerHeight + buttonsOffset < section.y + section.height
        ) || []

      setSelectedCategory(category)
    })

    return () => {
      mounted.current = false
      scrollY.removeAllListeners()
      listener?.()
    }
  }, [])

  useEffect(() => {
    categorySectionsRef.current = categorySections
  }, [categorySections])

  useEffect(() => {
    if (selectedCategory && selectedCategoryRef.current !== selectedCategory) {
      selectedCategoryRef.current = selectedCategory
      configureAnimation()
      setSelectedCategoryValue(selectedCategory)
    }
  }, [selectedCategory])

  useEffect(() => {
    if (!confirmResetBasketVisible && !resetBasketDeferred?.isFulfilled)
      resetBasketDeferred?.resolve(false)
  }, [confirmResetBasketVisible])

  const handleOnEditPostPress = () => {
    setMenuDrawerVisible(false)
    navigation.navigate('create-post', {
      data: post.current,
      type: post.current.type,
    })
  }

  const handleOnBuyPress = async () => {
    let shouldReset
    if (basket.postId && basket.postId !== post.current.id) {
      const deferred = Q.defer()
      setConfirmResetBasketVisible(true)
      setResetBasketDeferred(deferred)

      const result = await deferred.promise
      shouldReset = true
      if (!result) return
    }

    if (post.current.type === 'need') {
      if (basket.postId !== post.current.id || shouldReset)
        setBasket({
          postId: post.current.id,
          offer: post.current.budget.minimum,
          message: '',
          attachedPost: null,
        })
      else
        setBasket({
          offer: post.current.budget.minimum,
        })

      setTimeout(() => {
        setMakeOfferModalVisible(true)
      }, 256)
    } else if (post.current.type === 'sell') {
      if (basket.postId !== post.current.id || shouldReset) {
        const newBasket = {
          postId: post.current.id,
          shippingMethod: Object.keys(post.current.shipping_methods).sort()[0],
          shippingAddress: userInfo.addresses.find(address => address.default),
          items: basket.items,
        }
        if (!post.current.is_multiple)
          newBasket.items = cloneDeep(post.current.items)

        setBasket(newBasket)
      }

      const postData = post.current
      postData.user = user.current

      navigation.navigate('avail-post', {
        post: postData,
      })
    } else if (post.current.type === 'service') {
      if (basket.postId !== post.current.id || shouldReset) {
        const bookingAddress = {
          ...post.current.location,
          _id: 'post-location',
        }
        const newBasket = {
          postId: post.current.id,
          bookingMethod: Object.keys(post.current.booking_methods).sort()[0],
          bookingAddress,
          selectedBookingAddress: {
            ...(userInfo.addresses.find(address => address.default) || {}),
            _id: 'user-address',
          },
          items: basket.items,
        }

        if (!post.current.is_multiple)
          newBasket.items = cloneDeep(post.current.items)

        setBasket(newBasket)
      }

      const postData = post.current
      postData.user = user.current

      navigation.navigate('avail-post', {
        post: postData,
      })
    }
  }

  const handleOnViewExistingOrderPress = () => {
    navigation.navigate({
      name: 'orders',
      params: {
        screen: 'order-tracker',
        params: { orderID: existingOrder.id },
      },
    })
  }

  const handleOnSharePress = async () => {
    try {
      const url = await generateDynamicLink({
        type: 'post',
        params: { id: post.current.id },
        social: await getPreviewLinkData({
          type: 'post',
          data: post.current,
        }),
      })

      await Share.open({ url })
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleOnLikePress = async () => {
    const oldLikes = cloneDeep(post.current.likes || [])
    const newLikes = cloneDeep(post.current.likes || [])

    if (oldLikes.includes(userInfo.uid))
      newLikes.splice(newLikes.indexOf(userInfo.uid), 1)
    else newLikes.push(userInfo.uid)

    post.current.likes = newLikes
    const liked = post.current.likes.includes(userInfo.uid)
    setIsLiked(liked)

    try {
      const response = await Api[
        oldLikes.includes(userInfo.uid) ? 'unlikePost' : 'likePost'
      ]({
        pid: post.current.id,
      })

      if (!response.success) throw new Error(response.message)
    } catch (error) {
      console.log(error.message || error)
      setIsLiked(oldLikes.includes(userInfo.uid))
    }
  }

  const handleOnCoverPhotoPress = (index = 0) => {
    setImageModalImages(post.current.cover_photos)
    setImageModalSelectedIndex(index)
    setImageModalVisible(true)
  }

  const handleOnArchivePress = () => {
    setConfirmModalVisible(true)
    setConfirmModalTitle('Archive Post?')
    setConfirmModalMessage(
      'Hide your post from your profile and republish anytime you want. All active orders will still be processed.'
    )
    setConfirmModalCallback(() => handleOnArchivePost)
  }

  const handleUserPress = () => {
    if (userInfo?.uid === post.current.uid) {
      navigation.push('TabStack', { screen: 'You' })
    } else {
      navigation.push('NBTScreen', {
        screen: 'profile',
        params: {
          screen: 'profile',
          params: { uid: post.current.uid },
        },
      })
    }
  }

  const handleOnArchivePost = async () => {
    setIsLoading(true)
    setConfirmModalVisible(false)
    try {
      const response = await Api.archivePost({ pid: post.current.id })
      if (!response.success) throw new Error(response.message)
      setDashboardNeedsRefresh(true)
      setIsLoading(false)
      handleOnBackPress()
      Toast.show({
        content: (
          <View>
            <Text
              style={[typography.body2, { color: Colors.contentPlaceholder }]}>
              Post has ben successfully archived.{' '}
              <Text
                style={[typography.medium, typography.link]}
                onPress={() =>
                  navigation.navigate('NBTScreen', {
                    screen: 'posts',
                    params: {
                      screen: 'archived-posts',
                    },
                  })
                }>
                View Archived Posts
              </Text>
            </Text>
          </View>
        ),
        type: 'success',
        dismissible: true,
        timeout: 5000,
      })
    } catch (error) {
      console.log(error.message)
      Toast.show({
        content: (
          <View>
            <Text
              style={[typography.body2, { color: Colors.contentPlaceholder }]}>
              There was an error archiving your post.{' '}
              <Text
                style={[typography.medium, typography.link]}
                onPress={handleOnArchivePress}>
                Try again
              </Text>
              .
            </Text>
          </View>
        ),
        type: 'error',
        dismissible: true,
        screenId: 'published-post',
      })
    }
    setMenuDrawerVisible(false)
    setIsLoading(false)
  }

  const handleOnHidePost = async () => {
    setIsLoading(true)
    setConfirmModalVisible(false)
    try {
      const response = await Api.hidePost({ pid: post.current.id })
      if (!response.success) throw new Error(response.message)
      setDashboardNeedsRefresh(true)
      handleOnBackPress()
    } catch (error) {
      Alert.alert('Error', 'Oops, something went wrong')
      console.log(error.message)
    }
    setMenuDrawerVisible(false)
    setIsLoading(false)
  }

  const renderHeader = () => {
    if (!post.current) return null

    const translateY = scrollY.interpolate({
      inputRange: [0, headerHeight - gap],
      outputRange: [0, -headerHeight + gap],
      extrapolateRight: 'clamp',
    })
    const headerContentTranslateY = scrollY.interpolate({
      inputRange: [0, headerHeight - gap],
      outputRange: [0, headerHeight / 3],
      extrapolateRight: 'clamp',
    })

    return (
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
        {renderHeaderActions()}
        <Animated.View
          style={{
            transform: [{ translateY: headerContentTranslateY }],
          }}>
          <LinearGradient
            style={styles.coverPhotoGradient}
            colors={[
              'rgba(0,0,0,.45)',
              'transparent',
              'transparent',
              'rgba(0,0,0,.45)',
            ]}
            locations={[0, 0.2, 0.8, 1]}
            pointerEvents="none"
          />
          <View style={styles.coverPhotoWrapper}>
            {!!post.current.cover_photos?.length ? (
              <Swiper
                activeDotColor={Colors.ServbeesYellow}
                dotColor={Colors.neutralsIron}
                dotStyle={styles.dotStyle}
                activeDotStyle={styles.dotStyle}>
                {[...post.current.cover_photos].map((path, index) => (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{ height: normalize(350), width: '100%' }}
                    key={index}
                    onPress={() => handleOnCoverPhotoPress(index)}>
                    <PostImage
                      style={{ height: '100%', width: '100%' }}
                      path={path}
                      postType={post.current.type}
                    />
                  </TouchableOpacity>
                ))}
              </Swiper>
            ) : (
              <DefaultPostImage type={post.current.type} />
            )}
          </View>
        </Animated.View>
        <View style={styles.sectionOffset} />
      </Animated.View>
    )
  }

  const renderHeaderActions = () => {
    const opacity = scrollY.interpolate({
      inputRange: [0, headerHeight - gap - 30, headerHeight - gap - 10],
      outputRange: [1, 1, 0],
    })

    return (
      <>
        <Animated.View
          style={[
            styles.headerActions,
            { transform: [{ translateY: scrollY }], opacity },
          ]}>
          <TouchableOpacity
            style={[styles.headerButton, styles.backButton]}
            activeOpacity={0.7}
            onPress={handleOnBackPress}>
            <Icons.Back style={styles.headerIcon} {...iconSize(22)} />
          </TouchableOpacity>

          {!preview && userInfo?.uid && (
            <View style={styles.headerButtonGroup}>
              <TouchableOpacity
                style={styles.headerButton}
                activeOpacity={0.7}
                onPress={handleOnSharePress}>
                <Icons.Share style={styles.headerIcon} {...iconSize(22)} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                activeOpacity={0.7}
                onPress={handleOnLikePress}>
                {isLiked ? (
                  <Icons.LikeActive
                    style={styles.headerIcon}
                    {...iconSize(22)}
                  />
                ) : (
                  <Icons.Like style={styles.headerIcon} {...iconSize(22)} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.headerButton, { marginRight: 0 }]}
                activeOpacity={0.7}
                onPress={() => setMenuDrawerVisible(true)}>
                <Icons.VerticalEllipsis
                  style={styles.headerIcon}
                  {...iconSize(22)}
                />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </>
    )
  }

  const renderPreviewIndicator = () => {
    if (!preview || !post.current) return null
    return (
      <View style={styles.previewModeLabelWrapper} pointerEvents="none">
        <View style={styles.previewModeLabel}>
          <Icons.Eye style={styles.previewModeIcon} {...iconSize(16)} />
          <Text
            style={[typography.body2, typography.medium, { color: '#fff' }]}>
            You are in Preview Mode
          </Text>
        </View>
      </View>
    )
  }

  const renderSecondaryHeader = () => {
    if (
      !post.current ||
      !user.current ||
      !(contentHeight - (headerHeight - gap + getStatusBarHeight()) > height)
    )
      return null
    const translateY = scrollY.interpolate({
      inputRange: [0, headerHeight - gap - 40, headerHeight - gap],
      outputRange: [-headerHeight, -40, 0],
    })

    const categories =
      post.current.items?.reduce((list, current) => {
        if (!list.includes(current.category)) list.push(current.category)
        return list
      }, []) || []

    const onNavItemLayout = (event, category) => {
      const { layout } = event.nativeEvent
      setCategoryNavItems(items => ({ ...items, [category]: layout }))
    }

    const selectedCategoryLayout =
      categoryNavItems[selectedCategoryValue || categories[0]]

    const selectedCategoryIndicatorStyle = selectedCategoryLayout
      ? {
          width: selectedCategoryLayout.width,
          left: selectedCategoryLayout.x,
        }
      : {}

    return (
      <Animated.View
        style={[styles.secondaryHeader, { transform: [{ translateY }] }]}>
        <View style={[utilStyles.row, { paddingHorizontal: normalize(10) }]}>
          <TouchableOpacity
            style={styles.secondaryHeaderButton}
            activeOpacity={0.7}
            onPress={handleOnBackPress}>
            <Icons.Back style={styles.secondaryHeaderIcon} {...iconSize(22)} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
            <Text style={typography.subtitle2}>
              {user.current.display_name || user.current.full_name}
            </Text>
            {!!user.current?.account_verified && (
              <Icons.Verified style={styles.verifiedIcon} {...iconSize(16)} />
            )}
          </View>

          {!preview && userInfo?.uid && (
            <>
              <TouchableOpacity
                style={styles.secondaryHeaderButton}
                activeOpacity={0.7}
                onPress={handleOnSharePress}>
                <Icons.Share
                  style={styles.secondaryHeaderIcon}
                  {...iconSize(22)}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryHeaderButton}
                activeOpacity={0.7}
                onPress={handleOnLikePress}>
                {isLiked ? (
                  <Icons.LikeActive
                    style={styles.headerIcon}
                    {...iconSize(22)}
                  />
                ) : (
                  <Icons.Like
                    style={styles.secondaryHeaderIcon}
                    {...iconSize(22)}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryHeaderButton}
                activeOpacity={0.7}
                onPress={() => setMenuDrawerVisible(true)}>
                <Icons.VerticalEllipsis
                  style={styles.secondaryHeaderIcon}
                  {...iconSize(22)}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
        {['sell', 'service'].includes(post.current.type) &&
          post.current.is_multiple && (
            <>
              <View style={styles.secondaryHeaderTitleWrapper}>
                <View
                  style={[
                    styles.secondaryHeaderPostIcon,
                    {
                      backgroundColor:
                        post.current.type === 'sell'
                          ? Colors.secondaryRoyalBlue
                          : Colors.secondaryBrinkPink,
                    },
                  ]}>
                  {post.current.type === 'sell' ? (
                    <Icons.PostSell {...iconSize(18)} />
                  ) : (
                    <Icons.PostService {...iconSize(18)} />
                  )}
                </View>
                <Text style={[typography.display6, { flex: 1 }]}>
                  {post.current.title}
                </Text>
              </View>

              <ScrollView
                ref={categoriesNavRef}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesNav}>
                {categories.map((category, index, array) => (
                  <TouchableOpacity
                    onLayout={event => onNavItemLayout(event, category)}
                    activeOpacity={0.7}
                    style={[
                      styles.categoriesNavItem,
                      index === array.length - 1 ? { marginRight: 0 } : {},
                    ]}
                    key={category}
                    onPress={() => handleOnCategoryPress(category)}>
                    <Text
                      style={[
                        typography.body2,
                        selectedCategoryValue === category
                          ? { color: Colors.link }
                          : {},
                      ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
                <View
                  style={[
                    styles.selectedCategoryIndicator,
                    selectedCategoryIndicatorStyle,
                  ]}
                />
              </ScrollView>
            </>
          )}
        <LinearGradient
          style={{
            height: normalize(20),
            width: '100%',
            position: 'absolute',
            bottom: normalize(-20),
            zIndex: 1,
          }}
          colors={['rgba(65,65,65,0.05)', 'transparent']}
          locations={[0, 1]}
          pointerEvents="none"
        />
      </Animated.View>
    )
  }

  const renderPostDescriptionModal = () => {
    if (!post.current) return null
    return (
      <Modal
        isVisible={postDescriptionModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        style={styles.modal}
        onSwipeComplete={() => setPostDescriptionModalVisible(false)}
        swipeDirection="down"
        propagateSwipe
        onBackButtonPress={() => setPostDescriptionModalVisible(false)}
        statusBarTranslucent
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setPostDescriptionModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#000a' }} />
          </TouchableWithoutFeedback>
        }>
        <PostDescriptionModal
          title={post.current.title}
          description={post.current.description}
          close={() => setPostDescriptionModalVisible(false)}
        />
      </Modal>
    )
  }

  const renderImageModal = () => {
    return (
      <Modal
        isVisible={imageModalVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={200}
        animationOutTiming={180}
        style={styles.modal}
        onSwipeComplete={() => setImageModalVisible(false)}
        swipeDirection="down"
        propagateSwipe
        onBackButtonPress={() => setImageModalVisible(false)}
        statusBarTranslucent
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setImageModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#000a' }} />
          </TouchableWithoutFeedback>
        }>
        <ImageModal
          close={() => setImageModalVisible(false)}
          data={imageModalImages}
          selectedIndex={imageModalSelectedIndex}
        />
      </Modal>
    )
  }

  const renderMenuDrawer = () => {
    if (!post.current || !user.current) return

    const handleOnReportPostPress = () => {
      setMenuDrawerVisible(false)
      navigation.navigate('report-post', {
        postId: post.current.id,
      })
    }

    const menuItems =
      user.current.uid === userInfo.uid
        ? [
            {
              key: 'edit',
              label: (
                <Text
                  style={[
                    typography.body1,
                    typography.medium,
                    { color: Colors.contentPlaceholder },
                  ]}>
                  Edit Post
                </Text>
              ),
              icon: (
                <Icons.Pencil
                  style={{
                    color: Colors.contentPlaceholder,
                    marginRight: normalize(8),
                  }}
                  {...iconSize(24)}
                />
              ),
              onPress: handleOnEditPostPress,
            },
            // {
            //   key: 'sold',
            //   label: (
            //     <Text
            //       style={[
            //         typography.body1,
            //         typography.medium,
            //         { color: Colors.contentPlaceholder },
            //       ]}>
            //       Mark as Sold
            //     </Text>
            //   ),
            //   icon: (
            //     <Icons.CircleTick
            //       style={{
            //         color: Colors.contentPlaceholder,
            //         marginRight: normalize(8),
            //       }}
            //       {...iconSize(24)}
            //     />
            //   ),
            //   onPress: () => {},
            // },
            {
              key: 'archive',
              label: (
                <View>
                  <Text
                    style={[
                      typography.body1,
                      typography.medium,
                      { color: Colors.contentPlaceholder },
                    ]}>
                    Archive Post
                  </Text>
                  <Text
                    style={[
                      typography.body2,
                      { color: Colors.contentPlaceholder },
                    ]}>
                    Hide this post from your feed.
                  </Text>
                </View>
              ),
              icon: (
                <Icons.CircleHide
                  style={{
                    color: Colors.contentPlaceholder,
                    marginRight: normalize(8),
                  }}
                  {...iconSize(24)}
                />
              ),
              onPress: () => handleOnArchivePress(),
            },
            // {
            //   key: 'delete',
            //   label: (
            //     <Text
            //       style={[
            //         typography.body1,
            //         typography.medium,
            //         { color: Colors.secondaryBrinkPink },
            //       ]}>
            //       Delete Post
            //     </Text>
            //   ),
            //   icon: (
            //     <Icons.Trash
            //       style={{
            //         color: Colors.secondaryBrinkPink,
            //         marginRight: normalize(8),
            //       }}
            //       {...iconSize(24)}
            //     />
            //   ),
            //   onPress: () => {},
            // },
          ]
        : [
            {
              key: 'hide',
              label: (
                <View>
                  <Text
                    style={[
                      typography.body1,
                      typography.medium,
                      { color: Colors.contentPlaceholder },
                    ]}>
                    Hide Post
                  </Text>
                  <Text
                    style={[
                      typography.body2,
                      { color: Colors.contentPlaceholder },
                    ]}>
                    Hide this post from your feed.
                  </Text>
                </View>
              ),
              icon: (
                <Icons.CircleHide
                  style={{
                    color: Colors.contentPlaceholder,
                    marginRight: normalize(8),
                  }}
                  {...iconSize(24)}
                />
              ),
              onPress: () => {
                setConfirmModalVisible(true)
                setConfirmModalTitle('Hide Post?')
                setConfirmModalMessage('Hide this post from your feed.')
                setConfirmModalCallback(() => handleOnHidePost)
              },
            },
            {
              key: 'report',
              label: (
                <View>
                  <Text
                    style={[
                      typography.body1,
                      typography.medium,
                      { color: Colors.contentPlaceholder },
                    ]}>
                    Report Post
                  </Text>
                  <Text
                    style={[
                      typography.body2,
                      { color: Colors.contentPlaceholder },
                    ]}>
                    Report this post for action by Servbees.
                  </Text>
                </View>
              ),
              icon: (
                <Icons.Report
                  style={{
                    color: Colors.contentPlaceholder,
                    marginRight: normalize(8),
                  }}
                  {...iconSize(24)}
                />
              ),
              onPress: handleOnReportPostPress,
            },
          ]

    return (
      <Modal
        isVisible={menuDrawerVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        style={styles.modal}
        onSwipeComplete={() => setMenuDrawerVisible(false)}
        swipeDirection="down"
        propagateSwipe
        onBackButtonPress={() => setMenuDrawerVisible(false)}
        statusBarTranslucent
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setMenuDrawerVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#000a' }} />
          </TouchableWithoutFeedback>
        }>
        <MenuDrawer
          menuItems={menuItems}
          close={() => setMenuDrawerVisible(false)}
        />
        {renderConfirmModal()}
      </Modal>
    )
  }

  const renderMakeOfferModal = () => {
    if (!post.current || preview) return null

    const handleOnAttachPostPress = () => {
      setMakeOfferModalVisible(false)
      navigation.navigate('select-post', {
        onSelect: attachedPost => {
          handleOnBackPress()
          setBasket(basket => ({ ...basket, attachedPost }))
          setMakeOfferModalVisible(true)
        },
        onBackPress: () => {
          handleOnBackPress()
          setMakeOfferModalVisible(true)
        },
      })
    }

    const handleOnMakeOffer = () => {
      const postData = post.current
      postData.user = user.current

      setMakeOfferModalVisible(false)
      navigation.navigate('avail-post', {
        post: postData,
        callbacks: {
          onEditPress: () => {
            handleOnBackPress()
            setMakeOfferModalVisible(true)
          },
        },
        onBackPress: () => {
          handleOnBackPress()
          setMakeOfferModalVisible(true)
        },
      })
    }

    return (
      <Modal
        isVisible={makeOfferModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        style={styles.modal}
        onSwipeComplete={() => setMakeOfferModalVisible(false)}
        swipeDirection="down"
        propagateSwipe
        onBackButtonPress={() => setMakeOfferModalVisible(false)}
        statusBarTranslucent
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setMakeOfferModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#000a' }} />
          </TouchableWithoutFeedback>
        }>
        <KeyboardAvoidingView
          style={[
            {
              justifyContent: 'flex-end',
              margin: 0,
              padding: 0,
            },
          ]}
          enabled
          keyboardVerticalOffset={Platform.select({
            android: -StatusBar.currentHeight,
          })}
          behavior="padding">
          <MakeOfferModal
            budget={post.current.budget}
            data={basket}
            onAttachPostPress={handleOnAttachPostPress}
            onSubmit={handleOnMakeOffer}
          />
        </KeyboardAvoidingView>
      </Modal>
    )
  }

  const renderAddToBasketModal = () => {
    const handleOnAskResetBasket = async () => {
      const deferred = Q.defer()
      setAddToBasketModalVisible(false)
      setTimeout(() => {
        setConfirmResetBasketVisible(true)
      }, 256)
      setResetBasketDeferred(deferred)

      return deferred.promise
    }

    return (
      <Modal
        isVisible={addToBasketModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        style={styles.modal}
        onSwipeComplete={() => setAddToBasketModalVisible(false)}
        swipeDirection="down"
        propagateSwipe
        onBackButtonPress={() => setAddToBasketModalVisible(false)}
        statusBarTranslucent
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setAddToBasketModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#000a' }} />
          </TouchableWithoutFeedback>
        }>
        <KeyboardAvoidingView
          style={{
            justifyContent: 'flex-end',
            margin: 0,
            padding: 0,
          }}
          enabled
          keyboardVerticalOffset={Platform.select({
            ios: 0,
            android: -StatusBar.currentHeight,
          })}
          behavior="padding">
          <AddToBasketModal
            item={addToBasketModalItem}
            close={() => setAddToBasketModalVisible(false)}
            post={post.current}
            onAskResetBasket={handleOnAskResetBasket}
          />
        </KeyboardAvoidingView>
      </Modal>
    )
  }

  const renderConfirmResetBasketModal = () => {
    return (
      <Modal
        isVisible={confirmResetBasketVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        style={styles.modal}
        onSwipeComplete={() => setConfirmResetBasketVisible(false)}
        swipeDirection="down"
        propagateSwipe
        onBackButtonPress={() => setConfirmResetBasketVisible(false)}
        statusBarTranslucent
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setConfirmResetBasketVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#000a' }} />
          </TouchableWithoutFeedback>
        }>
        <ConfirmResetBasketModal
          onConfirmPress={() => {
            resetBasketDeferred?.resolve(true)
            setConfirmResetBasketVisible(false)
          }}
          onCancelPress={() => setConfirmResetBasketVisible(false)}
        />
      </Modal>
    )
  }

  const renderConfirmModal = () => {
    return (
      <Modal
        isVisible={confirmModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        style={styles.modal}
        onSwipeComplete={() => setConfirmModalVisible(false)}
        swipeDirection="down"
        propagateSwipe
        onBackButtonPress={() => setConfirmModalVisible(false)}
        statusBarTranslucent
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setConfirmModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#000a' }} />
          </TouchableWithoutFeedback>
        }>
        <ConfirmModal
          onConfirm={confirmModalCallback}
          close={() => setConfirmModalVisible(false)}
          message={confirmModalMessage}
          title={confirmModalTitle}
        />
      </Modal>
    )
  }

  const renderUserSection = () => {
    if (!user.current) return null

    return (
      <Animated.View style={[styles.userSection]}>
        <View style={styles.avatarWrapper}>
          <TouchableOpacity onPress={handleUserPress} activeOpacity={1}>
            <Avatar
              style={styles.avatar}
              path={user.current.profile_photo}
              size="64x64"
            />
          </TouchableOpacity>
        </View>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={[utilStyles.row, utilStyles.alignCenter]}
              onPress={handleUserPress}
              activeOpacity={1}>
              <Text style={[typography.body1, typography.medium]}>
                {user.current.display_name || user.current.full_name}
              </Text>
              {!!user.current?.account_verified && (
                <Icons.Verified style={styles.verifiedIcon} {...iconSize(16)} />
              )}
            </TouchableOpacity>
          </View>
          <Text
            style={[typography.body1, { color: Colors.contentPlaceholder }]}>
            @{user.current.username}
          </Text>
        </View>
      </Animated.View>
    )
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

  const handleOnViewMapPress = () => {
    if (!userInfo?.uid || user.current.uid === userInfo?.uid) return
    navigation.navigate('map-direction', {
      data: post.current,
      user: user.current,
    })
  }

  const handleOnSeeMoreSchedulePress = () => {
    configureAnimation()
    setScheduleExpanded(!scheduleExpanded)
  }

  const handleOnSeeMoreShippingMethodsPress = () => {
    configureAnimation()
    setShippingMethodsExpanded(!shippingMethodsExpanded)
  }

  const handleOnReadMoreDescriptionPress = () => {
    setPostDescriptionModalVisible(true)
  }

  /**
   * @param {string} time
   * @returns {Date}
   */
  const parseTime = time => {
    const matches = (time || '').match(/(\d{2}):(\d{2})(AM|PM)/)
    if (!matches) {
      return {}
    }

    const [hour, minute, ampm] = matches.slice(1)
    const dateNow = new Date()

    return new Date(
      dateNow.getFullYear(),
      dateNow.getMonth(),
      dateNow.getDate(),
      parseInt(hour) < 12 && ampm === 'PM' ? parseInt(hour) + 12 : hour,
      minute
    )
  }

  const getScheduleLabel = schedule => {
    let label, color

    if (!schedule) {
      label = 'Closed'
      color = Colors.secondaryBrinkPink
    } else if (schedule.is24Hour) {
      color = Colors.secondaryShamrock
      label = 'Open 24 Hours'
    } else {
      const dateNow = new Date().getTime()
      const opens = parseTime(schedule.opens).getTime()
      const closes = parseTime(schedule.closes).getTime()

      if (opens - dateNow > 0 && opens - dateNow < 3600000) {
        label = 'Opens soon'
        color = Colors.checkboxBorderDefault
      } else if (closes - dateNow > 0 && closes - dateNow < 3600000) {
        label = 'Closes soon'
        color = Colors.secondaryBrinkPink
      } else if (
        isWithinInterval(dateNow, {
          start: opens,
          end: closes,
        })
      ) {
        label = 'Open Now'
        color = Colors.secondaryShamrock
      } else {
        label = 'Closed'
        color = Colors.secondaryBrinkPink
      }
    }

    return () =>
      !!label ? (
        <Text style={[typography.body2, { color }]}>{label}</Text>
      ) : null
  }

  const renderSchedule = () => {
    if (post.current.type === 'need' || !post.current.schedule?.length)
      return null

    const todaySchedule = post.current.schedule.find(
      schedule => schedule.day === format(Date.now(), 'EEEE')
    )

    const renderScheduleLabel = getScheduleLabel(todaySchedule)

    const groupedSchedule = post.current.schedule.reduce(
      (schedule, current) => {
        const index = schedule.findIndex(
          _schedule =>
            (_schedule.is24Hour && current.is24Hour) ||
            _schedule.time === `${current.opens} - ${current.closes}`
        )

        if (!~index) {
          const day = {
            days: [current.day],
          }
          if (current.is24Hour) day.is24Hour = true
          else day.time = `${current.opens} - ${current.closes}`
          schedule.push(day)
        } else {
          schedule[index].days.push(current.day)
        }

        return schedule
      },
      []
    )

    return (
      <View style={[utilStyles.row, { marginTop: normalize(12) }]}>
        <Icons.Calendar
          style={[styles.postInfoIcon, { marginTop: normalize(2) }]}
          {...iconSize(18)}
        />
        <View style={utilStyles.flex1}>
          <View
            style={[utilStyles.flex1, utilStyles.row, utilStyles.alignCenter]}>
            <Text style={typography.body1}>{format(Date.now(), 'EEE')}</Text>
            {!!todaySchedule && (
              <Text style={typography.body1}>
                {todaySchedule.is24Hour
                  ? ''
                  : ` ${todaySchedule.opens} - ${todaySchedule.closes}`}
              </Text>
            )}
            <View style={{ marginLeft: normalize(6) }}>
              {renderScheduleLabel()}
            </View>
          </View>
          {scheduleExpanded && (
            <View style={[styles.schedules]}>
              {groupedSchedule.map((schedule, index, array) => {
                return (
                  <View
                    key={schedule.days.join('')}
                    style={[
                      styles.scheduleGroup,
                      index === array.length - 1
                        ? { borderBottomWidth: 0 }
                        : {},
                    ]}>
                    <View
                      style={[
                        utilStyles.row,
                        utilStyles.alignCenter,
                        { flexWrap: 'wrap' },
                      ]}>
                      {schedule.days.map((day, i, arr) => (
                        <View
                          style={[utilStyles.row, utilStyles.alignCenter]}
                          key={day}>
                          <Text style={typography.body2}>{day}</Text>
                          {i < arr.length - 1 && (
                            <Text
                              style={[
                                typography.eyebrow,
                                typography.medium,
                                { color: Colors.neutralsMischka },
                              ]}>
                              {' • '}
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                    <Text style={typography.body2}>{schedule.time}</Text>
                  </View>
                )
              })}
            </View>
          )}
          {!!groupedSchedule.length && (
            <TouchableOpacity
              style={styles.linkWrapper}
              pressRetentionOffset={{ top: normalize(4), bottom: normalize(4) }}
              activeOpacity={0.7}
              onPress={handleOnSeeMoreSchedulePress}>
              <Text
                style={[typography.body2, typography.medium, typography.link]}>
                See {scheduleExpanded ? 'less' : 'more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  const renderCategorizedItems = () => {
    if (!post.current?.is_multiple) return null

    const categorizedItems = post.current.items.reduce((list, item) => {
      let category = list.find(listItem => listItem.category === item.category)
      if (!category) {
        category = list.push({
          category: item.category,
          items: [item],
        })
      } else category.items.push(item)

      return list
    }, [])

    const handleOnItemImagePress = (items, index) => {
      const images = items.map(({ image }) => image).filter(image => !!image)
      setImageModalImages(images)
      setImageModalSelectedIndex(index)
      setImageModalVisible(true)
    }

    const onItemLayout = (event, category) => {
      const { layout } = event.nativeEvent
      setCategorySections(sections => ({ ...sections, [category]: layout }))
    }

    const handleOnItemPress = item => {
      if (preview || user.current.uid === userInfo.uid || !item.available)
        return

      setAddToBasketModalItem(
        basket.items?.find?.(_item => _item.id === item.id) || item
      )
      setAddToBasketModalVisible(true)
    }

    return (
      <>
        {categorizedItems.map(({ category, items }, index, arr) => {
          return (
            <View
              style={[
                styles.section,
                index === arr.length - 1 && styles.bottomSection,
              ]}
              onLayout={event => onItemLayout(event, category)}
              key={category}>
              <Text style={[typography.subtitle1, styles.categoryName]}>
                {category}
              </Text>
              <View style={styles.categoryItems}>
                {items.map((item, index) => {
                  return (
                    <View key={index} style={[styles.categoryItem]}>
                      <TouchableOpacity
                        disabled={!item.available}
                        style={[utilStyles.row, utilStyles.flex1]}
                        activeOpacity={0.7}
                        onPress={() => handleOnItemPress(item)}>
                        {!!item.image && (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.thumbnailWrapper}
                            onPress={() =>
                              handleOnItemImagePress(items, index)
                            }>
                            <PostImage
                              path={item.image}
                              size="128x128"
                              postType={post.type}
                            />
                            {!item.available && (
                              <Text
                                style={[
                                  typography.caption,
                                  styles.unavailableThumbnail,
                                ]}>
                                Not available
                              </Text>
                            )}
                          </TouchableOpacity>
                        )}
                        <View style={styles.categoryItemInfo}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={[
                                typography.body1narrow,
                                typography.medium,
                                !item.available ? { color: Colors.icon } : {},
                                { flex: 1, paddingRight: normalize(6) },
                              ]}>
                              {item.name}
                            </Text>
                            <Text
                              style={[
                                typography.body1narrow,
                                typography.medium,
                                !item.available ? { color: Colors.icon } : {},
                              ]}>
                              ₱
                              {formatNumber(item.price, {
                                separator: '.',
                                precision: 2,
                                delimiter: ',',
                              })}
                            </Text>
                          </View>
                          <View style={[utilStyles.flex1]}>
                            {!!item.description?.length && (
                              <Text
                                style={[
                                  typography.body2,
                                  styles.categoryItemDescription,
                                  !item.available ? { color: Colors.icon } : {},
                                ]}
                                numberOfLines={3}>
                                {item.description}
                              </Text>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )
                })}
              </View>
            </View>
          )
        })}
      </>
    )
  }

  const renderPostContent = () => {
    const prices = [
      ...new Set(
        post.current.budget
          ? [post.current.budget.minimum, post.current.budget.maximum]
          : post.current?.items?.map(item => item.price)
      ),
    ]

    const price =
      prices.length === 1
        ? `₱${formatNumber(prices[0], {
            separator: '.',
            precision: 2,
            delimiter: ',',
          })}`
        : `₱${formatNumber(Math.min(...prices), {
            separator: '.',
            precision: 2,
            delimiter: ',',
          })} - ₱${formatNumber(Math.max(...prices), {
            separator: '.',
            precision: 2,
            delimiter: ',',
          })}`

    const postTypeIcons = {
      sell: (
        <Icons.PostTypeSell style={styles.postInfoIcon} {...iconSize(18)} />
      ),
      service: (
        <Icons.PostTypeService style={styles.postInfoIcon} {...iconSize(18)} />
      ),
      need: (
        <Icons.PostTypeNeed style={styles.postInfoIcon} {...iconSize(18)} />
      ),
    }

    const postTypeLabelColor = {
      need: Colors.secondaryMountainMeadow,
      sell: Colors.secondaryRoyalBlue,
      service: Colors.secondaryBrinkPink,
    }

    const postTypeLabel = {
      need: 'Need',
      service: 'Service',
      sell: 'Selling',
    }

    const paymentMethodLabels = {
      cash: 'Cash',
      card: 'Credit/Debit',
      gcash: 'GCash',
      grabpay: 'GrabPay',
      paypal: 'PayPal',
    }

    const shippingMethodLabels = {
      pickup: 'Pick up',
      delivery: 'Delivery',
    }

    const bookingMethodLabels = {
      walkin: 'Walk-in',
      appointment: 'By Appointment',
    }

    const shippingMethods = []
    if (post.current.shipping_methods?.delivery?.courier) {
      shippingMethods.push({
        label: 'Delivery',
        icon: <Icons.Truck style={{ color: Colors.icon }} {...iconSize(18)} />,
        notes: post.current.shipping_methods.delivery.courier.notes || '',
      })
    }
    if (post.current.shipping_methods?.delivery?.own_delivery) {
      shippingMethods.push({
        label: 'Delivery',
        icon: <Icons.Truck style={{ color: Colors.icon }} {...iconSize(18)} />,
        notes: post.current.shipping_methods.delivery.own_delivery.notes || '',
      })
    }
    if (post.current.shipping_methods?.pickup) {
      shippingMethods.push({
        label: 'Pickup',
        icon: <Icons.Pickup style={{ color: Colors.icon }} {...iconSize(18)} />,
        notes: post.current.shipping_methods.pickup.notes || '',
      })
    }

    return (
      <View style={styles.postContent}>
        <Text style={[typography.display6, styles.postTitle]}>
          {post.current.title}
        </Text>
        <View
          style={[utilStyles.row, utilStyles.alignCenter, styles.priceWrapper]}>
          <Text style={[typography.eyebrow, { marginRight: normalize(8) }]}>
            {post.current.type === 'need' ? 'BUDGET' : 'PRICE'}
          </Text>
          <Text style={typography.subtitle1}>{price}</Text>
        </View>
        {post.current.date_posted && (
          <View style={[utilStyles.row, utilStyles.alignCenter]}>
            <Icons.Clock style={styles.postInfoIcon} {...iconSize(18)} />
            <Text style={typography.body1}>
              {formatDistanceToNow(
                new Date(post.current.date_posted._seconds * 1000)
              )}{' '}
              ago
            </Text>
          </View>
        )}
        <View
          style={[
            utilStyles.row,
            utilStyles.alignCenter,
            { marginTop: normalize(12) },
          ]}>
          {postTypeIcons[post.current.type]}
          <Text style={typography.body1}>
            <Text style={{ color: Colors.neutralsMischka }}>in </Text>
            <Text style={{ color: postTypeLabelColor[post.current.type] }}>
              {postTypeLabel[post.current.type]}
            </Text>
          </Text>
        </View>
        <View style={[utilStyles.row, { marginTop: normalize(12) }]}>
          <Icons.Navigation
            style={[styles.postInfoIcon, { marginTop: normalize(2) }]}
            {...iconSize(18)}
          />
          <View>
            <Text style={[typography.body1, { maxWidth: '95%' }]}>
              {post.current.location?.full_address}
            </Text>
            <TouchableOpacity
              style={[styles.linkWrapper]}
              pressRetentionOffset={{ top: normalize(4), bottom: normalize(4) }}
              activeOpacity={0.7}
              onPress={handleOnViewMapPress}>
              <Text
                style={[typography.body2, typography.medium, typography.link]}>
                View map
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {renderSchedule()}
        {!!post.current.description?.length && (
          <>
            <View style={styles.divider} />
            <View style={[utilStyles.row]}>
              <Icons.Page
                style={[styles.postInfoIcon, { marginTop: normalize(2) }]}
                {...iconSize(18)}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={typography.body1}
                  numberOfLines={!descriptionLines ? null : 10}
                  ellipsizeMode="clip"
                  onTextLayout={e => {
                    !descriptionLines &&
                      setDescriptionLines(e.nativeEvent.lines.length)
                  }}>
                  {post.current.description}
                </Text>
                {descriptionLines > 10 && (
                  <TouchableOpacity
                    style={styles.linkWrapper}
                    pressRetentionOffset={{
                      top: normalize(4),
                      bottom: normalize(4),
                    }}
                    activeOpacity={0.7}
                    onPress={handleOnReadMoreDescriptionPress}>
                    <Text
                      style={[
                        typography.body2,
                        typography.medium,
                        typography.link,
                      ]}>
                      Read more
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        )}
        {((post.current.type === 'sell' &&
          (!!post.current.shipping_methods?.delivery ||
            !!post.current.shipping_methods?.pickup)) ||
          (post.current.type === 'service' &&
            (!!post.current.booking_methods?.walkin ||
              !!post.current.booking_methods?.appointment)) ||
          !!post.current.payment_methods?.length) && (
          <View style={styles.divider} />
        )}

        {!!post.current.payment_methods?.length && (
          <View style={utilStyles.row}>
            <Icons.PostCash
              style={[styles.postInfoIcon, { marginTop: normalize(2) }]}
              {...iconSize(18)}
            />
            <Text style={[typography.body1, utilStyles.flex1]}>
              {post.current.payment_methods
                .map(method => paymentMethodLabels[method])
                .join(', ')}
            </Text>
          </View>
        )}
        {post.current.type === 'sell' &&
          (!!post.current.shipping_methods?.delivery ||
            !!post.current.shipping_methods?.pickup) && (
            <>
              <View
                style={[
                  utilStyles.row,
                  {
                    marginTop: normalize(
                      post.current.payment_methods?.length ? 12 : 0
                    ),
                  },
                ]}>
                {post.current.shipping_methods?.delivery?.own_delivery ||
                post.current.shipping_methods?.delivery?.courier ? (
                  <Icons.Truck
                    style={[styles.postInfoIcon, { marginTop: normalize(2) }]}
                    {...iconSize(18)}
                  />
                ) : (
                  <Icons.Pickup
                    style={[styles.postInfoIcon, { marginTop: normalize(2) }]}
                    {...iconSize(18)}
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={typography.body1}>
                    Available for{' '}
                    {Object.keys(post.current.shipping_methods)
                      .map(method => shippingMethodLabels[method])
                      .join(' or ')}
                  </Text>

                  {shippingMethodsExpanded && shippingMethods.length && (
                    <View style={styles.shippingMethods}>
                      {shippingMethods.map((method, index, arr) => {
                        return (
                          <View
                            key={index}
                            style={[
                              styles.shippingMethod,
                              index === arr.length - 1
                                ? { borderBottomWidth: 0 }
                                : {},
                            ]}>
                            <View
                              style={[utilStyles.row, utilStyles.alignCenter]}>
                              {method.icon}
                              <Text style={styles.shippingMethodLabel}>
                                {method.label}
                              </Text>
                            </View>
                            <Text
                              style={[
                                typography.body2,
                                { marginTop: normalize(4) },
                              ]}>
                              {method.notes}
                            </Text>
                          </View>
                        )
                      })}
                    </View>
                  )}

                  {!!shippingMethods.length && (
                    <TouchableOpacity
                      style={styles.linkWrapper}
                      pressRetentionOffset={{
                        top: normalize(4),
                        bottom: normalize(4),
                      }}
                      activeOpacity={0.7}
                      onPress={handleOnSeeMoreShippingMethodsPress}>
                      <Text
                        style={[
                          typography.body2,
                          typography.medium,
                          typography.link,
                        ]}>
                        See {shippingMethodsExpanded ? 'less' : 'more'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </>
          )}

        {post.current.type === 'service' &&
          (!!post.current.booking_methods?.walkin ||
            !!post.current.booking_methods?.appointment) && (
            <View
              style={[
                utilStyles.row,
                {
                  marginTop: normalize(
                    post.current.payment_methods?.length ? 12 : 0
                  ),
                },
              ]}>
              {post.current.booking_methods?.appointment ? (
                <Icons.Appointment
                  style={[styles.postInfoIcon, { marginTop: normalize(2) }]}
                  {...iconSize(18)}
                />
              ) : (
                <Icons.Store
                  style={[styles.postInfoIcon, { marginTop: normalize(2) }]}
                  {...iconSize(18)}
                />
              )}
              <Text style={typography.body1}>
                {Object.keys(post.current.booking_methods)
                  .map(method => bookingMethodLabels[method])
                  .join(' and ')}
              </Text>
            </View>
          )}

        {!!post.current.notes?.length && (
          <>
            <View style={styles.divider} />
            <View style={utilStyles.row}>
              <Icons.InfoCircle
                style={[styles.postInfoIcon, { marginTop: normalize(2) }]}
                {...iconSize(18)}
              />
              <Text style={[typography.body1, utilStyles.flex1]}>
                {post.current.notes}
              </Text>
            </View>
          </>
        )}
      </View>
    )
  }

  const canSubmit = () => {
    if (
      preview ||
      (post.current.is_multiple &&
        (!basket.postId || basket.postId === post.current.id) &&
        !basket.items?.length) ||
      (post.current.is_multiple &&
        basket.postId &&
        basket.postId !== post.current.id) ||
      !userInfo?.uid
    )
      return false

    return true
  }

  const handleOnChatPress = async () => {
    let channel
    setIsLoading(true)
    try {
      if (!userInfo?.uid) {
        setIsLoading(false)
        return
      }
      const snapshot = await firestore()
        .collection('chat_rooms')
        .where('members', '==', {
          [userInfo.uid]: true,
          [user.current.uid]: true,
        })
        .where('post_id', '==', post.current.id)
        .get()

      if (!snapshot.docs.length) {
        const ref = firestore().collection('chat_rooms')

        const { id } = await ref.add({
          members: {
            [userInfo.uid]: true,
            [user.current.uid]: true,
          },
          has_messages: false,
          participants: [userInfo.uid, user.current.uid],
          post_id: post.current.id,
          buyer_id: userInfo.uid,
          seller_id: user.current.uid,
        })

        await ref.doc(id).update({ id })
        channel = (await ref.doc(id).get()).data()
      } else {
        channel = snapshot.docs[0].data()
      }
      navigation.navigate('Chat', { user, channel })
    } catch (error) {
      console.log(error.message)
      Alert.alert('Error', 'Oops, something went wrong')
    }
    setIsLoading(false)
  }

  const renderButtons = () => {
    if (!post.current || userInfo.uid === post.current.uid) return null

    const handleOnCallPress = () => {
      Linking.openURL(`tel:${user?.current?.phone_number}`)
    }

    const disabledStyle = { opacity: 0.5 }
    const labelStyle = [typography.body1, typography.medium]

    let buyLabel = null
    const currentBasketItems =
      basket.postId === post.current.id || !basket.postId
        ? basket?.items || []
        : []

    const totalPrice = `₱${formatNumber(
      currentBasketItems.reduce(
        (total, item) => total + item.price * (item.quantity || 1),
        0
      ) || 0,
      {
        separator: '.',
        precision: 2,
        delimiter: ',',
      }
    )}`

    const totalItems = currentBasketItems.reduce(
      (total, curr) => total + (curr.quantity || 1),
      0
    )
    if (post.current.type === 'sell') {
      buyLabel = post.current.is_multiple ? (
        <View style={styles.multipleItemsBuyLabel}>
          <View style={[utilStyles.row, utilStyles.alignCenter]}>
            <Icons.ShoppingCart
              style={{ color: Colors.primaryMidnightBlue }}
              {...iconSize(24)}
            />
            <Text
              style={[
                typography.eyebrow,
                typography.medium,
                {
                  backgroundColor: '#fff',
                  borderRadius: normalize(8),
                  color: Colors.secondaryRoyalBlue,
                  paddingHorizontal: normalize(4),
                  paddingVertical: normalize(2),
                  marginLeft: normalize(4),
                },
              ]}>
              {totalItems}
            </Text>
          </View>
          <Text style={typography.subtitle1}>{totalPrice}</Text>
        </View>
      ) : (
        <Text style={labelStyle}>Buy</Text>
      )
    } else if (post.current.type === 'service') {
      buyLabel = post.current.is_multiple ? (
        <View style={styles.multipleItemsBuyLabel}>
          <View style={[utilStyles.row, utilStyles.alignCenter]}>
            <Icons.ShoppingCart
              style={{ color: Colors.primaryMidnightBlue }}
              {...iconSize(24)}
            />
            <Text
              style={[
                typography.eyebrow,
                typography.medium,
                {
                  backgroundColor: '#fff',
                  borderRadius: normalize(8),
                  color: Colors.secondaryRoyalBlue,
                  paddingHorizontal: normalize(4),
                  paddingVertical: normalize(2),
                  marginLeft: normalize(4),
                },
              ]}>
              {totalItems}
            </Text>
          </View>
          <Text style={typography.subtitle1}>{totalPrice}</Text>
        </View>
      ) : (
        <Text style={labelStyle}>Book</Text>
      )
    } else if (post.current.type === 'need') {
      buyLabel = <Text style={labelStyle}>Make an Offer</Text>
    }

    return (
      <View
        style={{ backgroundColor: '#fff' }}
        onLayout={event => {
          setButtonsOffset(event.nativeEvent.layout.height)
        }}>
        <LinearGradient
          style={{
            height: normalize(20),
            width: '100%',
            position: 'absolute',
            top: normalize(-20),
            zIndex: 1,
          }}
          colors={['transparent', 'rgba(65,65,65,0.05)']}
          locations={[0, 1]}
          pointerEvents="none"
        />

        <View style={styles.buttonsWrapper}>
          {!!post.current.display_contact && user?.current?.phone_number && (
            <Button
              style={{ marginRight: normalize(16) }}
              type="primary-outline"
              disabled={preview}
              disabledStyle={disabledStyle}
              onPress={handleOnCallPress}>
              <Icons.Call {...iconSize(24)} />
            </Button>
          )}
          <Button
            disabled={preview || !userInfo?.uid}
            disabledStyle={disabledStyle}
            style={{ marginRight: normalize(16) }}
            type="primary-outline"
            onPress={handleOnChatPress}>
            <Icons.Chat
              style={{ color: Colors.primaryMidnightBlue }}
              {...iconSize(24)}
            />
          </Button>
          {existingOrder ? (
            <Button
              style={[utilStyles.flex1]}
              type="primary"
              onPress={handleOnViewExistingOrderPress}>
              <Text style={labelStyle}>View Order</Text>
            </Button>
          ) : (
            <Button
              disabled={!canSubmit()}
              disabledStyle={disabledStyle}
              style={[utilStyles.flex1]}
              type="primary"
              onPress={handleOnBuyPress}>
              {buyLabel}
            </Button>
          )}
        </View>
      </View>
    )
  }

  const renderPublishButton = () => {
    return (
      preview && (
        <View>
          <LinearGradient
            style={{
              height: normalize(20),
              width: '100%',
              position: 'absolute',
              top: normalize(-20),
              zIndex: 1,
            }}
            colors={['transparent', 'rgba(65,65,65,0.05)']}
            locations={[0, 1]}
            pointerEvents="none"
          />
          <View style={styles.buttonsWrapper}>
            <Button
              style={{ flex: 1 }}
              label="Publish"
              type="primary"
              onPress={onPublishPress}
            />
          </View>
        </View>
      )
    )
  }

  const renderExistingOrderInfo = () => {
    if (!existingOrder || !post.current) return

    return (
      <View style={{ backgroundColor: '#fff' }}>
        <View style={styles.info}>
          <Text style={typography.caption}>
            Wait for the seller to confirm your order before ordering again.
          </Text>
        </View>
      </View>
    )
  }

  const onContentSizeChange = (width, height) => {
    setContentHeight(height)
  }

  return (
    <View style={{ flex: 1 }}>
      <Toast
        containerStyle={{
          marginTop: getStatusBarHeight() + normalize(8),
        }}
        ref={ref => Toast.setRef(ref, 'published-post')}
      />
      <StatusBar
        translucent
        barStyle={Platform.select({
          ios: 'dark-content',
          android: 'light-content',
        })}
        backgroundColor="transparent"
      />
      <Loader visible={isLoading} />
      {renderHeader()}
      {renderPreviewIndicator()}
      <Animated.ScrollView
        onContentSizeChange={onContentSizeChange}
        ref={scrollViewRef}
        style={[styles.wrapper]}
        onScroll={onScroll}
        bounces={false}
        scrollEventThrottle={16}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: headerHeight,
          backgroundColor: '#fff',
        }}>
        <View
          style={[
            styles.content,
            contentHeight - (headerHeight - gap + getStatusBarHeight()) > height
              ? { minHeight: height }
              : {},
          ]}>
          {renderSecondaryHeader()}
          {!!post.current && (
            <View
              style={[
                styles.section,
                styles.topSection,
                { paddingHorizontal: normalize(16) },
                !post.current.is_multiple && styles.bottomSection,
              ]}>
              {renderUserSection()}
              {renderPostContent()}
            </View>
          )}
          {renderCategorizedItems()}
          {renderExistingOrderInfo()}
          <View style={{ flex: 1, backgroundColor: '#fff' }} />
        </View>
        {preview && renderButtons()}
      </Animated.ScrollView>
      {renderPostDescriptionModal()}
      {renderImageModal()}
      {renderMenuDrawer()}
      {renderMakeOfferModal()}
      {renderAddToBasketModal()}
      {renderConfirmResetBasketModal()}
      {!preview && renderButtons()}
      {preview && renderPublishButton()}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerButton: {
    padding: normalize(4),
    zIndex: 2,
    backgroundColor: '#2e303459',
    borderRadius: normalize(24),
    marginRight: normalize(8),
  },
  backButton: {
    position: 'absolute',
    top: normalize(12 + getStatusBarHeight()),
    left: normalize(16),
  },
  headerIcon: {
    color: '#fff',
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
  headerButtonGroup: {
    flexDirection: 'row',
  },
  coverPhotoWrapper: {
    height: normalize(350),
    width: '100%',
    backgroundColor: '#fff',
  },
  content: {
    zIndex: 5,
    flex: 1,
    backgroundColor: Colors.neutralsZirconLight,
  },
  sectionOffset: {
    height: normalize(8),
    borderTopStartRadius: normalize(3),
    borderTopEndRadius: normalize(3),
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 10,
    bottom: normalize(-1),
    left: 0,
    width: '100%',
  },
  dotStyle: {
    height: normalize(4),
    width: normalize(4),
    marginRight: normalize(12),
  },
  coverPhotoGradient: {
    flex: 1,
    position: 'absolute',
    zIndex: 3,
    width: '100%',
    height: '100%',
  },
  avatarWrapper: {
    height: normalize(42),
    width: normalize(42),
    marginRight: normalize(8),
    borderRadius: normalize(21),
    overflow: 'hidden',
  },
  avatar: {
    height: '100%',
    width: '100%',
    marginRight: normalize(8),
  },
  section: {
    padding: normalize(24),
    backgroundColor: '#fff',
    borderRadius: normalize(10),
    marginBottom: normalize(8),
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedIcon: {
    marginLeft: normalize(6),
  },
  postTitle: {
    marginTop: normalize(16),
  },
  priceWrapper: {
    marginTop: normalize(16),
    marginBottom: normalize(12),
  },
  postInfoIcon: {
    marginRight: normalize(8),
    color: Colors.icon,
  },
  postContent: {
    flex: 1,
  },
  linkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(4),
  },
  scheduleGroup: {
    paddingVertical: normalize(6),
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors.neutralsZircon,
  },
  schedules: {
    marginTop: normalize(6),
  },
  divider: {
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors.neutralsGainsboro,
    marginVertical: normalize(12),
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  categoryName: {
    color: Colors.primaryMidnightBlue,
  },
  categoryItems: {
    marginTop: normalize(12),
  },
  categoryItem: {
    flexDirection: 'row',
    minHeight: normalize(54),
    marginTop: normalize(8),
  },
  categoryItemDescription: {
    color: Colors.contentPlaceholder,
  },
  categoryItemInfo: {
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors.neutralGray,
    flex: 1,
    paddingVertical: normalize(4),
    minHeight: normalize(66),
  },
  topSection: {
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
  },
  bottomSection: {
    marginBottom: 0,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
  },
  buttonsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: normalize(16),
  },
  thumbnailWrapper: {
    position: 'relative',
    height: normalize(60),
    width: normalize(60),
    marginRight: normalize(16),
    borderRadius: normalize(4),
    overflow: 'hidden',
  },
  thumbnail: {
    height: '100%',
    width: '100%',
  },
  unavailableThumbnail: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(31, 26, 84, 0.8)',
    zIndex: 1,
    color: '#fff',
    fontSize: normalize(8),
    lineHeight: normalize(8),
    padding: normalize(4),
    textAlign: 'center',
  },
  secondaryHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 10,
    backgroundColor: '#fff',
    borderBottomColor: Colors.neutralsZircon,
    borderBottomWidth: normalize(1),
    borderRadius: normalize(12),
  },
  secondaryHeaderIcon: {
    color: Colors.primaryMidnightBlue,
  },
  secondaryHeaderButton: {
    padding: normalize(10),
    paddingTop: normalize(6),
  },
  gapFiller: { flexGrow: 1, backgroundColor: '#fefefe' },
  previewModeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(12),
    backgroundColor: '#0000008c',
    borderRadius: normalize(20),
  },
  previewModeLabelWrapper: {
    position: 'absolute',
    width: '100%',
    top: normalize(12 + getStatusBarHeight()),
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },
  previewModeIcon: {
    color: '#fff',
    marginRight: normalize(4),
  },
  multipleItemsBuyLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  secondaryHeaderPostIcon: {
    height: normalize(24),
    width: normalize(24),
    borderRadius: normalize(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: normalize(8),
  },
  secondaryHeaderTitleWrapper: {
    flexDirection: 'row',
    paddingHorizontal: normalize(24),
    paddingVertical: normalize(6),
    alignItems: 'flex-start',
  },
  categoriesNav: {
    paddingHorizontal: normalize(24),
  },
  categoriesNavItem: {
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(8),
    marginRight: normalize(8),
  },
  selectedCategoryIndicator: {
    borderTopEndRadius: normalize(10),
    borderTopStartRadius: normalize(10),
    height: normalize(3),
    backgroundColor: Colors.link,
    position: 'absolute',
    bottom: 0,
  },
  shippingMethods: {
    marginTop: normalize(16),
  },
  shippingMethodLabel: {
    ...typography.body2,
    ...typography.medium,

    color: Colors.contentPlaceholder,
    marginLeft: normalize(4),
  },
  shippingMethod: {
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors.neutralsZircon,
    paddingVertical: normalize(8),
    flex: 1,
  },
  info: {
    marginHorizontal: normalize(24),
    marginVertical: normalize(16),
    padding: normalize(16),
    borderRadius: normalize(8),
    backgroundColor: Colors.secondarySolitude,
  },
})

export default PublishedPostScreen
