import {
  Dimensions,
  PermissionsAndroid,
  PixelRatio,
  Platform,
  Linking,
} from 'react-native'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import Geolocation from 'react-native-geolocation-service'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler'
import Geocoder from 'react-native-geocoding'
import Config from '@/services/Config'

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

export const tempHistory = completeDate => {
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
    const rawHour =
      newCompleteDate.getHours() > 12
        ? newCompleteDate.getHours() - 12
        : newCompleteDate.getHours()

    const hour = rawHour.toString().padStart(2, 0)
    const minutes = newCompleteDate.getMinutes().toString().padStart(2, 0)
    const AMPM = newCompleteDate.getHours() > 12 ? 'PM' : 'AM'
    const day = newCompleteDate.getDate().toString().padStart(2, 0)

    return (
      monthNames[newCompleteDate.getMonth()] +
      ' ' +
      day +
      ', ' +
      hour +
      ':' +
      minutes +
      AMPM
    )
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

export const cardValidator = cardNumber => {
  const visa = /^4[0-9]{12}(?:[0-9]{3})?$/
  const mastercard = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/

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
    return {}
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
  } else if ((Platform.OS = 'ios')) {
    Geolocation.requestAuthorization()
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
    })
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
    province: getLocationName(addressComponents, 'administrative_area_level_2'),
    country: getLocationName(addressComponents, 'country'),
    full_address: results[0].formatted_address,
  }
}

export const openInAppBrowser = async url => {
  try {
    if (await InAppBrowser.isAvailable()) {
      const result = await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: '#453AA4',
        preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        toolbarColor: '#6200EE',
        secondaryToolbarColor: 'black',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        // Specify full animation resource identifier(package:anim/name)
        // or only resource name(in case of animation bundled with app).
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right',
        },
        headers: {
          'my-custom-header': 'my custom header value',
        },
      })
      console.log(JSON.stringify(result))
    } else Linking.openURL(url)
  } catch (error) {
    console.log(error.message)
  }
}

export const closeInAppBrowser = async () => {
  try {
    if (await InAppBrowser.isAvailable()) {
      InAppBrowser.close()
    } else Linking.openURL(url)
  } catch (error) {
    console.log(error.message)
  }
}

export const thousandsSeparators = num => {
  const num_parts = num.toString().split('.')
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return num_parts.join('.')
}
