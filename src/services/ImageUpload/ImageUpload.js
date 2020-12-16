import storage from '@react-native-firebase/storage'

const uploadImageHandler = async (image, uid) => {
  try {
    if (image.includes('firebasestorage.googleapis.com')) return image

    const newFilename =
      Platform.OS === 'ios'
        ? image.split('/')[2]
        : image.substring(image.lastIndexOf('/') + 1)
    const uploadUri =
      Platform.OS === 'ios' ? image.replace('file://', '') : image

    const task = storage().ref()
    const fileRef = task.child(`${uid}/post-photo/${newFilename}`)

    await fileRef.putFile(uploadUri)
    const downloadURL = await fileRef.getDownloadURL()

    return downloadURL
  } catch (err) {
    console.log(err)
  }
}

const UploadImage = {
  upload: uploadImageHandler,
}

export default UploadImage
