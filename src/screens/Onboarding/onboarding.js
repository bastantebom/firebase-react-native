import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Swiper from 'react-native-swiper'
import Modal from 'react-native-modal'
import NetInfo from '@react-native-community/netinfo'
import {
  AppText,
  AppButton,
  BottomSheetHeader,
  Notification,
} from '@/components'
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
import { Icons } from '@/assets/images/icons'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

const Onboarding = ({ navigation }) => {
  const {
    authType,
    setAuthType,
    authenticationSheet,
    showAuthenticationSheet,
  } = useContext(Context)

  const [version, setVersion] = useState('1.0.3')
  const [notificationMessage, setNotificationMessage] = useState(null)

  const RenderContent = () => {
    if (authType === 'signup') {
      return <SignUp setNotificationMessage={setNotificationMessage} />
    }
    if (authType === 'login') {
      return <Login setNotificationMessage={setNotificationMessage} />
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
        'Find and offer items and services within your community. Go and raket, benta, search!',
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
        'Create your own Hives to organize your offers or connect with people with the same interests and needs.',
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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isInternetReachable === false)
        navigation.navigate('NBTScreen', {
          screen: 'unavailable-network',
        })
    })
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <>
      <View
        style={{
          flex: 1,
          position: 'absolute',
          zIndex: 10,
          width: width,
          paddingTop: normalize(40),
        }}>
        {notificationMessage && (
          <Notification
            type="danger"
            icon={<Icons.Warning />}
            onClose={() => setNotificationMessage(null)}
            animationOptions={{ height: normalize(85) }}>
            <AppText
              textStyle="body2"
              customStyle={{ marginLeft: 14 }}
              color={Colors.neutralsWhite}>
              {notificationMessage}
            </AppText>
          </Notification>
        )}
      </View>
      <View style={styles.contentHolder}>
        <View style={styles.bgImageHolder}>
          <PolygonStatic width={width} height={height} />
        </View>
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
            customStyle={{ height: normalize(50) }}
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
            customStyle={{ height: normalize(50) }}
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
        animationInTiming={200}
        animationOut="slideOutDown"
        animationOutTiming={180}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => {
              showAuthenticationSheet(false)
              setNotificationMessage(null)
            }}>
            <View style={{ flex: 1 }} />
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
    height: '100%',
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
    bottom: normalize(0),
    backgroundColor: Colors.neutralsWhite,
    borderRadius: 100,
  },
  dotActive: {
    backgroundColor: Colors.primaryMidnightBlue,
  },
  bgImageHolder: {
    position: 'absolute',
    bottom: normalize(30),
  },
  text: {
    textAlign: 'center',
    lineHeight: 23.76,
  },
  btnHolder: {
    height: height * 0.15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: normalize(30),
    paddingTop: normalize(height * 0.05),
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
