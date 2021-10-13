import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native'
import { Guide } from '@/assets/images'
import { Colors, normalize } from '@/globals'
import { Icons } from '@/assets/images/icons'
import Svg, { Circle } from 'react-native-svg'
import Button from '@/components/Button'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import StatusBar from '@/components/StatusBar'

/**
 * @typedef {object} CoverPhotoGuidelinesScreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {CoverPhotoGuidelinesScreenProps} CoverPhotoGuidelinesScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'CoverPhotoGuidelinesScreen'>} param0 */
const CoverPhotoGuidelinesScreen = ({ navigation }) => {
  const Bullet = () => {
    return (
      <Svg
        style={styles.bullet}
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none">
        <Circle cx="4" cy="4" r="4" fill={Colors.primaryMidnightBlue} />
      </Svg>
    )
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{ paddingHorizontal: normalize(24) }}>
            <View style={styles.titleWrapper}>
              <Guide />
              <Text style={styles.title}>Cover Photo Guidelines</Text>
            </View>

            <View>
              <Text style={typography.body2}>
                Upload your best shots to grab the attention of other Buzzybees.
                And take note: your first photo is your cover photo, make it
                clear and catchy.
              </Text>
              <Text style={[typography.body2, { marginTop: normalize(24) }]}>
                Here are some quick tips to make your photos buzz-worthy:
              </Text>
              <Text
                style={[typography.body2, typography.medium, styles.heading]}>
                Upload Relevant Images
              </Text>
              <Text style={typography.body2}>
                It is recommended that you fill up all ten photo slots. Make
                sure each photo highlights your product, brand, and story. Skip
                the photo if it's covered with text, or not connected with what
                you're selling.
              </Text>
              <Text
                style={[typography.body2, typography.medium, styles.heading]}>
                Photographic Style
              </Text>
              <View style={styles.listItem}>
                <Bullet />
                <Text style={typography.body2}>
                  Show the details. So no to blurred or pixelated shots!
                </Text>
              </View>
              <View style={styles.listItem}>
                <Bullet />
                <Text style={typography.body2}>
                  Keep it lit! Good lighting changes the photo quality by 100%.
                </Text>
              </View>
              <View style={styles.listItem}>
                <Bullet />
                <Text style={typography.body2}>
                  Focus on the product. It must cover more than half of the
                  image.
                </Text>
              </View>
              <View style={styles.listItem}>
                <Bullet />
                <Text style={typography.body2}>
                  Compose each photo properly. Cropping and zooming might not
                  work well for product shots.
                </Text>
              </View>

              <Text
                style={[typography.body2, typography.medium, styles.heading]}>
                Photo Dimensions
              </Text>
              <View style={styles.listItem}>
                <Bullet />
                <Text style={typography.body2}>
                  Minimum Dimension: 500x500 pixel
                </Text>
              </View>
              <View style={[styles.listItem, { marginBottom: 0 }]}>
                <Bullet />
                <Text style={typography.body2}>Minimum Resolution: 72dpi</Text>
              </View>
            </View>

            <Button
              style={{ marginVertical: normalize(24) }}
              label="Okay, got it!"
              type="primary"
              onPress={navigation.goBack}
            />
          </View>
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
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
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
  titleWrapper: { alignItems: 'center' },
  title: {
    ...typography.body1,
    ...typography.medium,
    marginVertical: normalize(16),
  },

  heading: {
    marginTop: normalize(16),
    color: Colors.primaryMidnightBlue,
    marginBottom: normalize(8),
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: normalize(8),
  },
  bullet: {
    margin: normalize(8),
    marginLeft: 0,
  },
})

export default CoverPhotoGuidelinesScreen
