import React, { useState } from 'react'
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import Modal from 'react-native-modal'
import { Icons } from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'
import MoreIdTypes from './modals/more-id-types'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import typography from '@/globals/typography'
import { iconSize } from '@/globals/Utils'
/**
 * @typedef {Object} IdTypeProps
 * @property {string} type
 * @property {(type: string) => void} onSelect
 */

/**
 * @typedef {Object} RootProps
 * @property {IdTypeProps} IdType
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'IdType'>} param0 */
const IdTypeScreen = ({ navigation, route }) => {
  const { onSelect } = route.params
  const [moreOptionsModalVisible, setMoreOptionsModalVisible] = useState(false)

  const idTypes = [
    "Driver's license",
    'NBI Clearance',
    'Social Security System ID',
    'Unified Multipurpose ID or UMID',
    'Passport',
    "Voter's ID",
    'Postal ID',
    'BIR ID',
    'Firearm License',
    'Marina ID',
    'OFW ID',
    'Professional Regulation Commission (PRC License)',
    'Pag-ibig ID',
    'Person With Disability ID',
    'Philhealth ID',
    'Police Clearance',
    "Seaman's Book",
    'Senior Citizen ID',
    'Solo Parent ID',
  ]

  const renderItem = item => {
    return (
      <TouchableOpacity
        key={item}
        style={styles.listItem}
        onPress={() => {
          onSelect(item)
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={typography.body1}>{item}</Text>
        </View>
        <Icons.ChevronRight
          color={Colors.checkboxBorderDefault}
          width={normalize(24)}
          height={normalize(24)}
        />
      </TouchableOpacity>
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
        <View style={styles.container}>
          <Text style={[typography.body1, typography.medium, styles.title]}>
            Select your preferred ID for upload:
          </Text>
          <View style={{ flex: 1 }}>
            <ScrollView>
              {idTypes.slice(0, 7).map(renderItem)}
              <TouchableOpacity
                style={styles.moreOptionsWrapper}
                onPress={() => setMoreOptionsModalVisible(true)}>
                <Icons.More {...iconSize(24)} />
                <Text
                  style={[
                    typography.body2,
                    typography.medium,
                    styles.moreOptionsText,
                  ]}>
                  More Options
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
        <View style={styles.infoWrapper}>
          <Icons.Lock width={normalize(24)} height={normalize(24)} />
          <Text style={[typography.caption, styles.infoText]}>
            This information won’t be shared with other people who use Servbees.
          </Text>
        </View>
        <Modal
          isVisible={moreOptionsModalVisible}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={300}
          animationOutTiming={250}
          onSwipeComplete={() => setMoreOptionsModalVisible(false)}
          swipeDirection="down"
          style={styles.modal}
          customBackdrop={
            <TouchableWithoutFeedback
              onPress={() => setMoreOptionsModalVisible(false)}>
              <View style={{ flex: 1, backgroundColor: 'black' }} />
            </TouchableWithoutFeedback>
          }>
          <MoreIdTypes
            onSelect={item => {
              setMoreOptionsModalVisible(false)
              setTimeout(() => {
                onSelect(item)
              }, 250)
            }}
            items={idTypes.slice(7)}
          />
        </Modal>
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
  container: {
    flex: 1,
  },
  title: {
    marginBottom: normalize(24),
    paddingHorizontal: normalize(24),
  },
  moreOptionsWrapper: {
    flexDirection: 'row',
    marginTop: normalize(16),
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(20),
  },
  moreOptionsText: {
    color: Colors.contentOcean,
    marginLeft: normalize(11),
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(24),
  },
  infoWrapper: {
    flexDirection: 'row',
    padding: normalize(24),
  },
  infoText: {
    fontSize: normalize(12),
    lineHeight: normalize(18),
    marginLeft: 12,
    maxWidth: '90%',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
    height: Dimensions.get('window').height,
    marginTop: 144,
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
})

export default IdTypeScreen
