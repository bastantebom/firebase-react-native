import React, { useRef, createRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { normalize } from '@/globals';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Post = () => {
  const [pickingState, setPickingState] = useState(true)

  const [postPosition] = useState(new Animated.Value(0))
  const [postSize] = useState(new Animated.Value(normalize(114)))

  const [sellPosition] = useState(new Animated.Value(0))
  const [sellSize] = useState(new Animated.Value(normalize(114)))

  const [needPosition] = useState(new Animated.Value(0))
  const [needSize] = useState(new Animated.Value(normalize(114)))

  const [containerPadding] = useState(new Animated.Value(0))


  const selectActive = (selectedCard) => {
    console.log("make me big")
    setPickingState(!pickingState)

    if (pickingState) {
      switch (selectedCard) {
        case 'post':
          Animated.parallel([
            Animated.timing(postSize, {
              toValue: normalize(271),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(needSize, {
              toValue: normalize(114),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(needPosition, {
              toValue: normalize(-74),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(sellSize, {
              toValue: normalize(114),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(sellPosition, {
              toValue: normalize(15),
              duration: 500,
              useNativeDriver: false
            }),
          ]).start()
          break;
        case 'need':
          Animated.parallel([
            Animated.timing(needSize, {
              toValue: normalize(271),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(postSize, {
              toValue: normalize(114),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(sellSize, {
              toValue: normalize(114),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(postPosition, {
              toValue: normalize(114 + 114 + 74 - 8),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(sellPosition, {
              toValue: normalize(114 + 74 + 9 + 9),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(needPosition, {
              toValue: normalize(-(114+ 114+ 9 + 9)),
              duration: 500,
              useNativeDriver: false
            }),
            
          ]).start()
          break;
        case 'sell':
          Animated.parallel([
            Animated.timing(sellSize, {
              toValue: normalize(271),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(needSize, {
              toValue: normalize(114),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(postSize, {
              toValue: normalize(114),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(postPosition, {
              toValue: normalize(114 + 114 + 74 - 8),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(sellPosition, {
              toValue: normalize(-9 -114),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(needPosition, {
              toValue: normalize(-74),
              duration: 500,
              useNativeDriver: false
            }),
          ]).start()
          break;
      }

    }

    else {

      switch (selectedCard) {
        case 'post':
          Animated.parallel([
            Animated.timing(postSize, {
              toValue: normalize(114),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(needPosition, {
              toValue: normalize(0),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(postPosition, {
              toValue: normalize(0),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(sellPosition, {
              toValue: normalize(0),
              duration: 500,
              useNativeDriver: false
            }),
          ]).start()
          break;

        case 'need':
          Animated.parallel([
            Animated.timing(needSize, {
              toValue: normalize(114),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(needPosition, {
              toValue: normalize(0),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(postPosition, {
              toValue: normalize(0),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(sellPosition, {
              toValue: normalize(0),
              duration: 500,
              useNativeDriver: false
            }),
          ]).start()
          break;

        case 'sell':
          Animated.parallel([
            Animated.timing(sellSize, {
              toValue: normalize(114),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(needPosition, {
              toValue: normalize(0),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(postPosition, {
              toValue: normalize(0),
              duration: 500,
              useNativeDriver: false
            }),
            Animated.timing(sellPosition, {
              toValue: normalize(0),
              duration: 500,
              useNativeDriver: false
            }),
          ]).start()
          break;
      }
    }


  }

  let PostAnimationStyle = {
    transform: [{ translateX: postPosition }],
    width: postSize,
  }

  let SellAnimationStyle = {
    transform: [{ translateX: sellPosition }],
    width: sellSize,
  }

  let NeedAnimationStyle = {
    transform: [{ translateX: needPosition }],
    width: needSize,
  }



  return (
    <View style={[
      styles.postAnimationContainer,
      {
        // justifyContent: pickingState ? 'flex-start' : 'space-around',
        // position: pickingState ? 'relative' : 'absolute',
        paddingLeft: normalize(8),
      }
    ]}>
      <Animated.View style={[styles.postCard, PostAnimationStyle]}>
        <TouchableOpacity onPress={() => selectActive('post')}>
          <View style={{ height: '100%' }}>
            <Text> Post card </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.sellCard, SellAnimationStyle]}>
        <TouchableOpacity onPress={() => selectActive('sell')}>
          <View style={{ height: '100%' }}>
            <Text> Sell card </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.needCard, NeedAnimationStyle]}>
        <TouchableOpacity onPress={() => selectActive('need')}>
          <View style={{ height: '100%' }}>
            <Text> Need card </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View >
  );
};

const styles = StyleSheet.create({
  postAnimationContainer: {
    backgroundColor: 'gray',
    flexDirection: 'row',
    position: 'relative',
    height: normalize(88)
  },
  sellCard: {
    backgroundColor: 'blue',
    height: normalize(70),
    borderRadius: 20,
    marginLeft: normalize(9)
  },
  postCard: {
    backgroundColor: 'pink',
    height: normalize(70),
    borderRadius: 20,
    // marginLeft: normalize(8)
  },
  needCard: {
    backgroundColor: 'green',
    height: normalize(70),
    borderRadius: 20,
    marginLeft: normalize(9)
  }
});

export default Post;
