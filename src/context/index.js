import React, { createContext, useState, useEffect } from 'react'

export const Context = createContext()

export const ContextProvider = ({ children }) => {
  const [dashboardNeedsRefresh, setDashboardNeedsRefresh] = useState(false)
  const [
    profileUserPostsNeedsRefresh,
    setProfileUserPostsNeedsRefresh,
  ] = useState(false)
  const [sliderState, setSliderState] = useState('')
  const [authenticationSheet, showAuthenticationSheet] = useState(false)

  const [notificationState, setNotificationState] = useState('')
  const [authType, setAuthType] = useState('')
  const [deleteNotif, setDeleteNotif] = useState(true)

  const [posts, setPosts] = useState([])
  const [userPosts, setUserPosts] = useState([])
  const [otherUserPosts, setOtherUserPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [archivedPosts, setArchivedPosts] = useState([])

  const [locationFilter, setLocationFilter] = useState(null)

  const [imageCurrent, setImageCurrent] = useState('')
  const [postCameraImage, setPostCameraImage] = useState([])
  const [createPostPopupVisible, setCreatePostPopupVisible] = useState(false)

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

  // const [notificationsList, setNotificationsList] = useState([])
  const [userCart, setUserCart] = useState([])
  const [deleteCurrentOrderModal, showDeleteCurrentOrderModal] = useState(false)
  // const [chatList, setChatList] = useState([])

  const [basket, setBasket] = useState({})

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

  return (
    <Context.Provider
      value={{
        deleteItemsByCategory,
        editCategory,
        items,
        addItem,
        editItem,
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
        userCart,
        setUserCart,
        isLoading,
        setIsLoading,
        refresh,
        setRefresh,
        deleteCurrentOrderModal,
        showDeleteCurrentOrderModal,
        setItems,
        basket,
        setBasket,
        dashboardNeedsRefresh,
        setDashboardNeedsRefresh,
        createPostPopupVisible,
        setCreatePostPopupVisible,
        profileUserPostsNeedsRefresh,
        setProfileUserPostsNeedsRefresh,
      }}>
      {children}
    </Context.Provider>
  )
}
