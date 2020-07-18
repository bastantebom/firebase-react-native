import React, { createContext, useState } from 'react'

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [sliderState, setSliderState] = useState('')
  const [notificationState, setNotificationState] = useState('')

  const closeSlider = () => {
    setSliderState("close")
  }

  const openSlider = () => {
    setSliderState("open")
  }

  const openNotification = () => {
    setNotificationState('open');
  }

  const closeNotification = () => {
    setNotificationState('close');
  }

  return (
    <Context.Provider value={{ sliderState, notificationState, closeSlider, openSlider, openNotification, closeNotification }} >
      {children}
    </Context.Provider>
  )
}