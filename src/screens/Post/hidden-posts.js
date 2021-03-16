import { Icons } from '@/assets/images/icons'
import { Colors } from '@/globals'
import typography from '@/globals/typography'
import { iconSize, normalize } from '@/globals/Utils'
import React from 'react'
import {
  Platform,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native'

/**
 * @typedef {Object} HiddenPostsScreenProps
 */

/**
 * @typedef {Object} RootProps
 * @property {HiddenPostsScreenProps} HiddenPostsScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'HiddenPostsScreen'>} param0 */
const HiddenPostsScreen = ({ navigation, route }) => {
  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>
              Hidden Posts
            </Text>
          </View>
        </View>
        <View style={styles.content}></View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  wrapper: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: Platform.select({
      ios: 0,
      android: StatusBar.currentHeight - 2,
    }),
  },
  titleWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: normalize(16),
    position: 'absolute',
    width: '100%',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

export default HiddenPostsScreen
