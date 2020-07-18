import React, { useContext } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

import PaddingView from '@/components/AppViewContainer/PaddingView';

import CloseDark from '@/assets/images/icons/close-dark.svg';
import CircleTick from '@/assets/images/icons/circle-tick.svg';

import { Context } from '@/context'

/**
 * 
 * @param {
 *     message: <Text> string </Text> 
 *     type: "error" | "success"
 * } 
 */

const Notification = ({ message, type }) => {
    const { notificationState, closeNotification } = useContext(Context);

    const width = Dimensions.get('window').width;
    
    const styles = StyleSheet.create({
        container: {
            width: width,
            position: "absolute",
            top: 0,
            left: 0,
            flexDirection: 'row',
            zIndex: 1,
            backgroundColor: type === 'success' ? '#FFD200': 'red'
        }
    })

    if (notificationState === 'open') {
        return (
            <PaddingView paddingSize={2} style={styles.container}>
                {type === 'success' ? <CircleTick /> : <CloseDark />}
                {message}
                <TouchableOpacity onPress={() => closeNotification()}>
                    <CloseDark />
                </TouchableOpacity>
            </PaddingView>
        )
    }

    return <></>;
}

export default Notification;