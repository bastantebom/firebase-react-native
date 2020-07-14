import React, { createContext, useState} from 'react'

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [sampleState, setSampleState] = useState('hello')

  const sampleFunction = () => {
    setSampleState("bang")
  }
  return (
    <Context.Provider value={{ sampleState, sampleFunction  }} >
      {children}
    </Context.Provider>
  )
}