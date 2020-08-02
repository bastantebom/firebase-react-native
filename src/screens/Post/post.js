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

  const [cardTextOpacity] = useState(new Animated.Value(1));

  const [postText, setPostText] = useState('Find What You Need');
  const [sellText, setSellText] = useState('Start Selling');
  const [needText, setNeedText] = useState('Offer Your Services');


  const resetPicking = () => {
    setHighlightedCard(activeCard)
    setActiveCard('none')

    setTimeout(() => {
      setPostText('Find What You Need')
      setSellText('Start Selling')
      setNeedText('Offer Your Services')
    }, 200)


    const showDot = () => {
      if (activeCard === 'post')
        return Animated.parallel([
          transitionFinish(),
          Animated.timing(postDotOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false
          })
        ])
      if (activeCard === 'need')
        return Animated.parallel([
          transitionFinish(),
          Animated.timing(needDotOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false
          })
        ])
      if (activeCard === 'sell')
        return Animated.parallel([
          transitionFinish(),
          Animated.timing(sellDotOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false
          })
        ])
    }

    Animated.sequence([
      transitionActive(),
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
      transitionActive(),
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

  const transitionActive = () => {
    return Animated.timing(cardTextOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false
    })
  }

  const transitionFinish = () => {
    return Animated.timing(cardTextOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false
    })
  }

  const selectActive = (selectedCard) => {
    setPickingState(!pickingState)

    if (pickingState) {
      switch (selectedCard) {
        case 'post':
          setActiveCard('post')
          setHighlightedCard('none')
          setTimeout(() => {
            setPostText('What are you looking for today?')
          }, 200)

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
            ]),
            transitionFinish(),
          ]).start()
          break;
        case 'need':
          setActiveCard('need')
          setHighlightedCard('none')
          setTimeout(() => {
            setNeedText('What services do you want to list today?')
          }, 200)
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
            ]),
            transitionFinish(),
          ]).start()
          break;
        case 'sell':
          setActiveCard('sell')
          setHighlightedCard('none')
          setTimeout(() => {
            setSellText('What are you listing today?')
          }, 200)
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
            ]),
            transitionFinish(),
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

  let PostTextOpacity = {
    opacity: cardTextOpacity
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
          <TouchableOpacity activeOpacity={.7} onPress={() => {
            selectActive('post')
            console.log(highlightedCard)
            if (activeCard !== 'none' && activeCard !== 'post') {
              resetPicking()
            }
          }}>
            <Animated.View style={[{ height: '100%', paddingLeft: 16, paddingRight: 8, paddingVertical: 8, position: 'relative' }, PostTextOpacity]}>
              <PostNeed width={normalize(24)} height={normalize(24)} />
              <Animated.View style={{ flex: 1, justifyContent: "center" }}>
                <AppText textStyle="subtitle2" color={Colors.neutralsWhite}>{postText}</AppText>
              </Animated.View>
            </Animated.View>
          </TouchableOpacity>

          <Animated.View style={[styles.needDot, { backgroundColor: Colors.secondaryMountainMeadow }, PostDotAnimationStyle]} />

        </Animated.View>

        <Animated.View style={[styles.sellCard, SellAnimationStyle]}>
          <TouchableOpacity activeOpacity={.7} onPress={() => {
            selectActive('sell')
            console.log(highlightedCard)
            if (activeCard !== 'none' && activeCard !== 'sell') {
              resetPicking()
            }
          }}>
            <Animated.View style={[{ height: '100%', paddingLeft: 16, paddingRight: 8, paddingVertical: 8, position: 'relative' }, PostTextOpacity]}>
              <PostSell width={normalize(24)} height={normalize(24)} />
              <Animated.View style={{ flex: 1, justifyContent: "center" }}>
                <AppText textStyle="subtitle2" color={Colors.neutralsWhite}>{sellText}</AppText>
              </Animated.View>
            </Animated.View>
          </TouchableOpacity>
          <Animated.View style={[styles.needDot, { backgroundColor: Colors.secondaryRoyalBlue }, SellDotAnimationStyle]} />

        </Animated.View>

        <Animated.View style={[styles.needCard, NeedAnimationStyle]}>
          <TouchableOpacity activeOpacity={.7} onPress={() => {
            selectActive('need')
            console.log(highlightedCard)
            if (activeCard !== 'none' && activeCard !== 'need') {
              resetPicking()
            }
          }}>
            <Animated.View style={[{ height: '100%', paddingLeft: 16, paddingRight: 8, paddingVertical: 8, position: 'relative' }, PostTextOpacity]}>
              <PostService width={normalize(24)} height={normalize(24)} />
              <Animated.View style={{ flex: 1, justifyContent: "center" }}>
                <AppText textStyle="subtitle2" color={Colors.neutralsWhite}>{needText}</AppText>
              </Animated.View>
            </Animated.View>
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
