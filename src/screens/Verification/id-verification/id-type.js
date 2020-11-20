import { Icons } from '@/assets/images/icons'
import { AppText, ScreenHeaderTitle } from '@/components'
import { normalize } from '@/globals'
import React from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'

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

  const idTypes = [
    {
      label: "Driver's license",
    },
    {
      label: 'Passport',
    },
    {
      label: 'NBI Clearance',
    },
    {
      label: "Voter's ID",
    },
    {
      label: "Student's ID",
    },
  ]

  const idTypeItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => {
          onSelect(item.label)
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Icons.FolderAdd
            style={{ marginRight: normalize(8) }}
            width={normalize(24)}
            height={normalize(24)}
          />
          <AppText textStyle="body1">{item.label}</AppText>
        </View>
        <Icons.ChevronRight width={normalize(24)} height={normalize(24)} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ justifyContent: 'space-between', height: '100%' }}>
      <View>
        <View style={{ padding: normalize(24) }}>
          <ScreenHeaderTitle iconSize={16} close={navigation.goBack} />
        </View>
        <View style={{ padding: normalize(24) }}>
          <AppText textStyle="body1medium" customStyle={{ marginBottom: 25 }}>
            Select your preferred ID for upload:
          </AppText>
          <FlatList
            data={idTypes}
            renderItem={idTypeItem}
            keyExtractor={item => item.label}
          />
        </View>
        <View
          style={{
            paddingHorizontal: normalize(24),
            flexDirection: 'row',
            marginTop: 30,
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
    </View>
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
