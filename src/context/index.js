import React, { createContext, useState} from 'react'

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [sliderState, setSliderState] = useState('')

  const closeSlider = () => {
    setSliderState("close")
  }

  const openSlider = () => {
    setSliderState("open")
  }

  return (
    <Context.Provider value={{ sliderState, closeSlider, openSlider  }} >
      {children}
    </Context.Provider>
  )
}