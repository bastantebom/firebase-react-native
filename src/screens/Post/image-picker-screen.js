import { Colors, normalize } from '@/globals'
import { iconSize } from '@/globals/Utils'
import typography from '@/globals/typography'
import CameraRoll from '@react-native-community/cameraroll'
import React, {
  PureComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native'
import { Icons } from '@/assets/images/icons'
import LinearGradient from 'react-native-linear-gradient'
import pluralize from 'pluralize'
import Svg, { Path } from 'react-native-svg'
import { getStatusBarHeight } from 'react-native-status-bar-height'

const { width, height } = Dimensions.get('window')

const SelectedMarker = React.memo(
  ({ index, showIndex }) => {
    return !~index ? null : (
      <View style={styles.selectedMarker}>
        {showIndex ? (
          <Text style={[typography.subtitle2, styles.selectedMarkerLabel]}>
            {index + 1}
          </Text>
        ) : (
          <Svg height={normalize(8.5)} width={normalize(12)}>
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.1042 0.180774C12.3358 0.417838 12.3313 0.79771 12.0942 1.02924L4.59423 8.35424C4.47675 8.46898 4.31738 8.53056 4.15327 8.52461C3.98916 8.51866 3.83466 8.4457 3.72579 8.32275L0.150795 4.28525C-0.0688789 4.03716 -0.0458405 3.65796 0.202253 3.43829C0.450346 3.21861 0.829545 3.24165 1.04922 3.48975L4.20653 7.05552L11.2558 0.170758C11.4928 -0.0607746 11.8727 -0.0562904 12.1042 0.180774Z"
              fill="white"
            />
          </Svg>
        )}
      </View>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.index === nextProps.index &&
      prevProps.showIndex === nextProps.showIndex
    )
  }
)

const ImageItem = React.memo(
  ({ item, multiple, selectedIndex, onPress }) => {
    return (
      <TouchableOpacity
        style={[styles.thumbnailWrapper]}
        activeOpacity={0.7}
        onPress={() => onPress(item)}>
        <SelectedMarker index={selectedIndex} showIndex={multiple} />
        <Image
          style={styles.thumbnail}
          height="100%"
          width="100%"
          resizeMethod="resize"
          source={{ uri: item.node.image.uri, priority: 'normal' }}
        />
      </TouchableOpacity>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.selectedIndex === nextProps.selectedIndex &&
      prevProps.item === nextProps.item &&
      prevProps.multiple === nextProps.multiple
    )
  }
)

class AlbumItem extends PureComponent {
  render() {
    const { onPress, item } = this.props

    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(item)}>
        <Image
          style={styles.albumThumbnail}
          width={width / 2 - normalize(24)}
          height={width / 2 - normalize(24)}
          resizeMethod="resize"
          source={{ uri: item.thumbnail, priority: 'normal' }}
        />
        <Text style={[typography.body2, typography.medium]}>{item.title}</Text>
        <Text
          style={[typography.caption, { color: Colors.contentPlaceholder }]}>
          {item.count}
        </Text>
      </TouchableOpacity>
    )
  }
}

/**
 * @typedef {object} ImagePickerScreenProps
 * @property {boolean} multiple
 * @property {number} maximum
 * @property {function} onSubmit
 * @property {string[]} images
 */

/**
 * @typedef {object} RootProps
 * @property {ImagePickerScreenProps} ImagePickerScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'ImagePickerScreen'>} param0 */
const ImagePickerScreen = ({ navigation, route }) => {
  const { multiple, maximum, images, onSubmit } = route.params

  const [items, setItems] = useState([])
  const [activeItem, setActiveItem] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [endCursor, setEndCursor] = useState(undefined)
  const [hasMoreImages, setHasMoreImages] = useState(false)

  const [albums, setAlbums] = useState([])
  const [selectedAlbum, setSelectedAlbum] = useState('All Photos')
  const [albumsVisible, setAlbumsVisible] = useState(false)

  const [selectedItems, setSelectedItems] = useState(images || [])
  const selectedItemsRef = useRef(selectedItems).current

  const albumsPosition = useRef(new Animated.Value(height * 0.75)).current
  const albumsOpacity = useRef(new Animated.Value(0)).current

  const handleOnNextPress = () => {
    onSubmit(selectedItems)
  }

  const handleOnEndReached = () => {
    if (!hasMoreImages) return
    fetchImages({
      initialLoad: false,
      after: endCursor,
    })
  }

  const handleOnAlbumPress = album => {
    if (selectedAlbum !== album.title) setSelectedAlbum(album.title)
    setAlbumsVisible(false)
  }

  const handleOnPress = useCallback(
    item => {
      const newItems = [...selectedItemsRef.current]
      const uri = item.node.image.uri
      const index = newItems.indexOf(uri)

      if (!!~index) newItems.splice(index, 1)
      else if (multiple) newItems.push(uri)
      else newItems.splice(0, 1, uri)

      if (maximum && newItems.length > maximum) return

      if (activeItem !== item) setActiveItem(item)
      setSelectedItems(newItems)
    },
    [selectedItems]
  )

  const fetchImages = async (options = {}) => {
    if (isLoading) return
    setIsLoading(true)
    const params = {
      first: 50,
      groupName: selectedAlbum === 'All Photos' ? undefined : selectedAlbum,
      assetType: 'Photos',
      after: options.after,
    }

    const result = await CameraRoll.getPhotos(params)
    setEndCursor(result.page_info.end_cursor)
    if (!result.page_info.has_next_page) setHasMoreImages(false)

    const newImages = options.initialLoad
      ? result.edges
      : items.concat(result.edges)
    setItems(newImages)
    options.initialLoad && setActiveItem(result.edges[0])
    setIsLoading(false)
  }

  const fetchAlbums = async () => {
    setIsLoading(true)
    const result = await CameraRoll.getAlbums({ assetType: 'Photos' })
    const albums = [
      ...result,
      {
        title: 'All Photos',
        count: result.reduce((total, album) => total + album.count, 0),
      },
    ].sort((a, b) => b.count - a.count)

    const albumsWithThumbnails = await Promise.all(
      albums.map(async album => {
        const result = await CameraRoll.getPhotos({
          first: 1,
          groupName: album.title === 'All Photos' ? undefined : album.title,
        })

        album.thumbnail = result.edges[0]?.node?.image?.uri
        return album
      })
    )

    setAlbums(albumsWithThumbnails)
    setIsLoading(false)
  }

  useEffect(() => {
    setEndCursor(undefined)
    setHasMoreImages(true)
    fetchImages({
      after: undefined,
      initialLoad: true,
    })
  }, [selectedAlbum])

  useEffect(() => {
    fetchAlbums()
  }, [])

  useEffect(() => {
    Animated.parallel([
      Animated.timing(albumsPosition, {
        toValue: albumsVisible ? 0 : height * 0.75,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(albumsOpacity, {
        toValue: albumsVisible ? 1 : 0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start()
  }, [albumsVisible])

  useEffect(() => {
    selectedItemsRef.current = selectedItems
  }, [selectedItems])

  const renderItem = ({ item }) => {
    const selectedIndex = selectedItems.indexOf(item.node.image.uri)

    return (
      <ImageItem
        item={item}
        onPress={handleOnPress}
        selectedIndex={selectedIndex}
        multiple={multiple}
      />
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
            <Text style={typography.button3}>Cancel</Text>
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <TouchableOpacity
              style={{ flexDirection: 'row', padding: normalize(8) }}
              activeOpacity={0.7}
              onPress={() => setAlbumsVisible(!albumsVisible)}>
              <Text style={styles.title}>{selectedAlbum}</Text>
              <Icons.ChevronDown
                style={{
                  position: 'absolute',
                  right: normalize(-24),
                  top: normalize(8),
                  color: Colors.icon,
                  transform: [{ rotate: albumsVisible ? '180deg' : '0deg' }],
                }}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            disabled={!selectedItems.length}
            style={[
              styles.backButton,
              !selectedItems.length ? { opacity: 0.5 } : {},
            ]}
            activeOpacity={0.7}
            onPress={handleOnNextPress}>
            <Text style={[typography.button3, typography.link]}>Next</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={{ flex: 1 }}>
            <View style={styles.imagePreview}>
              <LinearGradient
                style={styles.previewGradient}
                colors={['rgba(0,0,0,.5)', 'transparent']}
                locations={[0, 1]}
                pointerEvents="none">
                <Text style={[typography.subtitle2, { color: '#fff' }]}>
                  {maximum
                    ? 'You may select up to 10 photos'
                    : 'Select a photo of your item'}
                </Text>
                {!!maximum && (
                  <Text
                    style={[
                      typography.caption,
                      { color: '#fff', marginTop: normalize(8) },
                    ]}>
                    {!selectedItems.length ? 'No' : selectedItems.length}{' '}
                    {pluralize('photo', selectedItems.length)} selected
                  </Text>
                )}
              </LinearGradient>

              {!!activeItem && (
                <Image
                  style={styles.previewImage}
                  resizeMethod="resize"
                  width="100%"
                  height="100%"
                  source={{
                    uri: activeItem.node.image.uri,
                    priority: 'normal',
                  }}
                />
              )}
            </View>
            <FlatList
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
              data={items}
              renderItem={renderItem}
              keyExtractor={item => item.node.image.uri}
              initialNumToRender={10}
              updateCellsBatchingPeriod={10}
              removeClippedSubviews={true}
              onEndReached={handleOnEndReached}
              numColumns={3}
              columnWrapperStyle={{
                marginBottom: normalize(3),
                flex: 1,
              }}
              onEndReachedThreshold={normalize((width / 3) * 2)}
              ListFooterComponent={
                hasMoreImages && (
                  <View style={styles.loader}>
                    <ActivityIndicator
                      animating={true}
                      size="small"
                      color={Colors.primaryYellow}
                    />
                  </View>
                )
              }
            />
          </View>

          <Animated.View
            pointerEvents={albumsVisible ? 'auto' : 'none'}
            style={[
              styles.albumsWrapper,
              {
                transform: [{ translateY: albumsPosition }],
                opacity: albumsOpacity,
              },
            ]}>
            <FlatList
              columnWrapperStyle={{
                padding: normalize(16),
                flex: 1,
                alignItems: 'space-between',
                justifyContent: 'space-between',
              }}
              numColumns={2}
              renderItem={({ item }) => (
                <AlbumItem item={item} onPress={handleOnAlbumPress} />
              )}
              keyExtractor={item => item.title}
              data={albums}
            />
          </Animated.View>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
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
    paddingVertical: normalize(8),
  },
  title: {
    ...typography.body2,
    ...typography.medium,
  },
  modal: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 0,
    position: 'relative',
  },
  albumsWrapper: {
    flex: 1,
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 3,
  },
  albumThumbnail: {
    width: width / 2 - normalize(24),
    height: width / 2 - normalize(24),
  },
  thumbnailWrapper: {
    width: width / 3 - normalize(2),
    height: width / 3 - normalize(2),
    marginRight: normalize(3),
  },
  thumbnail: {
    height: '100%',
    width: '100%',
  },
  images: {
    flex: 1,
  },
  imagePreview: {
    marginBottom: normalize(3),
    width,
    height: width,
  },
  previewImage: {
    height: '100%',
    width: '100%',
  },
  loader: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(16),
  },
  previewGradient: {
    flex: 1,
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    height: normalize(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: normalize(24),
    minWidth: normalize(24),
    borderWidth: normalize(2),
    borderColor: '#fff',
    position: 'absolute',
    zIndex: 10,
    right: normalize(8),
    top: normalize(8),
    borderRadius: normalize(11),
    backgroundColor: Colors.secondaryRoyalBlue,
  },
  selectedMarkerLabel: {
    color: '#fff',
    letterSpacing: normalize(-1.5),
    lineHeight: normalize(20),
    fontSize: normalize(13),
  },
})

export default ImagePickerScreen
