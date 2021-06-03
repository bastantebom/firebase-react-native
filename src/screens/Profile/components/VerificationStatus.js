import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { normalize, Colors } from '@/globals'
import { Verified, Icons } from '@/assets/images/icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'

const VerificationStatus = ({ statusPercentage }) => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <View style={styles.verificationBox}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('NBTScreen', {
              screen: 'Verification',
            })
          }
          style={styles.rowContainer}>
          <View>
            <Verified {...iconSize(24)} />
          </View>
          <View style={styles.copyContainer}>
            <Text
              style={[typography.body2, typography.medium, styles.verifyTitle]}>
              Get bee-rified!
            </Text>
            <Text style={typography.caption}>
              Safeguard your account and credibility within the community.
            </Text>
          </View>
          <View>
            <Icons.ChevronRight style={styles.iconStyle} {...iconSize(16)} />
          </View>
        </TouchableOpacity>

        <ProgressBar
          progress={statusPercentage}
          color={Colors.contentOcean}
          style={styles.progressBar}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(24),
    backgroundColor: Colors.neutralsWhite,
  },
  rowContainer: { flexDirection: 'row' },
  verificationBox: {
    padding: normalize(16),
    borderColor: Colors.neutralsZircon,
    borderWidth: 1,
    borderRadius: 4,
  },
  verifyTitle: {
    paddingBottom: normalize(4),
    color: Colors.primaryMidnightBlue,
  },
  copyContainer: {
    width: '87%',
    paddingHorizontal: normalize(8),
  },
  iconStyle: {
    color: Colors.primaryMidnightBlue,
    marginRight: normalize(8),
  },
  progressBar: {
    backgroundColor: Colors.secondarySolitude,
    height: normalize(8),
    borderRadius: 50,
    marginTop: normalize(8),
  },
})

export default VerificationStatus
