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


  const selectActive = (selectedCard) => {
    console.log("make me big")
    setPickingState(!pickingState)

    if (pickingState) {

      switch (selectedCard) {
        case 'post':
          Animated.parallel([
            Animated.timing(postSize, {
              toValue: normalize(250),
              duration: 500,
              useNativeDriver: false
            }),
            // Animated.timing(sellPosition, {
            //   toValue: normalize(78),
            //   duration: 500,
            //   useNativeDriver: false
            // }),
            // Animated.timing(needPosition, {
            //   toValue: normalize(78),
            //   duration: 500,
            //   useNativeDriver: false
            // }),

          ]).start()
          break;
        case 'need':
          Animated.parallel([
            Animated.timing(needSize, {
              toValue: normalize(250),
              duration: 500,
              useNativeDriver: false
            }),
          ]).start()
          break;
        case 'sell':
          Animated.parallel([
            Animated.timing(sellSize, {
              toValue: normalize(250),
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
          ]).start()
          break;

        case 'need':
          Animated.parallel([
            Animated.timing(needSize, {
              toValue: normalize(114),
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
          ]).start()
          break;
      }
    }


  }

  let PostAnimationStyle = {
    transform: [{ translateX: postPosition }],
    width: postSize
  }

  let SellAnimationStyle = {
    transform: [{ translateX: sellPosition }],
    width: sellSize
  }

  let NeedAnimationStyle = {
    transform: [{ translateX: needPosition }],
    width: needSize
  }

  return (
    <View style={styles.postAnimationContainer} >
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
    position: 'relative'
  },
  sellCard: {
    backgroundColor: 'blue',
    height: normalize(100),
    borderRadius: 20
  },
  postCard: {
    backgroundColor: 'pink',
    height: normalize(100),
    borderRadius: 20
  },
  needCard: {
    backgroundColor: 'green',
    height: normalize(100),
    borderRadius: 20
  }
});

export default Post;
