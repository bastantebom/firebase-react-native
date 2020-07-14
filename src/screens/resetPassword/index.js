import React, { useState } from 'react';
import { View, TouchableOpacity, Keyboard, StyleSheet } from 'react-native';

import AppText from '@/components/AppText/AppText';
import AppInput from '@/components/AppInput/AppInput';
import AppButton from '@/components/AppButton';
import AppViewContainer from '@/components/AppViewContainer/AppViewContainer';

import ResetPasswordLock from '@/assets/images/reset-password.svg';
import CloseIcon from '@/assets/images/icons/close.svg';

import stylesImport from './resetPassword.scss';

const styles = StyleSheet.create(stylesImport);

const ResetPassword = ({ navigation }) => {

    const [email, setEmail] = useState('')

    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [buttonState, setButtonState] = useState('dark')
    const [buttonLoading, setButtonLoading] = useState(false)
    const [buttonText, setButtonText] = useState('Send')

    const onEmailChange = (text) => {
        setEmail(text);
        setButtonState('active');

        if (text === '') {
            setButtonState('dark');
        }
    }

    function sendResetPasswordEmail() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('Email sent');
                setButtonLoading(false)
                setButtonText('Resend the link')
            }, 2000);
        });
    }

    async function sendEmail() {
        const msg = await sendResetPasswordEmail();
        console.log('Message:', msg);
    }

    if (buttonState == 'dark') {

    }

    return (
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
                onPress={() => {
                    setButtonLoading(true)
                    sendEmail()
                    Keyboard.dismiss()
                    console.log(email)
                }}
            />
        </AppViewContainer>
    );
};

export default ResetPassword;