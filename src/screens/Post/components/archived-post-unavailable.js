import React from 'react'
import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Linking,
} from 'react-native'
import { Images } from '@/assets/images'
import { Colors, normalize } from '@/globals'
import { Icons } from '@/assets/images/icons'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { useNavigation } from '@react-navigation/native'
import { iconSize } from '@/globals/Utils'
import typography from '@/globals/typography'

const UnavailablePostScreen = () => {
  const navigation = useNavigation()
  const handleOnBackPress = () => {
    if (navigation.canGoBack()) navigation.goBack()
  }
  const handleOnExplorePress = () => {
    navigation.navigate('TabStack', {
      screen: 'Servbees',
    })
  }
  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor={Colors.neutralsWhite}
      />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={handleOnBackPress}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
        </View>
        <View style={{ padding: normalize(24) }}>
          <Images.NotAvailableArchive />
          <Text style={[typography.display5, styles.textStyle]}>
            Oh no, this post is not{'\n'} available anymore
          </Text>
          <Text style={[typography.body2, styles.subcopy]}>
            This link may be broken or the post may be removed.
          </Text>
          <TouchableOpacity onPress={handleOnExplorePress}>
            <Text style={[typography.body2, styles.explore]}>
              Explore other posts
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerCopy}>
          <Text style={[typography.body2, styles.footerText]}>
            Need help? Contact{' '}
          </Text>
          <TouchableOpacity
            onPress={async () =>
              await Linking.openURL(
                'mailto:support@servbees.com?subject=Support Needed'
              )
            }>
            <Text style={[typography.body2, styles.footerEmail]}>
              support@servbees.com
            </Text>
          </TouchableOpacity>
        </View>
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
  textStyle: {
    textAlign: 'center',
    marginTop: normalize(10),
    marginBottom: normalize(8),
    paddingHorizontal: normalize(15),
    color: Colors.primaryMidnightBlue,
  },
  contentWrapper: {
    flexGrow: 1,
    alignItems: 'center',
    padding: normalize(16),
    textAlign: 'center',
    backgroundColor: 'white',
  },
  footerCopy: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: normalize(27),
    paddingVertical: normalize(56),
    flexDirection: 'row',
  },
  footerText: {
    flexWrap: 'wrap',
  },
  subcopy: {
    textAlign: 'center',
    paddingHorizontal: normalize(10),
  },
  explore: {
    textAlign: 'center',
    marginTop: normalize(24),
    color: Colors.contentOcean,
  },
  footerEmail: {
    color: Colors.contentOcean,
  },
})

export default UnavailablePostScreen
