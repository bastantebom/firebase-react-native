import React, { useRef, useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Animated, 
  Dimensions,
  TouchableOpacity, Keyboard
} from 'react-native';
import PropTypes from 'prop-types';
import { Searchbar } from 'react-native-paper';
import { connectSearchBox } from 'react-instantsearch-native';
import { Colors, normalize } from '@/globals';
import AppColor from '@/globals/Colors';
import { Close, HeaderBackGray } from '@/assets/images/icons';
import { AppText } from '@/components';
import { Context } from '@/context';

const { width } = Dimensions.get("window");
const PADDING = 16;
const SEARCH_FULL_WIDTH = width - (PADDING + normalize(20)) * 2;
const SEARCH_SHRINK_WIDTH = width - PADDING - normalize(125);
const FULL_WIDTH = width - PADDING * 2;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const SearchBox = ({ 
  currentRefinement, 
  refine, 
  onSearchFocus, 
  onBackPress, 
  valueHandler,
  customStyle,
  props
 }) => {    

  const { searchType, setSearchType } = useContext(Context);

  const searchbarRef = useRef(null)
  const [value, setValue] = useState()
  const [inputLength] = useState(new Animated.Value(SEARCH_SHRINK_WIDTH))
  const [cancelPosition] = useState(new Animated.Value(0))
  const [barPosition] = useState(new Animated.Value(0))
  const [opacity] = useState(new Animated.Value(0))
  const [searchBarFocused, setSearchBarFocused] = useState(false)

  const onFocus = () => {
    // searchbarRef.current.isFocused(console.log('focused...'))
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
        // toValue: 0,
        duration: 400,
        useNativeDriver: false
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true
      })
    ]).start();
    setSearchBarFocused(true);
    onSearchFocus();
  }
  
  const onBlur = () => {
    // !searchbarRef.current.isFocused(console.log('blurred...'))
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_SHRINK_WIDTH,
        duration: 250,
        useNativeDriver: false
      }),
      Animated.timing(cancelPosition, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false
      }),
      Animated.timing(barPosition, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      })
    ]).start();
    setSearchBarFocused(false);
    setSearchType('posts')
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            width: searchType === 'posts' ? inputLength : FULL_WIDTH,
            position: 'absolute',
            zIndex: 1,
            left: searchType === 'posts' ? barPosition : 0,
            top: searchType === 'posts' ? 0 : normalize(55),
          }, customStyle
        ]}
      >
        <Searchbar
          placeholder="Start your search..."
          onChangeText={value => {refine(value), setValue(value), valueHandler(value)}}
          value={currentRefinement}
          onIconPress={onFocus}
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
          style={{ marginTop: normalize(0), borderWidth: 1.5, borderColor: searchBarFocused ? Colors.contentOcean : Colors.neutralGray , elevation: 0 }}
          ref={searchbarRef}
          onFocus={onFocus}
          {...props}
          // onBlur={onBlur}
        />
      </Animated.View>
      { searchType === 'posts' ? 
        <AnimatedTouchable
          style={[styles.cancelSearch, { left: cancelPosition }]}
          onPress={() => {onBlur(), onBackPress()}}
        >
          <Animated.View style={{ opacity: opacity }}>
            <HeaderBackGray width={normalize(25)} height={normalize(25)} />
          </Animated.View>
        </AnimatedTouchable> 
          :
        <View style={styles.modalHeader}>
          <AnimatedTouchable
            style={[styles.cancelSearch, { left: cancelPosition }]}
            onPress={() => {setSearchType('posts')}}
          >
            <Animated.View style={{ opacity: opacity }}>
              <HeaderBackGray width={normalize(25)} height={normalize(25)} />
            </Animated.View>
          </AnimatedTouchable>
          <AppText textStyle="body3">Search User</AppText>
        </View>
      } 
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
    position: 'relative',
    zIndex: 5,
    // height: normalize(50),
    // backgroundColor: 'red'
  },
  cancelSearch: {
    position: "absolute",
    marginHorizontal: 16,
    justifyContent: "center",
    alignSelf: "center",
  },
  modalHeader: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 13,
    width: '100%',
    top: 0
  }
});
