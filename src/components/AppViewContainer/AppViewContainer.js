import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, SafeAreaView, Platform } from 'react-native';
import styles from './AppViewContainer.scss';

/**
 * padding size(none): default(0) 
 * padding size(xs): 4
 * padding size(1): 1 x 8
 * padding size(2): 2 x 8
 * padding size(3): 3 x 8
 * padding size(4): 4 x 8
 * padding size(5): 5 x 8
 * padding size(6): 6 x 8
 * padding size(7): 7 x 8
 * padding size(8): 8 x 8
 * padding size(9): 9 x 8
 * padding size(10): 10 x 8
 * 
 */


const AppViewContainer = ({ children, paddingSize, marginSize, customStyle }) => {

    let computedStyles = StyleSheet.create({
        padding: 0,
        margin: 0
    })

    // compute padding size
    computedStyles.padding = paddingSize ? paddingSize === "xs" ? 4 : paddingSize * 8 : 0;


    // compute margin size
    computedStyles.margin = marginSize ? marginSize === "xs" ? 4 : marginSize * 8 : 0;

    // Apply custom style if there is any. 
    if (customStyle) {
        computedStyles = {
            ...computedStyles,
            ...customStyle
        }
    }


    return (
        <SafeAreaView style={Platform.OS === 'android'? customStyle: computedStyles}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={computedStyles}>{children}</View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default AppViewContainer;

