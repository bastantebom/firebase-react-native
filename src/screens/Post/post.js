import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';


import { AppText } from '@/components'
import { normalize, Colors } from '@/globals';
import { PostSell, PostService, PostNeed } from '@/assets/images/icons';

const Post = () => {
  const [pickingState, setPickingState] = useState(true)

  const [postPosition] = useState(new Animated.Value(0))
  const [postSize] = useState(new Animated.Value(normalize(114)))

  const [sellPosition] = useState(new Animated.Value(0))
  const [sellSize] = useState(new Animated.Value(normalize(114)))

  const [needPosition] = useState(new Animated.Value(0))
  const [needSize] = useState(new Animated.Value(normalize(114)))

  const [activeCard, setActiveCard] = useState('none')
  const [highlightedCard, setHighlightedCard] = useState('none')

  const [postDotOpacity] = useState(new Animated.Value(0));
  const [needDotOpacity] = useState(new Animated.Value(0));
  const [sellDotOpacity] = useState(new Animated.Value(0));

  const resetPicking = () => {
    setHighlightedCard(activeCard)
    setActiveCard('none')

    const showDot = () => {
      if (activeCard === 'post')
        return Animated.timing(postDotOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false
        })

      if (activeCard === 'need')
        return Animated.timing(needDotOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false
        })

      if (activeCard === 'sell')
        return Animated.timing(sellDotOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false
        })
    }

    Animated.sequence([
      Animated.parallel([
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
        Animated.timing(sellSize, {
          toValue: normalize(114),
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
        Animated.timing(needPosition, {
          toValue: normalize(0),
          duration: 500,
          useNativeDriver: false
        }),
      ]),
      showDot()
    ]).start()
  }

  const hideDots = () => {
    return Animated.parallel([
      Animated.timing(postDotOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false
      }),
      Animated.timing(needDotOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false
      }),
      Animated.timing(sellDotOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false
      })
    ])
  }

  const selectActive = (selectedCard) => {

    setPickingState(!pickingState)

    if (pickingState) {
      switch (selectedCard) {
        case 'post':
          setActiveCard('post')
          setHighlightedCard('none')

          Animated.sequence([
            hideDots(),
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
            ])
          ]).start()
          break;
        case 'need':
          setActiveCard('need')
          setHighlightedCard('none')
          Animated.sequence([
            hideDots(),
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
                toValue: normalize(-(114 + 114 + 9 + 9)),
                duration: 500,
                useNativeDriver: false
              }),

            ])
          ]).start()
          break;
        case 'sell':
          setActiveCard('sell')
          setHighlightedCard('none')
          Animated.sequence([
            hideDots(),
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
                toValue: normalize(-9 - 114),
                duration: 500,
                useNativeDriver: false
              }),
              Animated.timing(needPosition, {
                toValue: normalize(-74),
                duration: 500,
                useNativeDriver: false
              }),
            ])
          ]).start()
          break;
      }
    }
    else {
      resetPicking()
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

  let PostDotAnimationStyle = {
    opacity: postDotOpacity
  }

  let NeedDotAnimationStyle = {
    opacity: needDotOpacity
  }

  let SellDotAnimationStyle = {
    opacity: sellDotOpacity
  }



  return (
    <>
      <View style={[
        styles.postAnimationContainer,
        {
          // justifyContent: pickingState ? 'flex-start' : 'space-around',
          // position: pickingState ? 'relative' : 'absolute',
          paddingLeft: normalize(8),
        }
      ]}>
        <Animated.View style={[styles.postCard, PostAnimationStyle]}>
          <TouchableOpacity onPress={() => {
            selectActive('post')
            console.log(highlightedCard)
            if (activeCard !== 'none' && activeCard !== 'post') {
              resetPicking()
            }
          }}>
            <View style={{ height: '100%', paddingLeft: 16, paddingRight: 8, paddingVertical: 8, position: 'relative' }}>
              <PostNeed width={normalize(24)} height={normalize(24)} />
              <Animated.View style={{ flex: 1, justifyContent: "center" }}>
                <AppText textStyle="subtitle2" customStyle={{ textTransform: 'capitalize' }} color={Colors.neutralsWhite}>Find What You Need</AppText>
              </Animated.View>
            </View>
          </TouchableOpacity>

          <Animated.View style={[styles.needDot, { backgroundColor: Colors.secondaryMountainMeadow }, PostDotAnimationStyle]} />

        </Animated.View>

        <Animated.View style={[styles.sellCard, SellAnimationStyle]}>
          <TouchableOpacity onPress={() => {
            selectActive('sell')
            console.log(highlightedCard)
            if (activeCard !== 'none' && activeCard !== 'sell') {
              resetPicking()
            }
          }}>
            <View style={{ height: '100%', paddingLeft: 16, paddingRight: 8, paddingVertical: 8, position: 'relative' }}>
              <PostSell width={normalize(24)} height={normalize(24)} />
              <Animated.View style={{ flex: 1, justifyContent: "center" }}>
                <AppText textStyle="subtitle2" customStyle={{ textTransform: 'capitalize' }} color={Colors.neutralsWhite}>Start selling</AppText>
              </Animated.View>
            </View>
          </TouchableOpacity>
          <Animated.View style={[styles.needDot, { backgroundColor: Colors.secondaryRoyalBlue }, SellDotAnimationStyle]} />

        </Animated.View>

        <Animated.View style={[styles.needCard, NeedAnimationStyle]}>
          <TouchableOpacity onPress={() => {
            selectActive('need')
            console.log(highlightedCard)
            if (activeCard !== 'none' && activeCard !== 'need') {
              resetPicking()
            }
          }}>
            <View style={{ height: '100%', paddingLeft: 16, paddingRight: 8, paddingVertical: 8, position: 'relative' }}>
              <PostService width={normalize(24)} height={normalize(24)} />
              <Animated.View style={{ flex: 1, justifyContent: "center" }}>
                <AppText textStyle="subtitle2" customStyle={{ textTransform: 'capitalize' }} color={Colors.neutralsWhite}>offer your services</AppText>
              </Animated.View>
            </View>
          </TouchableOpacity>

          <Animated.View style={[styles.needDot, { backgroundColor: Colors.secondaryBrinkPink }, NeedDotAnimationStyle]} />

        </Animated.View>
      </View>
      <TouchableOpacity>
        <AppText>ASDASDA</AppText>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  postAnimationContainer: {
    backgroundColor: 'gray',
    flexDirection: 'row',
    position: 'relative',
    paddingBottom: 24
  },
  sellCard: {
    backgroundColor: Colors.secondaryRoyalBlue,
    height: normalize(80),
    borderRadius: 20,
    marginLeft: normalize(9)
  },
  postCard: {
    // ACTS AS NEED CARD
    backgroundColor: Colors.secondaryMountainMeadow,
    height: normalize(80),
    borderRadius: 20,
    // marginLeft: normalize(8)
  },
  needCard: {
    backgroundColor: Colors.secondaryBrinkPink,
    height: normalize(80),
    borderRadius: 20,
    marginLeft: normalize(9)
  },
  needDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    alignSelf: 'center'
  }
});

export default Post;
