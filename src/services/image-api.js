import storage from '@react-native-firebase/storage'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { Platform } from 'react-native'
import RNFS from 'react-native-fs'

const ImageApi = {
  pathUrls: [],
  /**
   * @param {object} param0
   * @param {string} param0.uri file path uri
   * @param {string | undefined} param0.filename file name (optional)
   * @param {string} param0.type file type
   * @param {string} param0.uid owner user id
   * @returns {import('node_modules/@react-native-firebase/storage/lib/index').FirebaseStorageTypes.Reference}
   */
  async upload({ uri, filename: _filename, type, uid }) {
    try {
      const parentFolder = this.getParentFolder({ type, uid })

      const ext = uri.match(/\.[0-9a-z]+$/i)?.[0]
      const filename = _filename || `${uuidv4()}${ext || ''}`

      const fileRef = this.getRef(`${parentFolder}/${filename}`)
      let uploadUri = Platform.select({
        android: uri,
        ios: uri.replace('file://', ''),
      })
      let destinationPath = ''
      if (Platform.OS === 'ios' && type === 'post') {
        destinationPath = `${
          RNFS.TemporaryDirectoryPath
        }${Math.random().toString(36).substring(7)}.jpg`
        try {
          uploadUri = await RNFS.copyAssetsFileIOS(
            uploadUri,
            destinationPath,
            0,
            0
          )
        } catch (err) {
          console.log(err)
        }
      }
      await fileRef.putFile(uploadUri)

      try {
        const exists = await RNFS.exists(destinationPath)
        if (exists && destinationPath) RNFS.unlink(destinationPath)
      } catch (error) {
        console.log(error)
      }

      return fileRef
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * @param {string} path file path
   * @returns {import('node_modules/@react-native-firebase/storage/lib/index').FirebaseStorageTypes.Reference}
   */
  getRef(path) {
    const storageRef = storage().ref()
    return storageRef.child(path)
  },

  /**
   * @param {object} param0
   * @param {import('node_modules/@react-native-firebase/storage/lib/index').FirebaseStorageTypes.Reference} param0.ref file reference
   * @param {string} param0.path file path
   */
  async delete({ ref, path }) {
    try {
      const fileRef = ref || this.getRef(path)
      await fileRef.delete()
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * @param {object} param0
   * @param {string} param0.size image size
   * @param {string} param0.path file path
   * @returns {string}
   */
  getThumbnailPath({ path, size }) {
    const ext = path.match(/\.[0-9a-z]+$/i)?.[0]
    return size
      ? `${path.slice(0, path.lastIndexOf('/'))}/thumbs/thumb@${size}_${
          path.split('/').pop().split('.')[0]
        }${ext || ''}`
      : path
  },
  /**
   * @param {object} param0
   * @param {string} param0.path file path
   * @param {string} param0.size image size
   * @returns {Promise<string>}
   */
  async getUrl({ path: _path, size }) {
    const path = this.getThumbnailPath({ path: _path, size })

    try {
      const ref = this.getRef(path)
      const pathUrl = this.pathUrls.find(pathUrl => pathUrl.path === path)

      let url
      if (!pathUrl) {
        url = await ref.getDownloadURL()
        this.pathUrls.push({ path, url })
      } else {
        url = pathUrl.url
      }
      return url
    } catch {
      return null
    }
  },
  /**
   * @param {object} param0
   * @param {string} param0.type file type
   * @param {string} param0.uid owner user id
   * @returns {string}
   */
  getParentFolder({ type, uid, pid }) {
    switch (type) {
      case 'profile':
      case 'profile-photo':
      case 'profile-photos':
        return `${uid}/profile/profile-photos`
      case 'profile-cover-photos':
        return `${uid}/profile/cover-photos`
      case 'post':
        return `${uid}/posts`
    }
  },
}

export default ImageApi
