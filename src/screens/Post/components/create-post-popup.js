import React, { useState, useEffect, useContext, useRef } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Text,
} from 'react-native'
import Modal from 'react-native-modal'
import { useNavigation } from '@react-navigation/native'

import { AppText } from '@/components'
import { Colors, normalize } from '@/globals'
import {
  PostBG,
  PostPlus,
  PostNeed,
  PostSell,
  PostService,
} from '@/assets/images/icons'
import { UserContext } from '@/context/UserContext'
import LinearGradient from 'react-native-linear-gradient'
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

const CreatePostPopup = ({}) => {
  const navigation = useNavigation()
  const { user } = useContext(UserContext)

  const [isOpen, setIsOpen] = useState(false)
  const rotateValue = useRef(new Animated.Value(0)).current

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '135deg'],
  })

  useEffect(() => {
    Animated.timing(rotateValue, {
      toValue: isOpen ? 1 : 0,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start()
  }, [isOpen])

  const handlePress = () => {
    if (!user) return navigation.navigate('posts')

    setIsOpen(!isOpen)
  }

  const handleButtonPress = type => {
    navigation.navigate('NBTScreen', {
      screen: 'posts',
      params: {
        screen: 'create-post',
        params: { type },
      },
    })
  }

  const iconAnimatedStyle = {
    transform: [{ rotate }],
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            transform: [{ translateY: normalize(-14) }],
            height: normalize(60),
            width: normalize(48),
          }}
          onPress={handlePress}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View>
                <PostBG width={normalize(40)} height={normalize(40)} />
              </View>
              <Animated.View style={[iconAnimatedStyle, styles.plusIcon]}>
                <PostPlus width={normalize(16)} height={normalize(16)} />
              </Animated.View>
            </View>
            <Text
              style={[
                styles.navLabel,
                {
                  paddingBottom: normalize(3.5),
                  transform: [{ translateY: -2 }],
                  color: isOpen
                    ? Colors.primaryMidnightBlue
                    : Colors.contentPlaceholder,
                },
              ]}>
              Post
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={isOpen}
        animationOutTiming={10}
        animationInTiming={10}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{
          margin: 0,
          backgroundColor: 'transparent',
          height: Dimensions.get('window').height,
        }}
        customBackdrop={
          <TouchableWithoutFeedback>
            <View style={{ flex: 1, backgroundColor: 'transparent' }} />
          </TouchableWithoutFeedback>
        }>
        <PopupButtons
          close={() => setIsOpen(false)}
          onButtonPress={handleButtonPress}
        />
      </Modal>
    </>
  )
}

const PopupButtons = ({ close, onButtonPress }) => {
  const viewOpacity = useRef(new Animated.Value(0)).current
  const serviceButton = useRef(new Animated.Value(130 + 70)).current
  const sellButton = useRef(new Animated.Value(65 + 70)).current
  const needButton = useRef(new Animated.Value(70)).current

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(viewOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(serviceButton, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(sellButton, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(needButton, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start()
    }, 150)
  }, [])

  let AnimationStyle = {
    opacity: viewOpacity,
  }

  let ServiceAnimationStyle = {
    transform: [{ translateY: serviceButton }],
  }

  let SellAnimationStyle = {
    transform: [{ translateY: sellButton }],
  }

  let NeedAnimationStyle = {
    transform: [{ translateY: needButton }],
  }

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(serviceButton, {
        toValue: 130 + 70,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(sellButton, {
        toValue: 65 + 70,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(needButton, {
        toValue: 70,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(viewOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start()
    close()
  }

  return (
    <TouchableWithoutFeedback onPress={closeModal}>
      <SafeAreaView style={{ flex: 1 }}>
        <AnimatedLinearGradient
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: normalize(60),
            backgroundColor: 'transparent',
            opacity: viewOpacity,
          }}
          colors={['rgba(255,255,255, 0)', 'rgba(255,255,255, .9)']}
          locations={[0.1, 1]}>
          <Animated.View
            style={[
              {
                alignItems: 'center',
                width: '100%',
                overflow: 'hidden',
              },
              AnimationStyle,
            ]}>
            <Animated.View style={ServiceAnimationStyle}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.button, styles.pink]}
                onPress={() => {
                  closeModal()
                  onButtonPress('service')
                }}>
                <View style={styles.iconHolder}>
                  <PostService width={normalize(25)} height={normalize(25)} />
                </View>
                <AppText textStyle="body2" customStyle={styles.btnText}>
                  Offer Your Services
                </AppText>
                <View style={styles.exampleHolder}>
                  <AppText textStyle="caption" customStyle={styles.exampleText}>
                    Plumbing
                  </AppText>
                  <AppText textStyle="caption" customStyle={styles.exampleText}>
                    Electrician
                  </AppText>
                </View>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={SellAnimationStyle}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.button, styles.blue]}
                onPress={() => {
                  closeModal()
                  onButtonPress('sell')
                }}>
                <View style={styles.iconHolder}>
                  <PostSell width={normalize(25)} height={normalize(25)} />
                </View>
                <AppText textStyle="body2" customStyle={styles.btnText}>
                  Sell your products
                </AppText>
                <View style={styles.exampleHolder}>
                  <AppText textStyle="caption" customStyle={styles.exampleText}>
                    Gadget
                  </AppText>
                  <AppText textStyle="caption" customStyle={styles.exampleText}>
                    Plants
                  </AppText>
                  <AppText textStyle="caption" customStyle={styles.exampleText}>
                    Cake
                  </AppText>
                  <AppText textStyle="caption" customStyle={styles.exampleText}>
                    Mobile Phone
                  </AppText>
                  <AppText textStyle="caption" customStyle={styles.exampleText}>
                    Books
                  </AppText>
                </View>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={NeedAnimationStyle}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.button, styles.green]}
                onPress={() => {
                  closeModal()
                  onButtonPress('need')
                }}>
                <View style={styles.iconHolder}>
                  <PostNeed width={normalize(25)} height={normalize(25)} />
                </View>
                <AppText textStyle="body2" customStyle={styles.btnText}>
                  {' '}
                  Find What You Need
                </AppText>
                <View style={styles.exampleHolder}>
                  <AppText textStyle="caption" customStyle={styles.exampleText}>
                    Looking for
                  </AppText>
                  <AppText textStyle="caption" customStyle={styles.exampleText}>
                    Available
                  </AppText>
                  <AppText textStyle="caption" customStyle={styles.exampleText}>
                    Photographer
                  </AppText>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </AnimatedLinearGradient>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 15,
    width: 340,
    borderRadius: 8,
    color: 'white',
    shadowColor: '#1f1a54',
    shadowOffset: { width: 2, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
    height: normalize(50),
  },
  navLabel: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(12),
    lineHeight: normalize(18),
    letterSpacing: normalize(0.4),
  },
  iconHolder: {
    marginRight: 12,
  },
  plusIcon: {
    position: 'absolute',
  },
  exampleHolder: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
  },
  pink: {
    backgroundColor: '#EA646C',
  },
  blue: {
    backgroundColor: '#3057BA',
  },
  green: {
    backgroundColor: '#00BB94',
  },
  btnText: {
    color: 'white',
  },
  exampleText: {
    color: 'white',
    paddingHorizontal: 5,
    opacity: 0.4,
  },
  boldText: {
    fontWeight: '700',
  },
})

export default CreatePostPopup
