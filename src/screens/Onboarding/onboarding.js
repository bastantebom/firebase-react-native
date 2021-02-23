import React, { useState, useContext, useEffect } from 'react'
import {
  View,
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
import { AppText, AppButton, BottomSheetHeader } from '@/components'
import Colors from '@/globals/Colors'
import Login from '@/screens/Authentication/Login/login'
import SignUp from '@/screens/Authentication/SignUp/SignUp'
import PolygonStatic from '@/assets/images/polygon-static.svg'
import IllustOne from '@/assets/images/onboarding-img1.svg'
import IllustTwo from '@/assets/images/onboarding-img2.svg'
import IllustThree from '@/assets/images/onboarding-img3.svg'
import IllustFour from '@/assets/images/onboarding-img4.svg'
import { getVersion, getBuildNumber } from 'react-native-device-info'
import { Context } from '@/context'
import { normalize } from '@/globals'

const height = normalize(Dimensions.get('window').height)
const width = normalize(Dimensions.get('window').width)

const Onboarding = ({ navigation }) => {
  const {
    authType,
    setAuthType,
    authenticationSheet,
    showAuthenticationSheet,
  } = useContext(Context)

  const [version, setVersion] = useState('1.0.3')

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
      illustration: <IllustOne width={width} height={height * 0.4} />,
      title: 'Welcome to Servbees!',
      description:
        'Go and Raket, Benta, and Search with your friendly neighborhood Pagkakakita-App!',
    },
    {
      illustration: <IllustTwo width={width} height={height * 0.4} />,
      title: 'Discover and Buy',
      description:
        'Looking for something in particular? Discover nearby options and get the best deals for goods and services.',
    },
    {
      illustration: <IllustThree width={width} height={height * 0.4} />,
      title: 'Offer and Sell',
      description:
        'Ready to be a Buzzybee? Offer your services and products to those near you. Find customers easily!',
    },
    {
      illustration: <IllustFour width={width} height={height * 0.4} />,
      title: 'Join a Hive',
      description:
        'Join our Hives to connect with people with the same interests and needs. Create your own Hives to organize your offers!',
    },
  ])

  const getVersionAndBuildNumber = () => {
    const buildNumber = getBuildNumber()
    const versionNumber = getVersion()
    const versionBuild = `${versionNumber} (${buildNumber})`
    setVersion(versionBuild)
  }

  useEffect(() => {
    getVersionAndBuildNumber()
  }, [])

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
            text="Log in"
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
            text="Sign up"
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
        <View style={styles.appVersion}>
          <AppText
            textStyle="captionConstant"
            color={Colors.primaryCornflowerBlue}>
            {`v${version} Beta`}
          </AppText>
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
    position: 'relative',
    height: height * 0.7,
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
    width: normalize(5),
    height: normalize(5),
    marginLeft: normalize(5.5),
    marginRight: normalize(5.5),
    top: height > 680 ? normalize(-40) : normalize(-10),
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 100,
  },
  dotActive: {
    backgroundColor: Colors.primaryMidnightBlue,
  },
  bgImageHolder: {
    position: 'absolute',
    width: width * 0.9,
    top: height > 680 ? normalize(-110) : normalize(-38),
  },
  text: {
    textAlign: 'center',
    lineHeight: 23.76,
  },
  btnHolder: {
    height: height * 0.15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: normalize(30),
    backgroundColor: 'transparent',
  },
  appVersion: {
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(height * 0.05),
    width: '100%',
  },
})

export default Onboarding
