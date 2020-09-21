import {Dimensions, PixelRatio, Platform} from 'react-native';

export const timePassed = (seconds) => {
  seconds = Number(seconds);
  var y = Math.floor(seconds / (3600 * 24 * 7 * 52));
  var w = Math.floor(seconds / (3600 * 24 * 7));
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);

  var yDisplay = y > 0 ? y + (y == 1 ? ' year' : ' years') : '';
  var wDisplay = w > 0 ? w + (w == 1 ? ' week' : ' weeks') : '';
  var dDisplay = d > 0 ? d + (d == 1 ? ' day' : ' days') : '';
  var hDisplay = h > 0 ? h + (h == 1 ? ' hour' : ' hours') : '';
  var mDisplay = m > 0 ? m + (m == 1 ? ' minute' : ' minutes') : '';
  var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';

  if (y >= 1) return yDisplay;

  if (w >= 1) return wDisplay;

  if (d >= 1) return dDisplay;

  if (h >= 1) return hDisplay;

  if (m >= 1) return mDisplay;

  if (s >= 1) return sDisplay;

  return;
};

export const timePassedShort = (seconds) => {
  seconds = Number(seconds);
  var w = Math.floor(seconds / (3600 * 24 * 7));
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);

  var wDisplay = w > 0 ? w + (w == 1 ? 'w' : 'w') : '';
  var dDisplay = d > 0 ? d + (d == 1 ? 'd' : 'd') : '';
  var hDisplay = h > 0 ? h + (h == 1 ? 'h' : 'h') : '';
  var mDisplay = m > 0 ? m + (m == 1 ? 'm' : 'm') : '';
  var sDisplay = s > 0 ? s + (s == 1 ? 's' : 's') : '';

  if (w >= 1) return wDisplay;

  if (d >= 1) return dDisplay;

  if (h >= 1) return hDisplay;

  if (m >= 1) return mDisplay;

  if (s >= 1) return sDisplay;

  return;
};

export const joinedDate = (completeDate) => {
  //console.log(completeDate);
  if (completeDate) {
    const newCompleteDate = new Date(completeDate);
    //console.log(newCompleteDate.getYear());
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
    ];
    return (
      monthNames[newCompleteDate.getMonth()] +
      ' ' +
      newCompleteDate.getFullYear()
    );
  } else {
    return 'Not registered yet';
  }
};

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 375;

export function normalize(size) {
  const newSize = size * scale;

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
}

export const scaleFont = (size) => size * PixelRatio.getFontScale();
