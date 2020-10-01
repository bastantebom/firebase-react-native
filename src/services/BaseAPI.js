import axios from 'axios';
import APIURL from '@/services/Config';

const client = axios.create({
  baseURL: APIURL.local.api,
  //headers: {Authorization: `bearer ${token}`},
});

const BaseAPI = function (options) {
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

  client.interceptors.request.use(function (config) {
    //const token = localStorage.getItem('token');
    //config.headers.Authorization =  token ? `Bearer ${token}` : '';
    return config;
  });

  return client(options).then(onSuccess).catch(onError);
};

export default BaseAPI;
