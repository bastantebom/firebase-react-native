import {
  Dimensions,
  PermissionsAndroid,
  PixelRatio,
  Platform,
} from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler'
import Geocoder from 'react-native-geocoding'
import Config from '@/services/Config'

import firebase from '@react-native-firebase/app'
import axios from 'axios'

// const FIREBASE_API_KEY = firebase.app().options.apiKey
const FIREBASE_API_KEY = 'AIzaSyDMknlgnSUy46tevw-jAixdIegnE4yiPCQ'

Geocoder.init(Config.apiKey)

export const timePassed = seconds => {
  seconds = Number(seconds)
  var y = Math.floor(seconds / (3600 * 24 * 7 * 52))
  var w = Math.floor(seconds / (3600 * 24 * 7))
  var d = Math.floor(seconds / (3600 * 24))
  var h = Math.floor((seconds % (3600 * 24)) / 3600)
  var m = Math.floor((seconds % 3600) / 60)
  var s = Math.floor(seconds % 60)

  var yDisplay = y > 0 ? y + (y == 1 ? ' year' : ' years') : ''
  var wDisplay = w > 0 ? w + (w == 1 ? ' week' : ' weeks') : ''
  var dDisplay = d > 0 ? d + (d == 1 ? ' day' : ' days') : ''
  var hDisplay = h > 0 ? h + (h == 1 ? ' hour' : ' hours') : ''
  var mDisplay = m > 0 ? m + (m == 1 ? ' minute' : ' minutes') : ''
  var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : ''

  if (y >= 1) return yDisplay

  if (w >= 1) return wDisplay

  if (d >= 1) return dDisplay

  if (h >= 1) return hDisplay

  if (m >= 1) return mDisplay

  if (s >= 1) return sDisplay

  return
}

export const timePassedShort = seconds => {
  seconds = Number(seconds)
  var w = Math.floor(seconds / (3600 * 24 * 7))
  var d = Math.floor(seconds / (3600 * 24))
  var h = Math.floor((seconds % (3600 * 24)) / 3600)
  var m = Math.floor((seconds % 3600) / 60)
  var s = Math.floor(seconds % 60)

  var wDisplay = w > 0 ? w + (w == 1 ? 'w' : 'w') : ''
  var dDisplay = d > 0 ? d + (d == 1 ? 'd' : 'd') : ''
  var hDisplay = h > 0 ? h + (h == 1 ? 'h' : 'h') : ''
  var mDisplay = m > 0 ? m + (m == 1 ? 'm' : 'm') : ''
  var sDisplay = s > 0 ? s + (s == 1 ? 's' : 's') : ''

  if (w >= 1) return wDisplay

  if (d >= 1) return dDisplay

  if (h >= 1) return hDisplay

  if (m >= 1) return mDisplay

  if (s >= 1) return sDisplay

  return
}

export const joinedDate = completeDate => {
  if (completeDate) {
    const newCompleteDate = new Date(completeDate)

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    return (
      monthNames[newCompleteDate.getMonth()] +
      ' ' +
      newCompleteDate.getFullYear()
    )
  } else {
    return 'Not registered yet'
  }
}

export const fullDateFormat = timeStamp => {
  if (timeStamp) {
    const newCompleteDate = new Date(timeStamp)
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    const day = newCompleteDate.getDate().toString().padStart(2, 0)

    return (
      monthNames[newCompleteDate.getMonth()] +
      ' ' +
      day +
      ' ' +
      newCompleteDate.getFullYear()
    )
  }
}

export const timeOnly = timeStamp => {
  if (timeStamp) {
    const newCompleteDate = new Date(timeStamp)
    const rawHour =
      newCompleteDate.getHours() > 12
        ? newCompleteDate.getHours() - 12
        : newCompleteDate.getHours()

    const hour = rawHour.toString().padStart(2, 0)
    const minutes = newCompleteDate.getMinutes().toString().padStart(2, 0)
    const AMPM = newCompleteDate.getHours() >= 12 ? 'PM' : 'AM'

    return hour + ':' + minutes + AMPM
  }
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const scale = SCREEN_WIDTH / 375

export function normalize(size) {
  const newSize = size * scale

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  }
}

export const scaleFont = size => size * PixelRatio.getFontScale()

export const getColorByBackground = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  const red = parseInt(result[1], 16)
  const green = parseInt(result[2], 16)
  const blue = parseInt(result[3], 16)

  return red * 0.299 + green * 0.587 + blue * 0.114 > 186 ? '#2E3034' : '#fff'
}

export const validateCardNumber = cardNumber => {
  const visa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/
  const mastercard = /^(?:5[1-5][0-9]{14})$/

  if (visa.test(cardNumber)) {
    return 'visa'
  }

  if (mastercard.test(cardNumber)) {
    return 'mastercard'
  }

  return false
}
export const getCurrentPosition = async () => {
  try {
    await requestLocation()
    const { latitude, longitude } = await new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(({ coords }) => resolve(coords), reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 5000,
      })
    })

    return { latitude, longitude }
  } catch (error) {
    return ['ERR00', 1].includes(error.code)
      ? { longitude: 120.983207, latitude: 14.585322 }
      : {}
  }
}

export const requestLocation = async () => {
  if (Platform.OS === 'android') {
    await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )

    return true
  } else if (Platform.OS === 'ios') {
    await Geolocation.requestAuthorization('whenInUse')
  }
}

export const getLocationName = (components, key) =>
  components.find(component => component.types.includes(key))?.long_name

export const getLocationData = async ({ latitude, longitude }) => {
  const { results } = await Geocoder.from(latitude, longitude)
  const addressComponents = results[0].address_components || []

  return {
    longitude,
    latitude,
    city: getLocationName(addressComponents, 'locality'),
    province:
      getLocationName(addressComponents, 'administrative_area_level_2') ||
      getLocationName(addressComponents, 'administrative_area_level_1') ||
      '',
    country: getLocationName(addressComponents, 'country'),
    full_address: results[0].formatted_address,
  }
}

/**
 * @param {number} num
 * @returns {string}
 */
export const commaSeparate = (num = '') => {
  const amount = parseFloat(
    (+num.toString().replace(/[^0-9\.\-]+/g, '')).toFixed(2)
  )

  return isNaN(amount)
    ? 0
    : amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * @param {string} str
 */
export const formatPrice = str => {
  const price = commaSeparate(str)
  const amount = parseFloat(price.replace(/,/g, ''))

  if (amount >= 1000000) return commaSeparate(999999)
  else if (
    (amount >= 1000 && !str.endsWith('.')) ||
    str.split('.')[1]?.length > 2
  )
    return price
  else if (amount > 1000 && str.endsWith('.')) return `${price}.`

  return str.replace(/[^0-9\.]+/g, '')
}

export const isEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false
  }
  return true
}

export const generateDynamicLink = async ({
  type,
  params = {},
  social = {},
}) => {
  const baseAppURL = 'https://app.servbees.com'
  const path = type === 'root' ? '/' : `/${type}`
  const parameters = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  const link = `${baseAppURL}${path}${
    parameters.length ? `?${parameters}` : ''
  }`

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks',
      params: {
        key: FIREBASE_API_KEY,
      },
      data: {
        dynamicLinkInfo: {
          domainUriPrefix: 'https://servbees.page.link',
          link,
          androidInfo: {
            androidPackageName: 'com.servbees',
            androidFallbackLink: 'https://app.servbees.com/download',
          },
          iosInfo: {
            iosBundleId: 'com.servbees.appservbees',
            iosAppStoreId: '1530137634',
            iosFallbackLink: 'https://app.servbees.com/download',
          },
          socialMetaTagInfo: social,
        },
        suffix: {
          option: 'SHORT',
        },
      },
    })

    return response.data.shortLink
  } catch (error) {
    console.log(error.response)
  }
}

export const getPreviewLinkData = ({ type, data }) => {
  const getPostPrice = post => {
    const prices = post.price_range
      ? [post.price_range.min, post.price_range.max]
      : post.items.map(item => +(item.price || 0))

    return prices.length === 1
      ? `₱${commaSeparate(prices[0])}`
      : `₱${commaSeparate(Math.min(...prices))} - ₱${commaSeparate(
          Math.max(...prices)
        )}`
  }

  const getPostTitle = () => {
    const prefix = {
      need: 'Searching for',
      sell: 'Now selling',
      service: 'Available for hire',
    }

    return `${prefix[data.type]}: ${data.title}`
  }

  const getPostDescription = () => {
    const prefix = {
      need: 'Budget',
      sell: 'Price',
      service: 'Price',
    }

    return `${prefix[data.type]}: ${getPostPrice(data)}. ${data.description}`
  }

  if (type === 'user') {
    const name = data.display_name || data.full_name

    return {
      socialTitle: `${name} is on Servbees, your friendly neighborhood Pagkakakita-App`,
      socialImageLink: data.profile_photo,
    }
  } else if (type === 'post') {
    return {
      socialTitle: getPostTitle(),
      socialImageLink: data.cover_photos[0],
      socialDescription: getPostDescription(),
    }
  }
}
