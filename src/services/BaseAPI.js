import axios from 'axios'
import APIURL from '@/services/Config'
import AsyncStorage from '@react-native-community/async-storage'

const client = axios.create({
  baseURL: APIURL.local.api,
  //headers: {Authorization: `bearer ${token}`},
})

const BaseAPI = function (options) {
  const onSuccess = response => response.data
  const onError = error => Promise.reject(error.response || error.message)
  client.interceptors.request.use(async function (config) {
    const token = await AsyncStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    else delete config.headers.Authorization
    return config
  })
  return client(options).then(onSuccess).catch(onError)
}

export default BaseAPI
