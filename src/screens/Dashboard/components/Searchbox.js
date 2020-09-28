import React, { useEffect, useRef, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Keyboard, 
  Animated, 
  Dimensions,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { Searchbar } from 'react-native-paper';
import { connectSearchBox } from 'react-instantsearch-native';
import { AppInput } from '@/components';
import { normalize } from '@/globals';
import AppColor from '@/globals/Colors';
import { HeaderBackGray } from '@/assets/images/icons';
import InfiniteHits from './InfiniteHits';

const { width } = Dimensions.get("window");
const PADDING = 16;
const SEARCH_FULL_WIDTH = width - (PADDING + normalize(20)) * 2; //search_width when unfocused
const SEARCH_SHRINK_WIDTH = width - PADDING - normalize(125); //search_width when focused

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const SearchBox = ({ currentRefinement, refine, onSearchFocus, onBackPress }) => {    
  const searchbarRef = useRef(null)

  const [inputLength] = useState(new Animated.Value(SEARCH_SHRINK_WIDTH))
  const [cancelPosition] = useState(new Animated.Value(0))
  const [barPosition] = useState(new Animated.Value(0))
  const [opacity] = useState(new Animated.Value(0))
  const [searchBarFocused] = useState(false)

  // useEffect(() => {
  //   Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
  //   Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

  //   return () => {
  //     Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
  //     Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
  //   };
  // }, []);

  // const _keyboardDidShow = () => {
  //   // alert("Keyboard Shown");
  //   searchbarRef.current.isFocused(console.log('focused...'))
  // };

  // const _keyboardDidHide = () => {
  //   // alert("Keyboard Hidden");
  //   !searchbarRef.current.isFocused(console.log('blurred...'))
  // };
    
  const onFocus = () => {
    searchbarRef.current.isFocused(console.log('focused...'))
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_FULL_WIDTH,
        duration: 250,
        useNativeDriver: false
      }),
      Animated.timing(cancelPosition, {
        toValue: -16,
        duration: 400,
        useNativeDriver: false
      }),
      Animated.timing(barPosition, {
        toValue: 45,
        duration: 400,
        useNativeDriver: false
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true
      })
    ]).start();
    onSearchFocus();
  }
  
  const onBlur = () => {
    !searchbarRef.current.isFocused(console.log('blurred...'))
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_SHRINK_WIDTH,
        duration: 250,
      }),
      Animated.timing(cancelPosition, {
        toValue: 0,
        duration: 250,
      }),
      Animated.timing(barPosition, {
        toValue: 0,
        duration: 250,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      })
    ]).start();
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            width: inputLength,
            position: "absolute",
            zIndex: 1,
            left: barPosition
          },
        ]}
      >
        <Searchbar
          placeholder="Start your search..."
          onChangeText={value => refine(value)}
          value={currentRefinement}
          fontFamily={'RoundedMplus1c-Regular'}
          theme={{
            colors: {
              primary: AppColor.contentOcean,
            },
            fonts: {
              regular: ''
            },
          }}
          inputStyle={{ paddingLeft: 0, paddingRight: 0 }}
          style={{ flex: 1, marginTop: normalize(0), paddingVertical: normalize(2) }}
          ref={searchbarRef}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Animated.View>
      <AnimatedTouchable
        style={[styles.cancelSearch, { left: cancelPosition }]}
        onPress={() => {onBlur(), onBackPress()}}
      >
        <Animated.View style={{ opacity: opacity }}>
          <HeaderBackGray width={normalize(25)} height={normalize(25)} />
        </Animated.View>
      </AnimatedTouchable>
    </View>
  )
};

SearchBox.propTypes = {
  currentRefinement: PropTypes.string.isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectSearchBox(SearchBox);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelSearch: {
    position: "absolute",
    marginHorizontal: 16,
    justifyContent: "center",
    alignSelf: "center",
  }
});
