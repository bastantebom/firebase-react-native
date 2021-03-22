import React from 'react'
import { Images } from '@/assets/images'
import { Icons } from '@/assets/images/icons'
import { Colors, GlobalStyle, normalize } from '@/globals'
import { iconSize } from '@/globals/Utils'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import PostImage from '@/components/Post/post-image'
import typography from '@/globals/typography'

const ImageUpload = ({ images, maximum, onChange, label, multiple }) => {
  const navigation = useNavigation()
  const showImagePicker = async () => {
    navigation.navigate('cover-photo-camera', {
      onSubmit: onChange,
      multiple,
      maximum,
      images,
    })
  }
  const showCoverPhotoGuidelines = () => {
    navigation.navigate('cover-photo-guidelines')
  }

  const handleOnRemovePress = image => {
    const newImages = [...images]
    newImages.splice(newImages.indexOf(image), 1)
    onChange(newImages)
  }

  return (
    <View style={styles.imageUploadContainer}>
      <View style={styles.imageUpload}>
        {(!multiple && !!images.length) ||
        (multiple && maximum && images.length === maximum) ? null : (
          <View style={styles.uploadDropBox}>
            <TouchableOpacity
              style={styles.uploadDropBoxButton}
              activeOpacity={0.7}
              onPress={showImagePicker}>
              <View style={styles.uploadDropBoxContent}>
                {!multiple ? (
                  <Images.Image {...iconSize(56)} />
                ) : (
                  <Images.CameraImage {...iconSize(56)} />
                )}
                <Text style={styles.uploadLabel}>
                  {label
                    ? label
                    : images.length
                    ? 'Upload More'
                    : 'Upload Images'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {!!images.length && (
          <ScrollView
            style={[
              styles.images,
              !multiple ? { maxWidth: normalize(114) } : {},
            ]}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            contentContainerStyle={{ flexGrow: 1 }}
            bounces={false}>
            {images.map(uri => (
              <View key={uri} style={styles.imageWrapper}>
                <TouchableOpacity
                  style={styles.removeImageButton}
                  activeOpacity={0.7}
                  onPress={() => handleOnRemovePress(uri)}>
                  <Icons.Close style={styles.removeIcon} {...iconSize(16)} />
                </TouchableOpacity>
                <PostImage
                  style={styles.image}
                  path={uri}
                  resizeMethod="resize"
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      {multiple && (
        <>
          <Text style={styles.uploadImageDescription}>
            {!!images?.length && (
              <Text style={{ fontFamily: 'RoundedMplus1c-Medium' }}>
                Photos - {images.length}/10{' '}
              </Text>
            )}
            {!images.length
              ? 'Choose up to 10 photos for your listing. The first photo you upload is automatically your cover photo. You may drag and drop to re-order the images. '
              : 'You can post up to 10 photos. The first one uploaded becomes your cover photo.'}
          </Text>
          <TouchableOpacity
            style={styles.linkWrapper}
            activeOpacity={0.7}
            onPress={showCoverPhotoGuidelines}>
            <Text
              style={[typography.body2, typography.medium, typography.link]}>
              Cover Photo Guidelines
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  linkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(8),
  },
  imageUploadContainer: {
    marginBottom: normalize(8),
  },
  imageUpload: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(17),
  },
  uploadDropBox: {
    borderStyle: 'dashed',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.neutralGray,
    justifyContent: 'center',
  },
  uploadDropBoxButton: {
    padding: normalize(16),
  },
  uploadLabel: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    color: Colors.contentOcean,
    letterSpacing: 0.4,
    lineHeight: normalize(18),
    textAlign: 'center',
  },
  uploadDropBoxContent: { alignSelf: 'center', alignItems: 'center' },
  uploadImageDescription: {
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(12),
    lineHeight: normalize(18),
    letterSpacing: normalize(0.4),
    color: Colors.contentEbony,
  },
  imageWrapper: {
    flex: 1,
    minWidth: normalize(85),
    marginRight: normalize(8),
    height: normalize(108),
    borderRadius: normalize(4),
    overflow: 'hidden',
  },
  images: {
    marginLeft: normalize(8),
  },
  image: {
    height: '100%',
    width: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: normalize(6),
    right: normalize(6),
    borderRadius: normalize(10),
    padding: normalize(4),
    zIndex: 1,
    backgroundColor: '#2e303459',
  },
  removeIcon: {
    color: '#fff',
  },
})

export default ImageUpload
