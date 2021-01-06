import React, { useState } from 'react'
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native'
import Modal from 'react-native-modal'
import { useNavigation } from '@react-navigation/native'
import { AppText, TabNavigation } from '@/components'
import { Colors, normalize } from '@/globals'

import Ongoing from './components/Ongoing'
import Notifications from './components/Notifications'
import { ChevronDown, Icons } from '@/assets/images/icons'
import ActivitySort from './components/ActivitySort'
import FilterSlider from './components/Search/Filters'
import SearchBarWithFilter from './components/Search/SearchWithFilter'
import SearchResults from './components/Search/SearchResults'

const Activity = () => {
  const [activitySort, setActivitySort] = useState(false)
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [activities, setActivities] = useState('all')
  const [searchBarFocused, setSearchBarFocused] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            paddingBottom: normalize(20),
            paddingHorizontal: normalize(16),
            display: searchBarFocused ? 'none' : 'flex',
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => setActivitySort(true)}>
            <AppText
              textStyle="body3"
              customStyle={{ marginRight: normalize(8) }}>
              All Activities
            </AppText>
            <ChevronDown width={normalize(20)} height={normalize(20)} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('NBTScreen', {
                    screen: 'ChatHouse',
                  })
                }>
                <Icons.ChatGray width={normalize(20)} height={normalize(20)} />
              </TouchableOpacity>
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: Colors.secondaryBrinkPink,
                  top: normalize(-7),
                  right: normalize(-8),
                  paddingHorizontal: normalize(6),
                  borderRadius: 16,
                }}>
                <AppText textStyle="eyebrow" color={Colors.neutralsWhite}>
                  2
                </AppText>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={{ marginLeft: normalize(25) }}
                onPress={() =>
                  navigation.navigate('NBTScreen', {
                    screen: 'Notifications',
                  })
                }>
                <Icons.MegaPhone width={normalize(20)} height={normalize(20)} />
              </TouchableOpacity>
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: Colors.secondaryBrinkPink,
                  top: normalize(-7),
                  right: normalize(-8),
                  paddingHorizontal: normalize(6),
                  borderRadius: 16,
                }}>
                <AppText textStyle="eyebrow" color={Colors.neutralsWhite}>
                  4
                </AppText>
              </View>
            </View>
          </View>
        </View>
        <View>
          <SearchBarWithFilter
            onFiltersPress={() => setIsFiltersVisible(true)}
            onValueChange={setSearchValue}
            value={searchValue}
            onFocus={() => setSearchBarFocused(true)}
            onBackPress={() => {
              setSearchBarFocused(false)
            }}
          />
        </View>
        {searchBarFocused && (
          <SearchResults
            containerStyle={{
              position: 'absolute',
              top: normalize(75),
            }}
            searchValue={searchValue}
          />
        )}
        <View>
          <Ongoing />
        </View>
      </>
      <Modal
        isVisible={activitySort}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setActivitySort(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <ActivitySort />
      </Modal>
      <Modal
        isVisible={isFiltersVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        animationInTiming={300}
        animationOutTiming={250}
        onSwipeComplete={() => setIsFiltersVisible(false)}
        swipeDirection="right"
        style={{
          justifyContent: 'flex-end',
          margin: 0,
          marginLeft: normalize(32),
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setIsFiltersVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }
        onDrag>
        <FilterSlider close={() => setIsFiltersVisible(false)} />
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    paddingTop: normalize(25),
    paddingBottom: normalize(50),
    backgroundColor: 'white',
  },
})

export default Activity
