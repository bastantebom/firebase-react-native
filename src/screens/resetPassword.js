import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';

import AppText from '@/components/AppText/AppText';
import AppInput from '@/components/AppInput/AppInput';
import AppButton from '@/components/AppButton';
import AppViewContainer from '@/components/AppViewContainer/AppViewContainer';

import ResetPasswordLock from '@/images/reset-password.svg';
import CloseIcon from '@/images/close.svg';

const ResetPassword = () => {
    return (
        <SafeAreaView style={styles.container}>
            <AppViewContainer paddingSize={3} customStyle={styles.container}>

                <AppViewContainer customStyle={styles.closeIconContainer} >
                    <CloseIcon width={24} height={24} />
                </AppViewContainer>

                <AppViewContainer customStyle={styles.resetPasswordContainer}>
                    <ResetPasswordLock width={80} height={80} />
                </AppViewContainer>

                <AppText customStyle={styles.resetPasswordText} textStyle="display5" >Reset Password</AppText>

                <AppText customStyle={styles.resetPasswordSubText} textStyle="body2">No worries, it happens to the best of us!</AppText>
                <AppInput
                    label="Email or Mobile Number" propsInputCustomStyle={styles.inputBox}
                />

                <AppButton
                    text="Send"
                    type="tertiary"
                    height="xl"
                    borderColor="primary"
                    propsButtonCustomStyle={styles.nextButton}
                    onPress={() => {
                        console.log("clicked")
                    }}
                />
            </AppViewContainer>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    closeIconContainer: {
        alignItems: "flex-end",
        marginBottom: 32
    },
    resetPasswordContainer: {
        marginBottom: 16,
        justifyContent: "center"
    },
    resetPasswordText: {
        marginBottom: 8
    },
    resetPasswordSubText: {
        marginBottom: 32
    },
    nextButton: {
        width: "100%"
    },
    inputBox: {
        marginBottom: 16
    }
})

export default ResetPassword;