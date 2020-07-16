import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import {View, Dimensions} from 'react-native';

import SlidingUpPanel from 'rn-sliding-up-panel';
import Colors from '@/globals/Colors';

// const {height} = Dimensions.get('window');

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  panel: {
    flex: 1,
    backgroundColor: Colors.neutralsWhite,
    // backgroundColor: Colors.neutralsWhite,
    elevation: 20,
  },
  panelHeader: {
    width: '100%',
    backgroundColor: Colors.neutralsWhite,
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
    borderRadius: 100,
  },
};

const useComponentSize = () => {
  const [size, setSize] = useState(null);

  const onLayout = useCallback(event => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  return [size, onLayout];
};

// view should have flex prop <View style={{flex: 1, flexGrow: 1}}>

const SlidePanel = forwardRef((props, ref) => {

  const [size, onLayout] = useComponentSize();

  useEffect(() => {
    console.log(size, onLayout)
  }, [])

  return (
    <View 
      style={styles.container}
    >
      {props.content}
      <SlidingUpPanel
        ref={ref}
        // draggableRange={{top: size, bottom: 0}}
        showBackdrop={false}>
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle} />
        </View>
        <View 
          style={styles.panel}
          onLayout={onLayout}
        >
          {props.children}
        </View>
      </SlidingUpPanel>
    </View>
  );
});

export default SlidePanel;
