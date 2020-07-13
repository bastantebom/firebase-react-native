//import liraries
import React, {useState} from 'react';
import axios from 'axios';
import APIConfig from '@/api/Globals';

import {useNavigation} from '@react-navigation/native';

import SignUp from '@/screens/SignUp/SignUp';
import Login from '@/screens/login';
// create a component
const SignUpWrapper = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [authType, setAuthType] = useState('signup');

  signUpEmail = () => {
    setIsLoading(true);
    console.log(APIConfig.apiUrl + 'users');
    axios
      .get(APIConfig.apiUrl + 'users')
      .then((response) => {
        console.log('getting data from axios', response.data);
        setTimeout(() => {
          setIsLoading(false);
          setData(response.data);
          navigation.navigate('VerifyAccount');
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loginClick = () => {
    setAuthType('login');
  };

  return (
    <>
      {authType === 'signup' ? (
        <SignUp
          loading={isLoading}
          signUpEmail={signUpEmail}
          loginClick={loginClick}
        />
      ) : (
        <Login />
      )}
    </>
  );
};

//make this component available to the app
export default SignUpWrapper;
