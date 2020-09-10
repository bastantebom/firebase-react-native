import React, {createContext, useState, useContext, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {PostService} from '@/services';
import {UserContext} from '@/context/UserContext';

export const Context = createContext();

export const ContextProvider = ({children}) => {
  // const {userInfo} = useContext(UserContext);

  const [sliderState, setSliderState] = useState('');
  const [notificationState, setNotificationState] = useState('');
  const [authType, setAuthType] = useState('');
  const [showButtons, setShowButtons] = useState();
  const [deleteNotif, setDeleteNotif] = useState(true);

  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [otherUserPosts, setOtherUserPosts] = useState([]);

  const [locationFilter, setLocationFilter] = useState(null);

  const [postImage, setPostImage] = useState([]);
  const [imageCount, setImageCount] = useState(0);
  const [imageCurrent, setImageCurrent] = useState('');

  const [isInternetReachable, setIsInternetReachable] = useState(false);

  const [needsRefresh, setNeedsRefresh] = useState(true)

  const closeSlider = () => {
    setSliderState('close');
  };

  const openSlider = () => {
    setSliderState('open');
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
        postImage,
        setPostImage,
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
        needsRefresh,
        setNeedsRefresh
      }}>
      {children}
    </Context.Provider>
  );
};
