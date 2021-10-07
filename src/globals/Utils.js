import {
  Dimensions,
  PermissionsAndroid,
  PixelRatio,
  Platform,
} from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler'
import Geocoder from 'react-native-geocoding'

import { intervalToDuration, differenceInWeeks } from 'date-fns'

import axios from 'axios'
import ImageApi from '@/services/image-api'
import { formatNumber } from 'react-native-currency-input'
import { FIREBASE_API_KEY, GOOGLE_MAPS_API_KEY } from '@env'
import { useEffect, useRef } from 'react'

Geocoder.init(GOOGLE_MAPS_API_KEY)

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

export const timePassedByDate = timeByseconds => {
  const { years, months, days, hours, minutes, seconds } = intervalToDuration({
    start: timeByseconds * 1000,
    end: new Date(),
  })

  const weeks = differenceInWeeks(timeByseconds * 1000, new Date())

  if (years >= 1) return years + 'y ago'
  if (months >= 1) return months + 'mo ago'
  if (weeks >= 1) return weeks + 'wk ago'
  if (days >= 1) return days + 'd ago'
  if (hours >= 1) return hours + 'h ago'
  if (minutes >= 1) return minutes + 'min ago'
  if (seconds >= 1) return seconds + 's ago'

  return 'just now'
}

export const isUrl = str => !!str && /\w+:(\/?\/?)[^\s]+/gi.test(str)

export const isUrlProfile = str =>
  !!str &&
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g.test(
    str
  )

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

const platformWidth = Platform.select({
  android: 375,
  ios: 360,
})

const scale = SCREEN_WIDTH / platformWidth

export function normalize(size) {
  const newSize = size * scale
  return Math.round(PixelRatio.roundToNearestPixel(newSize))
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
        maximumAge: 0,
      })
    })

    return { latitude, longitude }
  } catch (error) {
    return ['ERR00', 1, 2, 3].includes(error.code)
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
  try {
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
  } catch (error) {
    console.log(error)
    return {}
  }
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
          navigationInfo: {
            enableForcedRedirect: true,
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

export const getPreviewLinkData = async ({ type, data }) => {
  const defaultProfileImage =
    'https://dev-servbees-web-app.onrender.com/images/default-profile.png'

  const defaultCoverPhoto = () => {
    switch (data?.type?.toLowerCase()) {
      case 'service':
        return 'https://dev-servbees-web-app.onrender.com/images/cover-service.png'
      case 'need':
        return 'https://dev-servbees-web-app.onrender.com/images/cover-need.png'
      default:
        return 'https://dev-servbees-web-app.onrender.com/images/cover-sell.png'
    }
  }

  const getPostPrice = post => {
    const prices = [
      ...new Set(
        post.budget
          ? [post.budget.minimum, post.budget.maximum]
          : post?.items?.map(item => item.price)
      ),
    ]

    const price =
      prices.length === 1
        ? `₱${formatNumber(prices[0], {
            separator: '.',
            precision: 2,
            delimiter: ',',
          })}`
        : `₱${formatNumber(Math.min(...prices), {
            separator: '.',
            precision: 2,
            delimiter: ',',
          })} - ₱${formatNumber(Math.max(...prices), {
            separator: '.',
            precision: 2,
            delimiter: ',',
          })}`
    return price
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

  const getInviteContent = () => {
    return `Wazzup, kai-bee-gan? Be a part of Servbees and easily buy and sell items, offer services, and find great deals within your area. \r\n\r\nJoin for free at `
  }

  if (type === 'user') {
    const name = data.display_name || data.full_name
    return {
      socialTitle: `${name} is on Servbees, your friendly neighborhood Pagkakakita-App`,
      socialImageLink: data?.profile_photo
        ? (await ImageApi.getUrl({
            path: data.profile_photo,
            size: '1200x630',
          })) || (await ImageApi.getUrl({ path: data.profile_photo }))
        : defaultProfileImage,
    }
  } else if (type === 'post') {
    return {
      socialTitle: getPostTitle(),
      socialImageLink: data.cover_photos[0]
        ? (await ImageApi.getUrl({
            path: data.cover_photos[0],
            size: '1200x630',
          })) ||
          (await ImageApi.getUrl({
            path: data.cover_photos[0],
          }))
        : defaultCoverPhoto(),
      socialDescription: getPostDescription(),
    }
  } else if (type === 'invite') {
    const name = data.display_name || data.full_name
    return {
      socialTitle: `${name} invited you to join Servbees`,
      socialDescription: getInviteContent(),
    }
  }
}

/**
 * @param {number} size icon size
 */
export const iconSize = size => ({
  height: normalize(size),
  width: normalize(size),
})

/**
 * @param {Date} date
 * @returns {string}
 */
export const parseTime = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()

  return `${((hour % 12 || 12) + '').padStart(2, '0')}:${(minute + '').padStart(
    2,
    '0'
  )} ${hour >= 12 ? 'PM' : 'AM'}`
}

/**
 * @param {string} login
 * @returns {boolean}
 */
export const isEmail = login => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    String(login).toLowerCase()
  )
}

export function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  const bHasOwnProperty = hasOwnProperty.bind(objB)
  for (const key of keysA) {
    if (!bHasOwnProperty(key) || objA[key] !== objB[key]) {
      return false
    }
  }

  return true
}

export function shallowCompare(instance, nextProps, nextState) {
  return (
    !shallowEqual(instance.props, nextProps) ||
    !shallowEqual(instance.state, nextState)
  )
}

export function parseSocialLink(url) {
  if (/^(?:(?:http|https):\/\/)?(?:www.)?(fb|facebook).(com|me)/.test(url)) {
    return 'facebook'
  } else if (/^(?:(?:http|https):\/\/)?(?:www.)?(twitter).(com)/.test(url)) {
    return 'twitter'
  } else if (/^(?:(?:http|https):\/\/)?(?:www.)?(instagram).(com)/.test(url)) {
    return 'instagram'
  } else if (/^(?:(?:http|https):\/\/)?(?:www.)?(youtube).(com)/.test(url)) {
    return 'youtube'
  } else if (/^(?:(?:http|https):\/\/)?(?:www.)?(tiktok).(com)/.test(url)) {
    return 'tiktok'
  } else if (/^(?:(?:http|https):\/\/)?(?:www.)?(vimeo).(com)/.test(url)) {
    return 'vimeo'
  } else if (/^(?:(?:http|https):\/\/)?(?:www.)?(twitch).(com|tv)/.test(url)) {
    return 'twitch'
  } else if (/^(?:(?:http|https):\/\/)?(?:www.)?(dribbble).(com)/.test(url)) {
    return 'dribbble'
  } else if (/^(?:(?:http|https):\/\/)?(?:www.)?(medium).(com)/.test(url)) {
    return 'medium'
  } else if (/^(?:(?:http|https):\/\/)?(?:www.)?(github).(com)/.test(url)) {
    return 'github'
  } else if (
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
      url
    )
  ) {
    return 'website'
  }
}

export const useInterval = (callback, delay) => {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}
