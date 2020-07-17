import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Keyboard, StyleSheet, Dimensions, Text } from 'react-native';

import AppText from '@/components/AppText/AppText';
import AppInput from '@/components/AppInput/AppInput';
import AppButton from '@/components/AppButton';
import AppViewContainer from '@/components/AppViewContainer/AppViewContainer';
import PaddingView from '@/components/AppViewContainer/PaddingView';

import ResetPasswordLock from '@/assets/images/reset-password.svg';
import CloseIcon from '@/assets/images/icons/close.svg';
import CloseDark from '@/assets/images/icons/close-dark.svg';
import CircleTick from '@/assets/images/icons/circle-tick.svg';

import ForgotPasswordService from '@/services/ForgotPassword';

import styles from './resetPassword.scss';
import { SafeAreaView } from 'react-native-safe-area-context';

const ResetPassword = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [notificationState, setNotificationState] = useState('close')
    const [notificationMessage, setNotificationMessage] = useState(

    )

    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [buttonState, setButtonState] = useState('dark')
    const [buttonLoading, setButtonLoading] = useState(false)
    const [buttonText, setButtonText] = useState('Send')

    const onEmailChange = (text) => {
        setEmail(text);
        setButtonDisabled(false)
        setButtonState('active');

        if (text === '') {
            setButtonDisabled(true)
            setButtonState('dark');
        }
    }

    function sendResetPasswordEmail() {
        let payload = {
            email: email
        }

        return new Promise(resolve => {
            setTimeout(() => {
                ForgotPasswordService.forgotEmail(payload).then(res => {
                    // console.log(res)
                    resolve(JSON.stringify(res));

                    if (res?.success) {
                        console.log("its true")
                    }
                    else {
                        console.log('its false')
                        resolve('The email may not be linked to any account. Please try again.')
                    }
                })

                setButtonLoading(false)
                setButtonDisabled(false)
                setButtonText('Resend the link')
                setNotificationState('open')
                closeNotification()
            }, 2000);
        });
    }

    async function sendEmail() {
        const msg = await sendResetPasswordEmail();
        console.log('Message:', msg);
    }

    const closeNotification = () => {
        setTimeout(() => {
            setNotificationState('close')
        }, 5000)
    }

    return (
        <>
            {notificationState === 'open' ?
                <PaddingView paddingSize={2} customStyle={styles.notificationContainer}>
                    <CircleTick />
                    <AppText textStyle="body2" customStyle={styles.notificationText}>
                        We sent an email to <AppText customStyle={styles.email}>{email}.</AppText> Click the link in the email to reset your password.
                    </AppText>
                    <TouchableOpacity onPress={() => setNotificationState('close')}>
                        <CloseDark />
                    </TouchableOpacity>
                </PaddingView>
                : <></>
            }
            <AppViewContainer paddingSize={3} customStyle={styles.container}>

                <View style={styles.closeIconContainer}  >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <CloseIcon width={24} height={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.resetPasswordContainer}>
                    <ResetPasswordLock width={80} height={80} />
                </View>

                <AppText customStyle={styles.resetPasswordText} textStyle="display5" >Reset Password</AppText>

                <AppText customStyle={styles.resetPasswordSubText} textStyle="body2">No worries, it happens to the best of us!</AppText>

                <AppInput
                    label="Email or Mobile Number" customStyle={styles.inputBox} value={email} onChangeText={text => onEmailChange(text)}
                />

                <AppButton
                    text={buttonText}
                    type="primary"
                    height="lg"
                    customStyle={styles[buttonState]}
                    loading={buttonLoading}
                    disabled={buttonDisabled}
                    onPress={() => {
                        setButtonLoading(true)
                        setButtonDisabled(true)
                        sendEmail()
                        Keyboard.dismiss()
                        console.log(email)
                    }}
                />
            </AppViewContainer>
        </>
    );
};

export default ResetPassword;