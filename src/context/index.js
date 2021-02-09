import React, { createContext, useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore'
import Api from '@/services/Api'
import _ from 'lodash'

export const Context = createContext()

export const ContextProvider = ({ children }) => {
  const [sliderState, setSliderState] = useState('')
  const [authenticationSheet, showAuthenticationSheet] = useState(false)

  const [notificationState, setNotificationState] = useState('')
  const [authType, setAuthType] = useState('')
  const [showButtons, setShowButtons] = useState()
  const [deleteNotif, setDeleteNotif] = useState(true)

  const [posts, setPosts] = useState([])
  const [userPosts, setUserPosts] = useState([])
  const [otherUserPosts, setOtherUserPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [archivedPosts, setArchivedPosts] = useState([])

  const [locationFilter, setLocationFilter] = useState(null)

  const [imageCurrent, setImageCurrent] = useState('')
  const [postCameraImage, setPostCameraImage] = useState([])
  const [needsRefresh, setNeedsRefresh] = useState(true)

  // Post Images states
  const [imageCount, setImageCount] = useState(0)
  const [selected, setSelected] = useState([])

  const [coverPhoto, setCoverPhoto] = useState([])
  const [singleCameraImage, setSingleCameraImage] = useState(null)
  const [cameraImage, setCameraImage] = useState([])
  const [libImages, setLibImages] = useState([])

  const [refresh, setRefresh] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [searchType, setSearchType] = useState('posts')
  const [results, setResults] = useState([])
  const [page, setPage] = useState(0)

  // Added Items (multiple)
  const [items, setItems] = useState([])
  const [itemId, setItemId] = useState(1)

  const [refreshFollowerList, setRefreshFollowerList] = useState(false)

  const [deliveryMethod, setDeliveryMethod] = useState('delivery')

  const [notificationsList, setNotificationsList] = useState([])
  const [userCart, setUserCart] = useState([])
  const [deleteCurrentOrderModal, showDeleteCurrentOrderModal] = useState(false)
  const [chatList, setChatList] = useState([])

  const getItemsByCategory = cat => {
    const result = [
      ...items
        .reduce(
          (
            r,
            { categoryName, description, itemImage, price, title, itemId, name }
          ) => {
            r.has(categoryName) ||
              r.set(categoryName, {
                categoryName,
                items: [],
              })

            r.get(categoryName).items.push({
              description,
              itemImage,
              price,
              title,
              itemId,
              categoryName,
              name,
            })

            return r
          },
          new Map()
        )
        .values(),
    ]

    let filteredItems = result.filter(category => {
      if (category.categoryName === cat) {
        return category
      }
    })

    return filteredItems[0]?.items
  }

  const editCategory = (newCategoryName, oldCategoryName) => {
    let itemArray = items.slice()
    itemArray = itemArray.map(item => {
      if (oldCategoryName === item.categoryName) {
        return {
          ...item,
          categoryName: newCategoryName,
        }
      } else {
        return item
      }
    })

    setItems(itemArray)
  }

  const editItem = item => {
    let itemArray = items.slice()

    let index = itemArray.findIndex(i => {
      if (i.itemId === item.itemId) {
        return i
      }
    })

    itemArray[index] = item

    setItems(itemArray)
  }

  const deleteItemsByCategory = categoryName => {
    let itemArray = items.slice()

    let result = itemArray.filter(item => {
      return item.categoryName !== categoryName
    })

    setItems(result)
  }

  const addItem = item => {
    let itemWithID = {
      ...item,
      itemId: item.itemId ?? itemId,
    }

    let itemArray = [...items]

    itemArray.push(itemWithID)

    setItems(itemArray)
    setItemId(itemId + 1)
  }

  useEffect(() => {
    setImageCount(coverPhoto?.length || 0)
  }, [coverPhoto])

  useEffect(() => {
    const newCoverPhoto = [...cameraImage, ...libImages].sort((a, b) =>
      !~coverPhoto.indexOf(b) && ~coverPhoto.indexOf(a)
        ? -1
        : !~coverPhoto.indexOf(a)
        ? 1
        : coverPhoto.indexOf(a) - coverPhoto.indexOf(b)
    )
    setCoverPhoto([...newCoverPhoto])
    setImageCount(newCoverPhoto.length)
  }, [libImages, cameraImage])

  const closeSlider = () => {
    setSliderState('close')
    showAuthenticationSheet(false)
  }

  const openSlider = () => {
    setSliderState('open')
    showAuthenticationSheet(true)
  }

  const openNotification = () => {
    setNotificationState('open')
  }

  const closeNotification = () => {
    setNotificationState('close')
  }

  const openPostButtons = () => {
    setShowButtons(true)
  }

  const closePostButtons = () => {
    setShowButtons(false)
  }

  const initNotifications = async uid => {
    if (!uid) return
    let unsubscribe = firestore()
      .collection('activities')
      .doc(uid)
      .collection('notifications')
      .orderBy('date', 'desc')
      .onSnapshot(async snap => {
        if (!snap) return
        const allNotifications = await Promise.all(
          snap.docs.map(async doc => {
            let snapData = doc.data()
            if (['order', 'payment'].includes(snapData.type)) {
              const orderResponse = (
                await firestore().doc(`orders/${snapData.order_id}`).get()
              ).data()

              snapData = {
                ...snapData,
                buyerId:
                  orderResponse?.seller_id === uid
                    ? orderResponse?.buyer_id
                    : orderResponse?.seller_id,
                postId: orderResponse?.post_id,
                orderId: snapData.order_id,
              }
            }
            const response = await Api.getUser({
              uid: snapData.follower_uid || snapData.buyerId || uid,
            })
            if (response.success)
              return {
                profilePhoto: response.data.profile_photo,
                name: response.data.display_name
                  ? response.data.display_name
                  : response.data.full_name,
                isFollowing: response.data.is_following,
                ...snapData,
              }
          })
        )

        setNotificationsList(allNotifications)
      })
    return unsubscribe
  }

  const initChats = async uid => {
    if (!uid) return
    const roomRef = await firestore()
      .collection('chat_rooms')
      .where(`members.${uid}`, '==', true)
      .get()
    let chats = await Promise.all(
      roomRef.docs.map(async room => {
        if (!room.data().post_id) return
        const chatRef = await firestore()
          .collection('chat_rooms')
          .doc(room.id)
          .collection('messages')
          .where('uid', '!=', uid)
          .get()

        return chatRef.docs.map(chatDoc => {
          return chatDoc.data()
        })
      })
    )
    chats = _.flatten(chats.filter(e => e))

    setChatList(chats)
  }

  return (
    <Context.Provider
      value={{
        deleteItemsByCategory,
        editCategory,
        items,
        addItem,
        editItem,
        getItemsByCategory,
        authenticationSheet,
        showAuthenticationSheet,
        sliderState,
        notificationState,
        closeSlider,
        openSlider,
        openNotification,
        closeNotification,
        authType,
        setAuthType,
        openPostButtons,
        closePostButtons,
        showButtons,
        setShowButtons,
        posts,
        setPosts,
        deleteNotif,
        setDeleteNotif,
        imageCount,
        setImageCount,
        imageCurrent,
        setImageCurrent,
        locationFilter,
        setLocationFilter,
        userPosts,
        setUserPosts,
        otherUserPosts,
        setOtherUserPosts,
        needsRefresh,
        setNeedsRefresh,
        coverPhoto,
        setCoverPhoto,
        selected,
        setSelected,
        postCameraImage,
        setPostCameraImage,
        setCameraImage,
        cameraImage,
        libImages,
        setLibImages,
        setSingleCameraImage,
        singleCameraImage,
        searchType,
        setSearchType,
        results,
        setResults,
        page,
        setPage,
        refreshFollowerList,
        setRefreshFollowerList,
        deliveryMethod,
        setDeliveryMethod,
        likedPosts,
        setLikedPosts,
        archivedPosts,
        setArchivedPosts,
        notificationsList,
        setNotificationsList,
        initNotifications,
        userCart,
        setUserCart,
        isLoading,
        setIsLoading,
        refresh,
        setRefresh,
        deleteCurrentOrderModal,
        showDeleteCurrentOrderModal,
        initChats,
        chatList,
        setItems,
      }}>
      {children}
    </Context.Provider>
  )
}
