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
  
  const [coverPhoto, setCoverPhoto] = useState([])
  const [singleCameraImage, setSingleCameraImage] = useState(null)
  const [cameraImage, setCameraImage] = useState([])
  const [libImages, setLibImages] = useState([])
  
  useEffect(() => {
    setImageCount(coverPhoto.length)
  }, [coverPhoto])

  // Set post coverphoto
  useEffect(() => {
    const newCoverPhoto = [...coverPhoto, ...cameraImage, ...libImages].sort((a, b) => !~coverPhoto.indexOf(b) && ~coverPhoto.indexOf(a) ? -1 : !~coverPhoto.indexOf(a) ? 1 : coverPhoto.indexOf(a) - coverPhoto.indexOf(b))
    setCoverPhoto([...newCoverPhoto])
    setImageCount(newCoverPhoto.length)
  }, [libImages, cameraImage])

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
        singleCameraImage
      }}>
      {children}
    </Context.Provider>
  );
};
