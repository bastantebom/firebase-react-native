import * as React from 'react'
import { AppRegistry, YellowBox } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { name as appName } from './app.json'
import App from './App'

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
])

export default function Main() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  )
}

AppRegistry.registerComponent(appName, () => Main)
