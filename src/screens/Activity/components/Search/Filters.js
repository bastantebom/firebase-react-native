import React, { useState } from 'react'
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native'

import { AppText, AppViewContainer, AppRadio, AppCheckbox } from '@/components'
import { normalize, Colors } from '@/globals'

import {
  FilterServices,
  FilterSeller,
  FilterNeeds,
  Icons,
} from '@/assets/images/icons'

/**
 * @param {object} param0
 * @param {() => void} param0.close
 * @param {() => void} param0.onApply
 */
const FilterSlider = ({ close, onApply, filters: _filters }) => {
  const [filters, setFilters] = useState(
    _filters || {
      sort: 'recent',
      type: [],
    }
  )

  const postTypes = [
    {
      label: 'All',
      value: 'service, sell, need',
      icon: null,
    },
    {
      label: 'Service',
      value: 'service',
      icon: <FilterServices />,
    },
    {
      label: 'Sell',
      value: 'sell',
      icon: <FilterSeller />,
    },
    {
      label: 'Needs',
      value: 'need',
      icon: <FilterNeeds />,
    },
  ]

  const resetFilters = () => {
    setFilters({
      sort: 'recent',
      type: [],
    })
  }

  const applyFilters = () => {
    onApply?.(filters)
    close()
  }

  return (
    <View
      style={{
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
      }}>
      <ScrollView style={{ paddingTop: 24 }}>
        <AppViewContainer marginSize={3}>
          <View style={{ flexDirection: 'row', marginBottom: normalize(16) }}>
            <View style={{ flex: 1 }}>
              <AppText textStyle="subtitle1">Filter</AppText>
              <AppText textStyle="caption" color={Colors.contentPlaceholder}>
                Select all that applies
              </AppText>
            </View>

            <TouchableOpacity
              onPress={() => close()}
              style={{ justifyContent: 'flex-start' }}>
              <Icons.Close
                style={{ color: '#2E3034' }}
                width={normalize(24)}
                height={normalize(24)}
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 32 }}>
            <AppText
              textStyle="subtitle2"
              customStyle={{ marginBottom: normalize(16) }}>
              Filter by
            </AppText>
            {postTypes.map(postType => (
              <AppCheckbox
                key={postType.value}
                style={{
                  marginBottom: normalize(16),
                  backgroundColor: filters.type.includes(postType.value)
                    ? '#F2F4F6'
                    : '#FBFBFB',
                }}
                Icon={() => postType.icon}
                label={postType.label}
                value={filters.type.includes(postType.value)}
                valueChangeHandler={value => {
                  const currentPostTypes = filters.type
                  if (value) currentPostTypes.push(postType.value)
                  else
                    currentPostTypes.splice(
                      filters.type.indexOf(postType.value),
                      1
                    )
                  setFilters(filters => ({
                    ...filters,
                    type: [...new Set(currentPostTypes)],
                  }))
                }}
              />
            ))}
          </View>
        </AppViewContainer>
      </ScrollView>
      <View style={styles.filterActions}>
        <TouchableOpacity onPress={resetFilters}>
          <View style={styles.buttonWhite}>
            <AppText textStyle="button2">Reset</AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={applyFilters}>
          <View style={styles.buttonYellow}>
            <AppText textStyle="button2">Apply</AppText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonWhite: {
    paddingHorizontal: 40,
    paddingVertical: 8,
    borderColor: Colors.contentEbony,
    borderWidth: 1.5,
    borderRadius: 4,
  },
  buttonYellow: {
    paddingHorizontal: 40,
    paddingVertical: 8,
    borderColor: Colors.primaryYellow,
    backgroundColor: Colors.primaryYellow,
    borderWidth: 1.5,
    borderRadius: 4,
  },
  filterActions: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutralsZircon,
    padding: normalize(24),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    width: '100%',
  },
})

export default FilterSlider
