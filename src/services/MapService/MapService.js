import Geocoder from 'react-native-geocoding'
import { GOOGLE_MAPS_API_KEY } from '@env'

const getStringAddress = (
  lat,
  lng,
  addStr,
  setStringAddress,
  setAddressComponents,
  addressComponents
) => {
  Geocoder.init(GOOGLE_MAPS_API_KEY)
  Geocoder.from(lat, lng)
    .then(json => {
      setStringAddress(addStr ? addStr : json.results[1].formatted_address)
      const arrayToExtract =
        json.results.length == 14
          ? 9
          : json.results.length == 13
          ? 8
          : json.results.length == 12
          ? 7
          : json.results.length == 11
          ? 6
          : json.results.length == 10
          ? 5
          : json.results.length == 9
          ? 4
          : json.results.length == 8
          ? 3
          : json.results.length < 8
          ? 2
          : 2
      /*setCityName(
          json.results[arrayToExtract].address_components[0].long_name,
        );*/
      const splitAddress = json.results[arrayToExtract].formatted_address.split(
        ','
      )

      setAddressComponents({
        ...addressComponents,
        ...{
          latitude: lat,
          longitude: lng,
          city: splitAddress[0],
          province: splitAddress[1],
          country: splitAddress[2],
        },
        //setChangeMapAddress(addressComponent);
      })
    })
    .catch(error => console.warn(error))
}

const MapService = {
  getStringAddress: getStringAddress,
}

export default MapService
