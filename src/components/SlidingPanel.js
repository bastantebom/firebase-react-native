import React, { forwardRef } from 'react'
import { View, Dimensions } from 'react-native'

import SlidingUpPanel from 'rn-sliding-up-panel'

const {height} = Dimensions.get('window')

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'absolute'
  },
  panel: {
    flex: 1,
    backgroundColor: '#fff',
    elevation: 20,
  },
  panelHeader: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    elevation: 20,
  },
  panelHandle: {
    marginTop: 25,
    width: 40,
    height: 5,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100
  }
}

// view should have flex prop <View style={{flex: 1, flexGrow: 1}}>

const SlidePanel = forwardRef(( props, ref ) => {  

  return (
    <View style={styles.container}>
      {props.content}
      <SlidingUpPanel
        ref={ref}
        draggableRange={{top: height - 25, bottom: 0}}
        showBackdrop={false}
      >
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle} />
        </View>
        <View style={styles.panel}>
          {props.children}
        </View>
      </SlidingUpPanel>
    </View>
  )
})


export default SlidePanel;