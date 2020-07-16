//import liraries
import React, {useState} from 'react';
import SignUpService from '@/services/SignUpService';

import {useNavigation} from '@react-navigation/native';

import SignUp from '@/screens/SignUp/SignUp';
import Login from '@/screens/login';
// create a component
const SignUpWrapper = (props) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [authType, setAuthType] = useState('signup');
  //const _panel = useRef(null);

  signUpEmail = () => {
    setIsLoading(true);
    SignUpService.getAll()
      .then((response) => {
        setTimeout(() => {
          setIsLoading(false);
          setData(response.data);
          props.closePanel();
          navigation.navigate('VerifyAccount');
        }, 1500);
      })
      .catch((error) => {
        console.log('With Error in the API SignUp ' + error);
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
          closePanelUI={props.closePanel}
        />
      ) : (
        <Login />
      )}
    </>
  );
};

//make this component available to the app
export default SignUpWrapper;
