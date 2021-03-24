import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'

import { normalize, Colors } from '@/globals'
import { NoReview, NoPost, NoInfo } from '@/assets/images'

import { AppText } from '@/components'
import ActivitiesCard from '@/screens/Activity/components/ActivitiesCard'

const Ongoing = ({
  sort,
  activities,
  isLoading,
  isRereshing,
  setIsRereshing,
  loadMoreActivities,
  noMoreActivities,
  data,
}) => {
  const renderEmptyIcon = () => {
    switch (sort.value) {
      case 'all':
        return <NoPost />
      case 'my offers':
      case 'my orders':
      case 'past':
        return <NoReview />
      default:
        return <NoInfo />
    }
  }

  const renderEmptyHeadingText = () => {
    switch (sort.value) {
      case 'all':
        return 'No activities yet'
      case 'my offers':
        return 'No offers yet'
      case 'my orders':
        return 'No orders yet'
      case 'past':
        return 'No past orders yet'
      default:
        return ''
    }
  }

  const renderEmptyBodyText = () => {
    switch (sort.value) {
      case 'all':
        return 'Start checking what you can offer and discover the best deals in your area.'
      case 'my offers':
      case 'my orders':
        return 'Keep on posting about your products to attract orders, Buzzybee!'
      default:
        return 'Getting projects starts by making offers, Buzzybee!'
    }
  }

  const renderFooterContent = () => {
    if (activities.length >= 10 && !noMoreActivities) {
      return <ActivityIndicator style={styles.activeIndicator} />
    }
  }

  return (
    <View style={styles.activityWrapper}>
      <FlatList
        keyExtractor={item => item.post.id}
        data={activities}
        renderItem={({ item }) => <ActivitiesCard item={item} />}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (data.length >= 10) loadMoreActivities()
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRereshing}
            titleColor="#2E3034"
            tintColor="#2E3034"
            title="Refreshing"
            onRefresh={() => setIsRereshing(true)}
          />
        }
        ListFooterComponent={renderFooterContent()}
      />

      {!activities.length && !isLoading && (
        <View style={styles.emptyState}>
          {renderEmptyIcon()}

          <AppText textStyle="display6" customStyle={styles.emptyHeaderText}>
            {renderEmptyHeadingText()}
          </AppText>

          <AppText textStyle="body2" customStyle={styles.emptyBodyText}>
            {renderEmptyBodyText()}
          </AppText>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  activityWrapper: {
    paddingTop: normalize(15),
    paddingBottom: normalize(35),
    paddingHorizontal: normalize(15),
  },
  emptyState: {
    alignItems: 'center',
    padding: normalize(16),
    backgroundColor: Colors.neutralsWhite,
  },
  emptyHeaderText: {
    marginBottom: normalize(4),
    marginTop: normalize(15),
  },
  emptyBodyText: {
    textAlign: 'center',
  },
  activeIndicator: {
    paddingTop: normalize(10),
    paddingBottom: normalize(50),
  },
  noMorePost: {
    paddingVertical: normalize(20),
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    textAlign: 'center',
    color: '#A8AAB7',
  },
})

export default Ongoing
