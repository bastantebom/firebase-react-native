import React from 'react';
import { View, StyleSheet } from 'react-native';

import AppText from '@/components/AppText/AppText';
import AppInput from '@/components/AppInput/AppInput';
import AppButton from '@/components/AppButton'

import ResetPasswordLock from '@/images/reset-password.svg'
import CloseIcon from '@/images/close.svg'

const ResetPassword = () => {
    return (
        <View style={styles.container}>
            <View style={styles.closeIconContainer}>
                <CloseIcon width={24} height={24} />
            </View>

            <ResetPasswordLock width={80} height={80} />
            <AppText>Reset Password</AppText>

            <AppText>No worries, it happens to the best of us!</AppText>

            <AppInput
                label="Email or Mobile Number"
            />

            <AppButton
                text="Login"
                type="tertiary"
                size="sm"
                height="xl"
                borderColor="primary"
                propsButtonCustomStyle=""
                onPress={() => {
                    console.log("clicked")    
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "red",
        flex: 1
    },
    closeIconContainer: {
        backgroundColor: "blue",
        alignItems: "flex-end"
    }

})

export default ResetPassword;
