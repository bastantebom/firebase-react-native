import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { AppText, ScreenHeaderTitle } from '@/components'
import { Guide } from '@/assets/images'
import { Colors } from '@/globals'

const CoverPhotoGuidelines = ({ close }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ paddingTop: 16 }}>
        <ScreenHeaderTitle title={''} close={close} paddingSize={2} />
        <View style={{ paddingHorizontal: 24 }}>
          <View style={{ alignItems: 'center' }}>
            <Guide />
            <AppText customStyle={{ marginTop: 4 }} textStyle="body2medium">
              Cover Photo Guidelines
            </AppText>
          </View>

          <View>
            <AppText textStyle="body2" customStyle={{ marginTop: 8 }}>
              Upload your best shots to grab the attention of other Buzzybees.
              And take note: your first photo is your cover photo, make it clear
              and catchy.
            </AppText>
            <AppText textStyle="body2" customStyle={{ marginTop: 24 }}>
              Here are some quick tips to make your photos buzz-worthy:{' '}
            </AppText>
            <AppText textStyle="body2medium" customStyle={{ marginTop: 24 }}>
              Upload Relevant Images
            </AppText>
            <AppText textStyle="body2" customStyle={{ marginTop: 8 }}>
              Maximize all 10 slots, but make sure each one highlights your
              product, brand, and story. Skip the photo if it's covered with
              texts, or not connected with what you're selling.{' '}
            </AppText>
            <AppText textStyle="body2medium" customStyle={{ marginTop: 24 }}>
              Photographic Style
            </AppText>

            <View style={styles.dotContainer}>
              <View style={styles.dotStyle} />
              <AppText textStyle="body2" customStyle={{ paddingLeft: 8 }}>
                Show the details. So no to blurred or pixelated shots!
              </AppText>
            </View>
            <View style={styles.dotContainer}>
              <View style={styles.dotStyle} />
              <AppText textStyle="body2" customStyle={{ paddingLeft: 8 }}>
                Keep it lit! Good lighting changes the photo quality by 100%.
              </AppText>
            </View>
            <View style={styles.dotContainer}>
              <View style={styles.dotStyle} />
              <AppText textStyle="body2" customStyle={{ paddingLeft: 8 }}>
                Focus on the product. It must cover more than half of the image.
              </AppText>
            </View>
            <View style={styles.dotContainer}>
              <View style={styles.dotStyle} />
              <AppText textStyle="body2" customStyle={{ paddingLeft: 8 }}>
                Compose each photo properly. Cropping and zooming might not work
                well for product shots.
              </AppText>
            </View>
            <AppText textStyle="body2medium" customStyle={{ marginTop: 24 }}>
              Photo Dimensions
            </AppText>
            <View style={styles.dotContainer}>
              <View style={styles.dotStyle} />
              <AppText textStyle="body2" customStyle={{ paddingLeft: 8 }}>
                Minimum Dimension: 500x500 pixel
              </AppText>
            </View>
            <View style={styles.dotContainer}>
              <View style={styles.dotStyle} />
              <AppText textStyle="body2" customStyle={{ paddingLeft: 8 }}>
                Minimum Resolution: 72dpi
              </AppText>
            </View>

            <TouchableOpacity
              onPress={close}
              style={{
                backgroundColor: Colors.primaryYellow,
                paddingVertical: 8,
                alignItems: 'center',
                borderRadius: 4,
                marginVertical: 24,
              }}>
              <AppText textStyle="body2medium">Okay, got it!</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  dotStyle: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryMidnightBlue,
    marginTop: 8,
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
})

export default CoverPhotoGuidelines
