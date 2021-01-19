import React, {
  useRef,
  createRef,
  useState,
  useEffect,
  useContext,
} from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'
import Swiper from 'react-native-swiper'
import Modal from 'react-native-modal'
import BottomSheet from 'reanimated-bottom-sheet'

import {
  AppText,
  AppButton,
  AppViewContainer,
  BottomSheetHeader,
} from '@/components'

import Colors from '@/globals/Colors'
import Login from '@/screens/Authentication/Login/login'
import SignUp from '@/screens/Authentication/SignUp/SignUp'

import PolygonStatic from '@/assets/images/polygon-static.svg'
import IllustOne from '@/assets/images/onboarding-img1.svg'
import IllustTwo from '@/assets/images/onboarding-img2.svg'
import IllustThree from '@/assets/images/onboarding-img3.svg'
import IllustFour from '@/assets/images/onboarding-img4.svg'

import { Context } from '@/context'
import { normalize } from '@/globals'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

const Onboarding = ({ navigation, illustration }) => {
  const {
    sliderState,
    closeSlider,
    authType,
    setAuthType,
    authenticationSheet,
    showAuthenticationSheet,
  } = useContext(Context)

  const RenderContent = () => {
    if (authType === 'signup') {
      return <SignUp />
    }
    if (authType === 'login') {
      return <Login />
    }
  }

  const animation = new Animated.Value(0)

  const rotation = animation.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ['15deg', '60deg', '74.35deg', '97.93deg'],
  })

  const onSwipe = index => {
    Animated.timing(animation, {
      toValue: index,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start()
  }

  const [slideInfo] = useState([
    {
      illustration: <IllustOne width={width} height={width * 0.8} />,
      title: 'Welcome to Servbees!',
      description:
        'Go and Raket, Benta, and Search with your friendly neighborhood Pagkakakita-App!',
    },
    {
      illustration: <IllustTwo width={width} height={width * 0.8} />,
      title: 'Discover and Buy',
      description:
        'Looking for something in particular? Discover nearby options and get the best deals for goods and services.',
    },
    {
      illustration: <IllustThree width={width} height={width * 0.8} />,
      title: 'Offer and Sell',
      description:
        'Ready to be a Buzzybee? Offer your services and products to those near you. Find customers easily!',
    },
    {
      illustration: <IllustFour width={width} height={width * 0.8} />,
      title: 'Join a Hive',
      description:
        'Join our Hives to connect with people with the same interests and needs. Create your own Hives to organize your offers!',
    },
  ])

  return (
    <>
      <View style={styles.contentHolder}>
        <Animated.View style={styles.bgImageHolder}>
          <PolygonStatic width={width} height={height} />
        </Animated.View>
        <TouchableOpacity
          onPress={() => navigation.push('TabStack')}
          style={styles.link}>
          <AppText textStyle="body2">Skip</AppText>
        </TouchableOpacity>
        <View style={styles.swiperHolder}>
          <Swiper
            dot={<View style={styles.dot} />}
            activeDot={<View style={[styles.dot, styles.dotActive]} />}
            loop
            autoplay
            autoplayTimeout={4.0}
            onIndexChanged={onSwipe}>
            {slideInfo.map((item, i) => {
              return (
                <View key={i} style={styles.slideHolder}>
                  <View style={{ zIndex: 100, width: '100%' }}>
                    {item.illustration}
                  </View>
                  <AppText
                    textStyle="display5"
                    color={Colors.primaryMidnightBlue}>
                    {item.title}
                  </AppText>
                  <View style={styles.textHolder}>
                    <AppText textStyle="body2" customStyle={styles.text}>
                      {item.description}
                    </AppText>
                  </View>
                </View>
              )
            })}
          </Swiper>
        </View>
        <View style={styles.btnHolder}>
          <AppButton
            text="Login"
            type="tertiary"
            size="sm"
            height="xl"
            borderColor="primary"
            onPress={() => {
              setAuthType('login')
              showAuthenticationSheet(true)
            }}
          />
          <AppButton
            text="Sign Up"
            size="sm"
            height="xl"
            borderColor="primary"
            propsButtonCustomStyle=""
            onPress={() => {
              setAuthType('signup')
              showAuthenticationSheet(true)
            }}
          />
        </View>
      </View>

      <Modal
        isVisible={authenticationSheet}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback
            onPress={() => showAuthenticationSheet(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <View
          style={{
            backgroundColor: 'white',
            height: '82%',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}>
          <BottomSheetHeader />
          <RenderContent />
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  contentHolder: {
    position: 'relative',
    flex: 1,
    backgroundColor: Colors.primaryMidnightBlue,
  },
  swiperHolder: {
    flex: 1,
  },
  slideHolder: {
    alignItems: 'center',
    textAlign: 'center',
    overflow: 'hidden',
  },
  link: {
    alignSelf: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 44 : 16,
    paddingHorizontal: 30,
  },
  textHolder: {
    position: 'relative',
    zIndex: 5,
    padding: 15,
  },
  dot: {
    margin: 0,
    zIndex: 5,
    width: 5,
    height: 5,
    marginLeft: normalize(5.5),
    marginRight: normalize(5.5),
    bottom: height > 700 ? height * 0.3 : height * 0.18,
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 100,
  },
  dotActive: {
    backgroundColor: Colors.primaryMidnightBlue,
  },
  bgImageHolder: {
    position: 'absolute',
    top: -50,
    width: width,
  },
  text: {
    textAlign: 'center',
    lineHeight: 23.76,
  },
  btnHolder: {
    position: 'absolute',
    top: height * 0.85,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
  },
})

export default Onboarding
