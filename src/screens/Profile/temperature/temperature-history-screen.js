import { Images } from '@/assets/images'
import { Icons } from '@/assets/images/icons'
import Button from '@/components/Button'
import Toast from '@/components/toast'
import { UserContext } from '@/context/UserContext'
import { Colors } from '@/globals'
import typography from '@/globals/typography'
import utilStyles from '@/globals/util-styles'
import { iconSize, normalize } from '@/globals/Utils'
import Api from '@/services/Api'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  RefreshControl,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import {
  HighTemperatureNote,
  TemperatureListItem,
} from './update-temperature-screen'
import LottieView from 'lottie-react-native'
import assetLoader from '@/assets/animations/asset-loader.json'

/**
 * @typedef {object} TemperatureHistoryScreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {TemperatureHistoryScreenProps} TemperatureHistoryScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'TemperatureHistoryScreen'>} param0 */
const TemperatureHistoryScreen = ({ navigation }) => {
  const { user } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)
  const [highTemperatureNoteVisible, setHighTemperatureNoteVisible] = useState(
    false
  )
  const [data, setData] = useState([])
  const [filters] = useState({
    limit: 20,
    uid: user.uid,
  })
  const [lastId, setLastId] = useState()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hasMoreItems, setHasMoreItems] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)

  const handleOnRefresh = async () => {
    setLastId(null)
    setData([])
    setIsRefreshing(true)
    setHasMoreItems(true)
    setIsEmpty(false)
    await loadData({ data: [], filters: { ...filters } })
    setIsRefreshing(false)
  }

  const handleOnEndReached = useCallback(() => {
    if (!scrolled || isLoading || !hasMoreItems) return
    setScrolled(false)
    loadData({ data, filters: { ...filters, lastId } })
  }, [
    scrolled,
    setScrolled,
    lastId,
    filters,
    loadData,
    setScrolled,
    isLoading,
    scrolled,
    hasMoreItems,
  ])

  const renderItem = ({ item }) => {
    return <TemperatureListItem item={item} onNotePress={handleOnNotePress} />
  }

  const handleOnNotePress = () => {
    setHighTemperatureNoteVisible(true)
  }

  const loadData = useCallback(async ({ data, filters }) => {
    setIsLoading(true)
    try {
      if (!filters.lastId) delete filters.lastId
      const response = await Api.getTemperatureHistory(filters)
      if (!response.success) throw new Error(response.message)
      const newData = [...(response.data || [])]
        .reduce((list, item) => {
          const date = new Date(item.date._seconds * 1000)
          const year = date.getFullYear()
          const month = moment(date).format('MMMM')
          const title = moment(date).isSame(new Date(), 'month')
            ? 'This month'
            : `${month} ${year}`
          let group = list.find(group => group.title === title)
          if (!group) {
            group = {
              title,
              data: [],
            }
            list.push(group)
          }
          group.data.push(item)
          return list
        }, data || [])
        .sort((a, b) =>
          new Date(a.title).getTime() < new Date(b.title).getTime() ? -1 : 1
        )
      if (!response.data.length) setHasMoreItems(false)
      setIsEmpty(!response.data.length && !data?.length)
      setData(newData)
      setLastId(response.last_id)
    } catch (error) {
      console.log(error)
      Toast.show({
        type: 'error',
        dismissible: true,
        timeout: 5000,
        label: 'Uh-oh, An error occurred. Please try again',
        screenId: '',
      })
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadData({ filters })
  }, [loadData])

  return (
    <>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor="#fff"
      />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>
              Temperature History
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <SectionList
            contentContainerStyle={{ flexGrow: 1 }}
            sections={data}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            initialNumToRender={20}
            showsVerticalScrollIndicator={false}
            onEndReached={handleOnEndReached}
            onMomentumScrollBegin={() => setScrolled(true)}
            onEndReachedThreshold={0.1}
            renderSectionHeader={({ section: { title } }) => {
              return (
                <Text
                  style={[
                    typography.body2,
                    { color: Colors.contentPlaceholder },
                  ]}>
                  {title}
                </Text>
              )
            }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                titleColor={Colors.primaryMidnightBlue}
                tintColor={Colors.primaryYellow}
                onRefresh={handleOnRefresh}
              />
            }
            ListEmptyComponent={() => isEmpty && <EmptyState />}
            ListFooterComponent={() => isLoading && <ListLoader />}
          />
        </View>
      </View>
      <HighTemperatureNote
        isVisible={highTemperatureNoteVisible}
        setIsVisible={setHighTemperatureNoteVisible}
      />
    </>
  )
}

const ListLoader = () => {
  return (
    <View style={styles.listLoader}>
      <View style={styles.spinnerWrapper}>
        <LottieView source={assetLoader} autoPlay />
      </View>
    </View>
  )
}

const EmptyState = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.emptyStateWrapper}>
      <View
        style={[
          utilStyles.flex1,
          utilStyles.alignCenter,
          utilStyles.justifyCenter,
        ]}>
        <Images.NoReview {...iconSize(140)} />
        <Text style={[typography.subtitle1, { marginTop: normalize(16) }]}>
          Temperature Tracker
        </Text>
        <Text
          style={[
            typography.body2,
            typography.textCenter,
            { marginTop: normalize(8) },
          ]}>
          Safety first, always! Keep track of your temperature and body
          condition before hustling.{' '}
        </Text>
      </View>
      <Button
        label="Log Temperature"
        type="primary"
        onPress={navigation.goBack}
      />
    </View>
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
    justifyContent: 'space-between',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
  },
  content: {
    flex: 1,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(12),
  },
  emptyStateWrapper: {
    flex: 1,
    paddingHorizontal: normalize(4),
  },
  listLoader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerWrapper: {
    height: normalize(40),
    width: normalize(40),
    marginVertical: normalize(24),
  },
})

export default TemperatureHistoryScreen
