import React, {createContext, useState} from 'react';

export const Context = createContext();

export const ContextProvider = ({children}) => {
  const [sliderState, setSliderState] = useState('');
  const [notificationState, setNotificationState] = useState('');
  const [authType, setAuthType] = useState('');
  const [showButtons, setShowButtons] = useState();

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
      }}>
      {children}
    </Context.Provider>
  );
};
