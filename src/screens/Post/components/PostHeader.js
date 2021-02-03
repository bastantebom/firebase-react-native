import React, { useEffect, useState, useRef, useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { AppText } from '@/components'
import { normalize, Colors } from '@/globals'
import { PostSell, PostService, PostNeed } from '@/assets/images/icons'

import PostForm from './forms/post-form'
import { UserContext } from '@/context/UserContext'

const Post = ({ card, togglePostModal, initialData }) => {
  useEffect(() => {
    selectActive(card)
  }, [])

  const navigation = useNavigation()
  const { userInfo } = useContext(UserContext)

  const navToPost = data => {
    const defaultAddress = userInfo.addresses.find(address => address.default)
    const post = data.data
    navigation.navigate('Post', {
      screen: 'SinglePostView',
      params: {
        data: {
          ...post,
          user: userInfo,
          store_details: {
            ...(post.store_details || {}),
            location: {
              ...(post.store_details?.location || defaultAddress),
            },
          },
        },
      },
    })
  }

  const [pickingState, setPickingState] = useState(true)

  const [postPosition] = useState(new Animated.Value(0))
  const [postSize] = useState(new Animated.Value(normalize(114)))

  const [sellPosition] = useState(new Animated.Value(0))
  const [sellSize] = useState(new Animated.Value(normalize(114)))

  const [needPosition] = useState(new Animated.Value(0))
  const [needSize] = useState(new Animated.Value(normalize(114)))

  const [activeCard, setActiveCard] = useState('none')
  const [highlightedCard, setHighlightedCard] = useState('none')

  const [postDotOpacity] = useState(new Animated.Value(0))
  const [needDotOpacity] = useState(new Animated.Value(0))
  const [sellDotOpacity] = useState(new Animated.Value(0))

  const [cardTextOpacity] = useState(new Animated.Value(1))

  const [postText, setPostText] = useState('Find What You Need')
  const [sellText, setSellText] = useState('Start Selling')
  const [needText, setNeedText] = useState('Offer Your Services')

  const [activeScreen, setActiveScreen] = useState(card)

  const resetPicking = () => {
    setTimeout(() => {
      setHighlightedCard(activeCard)
      setActiveCard('none')
      setPostText('Find What You Need')
      setSellText('Start Selling')
      setNeedText('Offer Your Services')
    }, 200)

    const showDot = () => {
      if (activeCard === 'post')
        return Animated.parallel([
          transitionFinish(),
          Animated.timing(postDotOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ])
      if (activeCard === 'need')
        return Animated.parallel([
          transitionFinish(),
          Animated.timing(needDotOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ])
      if (activeCard === 'sell')
        return Animated.parallel([
          transitionFinish(),
          Animated.timing(sellDotOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ])
    }

    Animated.sequence([
      transitionActive(),
      Animated.parallel([
        Animated.timing(needSize, {
          toValue: normalize(114),
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(postSize, {
          toValue: normalize(114),
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(sellSize, {
          toValue: normalize(114),
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(postPosition, {
          toValue: normalize(0),
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(sellPosition, {
          toValue: normalize(0),
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(needPosition, {
          toValue: normalize(0),
          duration: 500,
          useNativeDriver: false,
        }),
      ]),
      showDot(),
    ]).start()
  }

  const hideDots = () => {
    return Animated.parallel([
      transitionActive(),
      Animated.timing(postDotOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(needDotOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(sellDotOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ])
  }

  const transitionActive = () => {
    return Animated.timing(cardTextOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    })
  }

  const transitionFinish = () => {
    return Animated.timing(cardTextOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    })
  }

  const selectActive = selectedCard => {
    setPickingState(!pickingState)

    if (pickingState) {
      switch (selectedCard) {
        case 'post':
          setTimeout(() => {
            setActiveCard('post')
            setHighlightedCard('none')
            setPostText('What are you looking for today?')
            setActiveScreen('post')
          }, 200)

          Animated.sequence([
            hideDots(),
            Animated.parallel([
              Animated.timing(postSize, {
                toValue: normalize(271),
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(needSize, {
                toValue: normalize(114),
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(needPosition, {
                toValue: normalize(-74),
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(sellSize, {
                toValue: normalize(114),
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(sellPosition, {
                toValue: normalize(15),
                duration: 500,
                useNativeDriver: false,
              }),
            ]),
            transitionFinish(),
          ]).start()
          break
        case 'need':
          setTimeout(() => {
            setActiveCard('need')
            setHighlightedCard('none')
            setNeedText('What services do you want to list today?')
            setActiveScreen('need')
          }, 200)
          Animated.sequence([
            hideDots(),
            Animated.parallel([
              Animated.timing(needSize, {
                toValue: normalize(271),
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(postSize, {
                toValue: normalize(114),
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(sellSize, {
                toValue: normalize(114),
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(postPosition, {
                toValue: normalize(114 + 114 + 74 - 8),
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(sellPosition, {
                toValue: normalize(114 + 74 + 9 + 9),
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(needPosition, {
                toValue: normalize(-(114 + 114 + 9 + 9)),
                duration: 500,
                useNativeDriver: false,
              }),
            ]),
            transitionFinish(),
          ]).start()
          break
        case 'sell':
          setTimeout(() => {
            setSellText('What are you listing today?')
            setActiveCard('sell')
            setHighlightedCard('none')
            setActiveScreen('sell')
          }, 200)
          Animated.sequence([
            hideDots(),
            Animated.parallel([
              Animated.timing(sellSize, {
                toValue: normalize(271),
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(needSize, {
                toValue: normalize(114),
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(postSize, {
                toValue: normalize(114),
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(postPosition, {
                toValue: normalize(114 + 114 + 74 - 8),
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(sellPosition, {
                toValue: normalize(-9 - 114),
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(needPosition, {
                toValue: normalize(-74),
                duration: 500,
                useNativeDriver: false,
              }),
            ]),
            transitionFinish(),
          ]).start()
          break
      }
    } else {
      resetPicking()
    }
  }

  let PostAnimationStyle = {
    transform: [{ translateX: postPosition }],
    width: postSize,
  }

  let SellAnimationStyle = {
    transform: [{ translateX: sellPosition }],
    width: sellSize,
  }

  let NeedAnimationStyle = {
    transform: [{ translateX: needPosition }],
    width: needSize,
  }

  let PostDotAnimationStyle = {
    opacity: postDotOpacity,
  }

  let NeedDotAnimationStyle = {
    opacity: needDotOpacity,
  }

  let SellDotAnimationStyle = {
    opacity: sellDotOpacity,
  }

  let PostTextOpacity = {
    opacity: cardTextOpacity,
  }

  const PostContent = () => {
    if (activeCard !== 'none' && activeCard !== 'post') {
      return (
        <Animated.View
          style={[
            {
              height: '100%',
              paddingLeft: 8,
              paddingRight: 8,
              paddingVertical: 8,
              position: 'relative',
              justifyContent: 'center',
            },
            PostTextOpacity,
          ]}>
          <PostNeed width={normalize(24)} height={normalize(24)} />
        </Animated.View>
      )
    }

    if (activeCard === 'post')
      return (
        <Animated.View
          style={[
            {
              height: '100%',
              paddingLeft: 16,
              paddingRight: 16,
              paddingVertical: 8,
              position: 'relative',
              flexDirection: 'row',
              alignItems: 'center',
            },
            PostTextOpacity,
          ]}>
          <Animated.View style={{ flex: 1, justifyContent: 'center' }}>
            <AppText textStyle="subtitle2constant" color={Colors.neutralsWhite}>
              Find What You Need
            </AppText>
            <AppText textStyle="captionConstant" color={Colors.neutralsWhite}>
              {postText}
            </AppText>
          </Animated.View>
          <PostNeed width={normalize(24)} height={normalize(24)} />
        </Animated.View>
      )

    return (
      <Animated.View
        style={[
          {
            height: '100%',
            paddingLeft: 16,
            paddingRight: 8,
            paddingVertical: 8,
            position: 'relative',
          },
          PostTextOpacity,
        ]}>
        <PostNeed width={normalize(24)} height={normalize(24)} />
        <Animated.View style={{ flex: 1, justifyContent: 'center' }}>
          <AppText textStyle="subtitle2constant" color={Colors.neutralsWhite}>
            {postText}
          </AppText>
        </Animated.View>
      </Animated.View>
    )
  }

  const SellContent = () => {
    if (activeCard !== 'none' && activeCard !== 'sell') {
      return (
        <Animated.View
          style={[
            {
              height: '100%',
              paddingLeft: 8,
              paddingRight: 8,
              paddingVertical: 8,
              position: 'relative',
              justifyContent: 'center',
            },
            PostTextOpacity,
          ]}>
          <PostSell width={normalize(24)} height={normalize(24)} />
        </Animated.View>
      )
    }

    if (activeCard === 'sell')
      return (
        <Animated.View
          style={[
            {
              height: '100%',
              paddingLeft: 16,
              paddingRight: 16,
              paddingVertical: 8,
              position: 'relative',
              flexDirection: 'row',
              alignItems: 'center',
            },
            PostTextOpacity,
          ]}>
          <Animated.View style={{ flex: 1, justifyContent: 'center' }}>
            <AppText textStyle="subtitle2constant" color={Colors.neutralsWhite}>
              Start Selling
            </AppText>
            <AppText textStyle="captionConstant" color={Colors.neutralsWhite}>
              {sellText}
            </AppText>
          </Animated.View>
          <PostSell width={normalize(24)} height={normalize(24)} />
        </Animated.View>
      )

    return (
      <Animated.View
        style={[
          {
            height: '100%',
            paddingLeft: 16,
            paddingRight: 8,
            paddingVertical: 8,
            position: 'relative',
          },
          PostTextOpacity,
        ]}>
        <PostSell width={normalize(24)} height={normalize(24)} />
        <Animated.View style={{ flex: 1, justifyContent: 'center' }}>
          <AppText textStyle="subtitle2constant" color={Colors.neutralsWhite}>
            {sellText}
          </AppText>
        </Animated.View>
      </Animated.View>
    )
  }

  const NeedContent = () => {
    if (activeCard !== 'none' && activeCard !== 'need') {
      return (
        <Animated.View
          style={[
            {
              height: '100%',
              paddingLeft: 8,
              paddingRight: 8,
              paddingVertical: 8,
              position: 'relative',
              justifyContent: 'center',
            },
            PostTextOpacity,
          ]}>
          <PostService width={normalize(24)} height={normalize(24)} />
        </Animated.View>
      )
    }

    if (activeCard === 'need')
      return (
        <Animated.View
          style={[
            {
              height: '100%',
              paddingLeft: 16,
              paddingRight: 16,
              paddingVertical: 8,
              position: 'relative',
              flexDirection: 'row',
              alignItems: 'center',
            },
            PostTextOpacity,
          ]}>
          <Animated.View style={{ flex: 1, justifyContent: 'center' }}>
            <AppText textStyle="subtitle2constant" color={Colors.neutralsWhite}>
              Offer Your Services
            </AppText>
            <AppText textStyle="captionConstant" color={Colors.neutralsWhite}>
              {needText}
            </AppText>
          </Animated.View>
          <PostService width={normalize(24)} height={normalize(24)} />
        </Animated.View>
      )

    return (
      <Animated.View
        style={[
          {
            height: '100%',
            paddingLeft: 16,
            paddingRight: 8,
            paddingVertical: 8,
            position: 'relative',
          },
          PostTextOpacity,
        ]}>
        <PostService width={normalize(24)} height={normalize(24)} />
        <Animated.View style={{ flex: 1, justifyContent: 'center' }}>
          <AppText textStyle="subtitle2constant" color={Colors.neutralsWhite}>
            {needText}
          </AppText>
        </Animated.View>
      </Animated.View>
    )
  }

  return (
    <SafeAreaView>
      {!initialData ? (
        <View
          style={[
            styles.postAnimationContainer,
            {
              // justifyContent: pickingState ? 'flex-start' : 'space-around',
              // position: pickingState ? 'relative' : 'absolute',
              paddingLeft: normalize(8),
            },
          ]}>
          <Animated.View style={[styles.postCard, PostAnimationStyle]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                selectActive('post')
                if (activeCard !== 'none' && activeCard !== 'post') {
                  resetPicking()
                }
              }}>
              <PostContent />
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.needDot,
                { backgroundColor: Colors.secondaryMountainMeadow },
                PostDotAnimationStyle,
              ]}
            />
          </Animated.View>

          <Animated.View style={[styles.sellCard, SellAnimationStyle]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                selectActive('sell')
                if (activeCard !== 'none' && activeCard !== 'sell') {
                  resetPicking()
                }
              }}>
              <SellContent />
            </TouchableOpacity>
            <Animated.View
              style={[
                styles.needDot,
                { backgroundColor: Colors.secondaryRoyalBlue },
                SellDotAnimationStyle,
              ]}
            />
          </Animated.View>

          <Animated.View style={[styles.needCard, NeedAnimationStyle]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                selectActive('need')
                if (activeCard !== 'none' && activeCard !== 'need') {
                  resetPicking()
                }
              }}>
              <NeedContent />
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.needDot,
                { backgroundColor: Colors.secondaryBrinkPink },
                NeedDotAnimationStyle,
              ]}
            />
          </Animated.View>
        </View>
      ) : null}
      <RenderActiveForm
        activeScreen={activeScreen}
        navToPost={navToPost}
        togglePostModal={togglePostModal}
        initialData={initialData ? initialData : {}}
      />
    </SafeAreaView>
  )
}

const RenderActiveForm = ({
  activeScreen,
  navToPost,
  togglePostModal,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData.title)
  const [images, setImages] = useState(
    initialData.cover_photos || initialData.images
  )
  const [price, setPrice] = useState(initialData?.items?.[0]?.price?.toString())
  const [description, setDescription] = useState(initialData.description)
  const [pickupState, setPickupState] = useState(
    initialData ? initialData?.delivery_methods?.pickup : {}
  )
  const [deliveryState, setDeliveryState] = useState(
    initialData ? initialData?.delivery_methods?.delivery : {}
  )
  const [storeLocation, setStoreLocation] = useState(initialData.store_location)
  const [paymentMethod, setPaymentMethod] = useState(initialData.payment_method)
  const [listAsSingle, setListAsSingle] = useState(!initialData.is_multiple)
  const [listAsMultiple, setListAsMultiple] = useState(
    !!initialData.is_multiple
  )
  const [allowContact, setAllowContact] = useState(initialData.allow_contact)
  const [freeCheckbox, setFreeCheckbox] = useState(false)
  const [postInStore, setPostInStore] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState({
    cash: false,
    gcash: false,
    card: false,
    paypal: false,
    grabpay: false,
    onlineBanking: false,
    bank: '',
    others: false,
    otherMethods: '',
    ...(initialData.payment?.reduce?.((methods, current) => {
      methods[current] = true
      return methods
    }, {}) || {}),
  })

  const [postExpiry, setPostExpiry] = useState()

  const formState = {
    postExpiry,
    setPostExpiry,
    paymentMethods,
    setPaymentMethods,
    title: title,
    setTitle: setTitle,
    images: images,
    setImages: setImages,
    price: price,
    setPrice: setPrice,
    description: description,
    setDescription: setDescription,
    pickupState: pickupState,
    setPickupState: setPickupState,
    deliveryState: deliveryState,
    setDeliveryState: setDeliveryState,
    storeLocation: storeLocation,
    setStoreLocation: setStoreLocation,
    paymentMethod: paymentMethod,
    setPaymentMethod: setPaymentMethod,
    listAsSingle: listAsSingle,
    setListAsSingle: setListAsSingle,
    listAsMultiple: listAsMultiple,
    setListAsMultiple: setListAsMultiple,
    freeCheckbox: freeCheckbox,
    setFreeCheckbox: setFreeCheckbox,
    postInStore,
    setPostInStore,
    allowContact,
    setAllowContact,
  }

  return (
    <PostForm
      navToPost={navToPost}
      togglePostModal={togglePostModal}
      formState={formState}
      initialData={initialData}
      activeScreen={initialData.type ?? activeScreen}
    />
  )
}

const styles = StyleSheet.create({
  postAnimationContainer: {
    flexDirection: 'row',
    position: 'relative',
    paddingBottom: 24,
  },
  sellCard: {
    backgroundColor: Colors.secondaryRoyalBlue,
    height: normalize(82),
    borderRadius: 8,
    marginLeft: normalize(9),
  },
  postCard: {
    backgroundColor: Colors.secondaryMountainMeadow,
    height: normalize(82),
    borderRadius: 8,
  },
  needCard: {
    backgroundColor: Colors.secondaryBrinkPink,
    height: normalize(82),
    borderRadius: 8,
    marginLeft: normalize(9),
  },
  needDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'center',
  },
})

export default Post
