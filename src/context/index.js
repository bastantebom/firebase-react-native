import React, {createContext, useState} from 'react';
import {PostService} from '@/services';

export const Context = createContext();

export const ContextProvider = ({children}) => {
  const [sliderState, setSliderState] = useState('');
  const [notificationState, setNotificationState] = useState('');
  const [authType, setAuthType] = useState('');
  const [showButtons, setShowButtons] = useState();

  const [posts, setPosts] = useState([]);

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
  }

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
        fetchPosts
      }}>
      {children}
    </Context.Provider>
  );
};
