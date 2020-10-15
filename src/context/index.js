import React, {createContext, useState, useContext, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {PostService} from '@/services';
import {UserContext} from '@/context/UserContext';

export const Context = createContext();

export const ContextProvider = ({children}) => {
  // const {userInfo} = useContext(UserContext);

  const [sliderState, setSliderState] = useState('');
  const [authenticationSheet, showAuthenticationSheet] = useState(false);

  const [notificationState, setNotificationState] = useState('');
  const [authType, setAuthType] = useState('');
  const [showButtons, setShowButtons] = useState();
  const [deleteNotif, setDeleteNotif] = useState(true);

  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [otherUserPosts, setOtherUserPosts] = useState([]);

  const [locationFilter, setLocationFilter] = useState(null);

  const [imageCurrent, setImageCurrent] = useState('');
  const [postCameraImage, setPostCameraImage] = useState([]);
  const [isInternetReachable, setIsInternetReachable] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(true);

  // Post Images states
  const [imageCount, setImageCount] = useState(0);
  const [selected, setSelected] = useState([]);

  const [coverPhoto, setCoverPhoto] = useState([]);
  const [singleCameraImage, setSingleCameraImage] = useState(null);
  const [cameraImage, setCameraImage] = useState([]);
  const [libImages, setLibImages] = useState([]);

  // Added Items (multiple)
  const [items, setItems] = useState([]);
  const [itemId, setItemId] = useState(1);

  const getItemsByCategory = (cat) => {
    const result = [
      ...items
        .reduce(
          (r, {categoryName, description, itemImage, price, title, itemId}) => {
            r.has(categoryName) ||
              r.set(categoryName, {
                categoryName,
                items: [],
              });

            r.get(categoryName).items.push({
              description,
              itemImage,
              price,
              title,
              itemId,
              categoryName,
            });

            return r;
          },
          new Map(),
        )
        .values(),
    ];

    let filteredItems = result.filter((category) => {
      if (category.categoryName === cat) {
        return category;
      }
    });

    return filteredItems[0]?.items;
  };

  const editItem = (item) => {
    let itemArray = items.slice();

    let index = itemArray.findIndex((i) => {
      if (i.itemId === item.itemId) {
        return i;
      }
    });

    itemArray[index] = item;

    setItems(itemArray)
  };

  const addItem = (item) => {
    console.log('Add Item context triggered');
    console.log(item);

    let itemWithID = {
      ...item,
      itemId: itemId,
    };

    let itemArray = [...items];

    itemArray.push(itemWithID);

    setItems(itemArray);
    setItemId(itemId + 1);
  };

  useEffect(() => {
    setImageCount(coverPhoto.length);
  }, [coverPhoto]);

  // Set post coverphoto
  useEffect(() => {
    const newCoverPhoto = [...cameraImage, ...libImages].sort((a, b) =>
      !~coverPhoto.indexOf(b) && ~coverPhoto.indexOf(a)
        ? -1
        : !~coverPhoto.indexOf(a)
        ? 1
        : coverPhoto.indexOf(a) - coverPhoto.indexOf(b),
    );
    setCoverPhoto([...newCoverPhoto]);
    setImageCount(newCoverPhoto.length);
  }, [libImages, cameraImage]);

  const closeSlider = () => {
    setSliderState('close');
    showAuthenticationSheet(false);
  };

  const openSlider = () => {
    setSliderState('open');
    showAuthenticationSheet(true);
  };

  const openNotification = () => {
    setNotificationState('open');
  };

  const closeNotification = () => {
    setNotificationState('close');
  };

  const openPostButtons = () => {
    setShowButtons(true);
  };

  const closePostButtons = () => {
    setShowButtons(false);
  };

  const fetchPosts = (getPostsParams) => {
    PostService.getPosts(getPostsParams).then((res) => {
      // console.log('POSTS');
      // LAST ID TO BE USED FOR PAGINATION
      console.log(res.last_id);
      setPosts(res.data);
    });
  };

  const onChangeConnection = (newState) => {
    setIsInternetReachable(newState);
  };

  useEffect(() => {
    // NetInfo.isConnected.addEventListener(
    //   'connectionChange',
    //   onChangeConnection,
    // );
  }, []);

  return (
    <Context.Provider
      value={{
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
      }}>
      {children}
    </Context.Provider>
  );
};
