//import liraries
import React, {useState, useRef} from 'react';
import SignUpService from '@/services/SignUpService';

import {useNavigation} from '@react-navigation/native';

import SignUp from '@/screens/SignUp/SignUp';
import Login from '@/screens/login';
// create a component
const SignUpWrapper = (props) => {
  const ref = useRef(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const [authType, setAuthType] = useState('signup');

  signUpEmail = (formValues) => {
    setIsLoading(true);
    console.log(JSON.stringify(formValues));
    SignUpService.createUser(JSON.stringify(formValues))
      .then((response) => {
        setIsLoading(false);
        console.log('success firebase api call');
        console.log(response);
        console.log('success firebase api call end');
        props.closePanel();
        ref.current.cleanSignUpForm();
        navigation.navigate('VerifyAccount', {formValues});
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
          ref={ref}
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
