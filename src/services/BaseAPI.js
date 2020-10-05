import axios from 'axios';
import APIURL from '@/services/Config';
import Keychain from 'react-native-keychain';
//import {useContext} from 'react';
//import {UserContext} from '@/context/UserContext';
import AsyncStorage from '@react-native-community/async-storage';

const client = axios.create({
  baseURL: APIURL.dev.api,
  //headers: {Authorization: `bearer ${token}`},
});

const BaseAPI = function (options) {
  //const {token} = useContext(UserContext);
  //console.log('top');
  //console.log(token);

  const onSuccess = function (response) {
    // console.debug('Request Successful!');
    return response.data;
  };

  const onError = function (error) {
    // console.error('Request Failed:');

    if (error.response) {
      // console.error('Status:');
      // console.error('Data:');
      // console.error('Headers:');
    } else {
      // console.error('Error Message:');
    }

    return Promise.reject(error.response || error.message);
  };

  client.interceptors.request.use(async function (config) {
    const token = await AsyncStorage.getItem('token');
    //console.log(token);
    if (token) config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  });

  return client(options).then(onSuccess).catch(onError);
};

export default BaseAPI;
