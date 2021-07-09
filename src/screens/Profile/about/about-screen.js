import { Icons } from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import React from 'react'
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { getStatusBarHeight } from 'react-native-status-bar-height'

/**
 * @typedef {object} AboutScreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {AboutScreenProps} AboutScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'AboutScreen'>} param0 */
const AboutScreen = ({ navigation }) => {
  const renderItem = item => {
    return (
      <TouchableOpacity
        onPress={item.onPress}
        activeOpacity={0.7}
        key={item.label}
        style={styles.aboutItem}>
        <Text style={[typography.body1narrow, typography.medium]}>
          {item.label}
        </Text>
        <Icons.ChevronRight style={{ color: Colors.icon }} {...iconSize(24)} />
      </TouchableOpacity>
    )
  }

  const aboutItems = [
    {
      label: 'Servbees',
      onPress: () => {
        navigation.navigate('NBTScreen', {
          screen: 'profile',
          params: {
            screen: 'about',
            params: {
              screen: 'webview',
              params: {
                url: 'https://servbees.com/about/',
                title: 'Servbees',
              },
            },
          },
        })
      },
    },
    {
      label: 'Privacy Policy',
      onPress: () => {
        const toInject = `
        document.querySelector('.show-card-mobile').style.display = 'none';
        document.querySelector('.cards-mobile').style.display = 'none';
        document.querySelector('.header').style.display = 'none';
        document.querySelector('.sub-title-holder').style.display = 'none';
        document.querySelector('.banner-wrapper').style.display = 'none';
        document.querySelector('.vector-dash').style.paddingTop = '0';
        document.querySelector('.section-cta').style.display = 'none';
        document.querySelector('.footer').style.display = 'none';
        true;
        `

        navigation.navigate('NBTScreen', {
          screen: 'profile',
          params: {
            screen: 'about',
            params: {
              screen: 'webview',
              params: {
                url: 'https://servbees.com/privacy/',
                title: 'Servbees',
                injectedJavaScript: toInject,
              },
            },
          },
        })
      },
    },
    {
      label: 'Terms of Use',
      onPress: () => {
        const toInject = `
        document.querySelector('.card').style.display = 'none';
        document.querySelector('.header').style.display = 'none';
        document.querySelector('.banner-wrapper').style.display = 'none';
        document.querySelector('.bg-design').style.paddingTop = '0';
        document.querySelector('.sub-title-holder').style.display = 'none';
        document.querySelector('.section-cta').style.display = 'none';
        document.querySelector('.footer').style.display = 'none';
        true;
        `
        navigation.navigate('NBTScreen', {
          screen: 'profile',
          params: {
            screen: 'about',
            params: {
              screen: 'webview',
              params: {
                url: 'https://servbees.com/terms/',
                title: 'Servbees',
                injectedJavaScript: toInject,
              },
            },
          },
        })
      },
    },
  ]

  return (
    <>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor="#fff"
      />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>About</Text>
          </View>
        </View>
        <ScrollView style={styles.content}>
          {aboutItems.map(renderItem)}
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
  header: {
    flexDirection: 'row',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
  },
  content: {
    flex: 1,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(12),
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalize(12),
    alignItems: 'center',
  },
})

export default AboutScreen
