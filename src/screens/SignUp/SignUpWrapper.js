//import liraries
import React, {useState, useRef} from 'react';

import LoginService from '@/services/LoginService';

import SignUp from '@/screens/SignUp';
import Login from '@/screens/login';
//import {set} from 'react-native-reanimated';
// create a component
const SignUpWrapper = (props) => {
  return (
    <>
      {authType === 'signup' ? (
        <SignUp
          ref={ref}
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
