import React, { createContext, useState, useContext, useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { PostService } from '@/services'
import firestore from '@react-native-firebase/firestore'
import Api from '@/services/Api'

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
  const [isInternetReachable, setIsInternetReachable] = useState(false)
  const [needsRefresh, setNeedsRefresh] = useState(true)

  // Post Images states
  const [imageCount, setImageCount] = useState(0)
  const [selected, setSelected] = useState([])

  const [coverPhoto, setCoverPhoto] = useState([])
  const [singleCameraImage, setSingleCameraImage] = useState(null)
  const [cameraImage, setCameraImage] = useState([])
  const [libImages, setLibImages] = useState([])

  // Added Items (multiple)
  const [items, setItems] = useState([])
  const [itemId, setItemId] = useState(1)
  const [searchType, setSearchType] = useState('posts')
  const [results, setResults] = useState([])
  const [page, setPage] = useState(0)
  const [refreshFollowerList, setRefreshFollowerList] = useState(false)

  const [deliveryMethod, setDeliveryMethod] = useState('delivery')

  const [notificationsList, setNotificationsList] = useState([])
  const [activityNotification, setActivityNotification] = useState()

  const getItemsByCategory = cat => {
    const result = [
      ...items
        .reduce(
          (
            r,
            { categoryName, description, itemImage, price, title, itemId }
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
    console.log('Add Item context triggered')
    console.log(item)

    let itemWithID = {
      ...item,
      itemId: itemId,
    }

    let itemArray = [...items]

    itemArray.push(itemWithID)

    setItems(itemArray)
    setItemId(itemId + 1)
  }

  const handleSearch = async value => {
    const result = await PostService.searchPosts({
      limit: 10,
      page: 0,
      search: value,
    })
    setResults(result.data)
    setPage(0)
  }

  const handleSearchUser = async value => {
    const result = await PostService.searchUsers({
      limit: 10,
      page: 0,
      search: value,
    })
    setResults(result.data)
    setPage(0)
  }

  const handleOnEndReach = async value => {
    const results = await PostService.searchPosts({
      limit: 10,
      page: page + 1,
      search: value,
    })
    setResults(prev => [...prev, ...results.data])
    setPage(page + 1)
  }

  const handleOnUserEndReach = async value => {
    const results = await PostService.searchUsers({
      limit: 10,
      page: page + 1,
      search: value,
    })
    setResults(prev => [...prev, ...results.data])
    setPage(page + 1)
  }

  useEffect(() => {
    setImageCount(coverPhoto.length)
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

  const fetchPosts = getPostsParams => {
    PostService.getPosts(getPostsParams).then(res => {
      setPosts(res.data)
    })
  }

  const initNotifications = async uid => {
    if (!uid) return
    firestore()
      .collection('activities')
      .doc(uid)
      .collection('notifications')
      .onSnapshot(async snap => {
        if (!snap) return
        setNotificationsList([])
        await Promise.all(
          snap.docs.map(async doc => {
            const data = doc.data()
            const response = await Api.getUser({ uid: data.follower_uid })
            if (response.success) {
              setNotificationsList(notificationsList => [
                ...notificationsList,
                {
                  profilePhoto: response.data.profile_photo,
                  name: response.data.full_name,
                  isFollowing: response.data.is_following,
                  ...data,
                },
              ])
            }
          })
        )
      })
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
        fetchPosts,
        deleteNotif,
        setDeleteNotif,
        imageCount,
        setImageCount,
        imageCurrent,
        setImageCurrent,
        locationFilter,
        setLocationFilter,
        isInternetReachable,
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
        handleSearch,
        handleSearchUser,
        handleOnEndReach,
        handleOnUserEndReach,
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
      }}>
      {children}
    </Context.Provider>
  )
}
