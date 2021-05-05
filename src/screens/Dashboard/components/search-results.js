import { ChevronRight, Icons, UserCircle } from '@/assets/images/icons'
import { AppText } from '@/components'
import Avatar from '@/components/Avatar/avatar'
import PostImage from '@/components/Post/post-image'
import { Colors, normalize } from '@/globals'
import React from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const SearchResults = ({
  data,
  renderItem,
  containerStyle,
  isLoading,
  noResults,
  onResultPress,
  setSearchType,
  searchType,
  searchValue,
  setSearchValue,
}) => {
  const renderUserImage = item => {
    return (
      <View style={styles.resultImage}>
        <Avatar
          style={{ width: '100%', height: '100%' }}
          path={item.profile_photo}
          size="64x64"
        />
      </View>
    )
  }

  const renderPostImage = item => {
    const size = { width: normalize(24), height: normalize(24) }

    return (
      <View style={styles.resultImage}>
        <PostImage
          resizeMode="stretch"
          style={styles.resultImage}
          path={item.cover_photos?.[0]}
          size="32x32"
          postType={item.type?.toLowerCase()}
          {...size}
        />
      </View>
    )
  }

  const renderNoResults = () => {
    return (
      <View>
        <AppText textStyle="subtitle1">
          Your search “{searchValue}” did not match any {searchType}.{' '}
        </AppText>
        <AppText textStyle="subtitle1">Try another search?</AppText>
        <View style={{ marginVertical: normalize(16) }}>
          <AppText textStyle="caption">
            - Check if the spelling is correct
          </AppText>
          <AppText textStyle="caption">- Use different keywords</AppText>
        </View>
      </View>
    )
  }

  const renderItemImage = item => {
    return searchType === 'post' ? renderPostImage(item) : renderUserImage(item)
  }

  const renderSearchResult =
    renderItem ||
    (({ item }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.searchResultItem}
          onPress={() => onResultPress(item)}>
          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
            <Icons.Search height={normalize(16)} width={normalize(16)} />
            <Text style={styles.searchResultItemTitle}>
              {searchType === 'post'
                ? item.title
                : item.display_name || item.full_name || item.username}
            </Text>
          </View>
          {renderItemImage(item)}
        </TouchableOpacity>
      )
    })

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        { paddingBottom: normalize(searchType === 'user' ? 120 : 80) },
      ]}>
      {!noResults &&
        !searchValue.length &&
        !data.length &&
        searchType === 'post' && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setSearchType('user')
              setSearchValue(searchValue)
            }}>
            <View style={styles.searchUserInstead}>
              <View style={{ flexDirection: 'row' }}>
                <UserCircle width={normalize(25)} height={normalize(25)} />
                <AppText textStyle="body2" customStyle={{ marginLeft: 11 }}>
                  Search a user
                </AppText>
              </View>
              <ChevronRight
                style={{ color: Colors.checkboxBorderDefault }}
                width={normalize(25)}
                height={normalize(25)}
              />
            </View>
          </TouchableOpacity>
        )}

      {isLoading && (
        <ActivityIndicator
          color={Colors.primaryYellow}
          height={normalize(24)}
          width={normalize(24)}
          animating={true}
        />
      )}

      {noResults && searchValue.length ? (
        renderNoResults()
      ) : (
        <FlatList
          scrollEventThrottle={16}
          data={data}
          keyExtractor={item => (searchType === 'post' ? item.id : item.uid)}
          renderItem={renderSearchResult}
          initialNumToRender={15}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: normalize(16),
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    zIndex: 2000,
  },
  searchUserInstead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.neutralGray,
    paddingTop: 8,
    paddingBottom: 15,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: normalize(10),
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutralGray,
  },
  searchResultItemTitle: {
    fontSize: normalize(14),
    fontFamily: 'RoundedMplus1c-Medium',
    letterSpacing: 0.25,
    lineHeight: normalize(21),
    marginLeft: normalize(10),
  },
  resultImage: {
    borderRadius: normalize(4),
    height: normalize(24),
    width: normalize(24),
  },
})

export default SearchResults
