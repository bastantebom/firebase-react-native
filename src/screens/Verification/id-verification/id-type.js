import React, { useState } from 'react'
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import Modal from 'react-native-modal'
import { Icons } from '@/assets/images/icons'
import { AppText, ScreenHeaderTitle } from '@/components'
import { Colors, normalize } from '@/globals'
import MoreIdTypes from './modals/more-id-types'

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

  const [moreOptions, setMoreOptions] = useState(false)

  const toggleMoreOptions = () => setMoreOptions(!moreOptions)

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
          <AppText textStyle="body1">{item}</AppText>
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
      <View style={styles.container}>
        <View style={styles.header}>
          <ScreenHeaderTitle iconSize={16} close={navigation.goBack} />
        </View>

        <View>
          <AppText textStyle="body1medium" customStyle={styles.title}>
            Select your preferred ID for upload:
          </AppText>
          <ScrollView>{idTypes.slice(0, 7).map(renderItem)}</ScrollView>
        </View>

        <TouchableOpacity
          style={styles.moreOptionsWrapper}
          onPress={() => setMoreOptionsModalVisible(true)}>
          <Icons.More width={normalize(24)} height={normalize(24)} />
          <AppText textStyle="body2medium" customStyle={styles.moreOptionsText}>
            More Options
          </AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.infoWrapper}>
        <Icons.Lock width={normalize(24)} height={normalize(24)} />
        <AppText textStyle="caption" customStyle={styles.infoText}>
          This information won’t be shared with other people who use Servbees.
        </AppText>
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
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: normalize(24), paddingBottom: normalize(80) },
  header: {
    marginBottom: normalize(24),
  },
  title: {
    marginBottom: normalize(24),
  },
  moreOptionsWrapper: {
    flexDirection: 'row',
    marginTop: normalize(16),
    paddingVertical: normalize(5),
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
    paddingLeft: normalize(3),
    paddingRight: 0,
  },
  infoWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
})

export default IdTypeScreen
