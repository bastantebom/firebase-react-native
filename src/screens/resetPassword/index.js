import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Keyboard, StyleSheet, Dimensions, Text, Platform } from 'react-native';

import AppText from '@/components/AppText/AppText';
import AppInput from '@/components/AppInput/AppInput';
import AppButton from '@/components/AppButton';
import AppViewContainer from '@/components/AppViewContainer/AppViewContainer';
import PaddingView from '@/components/AppViewContainer/PaddingView';
import Notification from '@/components/Notification'

import ResetPasswordLock from '@/assets/images/reset-password.svg';

import { Close } from '@/assets/images/icons';

import ForgotPasswordService from '@/services/ForgotPassword';

import styles from './resetPassword.scss';

import { Context } from '@/context'

const ResetPassword = ({ navigation }) => {
    const [email, setEmail] = useState('')

    const { openNotification, closeNotification } = useContext(Context);

    const [notificationMessage, setNotificationMessage] = useState()
    const [notificationType, setNotificationType] = useState()

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
                    if (res?.success) {
                        setNotificationType('success')
                        resolve(
                            <AppText textStyle="body2" customStyle={styles.notificationText}>
                                We sent an email to <AppText customStyle={styles.email}>{email}.</AppText> Click the link in the email to reset your password.
                            </AppText>
                        )
                    }
                    else {
                        setNotificationType('error')
                        resolve(
                            <AppText textStyle="body2" customStyle={styles.notificationText}>
                                The email <AppText customStyle={styles.email}>{email}</AppText> may not be linked to any account. Please try again.
                            </AppText>
                        )
                    }
                })

                setButtonLoading(false)
                setButtonDisabled(false)
                setButtonText('Resend the link')
                closeNotificationTimer()

            }, 2000);
        });
    }

    async function sendEmail() {
        const msg = await sendResetPasswordEmail();
        setNotificationMessage(msg);
        openNotification();
    }

    const closeNotificationTimer = () => {
        setTimeout(() => {
            closeNotification();
        }, 5000)
    }

    return (
        <AppViewContainer paddingSize={3} customStyle={styles.container}>
            <Notification message={notificationMessage} type={notificationType} />

            <View style={styles.closeIconContainer}  >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Close width={24} height={24} />
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
                }}
            />
        </AppViewContainer>
    );
};

export default ResetPassword;