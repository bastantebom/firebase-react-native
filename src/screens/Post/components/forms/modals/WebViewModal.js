import React from 'react'
import { WebView } from 'react-native-webview'

const WebViewModal = ({ children, link }) => {
  return (
    <>
      {children}
      <WebView source={{ uri: link }} />
    </>
  )
}

export default WebViewModal
