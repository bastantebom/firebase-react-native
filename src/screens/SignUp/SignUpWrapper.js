//import liraries
import React, {useState, useRef} from 'react';
import SignUpService from '@/services/SignUpService';
import LoginService from '@/services/LoginService';

import {useNavigation} from '@react-navigation/native';

import SignUp from '@/screens/SignUp/SignUp';
import Login from '@/screens/login';
//import {set} from 'react-native-reanimated';
// create a component
const SignUpWrapper = (props) => {
  const ref = useRef(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [passForm, setPassForm] = useState({});
  //const [uid, setUid] = useState('');

  const [authType, setAuthType] = useState('signup');

  signUpEmail = (formValues) => {
    //setPassForm(formValues);
    setIsLoading(true);
    //console.log(JSON.stringify(formValues));
    console.log(formValues);
    //console.log(isEmail);
    /* if (isEmail) { */
    SignUpService.createUser(JSON.stringify(formValues))
      .then((response) => {
        setIsLoading(false);
        ref.current.cleanSignUpForm();
        if (response.success) {
          navigation.navigate('VerifyAccount', {...response, ...formValues});
        } else {
          navigation.navigate('Onboarding');
        }
      })
      .catch((error) => {
        console.log('With Error in the API SignUp ' + error);
      });
    /*} else {
      LoginService.loginMobile(JSON.stringify(formValues))
        .then((response) => {
          setIsLoading(false);
          ref.current.cleanSignUpForm();
          if (response.success) {
            navigation.navigate('VerifyAccount', {...response, ...formValues});
          } else {
            navigation.navigate('Onboarding');
          }
        })
        .catch((error) => {
          console.log('With Error in the API SignUp ' + error);
        });
    }*/
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
        />
      ) : (
        <Login />
      )}
    </>
  );
};

//make this component available to the app
export default SignUpWrapper;
