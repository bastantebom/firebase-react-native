import { Icons } from '@/assets/images/icons'
import {
  AppText,
  BottomSheetHeader,
  PaddingView,
  ScreenHeaderTitle,
} from '@/components'
import { Colors, normalize } from '@/globals'
import React, { useState } from 'react'
import {
  FlatList,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
} from 'react-native'
import Modal from 'react-native-modal'

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

  const [moreOptions, setMoreOptions] = useState(false)

  const toggleMoreOptions = () => setMoreOptions(!moreOptions)

  const idTypes = [
    {
      label: "Driver's license",
    },
    {
      label: 'NBI Clearance',
    },
    {
      label: 'Social Security System ID',
    },
    {
      label: 'Unified Multipurpose ID or UMID',
    },
    {
      label: 'Passport',
    },
    {
      label: "Voter's ID",
    },
    {
      label: 'Postal ID',
    },
  ]

  const moreIdTypes = [
    {
      label: 'BIR ID',
    },
    {
      label: 'Firearm License',
    },
    {
      label: 'Marina ID',
    },
    {
      label: 'OFW ID',
    },
    {
      label: 'Professional Regulation Commission (PRC License)',
    },
    {
      label: 'Pag-ibig ID',
    },
    {
      label: 'Person With Disability ID',
    },
    {
      label: 'Philhealth ID',
    },
    {
      label: 'Police Clearance',
    },
    {
      label: 'Seaman’s Book',
    },
    {
      label: 'Senior Citizen ID',
    },
    {
      label: 'Solo Parent ID',
    },
  ]

  const idTypeItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => {
          setMoreOptions(false)
          onSelect(item.label)
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
          <AppText textStyle="body1" customStyle={{ maxWidth: '90%' }}>
            {item.label}
          </AppText>
          <Icons.ChevronRightGray
            width={normalize(18)}
            height={normalize(18)}
          />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          justifyContent: 'space-between',
          height: '100%',
        }}>
        <View>
          <ScreenHeaderTitle
            iconSize={16}
            close={navigation.goBack}
            paddingSize={3}
          />
          <View style={{ paddingHorizontal: normalize(24) }}>
            <AppText textStyle="body1medium" customStyle={{ marginBottom: 25 }}>
              Select your preferred ID for upload:
            </AppText>
            <FlatList
              data={idTypes}
              renderItem={idTypeItem}
              keyExtractor={item => item.label}
            />
            <TouchableOpacity onPress={toggleMoreOptions}>
              <View style={{ flexDirection: 'row' }}>
                <Icons.RoundEllipsisBlue />
                <AppText
                  textStyle="body2medium"
                  color={Colors.contentOcean}
                  customStyle={{ marginLeft: 8 }}>
                  More Options
                </AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: normalize(24),
            paddingBottom: normalize(24),
            flexDirection: 'row',
          }}>
          <Icons.Lock width={normalize(24)} height={normalize(24)} />
          <AppText
            textStyle="caption"
            customStyle={{
              fontSize: normalize(12),
              lineHeight: normalize(18),
              marginLeft: 12,
              maxWidth: '90%',
            }}>
            This information won’t be shared with other people who use Servbees.
          </AppText>
        </View>
      </View>

      <Modal
        isVisible={moreOptions}
        animationIn="slideInUp"
        animationInTiming={500}
        animationOut="slideOutDown"
        animationOutTiming={500}
        onSwipeComplete={toggleMoreOptions}
        swipeDirection="down"
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={toggleMoreOptions}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <View
          style={{
            backgroundColor: 'white',
            paddingBottom: 24,
            borderTopEndRadius: 8,
            borderTopStartRadius: 8,
            maxHeight: '85%',
          }}>
          <BottomSheetHeader />
          <PaddingView
            paddingSize={2}
            style={{
              paddingBottom: Platform.OS === 'android' ? normalize(55) : 0,
            }}>
            <AppText
              textStyle="display6"
              customStyle={{
                paddingTop: normalize(8),
                paddingBottom: normalize(24),
              }}>
              More Options
            </AppText>
            <FlatList
              data={moreIdTypes}
              renderItem={idTypeItem}
              keyExtractor={item => item.label}
              showsVerticalScrollIndicator={false}
            />
          </PaddingView>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = {
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(28),
  },
}

export default IdTypeScreen
